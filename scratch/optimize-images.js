const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');

const prisma = new PrismaClient();

// Directories to scan
const SCAN_DIRS = [
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..', 'public', 'images'),
];

async function main() {
  console.log('--- BẮT ĐẦU TỐI ƯU HÓA HÌNH ẢNH ---');

  const fileMap = []; // Keep track of old file -> new file mappings for DB updates

  for (const scanDir of SCAN_DIRS) {
    if (!fs.existsSync(scanDir)) {
      console.log(`Thư mục không tồn tại: ${scanDir}`);
      continue;
    }

    console.log(`\nĐang quét thư mục: ${scanDir}`);
    const files = fs.readdirSync(scanDir);

    for (const file of files) {
      const filePath = path.join(scanDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) continue;

      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

      // Only optimize images heavier than 150KB
      const sizeKb = stat.size / 1024;
      if (sizeKb < 150) {
        console.log(`Skipping ${file} (${sizeKb.toFixed(1)} KB - Đã đủ nhẹ)`);
        continue;
      }

      const baseName = path.basename(file, ext);
      const webpFileName = `${baseName}.webp`;
      const webpFilePath = path.join(scanDir, webpFileName);

      console.log(`Đang nén & convert: ${file} (${sizeKb.toFixed(1)} KB) -> ${webpFileName}...`);

      try {
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(webpFilePath);

        const newStat = fs.statSync(webpFilePath);
        console.log(`  => Thành công: ${webpFileName} (${(newStat.size / 1024).toFixed(1)} KB)`);

        // Record the relative URL paths
        const relDir = scanDir.endsWith('images') ? '/images/' : '/';
        const oldUrl = `${relDir}${file}`;
        const newUrl = `${relDir}${webpFileName}`;

        fileMap.push({ oldUrl, newUrl, filePathToDelete: filePath });
      } catch (err) {
        console.error(`  => Lỗi khi nén file ${file}:`, err.message);
      }
    }
  }

  if (fileMap.length === 0) {
    console.log('\nKhông tìm thấy hình ảnh nào cần tối ưu hóa thêm.');
    await prisma.$disconnect();
    return;
  }

  console.log('\n--- CẬP NHẬT CƠ SỞ DỮ LIỆU ---');
  
  // 1. Update Post coverImages, content references
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    let coverUpdated = false;
    let contentUpdated = false;
    let updatedCoverImage = post.coverImage;
    let updatedContent = post.content;

    for (const mapping of fileMap) {
      if (updatedCoverImage === mapping.oldUrl) {
        updatedCoverImage = mapping.newUrl;
        coverUpdated = true;
      }
      if (updatedContent && updatedContent.includes(mapping.oldUrl)) {
        updatedContent = updatedContent.split(mapping.oldUrl).join(mapping.newUrl);
        contentUpdated = true;
      }
    }

    if (coverUpdated || contentUpdated) {
      console.log(`Cập nhật post: "${post.title}"`);
      await prisma.post.update({
        where: { id: post.id },
        data: {
          coverImage: updatedCoverImage,
          content: updatedContent,
        },
      });
    }
  }

  // 2. Update ProjectResource images
  const resources = await prisma.projectResource.findMany();
  for (const res of resources) {
    let imageUpdated = false;
    let updatedImage = res.image;

    for (const mapping of fileMap) {
      if (updatedImage === mapping.oldUrl) {
        updatedImage = mapping.newUrl;
        imageUpdated = true;
      }
    }

    if (imageUpdated) {
      console.log(`Cập nhật tài nguyên: "${res.title}"`);
      await prisma.projectResource.update({
        where: { id: res.id },
        data: { image: updatedImage },
      });
    }
  }

  console.log('\n--- DỌN DẸP HÌNH ẢNG GỐC NẶNG ---');
  for (const mapping of fileMap) {
    try {
      if (fs.existsSync(mapping.filePathToDelete)) {
        fs.unlinkSync(mapping.filePathToDelete);
        console.log(`Đã xóa file gốc: ${path.basename(mapping.filePathToDelete)}`);
      }
    } catch (err) {
      console.error(`Không thể xóa file ${mapping.filePathToDelete}:`, err.message);
    }
  }

  console.log('\n--- HOÀN THÀNH TỐI ƯU HÓA HÌNH ẢNH ---');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Fatal error during optimization:', err);
  prisma.$disconnect();
});
