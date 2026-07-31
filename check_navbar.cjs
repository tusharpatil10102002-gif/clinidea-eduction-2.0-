const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /var/www/clinidea/src/components/Navbar.jsx | grep -i login', (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('close', (code) => {
      console.log('Exit Code:', code);
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
