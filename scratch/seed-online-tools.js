const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // 1. Create or upsert Category "Công cụ Online"
    const category = await prisma.category.upsert({
      where: { 
        slug_type: {
          slug: 'cong-cu-online',
          type: 'resource'
        }
      },
      update: {
        name: 'Công cụ Online',
        description: 'Các công cụ tiện ích miễn phí chạy trực tiếp trên trình duyệt.',
        type: 'resource',
        icon: 'Wrench'
      },
      create: {
        name: 'Công cụ Online',
        slug: 'cong-cu-online',
        description: 'Các công cụ tiện ích miễn phí chạy trực tiếp trên trình duyệt.',
        type: 'resource',
        icon: 'Wrench'
      }
    });

    console.log(`Category created/updated: ${category.name} (ID: ${category.id})`);

    // 2. Add Project resources
    const tools = [
      {
        title: "Nén ảnh online miễn phí",
        slug: "nen-anh-online-mien-phi",
        description: "Nén và giảm dung lượng ảnh PNG, JPG trực tiếp trên trình duyệt của bạn với tốc độ tức thì, bảo mật 100%.",
        type: "tool",
        url: "/du-an-tai-nguyen/nen-anh",
        image: "/images/thumb-nen-anh-online.png",
        featured: true,
        categoryId: category.id
      },
      {
        title: "Chuyển đổi ảnh sang WebP",
        slug: "convert-anh-sang-webp",
        description: "Chuyển đổi các định dạng hình ảnh sang WebP hàng loạt để tối ưu hóa SEO và tốc độ tải trang web.",
        type: "tool",
        url: "/du-an-tai-nguyen/convert-webp",
        image: "/images/thumb-convert-webp.png",
        featured: true,
        categoryId: category.id
      },
      {
        title: "Đếm từ & Phân tích từ khóa SEO",
        slug: "dem-tu-va-phan-tich-tu-khoa-seo",
        description: "Công cụ phân tích mật độ từ khóa, đếm từ, đếm câu và ước tính thời gian đọc thời gian thực.",
        type: "tool",
        url: "/du-an-tai-nguyen/dem-tu",
        image: "/images/thumb-dem-tu.png",
        featured: true,
        categoryId: category.id
      }
    ];

    for (const tool of tools) {
      await prisma.projectResource.upsert({
        where: { slug: tool.slug },
        update: tool,
        create: tool
      });
      console.log(`Resource upserted: ${tool.title}`);
    }

    console.log('Online tools category and resource items seeded successfully!');
  } catch (err) {
    console.error('Error seeding online tools:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
