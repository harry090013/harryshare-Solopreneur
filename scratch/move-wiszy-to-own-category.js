const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- CREATING DEDICATED WISZY POST CATEGORY & MOVING ALL WISZY POSTS ---');

  const wiszyCategory = await prisma.category.upsert({
    where: {
      slug_type: {
        slug: 'wiszy',
        type: 'post'
      }
    },
    update: {
      name: 'Wiszy',
      description: 'Hành trình xây dựng hệ sinh thái giáo dục Wiszy (wiszy.vn) kết nối Giáo viên, Phụ huynh và Học sinh.',
      icon: 'GraduationCap'
    },
    create: {
      name: 'Wiszy',
      slug: 'wiszy',
      description: 'Hành trình xây dựng hệ sinh thái giáo dục Wiszy (wiszy.vn) kết nối Giáo viên, Phụ huynh và Học sinh.',
      type: 'post',
      icon: 'GraduationCap'
    }
  });

  console.log(`✓ Category ready: "${wiszyCategory.name}" (slug: ${wiszyCategory.slug}, id: ${wiszyCategory.id})`);

  const wiszyPosts = await prisma.post.findMany({
    where: {
      OR: [
        { slug: { contains: 'wiszy' } },
        { title: { contains: 'Wiszy', mode: 'insensitive' } }
      ]
    },
    select: { id: true, title: true, slug: true }
  });

  const result = await prisma.post.updateMany({
    where: {
      id: { in: wiszyPosts.map((p) => p.id) }
    },
    data: {
      categoryId: wiszyCategory.id
    }
  });

  console.log(`✓ Moved ${result.count} Wiszy posts into category "${wiszyCategory.name}":`);
  for (const p of wiszyPosts) {
    console.log(`  - ${p.title} (${p.slug})`);
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
