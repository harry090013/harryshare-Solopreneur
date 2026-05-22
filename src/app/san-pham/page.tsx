import React from 'react';
import ProductsClient from './ProductsClient';
import { db } from '@/lib/db';

export const revalidate = 60;

export default async function ProductsPage() {
  let products = [];
  let categories = [];

  try {
    products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true
      }
    });

    categories = await db.category.findMany({
      where: { type: 'product' },
      orderBy: { name: 'asc' }
    });
  } catch (err) {
    console.error('Database connection failed in Products Page, falling back to mock:', err);
    
    // Fallback Mock Categories
    categories = [
      { id: 'cat-main-service', name: 'Dịch vụ của Harry', slug: 'dich-vu-cua-harry' },
      { id: 'cat-digital-prod', name: 'Sản phẩm số', slug: 'san-pham-so' },
      { id: 'cat-affiliate-gear', name: 'Thiết bị làm việc (Affiliate)', slug: 'thiet-bi-lam-viec' },
      { id: 'cat-affiliate-course', name: 'Khóa học khuyên dùng (Affiliate)', slug: 'khoa-hoc-khuyen-dung' },
    ];

    // Fallback Mock Products
    products = [
      {
        id: 'p1',
        title: 'Cố vấn 1-1: Xây dựng Sản phẩm & Thương hiệu cá nhân',
        slug: 'co-van-1-1-xay-dung-san-pham',
        description: 'Chương trình đồng hành 8 tuần giúp bạn từ số 0 phát triển một sản phẩm công nghệ hoàn chỉnh và thu hút nhóm độc giả đầu tiên.',
        content: 'Đây là chương trình cố vấn đặc biệt được thiết kế riêng cho các bạn Solopreneur...',
        price: 15000000,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        type: 'main',
        affiliateUrl: null,
        featured: true,
        category: { id: 'cat-main-service', name: 'Dịch vụ của Harry', slug: 'dich-vu-cua-harry' }
      },
      {
        id: 'p2',
        title: 'Cẩm nang Solopreneur Khởi nghiệp tinh gọn',
        slug: 'cam-nang-solopreneur-khoi-nghiep-tinh-gon',
        description: 'Tài liệu hơn 150 trang chứa toàn bộ bí quyết, biểu mẫu, quy trình vận hành một mô hình kinh doanh cá nhân siêu lợi nhuận.',
        content: 'Cuốn sách số này sẽ giải mã cách xây dựng doanh nghiệp 1 người...',
        price: 299000,
        image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80',
        type: 'main',
        affiliateUrl: null,
        featured: false,
        category: { id: 'cat-digital-prod', name: 'Sản phẩm số', slug: 'san-pham-so' }
      },
      {
        id: 'p3',
        title: 'Bàn phím cơ Keychron K2 Pro QMK/VIA',
        slug: 'ban-phim-co-keychron-k2-pro',
        description: 'Chiếc bàn phím cơ layout 75% gọn nhẹ, gõ cực êm, hỗ trợ custom phím dễ dàng qua VIA. Harry đang dùng hàng ngày.',
        content: 'Nếu bạn đang tìm một chiếc bàn phím cơ hoàn hảo cho lập trình viên...',
        price: 2350000,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
        type: 'affiliate',
        affiliateUrl: 'https://keychron.com.vn',
        featured: true,
        category: { id: 'cat-affiliate-gear', name: 'Thiết bị làm việc (Affiliate)', slug: 'thiet-bi-lam-viec' }
      },
      {
        id: 'p4',
        title: 'Khóa học Next.js 14 - Xây dựng SaaS Apps chuyên nghiệp',
        slug: 'khoa-hoc-nextjs-14-saas',
        description: 'Khóa học thực chiến toàn diện từ cơ bản đến nâng cao về Next.js, Stripe, Prisma, Postgres của tác giả nổi tiếng.',
        content: 'Đây là khóa học tuyệt vời nhất về Next.js mà mình từng học...',
        price: 1999000,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        type: 'affiliate',
        affiliateUrl: 'https://udemy.com',
        featured: false,
        category: { id: 'cat-affiliate-course', name: 'Khóa học khuyên dùng (Affiliate)', slug: 'khoa-hoc-khuyen-dung' }
      }
    ];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-12 animate-slide-up">
      {/* Header */}
      <div className="text-left max-w-2xl flex flex-col gap-3">
        <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
          🛍️ Sản phẩm & dịch vụ
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-850 leading-tight">
          Cửa hàng của Harry
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Khám phá những sản phẩm chính chủ chất lượng cao do mình thiết kế, hoặc các thiết bị, khóa học affiliate uy tín mà mình đã trải nghiệm và tin dùng.
        </p>
      </div>

      {/* Products Client */}
      <ProductsClient initialProducts={products} categories={categories} />
    </div>
  );
}
