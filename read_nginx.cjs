const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /etc/nginx/sites-available/clinidea', (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('close', () => {
      console.log(data);
      conn.end();
    }).on('data', (d) => {
      data += d.toString();
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999',
});
