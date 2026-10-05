const sharp = require('sharp');
const path = require('path');

const brainDir = 'C:/Users/Harry/.gemini/antigravity/brain/46f49c42-3893-4c6f-8bb6-81e63fcaaf49';

const imagesToProcess = [
  {
    src: path.join(brainDir, 'voice_ai_realtime_1791205108584.jpg'),
    dest: 'public/images/voice-ai-thoi-gian-thuc-trai-nghiem-dam-thoai-hai-chieu.webp'
  },
  {
    src: path.join(brainDir, 'mvp_product_launch_1791205141442.jpg'),
    dest: 'public/images/san-pham-toi-gian-dau-tien-mvp-khi-nao-nen-ra-mat.webp'
  },
  {
    src: path.join(brainDir, 'dev_to_marketing_1791205166976.jpg'),
    dest: 'public/images/tu-lap-trinh-vien-sang-marketing-3-loi-the-cong-nghe.webp'
  }
];

async function main() {
  for (const item of imagesToProcess) {
    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(item.dest);
    console.log(`✓ Processed: ${item.dest}`);
  }
  console.log('--- ALL 3 IMAGES PROCESSED SUCCESSFULLY ---');
}

main().catch(console.error);
