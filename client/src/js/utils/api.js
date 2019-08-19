import request from 'superagent';
const API_BASE = 'http://localhost:5001';

export function fetchAllContactsInfo() {
  return new Promise((resolve, reject) => {
    request.get(`${API_BASE}/contactinfo`)
      .end((err, res) => {
        if (err) {
          reject(res.body.error);
        } else {
          resolve(res.body);
        }
      });
  });
}