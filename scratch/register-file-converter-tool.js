const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateThumbnail() {
  const outPath = path.join(process.cwd(), 'public', 'images', 'thumb-chuyen-doi-file.webp');
  const svg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FAF7F0"/>
        <stop offset="100%" stop-color="#EFEAD8"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#556B2F"/>
        <stop offset="100%" stop-color="#3F5122"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="675" fill="url(#bg)"/>
    <circle cx="1040" cy="110" r="240" fill="#556B2F" fill-opacity="0.06"/>
    <circle cx="160" cy="600" r="200" fill="#556B2F" fill-opacity="0.05"/>

    <!-- Top Brand Pill -->
    <rect x="76" y="68" width="268" height="42" rx="21" fill="#556B2F" fill-opacity="0.12" stroke="#556B2F" stroke-opacity="0.25"/>
    <text x="210" y="95" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5" fill="#465925">HARRYSHARE FREE TOOL</text>

    <!-- Main Heading -->
    <text x="76" y="210" font-family="Georgia, serif" font-size="58" font-weight="700" fill="#1C1917">Chuyển đổi File</text>
    <text x="76" y="282" font-family="Georgia, serif" font-size="58" font-weight="700" fill="#4A5D23">&amp; Media Đa Năng</text>

    <text x="76" y="344" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#57534E">Xử lý trực tiếp trên trình duyệt • Bảo mật • Không watermark</text>

    <!-- Feature Cards Grid (Right & Bottom) -->
    <!-- Card 1: PDF <-> Word -->
    <rect x="76" y="405" width="248" height="190" rx="24" fill="#FFFFFF" stroke="#E5E0D5" stroke-width="2"/>
    <rect x="102" y="432" width="56" height="56" rx="16" fill="url(#accent)"/>
    <text x="130" y="468" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">PDF</text>
    <text x="102" y="528" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#1C1917">PDF ↔ Word</text>
    <text x="102" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#78716C">Đổi qua lại .docx &amp; .pdf</text>

    <!-- Card 2: PDF Tools -->
    <rect x="344" y="405" width="248" height="190" rx="24" fill="#FFFFFF" stroke="#E5E0D5" stroke-width="2"/>
    <rect x="370" y="432" width="56" height="56" rx="16" fill="#D97706"/>
    <text x="398" y="468" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="800" fill="#FFFFFF">IMG</text>
    <text x="370" y="528" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#1C1917">Ảnh &amp; Gộp PDF</text>
    <text x="370" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#78716C">Ảnh↔PDF, Gộp, Tách</text>

    <!-- Card 3: MP3 -> SRT -->
    <rect x="612" y="405" width="248" height="190" rx="24" fill="#FFFFFF" stroke="#E5E0D5" stroke-width="2"/>
    <rect x="638" y="432" width="56" height="56" rx="16" fill="#0F766E"/>
    <text x="666" y="468" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="800" fill="#FFFFFF">SRT</text>
    <text x="638" y="528" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#1C1917">MP3 → Lyric SRT</text>
    <text x="638" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#78716C">AI tự động + Sync tay</text>

    <!-- Card 4: Audio & Data -->
    <rect x="880" y="405" width="244" height="190" rx="24" fill="#FFFFFF" stroke="#E5E0D5" stroke-width="2"/>
    <rect x="906" y="432" width="56" height="56" rx="16" fill="#B91C1C"/>
    <text x="934" y="468" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">MP3</text>
    <text x="906" y="528" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#1C1917">Video &amp; Data</text>
    <text x="906" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#78716C">YT, WAV, CSV/JSON</text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(outPath);

  console.log('Generated thumbnail:', outPath);
}

async function registerTool() {
  let category = await prisma.category.findFirst({
    where: { slug: 'cong-cu-online', type: 'resource' },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Công cụ Online',
        slug: 'cong-cu-online',
        type: 'resource',
        description: 'Các công cụ web miễn phí hỗ trợ công việc và sáng tạo nội dung hàng ngày.',
      },
    });
    console.log('Created category:', category.slug);
  }

  const tool = await prisma.projectResource.upsert({
    where: { slug: 'chuyen-doi-file-media-da-nang' },
    update: {
      title: 'Chuyển đổi File & Media Đa Năng (PDF, Word, MP3 → SRT)',
      description:
        'Bộ công cụ chuyển đổi miễn phí: PDF ↔ Word (.docx), Ảnh ↔ PDF, Gộp/Tách trang PDF, tách lời bài hát MP3 sang phụ đề Lyric (.srt) bằng AI hoặc đồng bộ tay, trích xuất âm thanh từ Video và chuyển đổi CSV/JSON/Markdown.',
      type: 'tool',
      url: '/du-an-tai-nguyen/chuyen-doi-file',
      image: '/images/thumb-chuyen-doi-file.webp',
      featured: true,
      categoryId: category.id,
    },
    create: {
      title: 'Chuyển đổi File & Media Đa Năng (PDF, Word, MP3 → SRT)',
      slug: 'chuyen-doi-file-media-da-nang',
      description:
        'Bộ công cụ chuyển đổi miễn phí: PDF ↔ Word (.docx), Ảnh ↔ PDF, Gộp/Tách trang PDF, tách lời bài hát MP3 sang phụ đề Lyric (.srt) bằng AI hoặc đồng bộ tay, trích xuất âm thanh từ Video và chuyển đổi CSV/JSON/Markdown.',
      type: 'tool',
      url: '/du-an-tai-nguyen/chuyen-doi-file',
      image: '/images/thumb-chuyen-doi-file.webp',
      featured: true,
      categoryId: category.id,
    },
  });

  console.log('Upserted ProjectResource:', tool.id, '|', tool.slug, '|', tool.url);
}

async function main() {
  await generateThumbnail();
  await registerTool();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
