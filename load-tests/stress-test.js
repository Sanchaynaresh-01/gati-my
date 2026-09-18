import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:5000';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Warm up to 50 users
    { duration: '1m', target: 100 },   // Push to 100 users
    { duration: '1m', target: 200 },   // Push to 200 users (Stress limit)
    { duration: '1m', target: 300 },   // Spike to 300 users (Breaking point)
    { duration: '1m', target: 0 },     // Recovery ramp-down
  ],
  thresholds: {
    // Under extreme stress, we want to know at what VU count errors start appearing
    http_req_failed: ['rate<0.05'], // Flag if failure rate exceeds 5%
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  const resRounds = http.get(`${BASE_URL}/api/v1/competition/rounds`);
  check(resRounds, {
    'rounds status is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
