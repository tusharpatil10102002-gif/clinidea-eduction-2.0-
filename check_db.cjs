const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('cd /var/www/clinidea/backend && node -e "const { PrismaClient } = require(\'@prisma/client\'); const prisma = new PrismaClient(); prisma.placement.findMany().then(p => { console.log(JSON.stringify(p)); process.exit(0); })"', (err, stream) => { 
    if (err) throw err;
    stream.on('data', d => console.log(d.toString()))
          .on('stderr', d => console.error(d.toString()))
          .on('close', () => conn.end()); 
  }); 
}).connect({host: '185.199.53.21', username: 'root', password: 'Swami@28031999'});
