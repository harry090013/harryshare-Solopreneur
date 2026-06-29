const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const posts = await prisma.post.findMany();
    console.log(`Found ${posts.length} posts to update.`);

    for (const post of posts) {
      // Generate natural looking numbers
      const fakeViews = Math.floor(Math.random() * (7800 - 1200 + 1)) + 1200;
      const fakeLikes = Math.floor(fakeViews * (0.08 + Math.random() * 0.05)); // 8% - 13% of views are likes
      const fakeShares = Math.floor(fakeLikes * (0.15 + Math.random() * 0.1)); // 15% - 25% of likes are shares

      await prisma.post.update({
        where: { id: post.id },
        data: {
          views: fakeViews,
          likes: fakeLikes,
          shares: fakeShares
        }
      });
      console.log(`Updated post: ${post.title}`);
      console.log(`- Views: ${fakeViews}, Likes: ${fakeLikes}, Shares: ${fakeShares}`);
    }

    console.log('Successfully faked post interaction stats!');
  } catch (err) {
    console.error('Error faking interactions:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
