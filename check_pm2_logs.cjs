const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('pm2 logs clinidea-backend --lines 50 --nostream', (err, stream) => { 
    if (err) throw err;
    stream.on('data', d => console.log(d.toString()))
          .on('stderr', d => console.error(d.toString()))
          .on('close', () => conn.end()); 
  }); 
}).connect({host: '185.199.53.21', username: 'root', password: 'Swami@28031999'});
