import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://3.21.97.207:3000/reviews/meta');
  check(res, { 'Status: 200': (r) => r.status == 200 });
  sleep(1);
}

// k6 run script.js
// k6 run --vus 10 --duration 30s script.js