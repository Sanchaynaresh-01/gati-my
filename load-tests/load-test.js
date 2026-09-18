import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:5000';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users over 30s
    { duration: '1m', target: 20 },   // Stay at 20 users for 1 minute
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],       // Error rate < 2%
    http_req_duration: ['p(95)<2500'],    // 95% of requests under 2.5s
    http_req_duration: ['p(99)<3500'],    // 99% of requests under 3.5s (accommodates bcrypt + cloud Atlas roundtrips)
  },
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export default function () {
  // Scenario A: Public Browsing (Every user browses public landing endpoints)
  group('01_Public_Endpoints', function () {
    const resHealth = http.get(`${BASE_URL}/api/v1/health`);
    check(resHealth, {
      'healthcheck status 200': (r) => r.status === 200,
    });

    const resRounds = http.get(`${BASE_URL}/api/v1/competition/rounds`);
    check(resRounds, {
      'competition rounds status 200': (r) => r.status === 200,
    });

    const resInnovations = http.get(`${BASE_URL}/api/v1/innovations`);
    check(resInnovations, {
      'innovations gallery status 200': (r) => r.status === 200,
    });

    const resLeaderboard = http.get(`${BASE_URL}/api/v1/leaderboard`);
    check(resLeaderboard, {
      'leaderboard status 200': (r) => r.status === 200,
    });
  });

  sleep(1);

  // Scenario B: Authentication & School Dashboard Access
  // (Simulates authenticated school administrators loading their dashboard and teams)
  group('02_School_Login_and_Dashboard', function () {
    const loginPayload = JSON.stringify({
      email: 'school@afip.demo',
      password: 'School@123',
      role: 'school'
    });

    const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, loginPayload, { headers: JSON_HEADERS });
    const loginSuccess = check(loginRes, {
      'school login status is 200': (r) => r.status === 200,
      'school login returned token': (r) => {
        try {
          const body = JSON.parse(r.body);
          return !!(body.data && (body.data.token || body.data.access_token));
        } catch (e) {
          return false;
        }
      },
    });

    if (loginSuccess) {
      const bodyData = JSON.parse(loginRes.body).data;
      const token = bodyData.token || bodyData.access_token;
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch school profile
      const schoolMeRes = http.get(`${BASE_URL}/api/v1/schools/me`, { headers: authHeaders });
      check(schoolMeRes, {
        'school profile status is 200': (r) => r.status === 200,
      });

      // Fetch enrolled teams for the school
      const schoolTeamsRes = http.get(`${BASE_URL}/api/v1/schools/my-teams`, { headers: authHeaders });
      check(schoolTeamsRes, {
        'school my-teams status is 200': (r) => r.status === 200,
      });
    }
  });

  sleep(2);
}
