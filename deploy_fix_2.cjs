const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

const newStudentLMS = fs.readFileSync('src/pages/StudentLMS.jsx', 'utf8');

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP :: ready');
    
    const remotePath = '/var/www/clinidea/src/pages/StudentLMS.jsx';
    const stream = sftp.createWriteStream(remotePath);
    stream.on('close', () => {
      console.log('File written to remote server');
      console.log('Rebuilding frontend...');
      conn.exec('cd /var/www/clinidea && npm run build', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Build complete with code: ' + code);
          conn.end();
        }).on('data', (data) => {
          process.stdout.write('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          process.stderr.write('STDERR: ' + data);
        });
      });
    });
    stream.write(newStudentLMS);
    stream.end();
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999'
});
