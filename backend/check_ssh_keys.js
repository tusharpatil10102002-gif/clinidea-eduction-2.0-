const fs = require('fs');
const path = require('path');
const os = require('os');
const { Client } = require('ssh2');

const sshDir = path.join(os.homedir(), '.ssh');
console.log('Checking SSH directory:', sshDir);

if (fs.existsSync(sshDir)) {
  const files = fs.readdirSync(sshDir);
  console.log('Files in .ssh:', files);
  
  files.forEach(file => {
    if (!file.endsWith('.pub') && file !== 'known_hosts' && file !== 'config') {
      const keyPath = path.join(sshDir, file);
      console.log('Attempting connection with key:', keyPath);
      try {
        const privateKey = fs.readFileSync(keyPath);
        const conn = new Client();
        conn.on('ready', () => {
          console.log(`✅ CONNECTED SUCCESSFULLY WITH KEY: ${file}`);
          conn.exec('cd /var/www/clinidea && pm2 list && git status', (err, stream) => {
            if (err) console.error(err);
            stream.on('data', (data) => console.log(data.toString()));
            stream.on('close', () => conn.end());
          });
        }).on('error', (err) => {
          console.log(`❌ KEY FAILED (${file}):`, err.message);
        }).connect({
          host: '185.199.53.21',
          port: 22,
          username: 'root',
          privateKey: privateKey,
          readyTimeout: 10000
        });
      } catch (e) {
        console.error('Error reading key:', e.message);
      }
    }
  });
} else {
  console.log('.ssh directory does not exist');
}
