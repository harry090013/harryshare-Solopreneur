const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true
      }
    });

    const groups = {};
    posts.forEach(p => {
      if (!groups[p.coverImage]) groups[p.coverImage] = [];
      groups[p.coverImage].push(p);
    });

    console.log('Duplicate Cover Images:');
    Object.keys(groups).forEach(img => {
      if (groups[img].length > 1) {
        console.log(`\nImage: ${img}`);
        groups[img].forEach(p => {
          console.log(`  - ID: ${p.id} | Slug: ${p.slug} | Title: ${p.title}`);
        });
      }
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
