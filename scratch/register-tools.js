const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
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
        description: 'Các tiện ích đồ họa, mã QR và công cụ trực tuyến miễn phí 100% trên trình duyệt.',
        type: 'resource',
        icon: 'Wrench'
      },
      create: {
        name: 'Công cụ Online',
        slug: 'cong-cu-online',
        description: 'Các tiện ích đồ họa, mã QR và công cụ trực tuyến miễn phí 100% trên trình duyệt.',
        type: 'resource',
        icon: 'Wrench'
      }
    });

    console.log(`Category verified: ${category.name} (${category.id})`);

    // 2. Remove unfinished placeholder tools from database
    const removed = await prisma.projectResource.deleteMany({
      where: {
        slug: {
          in: [
            'nen-anh-online-mien-phi',
            'convert-anh-sang-webp',
            'dem-tu-va-phan-tich-tu-khoa-seo'
          ]
        }
      }
    });
    console.log(`Removed ${removed.count} unfinished placeholder tools.`);

    // 3. Upsert the 2 polished tools:
    // Tool 1: Studio Lồng Khung Ảnh & Mockup Thiết Bị
    const toolMockup = await prisma.projectResource.upsert({
      where: { slug: 'ghep-anh-mockup-thiet-bi' },
      update: {
        title: 'Studio Lồng Khung Ảnh & Mockup Thiết Bị',
        description: 'Lồng khung tranh gỗ sồi, mạ vàng, dải phim 35mm hoài cổ, ảnh Polaroid và mockup iPhone 16 Pro, MacBook M3, Safari cực đẹp với phông mờ studio và xuất ảnh Retina siêu nét.',
        type: 'tool',
        url: '/du-an-tai-nguyen/ghep-anh-mockup',
        image: '/images/checklist-truoc-khi-build.webp',
        featured: true,
        categoryId: category.id
      },
      create: {
        title: 'Studio Lồng Khung Ảnh & Mockup Thiết Bị',
        slug: 'ghep-anh-mockup-thiet-bi',
        description: 'Lồng khung tranh gỗ sồi, mạ vàng, dải phim 35mm hoài cổ, ảnh Polaroid và mockup iPhone 16 Pro, MacBook M3, Safari cực đẹp với phông mờ studio và xuất ảnh Retina siêu nét.',
        type: 'tool',
        url: '/du-an-tai-nguyen/ghep-anh-mockup',
        image: '/images/checklist-truoc-khi-build.webp',
        featured: true,
        categoryId: category.id
      }
    });
    console.log(`Upserted: ${toolMockup.title}`);

    // Tool 2: Tạo Mã QR & VietQR Đẹp Tối Giản
    const toolQr = await prisma.projectResource.upsert({
      where: { slug: 'tao-ma-qr-vietqr-mien-phi' },
      update: {
        title: 'Tạo Mã QR & VietQR Đẹp Tối Giản',
        description: 'Tạo mã QR thanh toán ngân hàng (VietQR Napas 24/7), liên kết website và mạng Wi-Fi bảo mật. Tùy biến màu thương hiệu sắc nét và tải ảnh tức thì.',
        type: 'tool',
        url: '/du-an-tai-nguyen/tao-ma-qr',
        image: '/images/phong-cach-hoc-tap-va-lam-viec-cua-harry.webp',
        featured: true,
        categoryId: category.id
      },
      create: {
        title: 'Tạo Mã QR & VietQR Đẹp Tối Giản',
        slug: 'tao-ma-qr-vietqr-mien-phi',
        description: 'Tạo mã QR thanh toán ngân hàng (VietQR Napas 24/7), liên kết website và mạng Wi-Fi bảo mật. Tùy biến màu thương hiệu sắc nét và tải ảnh tức thì.',
        type: 'tool',
        url: '/du-an-tai-nguyen/tao-ma-qr',
        image: '/images/phong-cach-hoc-tap-va-lam-viec-cua-harry.webp',
        featured: true,
        categoryId: category.id
      }
    });
    console.log(`Upserted: ${toolQr.title}`);

    console.log('Database successfully updated!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
