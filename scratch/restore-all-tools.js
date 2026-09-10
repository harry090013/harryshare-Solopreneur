const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- RESTORING ALL ONLINE TOOLS WITH CLEAN THUMBNAILS ---');

    // 1. Ensure category "Công cụ Online"
    const category = await prisma.category.upsert({
      where: { 
        slug_type: {
          slug: 'cong-cu-online',
          type: 'resource'
        }
      },
      update: {
        name: 'Công cụ Online',
        description: 'Các tiện ích miễn phí xử lý trực tiếp trên trình duyệt, bảo mật 100%.',
        type: 'resource',
        icon: 'Wrench'
      },
      create: {
        name: 'Công cụ Online',
        slug: 'cong-cu-online',
        description: 'Các tiện ích miễn phí xử lý trực tiếp trên trình duyệt, bảo mật 100%.',
        type: 'resource',
        icon: 'Wrench'
      }
    });

    console.log(`Category ID: ${category.id}`);

    // 2. All Online Tools with their proper dedicated thumbnails
    const allTools = [
      {
        title: 'Studio Lồng Khung Ảnh & Mockup Thiết Bị',
        slug: 'ghep-anh-mockup-thiet-bi',
        description: 'Đóng khung ảnh nghệ thuật (gỗ sồi, mạ vàng, dải phim 35mm, ảnh Polaroid) và mockup iPhone 16 Pro, MacBook M3, Safari với phông mờ studio và xuất ảnh Retina sắc nét.',
        type: 'tool',
        url: '/du-an-tai-nguyen/ghep-anh-mockup',
        image: '/images/thumb-ghep-anh-mockup.webp',
        featured: true,
        categoryId: category.id
      },
      {
        title: 'Tạo Mã QR & VietQR Đẹp Tối Giản',
        slug: 'tao-ma-qr-vietqr-mien-phi',
        description: 'Tạo mã QR thanh toán ngân hàng (VietQR Napas 24/7), link website và Wi-Fi bảo mật. Tùy biến màu thương hiệu và tải ảnh tức thì.',
        type: 'tool',
        url: '/du-an-tai-nguyen/tao-ma-qr',
        image: '/images/thumb-tao-ma-qr.webp',
        featured: true,
        categoryId: category.id
      },
      {
        title: 'Nén ảnh online miễn phí',
        slug: 'nen-anh-online-mien-phi',
        description: 'Nén và giảm dung lượng ảnh PNG, JPG trực tiếp trên trình duyệt của bạn với tốc độ tức thì, bảo mật 100%.',
        type: 'tool',
        url: '/du-an-tai-nguyen/nen-anh',
        image: '/images/thumb-nen-anh-online.webp',
        featured: true,
        categoryId: category.id
      },
      {
        title: 'Chuyển đổi ảnh sang WebP',
        slug: 'convert-anh-sang-webp',
        description: 'Chuyển đổi các định dạng hình ảnh sang WebP hàng loạt để tối ưu hóa SEO và tốc độ tải trang web.',
        type: 'tool',
        url: '/du-an-tai-nguyen/convert-webp',
        image: '/images/thumb-convert-webp.webp',
        featured: true,
        categoryId: category.id
      },
      {
        title: 'Đếm từ & Phân tích từ khóa SEO',
        slug: 'dem-tu-va-phan-tich-tu-khoa-seo',
        description: 'Công cụ phân tích mật độ từ khóa, đếm từ, đếm câu và ước tính thời gian đọc thời gian thực.',
        type: 'tool',
        url: '/du-an-tai-nguyen/dem-tu',
        image: '/images/thumb-dem-tu.webp',
        featured: true,
        categoryId: category.id
      }
    ];

    // Clean up any legacy duplicate slugs if any
    const legacySlugs = [
      'ghep-anh-mockup-san-pham',
      'tao-ma-qr-va-vietqr-chen-logo'
    ];
    await prisma.projectResource.deleteMany({
      where: { slug: { in: legacySlugs } }
    });

    for (const tool of allTools) {
      const res = await prisma.projectResource.upsert({
        where: { slug: tool.slug },
        update: tool,
        create: tool
      });
      console.log(`✓ Restored: ${res.title} -> ${res.url} (Image: ${res.image})`);
    }

    console.log('--- ALL TOOLS RESTORED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Error restoring tools:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
