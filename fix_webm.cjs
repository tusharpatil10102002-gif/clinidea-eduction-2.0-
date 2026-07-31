const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected, fixing webm files...');
  
  const cmd = `
    cd /var/www/clinidea/backend/uploads/lms
    for file in *.webm; do
      if [ -f "$file" ]; then
        echo "Processing $file..."
        # We use -c copy which will recreate the WebM file with proper Cues
        ffmpeg -y -i "$file" -c copy "fixed_$file"
        if [ $? -eq 0 ]; then
          mv "fixed_$file" "$file"
          echo "Successfully fixed $file"
        else
          echo "Failed to fix $file"
          rm -f "fixed_$file"
        fi
      fi
    done
  `;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Fix script Exit Code:', code);
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
