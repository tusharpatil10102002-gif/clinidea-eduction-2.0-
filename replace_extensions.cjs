const fs = require('fs');
const path = require('path');

function replaceExtensions(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceExtensions(filePath);
    } else if (file.match(/\.(js|jsx|css|html)$/i)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // We want to replace .jpg, .jpeg, .png with .webp, but only if they are likely URLs
      // In JS/JSX, they usually look like 'image.png' or "image.jpg" or `/image.png`
      const newContent = content.replace(/\.(png|jpg|jpeg)(['"`\)])/gi, '.webp$2');
      
      // Also inject loading="lazy" into img tags if it doesn't exist
      // Only do this roughly for standard img tags
      let updatedContent = newContent.replace(/<img\s+(?!.*loading=['"]lazy['"])([^>]+)>/gi, '<img loading="lazy" $1>');
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

replaceExtensions(path.join(__dirname, 'src'));
replaceExtensions(path.join(__dirname, 'public'));
// also check index.html in root
const idxPath = path.join(__dirname, 'index.html');
if (fs.existsSync(idxPath)) {
  let idxContent = fs.readFileSync(idxPath, 'utf8');
  const newIdx = idxContent.replace(/\.(png|jpg|jpeg)(['"`\)])/gi, '.webp$2');
  if (idxContent !== newIdx) {
    fs.writeFileSync(idxPath, newIdx, 'utf8');
    console.log(`Updated: index.html`);
  }
}

console.log('Finished updating image references and adding lazy loading.');
