const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected, installing ffmpeg...');
  conn.exec('apt-get update && apt-get install -y ffmpeg', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Install Exit Code:', code);
      conn.end();
    }).on('data', (d) => {
      process.stdout.write(d.toString());
    }).stderr.on('data', (d) => {
      process.stderr.write(d.toString());
    });
  });
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999',
});
