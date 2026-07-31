const https = require('https');

const url = 'https://clinidea.in/uploads/lms/1781227776091-Drug%20discovery%20and%20development%20Lec%201.webm';

const req = https.request(url, { method: 'HEAD' }, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
