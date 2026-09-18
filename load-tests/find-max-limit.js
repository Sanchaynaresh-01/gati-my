import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:5000';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Step 1: 50 users
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },  // Step 2: 100 users
    { duration: '30s', target: 100 },
    { duration: '30s', target: 150 },  // Step 3: 150 users
    { duration: '30s', target: 150 },
    { duration: '30s', target: 200 },  // Step 4: 200 users
    { duration: '30s', target: 200 },
    { duration: '30s', target: 250 },  // Step 5: 250 users
    { duration: '30s', target: 250 },
    { duration: '20s', target: 0 },    // Cool down
  ],
  thresholds: {
    // Record where errors start appearing
    http_req_failed: ['rate<0.05'], 
  },
};

export default function () {
  // Real human browsing pattern across the website
  const r1 = http.get(`${BASE_URL}/api/v1/health`);
  check(r1, { 'health 200': (r) => r.status === 200 });

  const r2 = http.get(`${BASE_URL}/api/v1/competition/rounds`);
  check(r2, { 'rounds 200': (r) => r.status === 200 });

  const r3 = http.get(`${BASE_URL}/api/v1/innovations`);
  check(r3, { 'innovations 200': (r) => r.status === 200 });

  const r4 = http.get(`${BASE_URL}/api/v1/leaderboard`);
  check(r4, { 'leaderboard 200': (r) => r.status === 200 });

  // 1-second pause prevents local Windows port exhaustion and mimics real user pace
  sleep(1);
}
