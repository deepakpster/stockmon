import request from 'superagent';
const API_BASE = 'http://localhost:5001';

export function getNifty50Gainers(): Promise < Object > {
  return new Promise((resolve, reject) => {
    request.get(`${API_BASE}/nifty50Gainers`)
      .end((err, res) => {
        if (err) {
          reject(res.body.error);
        } else {
          resolve(res.body);
        }
      });
  });
}