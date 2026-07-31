const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('c:/Users/HP/Desktop/Website/Clinidea Education/CE_Web/src/components/Navbar.jsx', '/var/www/clinidea/src/components/Navbar.jsx', (err) => {
      if (err) throw err;
      console.log('Successfully uploaded Navbar.jsx');
      
      // Now run build on the server
      console.log('Rebuilding frontend on server...');
      conn.exec('cd /var/www/clinidea && npm run build', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Build Exit Code:', code);
          conn.end();
        }).on('data', (d) => {
          process.stdout.write(d.toString());
        }).stderr.on('data', (d) => {
          process.stderr.write(d.toString());
        });
      });
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999',
});
