const net = require('net');

const client = new net.Socket();
client.setTimeout(5000);

client.connect(22, '185.199.53.21', () => {
  console.log('✅ TCP Connection to 185.199.53.21:22 Successful!');
  client.destroy();
});

client.on('error', (err) => {
  console.log('❌ Connection error:', err.message);
});

client.on('timeout', () => {
  console.log('❌ Connection timed out');
  client.destroy();
});
