const https = require('https');

const host = "api.indexnow.org";
const path = "/indexnow";
const data = JSON.stringify({
  "host": "www.clinidea.in",
  "key": "cfd4e9d7247a4ba7b1659dc6cf65c2b0",
  "keyLocation": "https://www.clinidea.in/cfd4e9d7247a4ba7b1659dc6cf65c2b0.txt",
  "urlList": [
    "https://www.clinidea.in/",
    "https://www.clinidea.in/about",
    "https://www.clinidea.in/program",
    "https://www.clinidea.in/clinical-research-pharmacovigilance-course",
    "https://www.clinidea.in/clinical-research-data-management-course",
    "https://www.clinidea.in/clinical-research-cr-pv-dm-course",
    "https://www.clinidea.in/clinical-research-regulatory-affairs-course",
    "https://www.clinidea.in/clinical-research-medical-writing-course",
    "https://www.clinidea.in/clinical-research-medical-coding-course",
    "https://www.clinidea.in/events",
    "https://www.clinidea.in/blogs",
    "https://www.clinidea.in/placements"
  ]
});

const options = {
  hostname: host,
  path: path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log(`IndexNow Submission Status: ${res.statusCode} ${res.statusMessage}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
  if (res.statusCode === 200) {
    console.log("Urls submitted successfully to IndexNow!");
  } else {
    console.log("There was an error submitting to IndexNow.");
  }
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
