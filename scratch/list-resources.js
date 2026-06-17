const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const resources = await prisma.projectResource.findMany();
    console.log('RESOURCES IN DB:', JSON.stringify(resources, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
