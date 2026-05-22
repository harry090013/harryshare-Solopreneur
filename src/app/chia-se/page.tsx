import React from 'react';
import ChiaSeClient from './ChiaSeClient';
import { db } from '@/lib/db';

export const revalidate = 60;

export default async function ChiaSePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: selectedCategorySlug } = await searchParams;

  let posts: any[] = [];
  let categories: any[] = [];

  try {
    posts = await db.post.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      include: {
        category: true
      }
    });

    categories = await db.category.findMany({
      where: { type: 'post' }
    });
  } catch (err) {
    console.error('Database query failed in ChiaSePage, using mock fallbacks:', err);
    // Fallback Mock Data
    categories = [
      { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' },
      { id: '2', name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' },
      { id: '3', name: 'AI & Vibe Coding', slug: 'ai-vibe-coding' },
      { id: '4', name: 'Hành trình làm nghề', slug: 'hanh-trinh-lam-nghe' },
    ];

    posts = [
      {
        id: '1',
        title: 'Vibe Coding - Kỷ nguyên mới của các nhà sáng tạo công nghệ',
        slug: 'vibe-coding-ky-nguyen-moi-cua-cac-nha-sang-tao-cong-nghe',
        description: 'Lập trình viên tương lai sẽ không viết code từng dòng nữa. Chúng ta sẽ "vibe" cùng AI để biến ý tưởng thành sản phẩm thực tế.',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        readTime: 5,
        date: new Date('2026-05-18'),
        category: { id: '3', name: 'AI & Vibe Coding', slug: 'ai-vibe-coding' }
      },
      {
        id: '2',
        title: 'Xây dựng thương hiệu cá nhân bền vững từ số 0',
        slug: 'xay-dung-thuong-hieu-ca-nhan-ben-vung-tu-so-0',
        description: 'Thương hiệu cá nhân không phải là phô trương bóng bẩy. Nó là việc kiên trì chia sẻ giá trị thực đến đúng đối tượng.',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
        readTime: 8,
        date: new Date('2026-05-15'),
        category: { id: '2', name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' }
      },
      {
        id: '3',
        title: 'Tư duy Product-Led Growth cho Solopreneur',
        slug: 'tu-duy-product-led-growth-cho-solopreneur',
        description: 'Làm sao để sản phẩm tự bán chính nó? Khám phá cách Solopreneur áp dụng mô hình PLG để phát triển bền vững.',
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readTime: 6,
        date: new Date('2026-05-10'),
        category: { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' }
      },
      {
        id: '4',
        title: 'Hành trình từ cậu bé phục vụ bàn đến Solopreneur tự do',
        slug: 'hanh-trinh-tu-cau-be-phuc-vu-ban-den-solopreneur-tu-do',
        description: 'Nhìn lại chặng đường 10 năm bôn ba qua đủ nghề: Phục vụ bàn, bán áo thun POD, lập trình tự do, làm marketing và cuối cùng là tự xây sản phẩm riêng.',
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        readTime: 10,
        date: new Date('2026-05-20'),
        category: { id: '4', name: 'Hành trình làm nghề', slug: 'hanh-trinh-lam-nghe' }
      }
    ];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-12">
      {/* Page Header */}
      <div className="text-left max-w-2xl flex flex-col gap-3">
        <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
          📝 Góc chia sẻ & cảm xúc
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-850 leading-tight">
          Chia sẻ của Harry
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Nơi mình lưu giữ tất cả bài học xương máu về kỹ thuật, tư duy làm sản phẩm công nghệ, phát triển thương hiệu cá nhân bền vững và cuộc sống của một Solopreneur.
        </p>
      </div>

      {/* Client List component handles filters */}
      <ChiaSeClient 
        initialPosts={posts} 
        categories={categories} 
        defaultCategorySlug={selectedCategorySlug || 'all'}
      />
    </div>
  );
}
