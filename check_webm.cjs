const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected, checking files...');
  // Find all .webm files in /var/www/clinidea/backend/uploads/lms/
  conn.exec('cd /var/www/clinidea/backend/uploads/lms && ls *.webm', (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('close', (code) => {
      console.log('Files:');
      console.log(data);
      conn.end();
    }).on('data', (d) => {
      data += d.toString();
    }).stderr.on('data', (d) => {
      console.error(d.toString());
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999',
});
