const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  "sed -i 's/# gzip_vary on;/gzip_vary on;/' /etc/nginx/nginx.conf",
  "sed -i 's/# gzip_proxied any;/gzip_proxied any;/' /etc/nginx/nginx.conf",
  "sed -i 's/# gzip_comp_level 6;/gzip_comp_level 6;/' /etc/nginx/nginx.conf",
  "sed -i 's/# gzip_buffers 16 8k;/gzip_buffers 16 8k;/' /etc/nginx/nginx.conf",
  "sed -i 's/# gzip_http_version 1.1;/gzip_http_version 1.1;/' /etc/nginx/nginx.conf",
  "sed -i 's/# gzip_types /gzip_types /' /etc/nginx/nginx.conf",
  "sed -i 's/listen 443 ssl;/listen 443 ssl http2;/' /etc/nginx/sites-available/clinidea",
  "grep -q 'max-age=31536000' /etc/nginx/sites-available/clinidea || sed -i '/location \\/ {/i \\    location ~* \\\\.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp|avif)$ {\\n        root /var/www/clinidea/dist;\\n        expires 1y;\\n        access_log off;\\n        add_header Cache-Control \"public, max-age=31536000, immutable\";\\n        try_files $uri =404;\\n    }\\n' /etc/nginx/sites-available/clinidea",
  "nginx -t",
  "systemctl reload nginx"
];

conn.on('ready', () => {
  console.log('Connected.');
  let i = 0;
  const next = () => {
    if (i >= commands.length) {
      console.log('All done');
      conn.end();
      return;
    }
    const cmd = commands[i++];
    console.log('Running:', cmd);
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code) => {
        if (code !== 0) console.log('Command failed with code:', code);
        next();
      }).on('data', (d) => process.stdout.write('STDOUT: ' + d.toString())).stderr.on('data', (d) => process.stdout.write('STDERR: ' + d.toString()));
    });
  };
  next();
}).on('error', (err) => {
  console.log('Connection Error:', err);
}).connect({
  host: '185.199.53.21',
  port: 22,
  username: 'root',
  password: 'Swami@28031999',
});
