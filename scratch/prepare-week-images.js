const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  const destDir = path.join(__dirname, '..', 'public', 'images');

  const targets = [
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      filename: 'vi-sao-minh-chon-lam-cong-cu-mien-phi-cover.webp'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      filename: 'gioi-han-cua-ai-agent-nhung-bai-hoc-thuc-te-cover.webp'
    },
    {
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      filename: 'lam-san-pham-vat-ly-khac-gi-lam-phan-mem-cover.webp'
    },
    {
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
      filename: 'mot-nguoi-cong-ai-quan-tri-nhip-song-o-que-cover.webp'
    }
  ];

  for (const item of targets) {
    const tempFile = path.join(__dirname, `temp_${item.filename}.jpg`);
    const finalDest = path.join(destDir, item.filename);

    console.log(`Downloading ${item.filename}...`);
    try {
      await download(item.url, tempFile);
      console.log(`Converting to WebP 16:9...`);
      await sharp(tempFile)
        .resize({ width: 1200, height: 675, fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(finalDest);
      fs.unlinkSync(tempFile);
      console.log(`✓ Saved ${item.filename}`);
    } catch (e) {
      console.error(`Error processing ${item.filename}:`, e);
    }
  }
}

main().catch(console.error);
