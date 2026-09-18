import http from 'k6/http';
import { check, sleep } from 'k6';

// Configurable target host (defaults to local Flask backend)
const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:5000';

export const options = {
  vus: 1, // 1 virtual user
  duration: '10s', // short duration for quick health check
  thresholds: {
    http_req_failed: ['rate<0.01'], // less than 1% errors
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

export default function () {
  // 1. Health check
  const resHealth = http.get(`${BASE_URL}/api/v1/health`);
  check(resHealth, {
    'health status is 200': (r) => r.status === 200,
    'health response is healthy': (r) => {
      try {
        return JSON.parse(r.body).status === 'healthy';
      } catch (e) {
        return false;
      }
    },
  });

  // 2. Competition rounds & stages
  const resRounds = http.get(`${BASE_URL}/api/v1/competition/rounds`);
  check(resRounds, {
    'competition rounds is 200': (r) => r.status === 200,
  });

  // 3. Public Innovations Gallery
  const resInnovations = http.get(`${BASE_URL}/api/v1/innovations`);
  check(resInnovations, {
    'innovations gallery is 200': (r) => r.status === 200,
  });

  // 4. Leaderboard preview
  const resLeaderboard = http.get(`${BASE_URL}/api/v1/leaderboard`);
  check(resLeaderboard, {
    'leaderboard is 200': (r) => r.status === 200,
  });

  sleep(1);
}
