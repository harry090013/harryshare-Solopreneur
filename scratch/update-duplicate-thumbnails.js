const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    slug: 'dung-xay-tinh-nang-hay-xay-giai-phap-cho-quy-trinh',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'viet-blog-la-cach-tu-phan-chieu-va-hoc-hoi',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'thuong-hieu-ca-nhan-khong-phai-la-co-gang-dien',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'su-nhat-quan-vu-khi-tham-lang-xay-dung-long-tin',
    coverImage: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'vuot-qua-noi-so-overthinking-de-bat-dau-hanh-dong',
    coverImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'moi-san-pham-tot-deu-nen-bat-dau-tu-noi-dau-cua-chinh-minh',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'kien-truc-hoa-su-don-gian-trong-phat-trien-san-pham',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'ky-nang-phan-bien-trong-thoi-dai-ai-tao-sinh',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  }
];

async function update() {
  try {
    for (const item of updates) {
      const updated = await prisma.post.update({
        where: { slug: item.slug },
        data: { coverImage: item.coverImage }
      });
      console.log(`Updated coverImage for: ${updated.slug}`);
    }
    console.log('All updates completed successfully!');
  } catch (err) {
    console.error('Error during update:', err);
  } finally {
    await prisma.$disconnect();
  }
}

update();
