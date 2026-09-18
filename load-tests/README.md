# Load Testing Suite (k6) — Assam Future Innovation Program

This directory contains pre-configured [k6](https://k6.io/) load testing scripts tailored for the AFIP web application.

## Test Scripts

| Script | Purpose | Concurrency | Duration |
| :--- | :--- | :--- | :--- |
| `smoke-test.js` | Fast health & sanity check | 1 VU | 10s |
| `load-test.js` | Realistic traffic (Public + Login + Auth endpoints) | Up to 50 VUs | ~3.5m |
| `stress-test.js` | Peak capacity & breaking point discovery | Up to 300 VUs | 4.5m |

## How to Run

### 1. Ensure Target Server is Running
Before running tests, ensure the backend server is running:
```bash
# In backend folder:
python app.py
```
*(Default URL: `http://127.0.0.1:5000`)*

> **Important note for local testing:** Flask's built-in development server (`werkzeug`) is synchronous and handles only limited concurrent requests. To test realistic high-concurrency production limits locally on Windows, consider running with a WSGI server like `waitress`:
> ```bash
> pip install waitress
> waitress-serve --port=5000 --threads=8 app:create_app
> ```

### 2. Run Smoke Test (Quick Validation)
```bash
k6 run load-tests/smoke-test.js
```

### 3. Run Realistic Load Test
```bash
k6 run load-tests/load-test.js
```

### 4. Run with Live Browser Web Dashboard
k6 includes an interactive web dashboard in your browser:
```bash
k6 run --out web-dashboard load-tests/load-test.js
```

### 5. Testing Deployed / Staging URLs
You can override the target URL at runtime using `-e BASE_URL=...`:
```bash
k6 run -e BASE_URL=https://your-staging-or-production-domain.com load-tests/load-test.js
```
