const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const resources = await prisma.projectResource.findMany({
      where: { type: 'freebie' }
    });
    for (const res of resources) {
      console.log(`Resource: ${res.title}`);
      console.log(`- ID: ${res.id}`);
      console.log(`- Slug: ${res.slug}`);
      console.log(`- downloadUrl: ${res.downloadUrl}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
