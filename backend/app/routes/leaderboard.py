from flask import Blueprint, request
from app.utils.db import get_db, serialize_doc
from app.utils.helpers import api_response, api_error
from app.utils.cache import cache_response

leaderboard_bp = Blueprint("leaderboard", __name__, url_prefix="/api/v1")

@leaderboard_bp.route("/leaderboard", methods=["GET"])
@cache_response(ttl_seconds=30, key_prefix="leaderboard")
def get_leaderboard():
    db = get_db()
    settings = db.settings.find_one({"key": "competition"}) or {}
    is_public = settings.get("leaderboard_public", True)

    if not is_public:
        return api_response(
            data={"is_public": False, "entries": []},
            message="Leaderboard will be published after official evaluation by the jury committee."
        )

    category = request.args.get("category")
    district = request.args.get("district")
    stage = request.args.get("stage")

    query = {"status": "active"}
    if category and category != "all":
        query["category"] = category
    if stage and stage != "all":
        query["competition_stage"] = stage

    # High-Performance MongoDB Aggregation Pipeline: O(1) single-trip execution with $lookup
    pipeline = [
        {"$match": query},
        {
            "$lookup": {
                "from": "schools",
                "localField": "school_id",
                "foreignField": "_id",
                "as": "school_info"
            }
        },
        {"$unwind": {"path": "$school_info", "preserveNullAndEmptyArrays": True}}
    ]

    if district and district != "all" and district != "All Districts":
        pipeline.append({
            "$match": {
                "$or": [
                    {"district": district},
                    {"school_info.district": district}
                ]
            }
        })

    pipeline.extend([
        {
            "$addFields": {
                "final_score": {
                    "$ifNull": [
                        "$evaluation_score",
                        {"$ifNull": ["$quiz_score", 0]}
                    ]
                }
            }
        },
        {"$sort": {"final_score": -1, "created_at": -1}},
        {"$limit": 100},
        {
            "$project": {
                "_id": 0,
                "id": {"$toString": "$_id"},
                "team_code": 1,
                "team_name": 1,
                "category": 1,
                "competition_stage": {"$ifNull": ["$competition_stage", "team_formation"]},
                "school_name": {"$ifNull": ["$school_info.school_name", "$school_name", "Assam School"]},
                "district": {"$ifNull": ["$school_info.district", "$district", "Kamrup"]},
                "score": {"$round": ["$final_score", 1]}
            }
        }
    ])

    raw_entries = list(db.teams.aggregate(pipeline))
    entries = []
    for idx, item in enumerate(raw_entries):
        doc = serialize_doc(item)
        doc["rank"] = idx + 1
        entries.append(doc)

    return api_response(data={"is_public": True, "entries": entries})

@leaderboard_bp.route("/innovations", methods=["GET"])
@cache_response(ttl_seconds=120, key_prefix="innovations")
def get_public_innovations():
    db = get_db()
    theme = request.args.get("theme")
    category = request.args.get("category")

    query = {"is_showcased": True}
    if theme and theme != "all":
        query["theme"] = theme
    if category and category != "all":
        query["category"] = category

    pipeline = [
        {"$match": query},
        {"$limit": 50},
        {
            "$lookup": {
                "from": "teams",
                "localField": "team_id",
                "foreignField": "_id",
                "as": "team_info"
            }
        },
        {"$unwind": {"path": "$team_info", "preserveNullAndEmptyArrays": True}},
        {
            "$lookup": {
                "from": "schools",
                "localField": "school_id",
                "foreignField": "_id",
                "as": "school_info"
            }
        },
        {"$unwind": {"path": "$school_info", "preserveNullAndEmptyArrays": True}}
    ]

    projects = list(db.projects.aggregate(pipeline))

    # If few showcased in db, fallback to recent submitted projects
    if len(projects) < 5:
        more_pipeline = [
            {"$match": {"status": {"$in": ["submitted", "evaluated"]}}},
            {"$limit": 20},
            {
                "$lookup": {
                    "from": "teams",
                    "localField": "team_id",
                    "foreignField": "_id",
                    "as": "team_info"
                }
            },
            {"$unwind": {"path": "$team_info", "preserveNullAndEmptyArrays": True}},
            {
                "$lookup": {
                    "from": "schools",
                    "localField": "school_id",
                    "foreignField": "_id",
                    "as": "school_info"
                }
            },
            {"$unwind": {"path": "$school_info", "preserveNullAndEmptyArrays": True}}
        ]
        more = list(db.projects.aggregate(more_pipeline))
        for m in more:
            if not any(str(p["_id"]) == str(m["_id"]) for p in projects):
                projects.append(m)

    enriched = []
    for p in projects:
        item = serialize_doc(p)
        team_info = p.get("team_info") or {}
        school_info = p.get("school_info") or {}
        item["team_name"] = team_info.get("team_name", "Innovator Team")
        item["school_name"] = school_info.get("school_name", "Assam School")
        item["district"] = school_info.get("district", "Kamrup")
        # Clean up internal lookup fields
        item.pop("team_info", None)
        item.pop("school_info", None)
        enriched.append(item)

    return api_response(data=enriched)
