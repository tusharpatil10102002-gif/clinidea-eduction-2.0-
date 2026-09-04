const { Client } = require('ssh2');

const passwords = ['Swami@28031999', 'Swami@280399', 'root@123', 'Clinidea@2024'];

async function tryPassword(pass) {
  return new Promise((resolve) => {
    const conn = new Client();
    conn.on('ready', () => {
      console.log(`✅ SUCCESS WITH PASSWORD: ${pass}`);
      conn.exec('pm2 status && git status', (err, stream) => {
        if (err) console.error(err);
        stream.on('data', (data) => console.log(data.toString()));
        stream.on('close', () => {
          conn.end();
          resolve(true);
        });
      });
    }).on('error', (err) => {
      console.log(`❌ FAILED WITH PASSWORD: ${pass} (${err.message})`);
      resolve(false);
    }).connect({
      host: '185.199.53.21',
      port: 22,
      username: 'root',
      password: pass,
      readyTimeout: 10000
    });
  });
}

async function main() {
  for (const p of passwords) {
    const ok = await tryPassword(p);
    if (ok) break;
  }
}

main();
