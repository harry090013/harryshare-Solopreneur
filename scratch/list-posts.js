const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function list() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        slug: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    console.log('Existing Posts:', JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

list();
