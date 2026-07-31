const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function convertImages(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await convertImages(filePath);
    } else if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const outPath = path.join(dir, `${baseName}.webp`);

      console.log(`Converting: ${filePath} -> ${outPath}`);
      try {
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(outPath);
        
        // Remove old file
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error converting ${filePath}:`, err);
      }
    }
  }
}

convertImages(publicDir).then(() => console.log('All images converted to WebP.'));
