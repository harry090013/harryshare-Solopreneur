const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const datesToUpdate = [
      { slug: 'cong-cu-ai-minh-dung-hang-ngay', dateStr: '2026-06-18T07:00:00+07:00' },
      { slug: 'mot-nguoi-cong-ai-lam-viec-ca-nhom', dateStr: '2026-06-19T07:00:00+07:00' },
      { slug: 'duoc-nhin-thay-kho-hon-lam-ra-san-pham', dateStr: '2026-06-20T07:00:00+07:00' },
      { slug: 'vi-sao-minh-cho-di-truoc', dateStr: '2026-06-21T07:00:00+07:00' },
      { slug: 'gioi-han-cua-ai-agent', dateStr: '2026-06-22T07:00:00+07:00' }
    ];

    for (const item of datesToUpdate) {
      const targetDate = new Date(item.dateStr);
      await prisma.post.update({
        where: { slug: item.slug },
        data: { date: targetDate }
      });
      console.log(`Updated ${item.slug} to date: ${targetDate}`);
    }
    console.log('Successfully updated all post dates!');
  } catch (err) {
    console.error('Error updating dates:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
