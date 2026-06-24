const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        date: true,
        published: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    console.log('ALL POSTS IN DB:');
    posts.forEach(p => {
      console.log(`- Slug: ${p.slug}`);
      console.log(`  Title: ${p.title}`);
      console.log(`  Date: ${p.date}`);
      console.log(`  Published: ${p.published}`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
