import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const time = __ENV.DURATION + "m";

export let options = {
  vus : 1,
  iterations: 1,
  duration: time,
};

export default function() {
  http.get(__ENV.URL);
  sleep(1);
}

export function handleSummary(data){
    delete data.metrics['http_req_blocked'];
    return {
	    "performance-summary.json": JSON.stringify(data),
      "stdout": textSummary(data, { indent: ' ', enableColors: true }),
      "performance-summary.html": htmlReport(data, {title : "Peformance Test Summary"}),
    }
}
