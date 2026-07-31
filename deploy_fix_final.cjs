const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

const newContentPlayer = fs.readFileSync('src/pages/ContentPlayer.jsx', 'utf8');
const newStudentLMS = fs.readFileSync('src/pages/StudentLMS.jsx', 'utf8');

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP :: ready');
    
    const writeContentPlayer = () => {
      return new Promise((resolve, reject) => {
        const stream = sftp.createWriteStream('/var/www/clinidea/src/pages/ContentPlayer.jsx');
        stream.on('close', resolve);
        stream.on('error', reject);
        stream.write(newContentPlayer);
        stream.end();
      });
    };

    const writeStudentLMS = () => {
      return new Promise((resolve, reject) => {
        const stream = sftp.createWriteStream('/var/www/clinidea/src/pages/StudentLMS.jsx');
        stream.on('close', resolve);
        stream.on('error', reject);
        stream.write(newStudentLMS);
        stream.end();
      });
    };

    Promise.all([writeContentPlayer(), writeStudentLMS()]).then(() => {
      console.log('Files written to remote server');
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
    }).catch(err => {
      console.error(err);
      conn.end();
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999'
});
