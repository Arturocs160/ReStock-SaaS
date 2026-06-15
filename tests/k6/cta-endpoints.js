import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const ctaErrors = new Rate('cta_errors');
const ctaLatency = new Trend('cta_latency');

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '10s', target: 30 },
    { duration: '15s', target: 50 },
    { duration: '10s', target: 30 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    cta_errors: ['rate<0.05'],
    cta_latency: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3010';

export default function () {
  const payload = JSON.stringify({
    nombre: `TestUser${Math.floor(Math.random() * 10000)}`,
    negocio: `Negocio${Math.floor(Math.random() * 10000)}`,
    telefono: '+52 5551234567',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/cta`, payload, params);

  ctaLatency.add(res.timings.duration);

  const success = check(res, {
    'CTA: status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'CTA: response time < 200ms': (r) => r.timings.duration < 200,
    'CTA: response time < 500ms': (r) => r.timings.duration < 500,
    'CTA: no 5xx errors': (r) => r.status < 500,
  });

  ctaErrors.add(!success);

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  let summary = '\n=== CTA Endpoints Load Test Summary ===\n';

  summary += `\nHTTP Requests:\n`;
  summary += `  Total: ${data.metrics.http_reqs.value}\n`;
  summary += `  Failed: ${data.metrics.http_req_failed.value}\n`;
  summary += `  Success Rate: ${((1 - data.metrics.http_req_failed.value / data.metrics.http_reqs.value) * 100).toFixed(2)}%\n`;

  summary += `\nResponse Times (ms):\n`;
  summary += `  Min: ${data.metrics.http_req_duration.values.min?.toFixed(2)}\n`;
  summary += `  Max: ${data.metrics.http_req_duration.values.max?.toFixed(2)}\n`;
  summary += `  Avg: ${data.metrics.http_req_duration.values.avg?.toFixed(2)}\n`;
  summary += `  p95: ${data.metrics.http_req_duration.values['p(95)']?.toFixed(2)}\n`;
  summary += `  p99: ${data.metrics.http_req_duration.values['p(99)']?.toFixed(2)}\n`;

  summary += `\nCTA Metrics:\n`;
  summary += `  Error Rate: ${(data.metrics.cta_errors.value * 100).toFixed(2)}%\n`;
  summary += `  Avg Latency: ${data.metrics.cta_latency.values.avg?.toFixed(2)}ms\n`;
  summary += `  p95 Latency: ${data.metrics.cta_latency.values['p(95)']?.toFixed(2)}ms\n`;

  summary += `\n=====================================\n`;

  return summary;
}
