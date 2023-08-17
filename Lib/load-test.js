import http from 'k6/http';
import { sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const duration = parseInt(__ENV.DURATION) - 3
const time = duration.toString() + "m";

export let options = {
  rps: parseInt(__ENV.RPS),
  stages: [
    { duration: '2m', target: __ENV.VUS },
    { duration: time, target: __ENV.VUS },
    { duration: '1m', target: 0},
  ]
};

export default function() {
  http.get(__ENV.URL,{ timeout: '1200s' });
  sleep(1);
};

export function handleSummary(data){
  delete data.metrics['http_req_blocked'];
  return {
      "load-summary.json": JSON.stringify(data),
      "stdout": textSummary(data, { indent: ' ', enableColors: true }),
      "load-summary.html": htmlReport(data, {title : "Load Test Summary"}),
  }
}

