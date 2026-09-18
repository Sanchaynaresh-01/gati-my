import os
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class StorageService:
    """
    Direct-to-S3 Media Storage Service.
    Offloads binary photos and documents from the backend server and MongoDB,
    allowing clients to upload directly to Amazon S3 via secure, presigned URLs.
    """

    BUCKET_NAME = os.environ.get("AWS_S3_BUCKET", "afip-media-storage")
    REGION = os.environ.get("AWS_REGION", "ap-south-1") # Default to Mumbai region

    @classmethod
    def generate_presigned_upload(cls, filename: str, content_type: str = "image/jpeg", folder: str = "students"):
        """
        Generates a direct presigned PUT upload URL and the eventual public CDN URL.
        """
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
        unique_key = f"{folder}/{datetime.utcnow().strftime('%Y/%m')}/{uuid.uuid4().hex}.{ext}"

        # If AWS credentials are provided, generate a signed S3 upload URL
        aws_key = os.environ.get("AWS_ACCESS_KEY_ID")
        aws_secret = os.environ.get("AWS_SECRET_ACCESS_KEY")

        if aws_key and aws_secret:
            try:
                import boto3
                from botocore.config import Config
                s3_client = boto3.client(
                    "s3",
                    region_name=cls.REGION,
                    aws_access_key_id=aws_key,
                    aws_secret_access_key=aws_secret,
                    config=Config(signature_version="s3v4")
                )
                presigned_url = s3_client.generate_presigned_url(
                    "put_object",
                    Params={
                        "Bucket": cls.BUCKET_NAME,
                        "Key": unique_key,
                        "ContentType": content_type
                    },
                    ExpiresIn=300 # 5 minutes validity
                )
                cdn_domain = os.environ.get("CLOUDFRONT_DOMAIN")
                public_url = f"https://{cdn_domain}/{unique_key}" if cdn_domain else f"https://{cls.BUCKET_NAME}.s3.{cls.REGION}.amazonaws.com/{unique_key}"
                return {
                    "upload_url": presigned_url,
                    "file_url": public_url,
                    "storage_type": "s3_direct"
                }
            except Exception as e:
                logger.error(f"[STORAGE] Failed to generate S3 presigned URL: {e}")

        # Local development fallback
        return {
            "upload_url": f"/api/v1/media/upload?key={unique_key}",
            "file_url": f"/uploads/{unique_key}",
            "storage_type": "local"
        }
