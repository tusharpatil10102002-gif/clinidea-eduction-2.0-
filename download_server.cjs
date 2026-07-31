const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const remoteZipPath = '/var/www/clinidea/server_backup.zip';
// Download to the target folder
const localZipPath = 'C:\\Users\\HP\\Desktop\\Website\\Clinidea Education\\Clinidea Education 3.0\\server_backup.zip';

console.log('Connecting to Hostinger...');
conn.on('ready', () => {
  console.log('Client :: ready');
  
  // Command to zip everything inside /var/www/clinidea except node_modules and .git
  const cmd = `cd /var/www/clinidea && apt-get install -y zip && zip -r server_backup.zip . -x "*/node_modules/*" -x "*/.git/*" -x "*.tar.gz" -x "*.zip"`;
  
  console.log('Zipping files on server...');
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Zipping complete. Downloading...');
      
      conn.sftp((err, sftp) => {
        if (err) throw err;
        
        sftp.fastGet(remoteZipPath, localZipPath, (err) => {
          if (err) throw err;
          console.log('Download complete! Saved to ' + localZipPath);
          
          // Cleanup remote zip
          conn.exec(`rm ${remoteZipPath}`, (err, stream2) => {
            conn.end();
          });
        });
      });
      
    }).on('data', (data) => {
      process.stdout.write('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data);
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999'
});
