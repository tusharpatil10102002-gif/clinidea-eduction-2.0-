const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'StudentDashboard.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('/live') || line.toLowerCase().includes('live') || line.toLowerCase().includes('jitsi')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
