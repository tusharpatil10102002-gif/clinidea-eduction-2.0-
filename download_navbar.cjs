const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastGet('/var/www/clinidea/src/components/Navbar.jsx', 'c:/Users/HP/Desktop/Website/Clinidea Education/CE_Web/src/components/Navbar.jsx', (err) => {
      if (err) throw err;
      console.log('Successfully downloaded Navbar.jsx');
      conn.end();
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999',
});
