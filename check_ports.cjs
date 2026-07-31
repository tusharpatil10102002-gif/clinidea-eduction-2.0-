const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('netstat -tulnp | grep -E "5000|5001" && pm2 ls', (err, stream) => { 
    if (err) throw err;
    stream.on('data', d => console.log(d.toString()))
          .on('stderr', d => console.error(d.toString()))
          .on('close', () => conn.end()); 
  }); 
}).connect({host: '185.199.53.21', username: 'root', password: 'Swami@28031999'});
