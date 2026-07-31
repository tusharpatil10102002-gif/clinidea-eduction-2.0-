const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const tarPath = path.join(__dirname, 'Clinidea_Frontend_Update.tar.gz');
const remoteTarPath = '/var/www/clinidea/Clinidea_Frontend_Update.tar.gz';

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP :: ready');
    
    console.log('Uploading tar.gz file...');
    sftp.fastPut(tarPath, remoteTarPath, (err) => {
      if (err) throw err;
      console.log('Upload complete!');
      
      console.log('Extracting on server...');
      conn.exec('cd /var/www/clinidea && rm -rf dist_backup && mv dist dist_backup && mkdir dist && tar -xzf Clinidea_Frontend_Update.tar.gz -C dist/ && rm Clinidea_Frontend_Update.tar.gz', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Extraction and deployment complete with code: ' + code);
          conn.end();
        }).on('data', (data) => {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
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
