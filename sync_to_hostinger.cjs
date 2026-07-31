const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const tarPath = path.join(__dirname, 'full_project.tar.gz');
const remoteTarPath = '/var/www/clinidea/full_project.tar.gz';

console.log('Connecting to Hostinger...');
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP :: ready');
    
    console.log('Uploading full_project.tar.gz file... This may take a moment.');
    sftp.fastPut(tarPath, remoteTarPath, (err) => {
      if (err) throw err;
      console.log('Upload complete!');
      
      console.log('Extracting and configuring on server...');
      // Extract, npm install, build frontend, and restart backend
      const cmd = `cd /var/www/clinidea && tar -xzf full_project.tar.gz && rm full_project.tar.gz && npm install && npm run build && cd backend && npm install && pm2 restart all`;
      conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Deployment complete with code: ' + code);
          conn.end();
        }).on('data', (data) => {
          process.stdout.write('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          process.stderr.write('STDERR: ' + data);
        });
      });
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999'
});
