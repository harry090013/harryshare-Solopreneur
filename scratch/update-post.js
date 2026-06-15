const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newTitle = 'Vượt ra khỏi khung chat: Khi AI Agent trở thành "đồng nghiệp số" thực thụ';
const newSlug = 'vuot-ra-khoi-khung-chat-ai-agent-dong-nghiep-so';

async function update() {
  try {
    const post = await prisma.post.update({
      where: { id: '8ce08622-48b2-4950-96ee-c1316692bcbb' },
      data: {
        title: newTitle,
        slug: newSlug
      }
    });
    console.log('Post updated successfully:', post.id, post.title, post.slug);
  } catch (err) {
    console.error('Update error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
update();
