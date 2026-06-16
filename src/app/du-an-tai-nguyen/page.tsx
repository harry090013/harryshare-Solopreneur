import React from 'react';
import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';
import { db } from '@/lib/db';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dự án & Tài nguyên',
  description: 'Tổng hợp các công cụ đắc lực khuyên dùng để làm sản phẩm, cùng các tài liệu, cẩm nang, checklist miễn phí do Harry tự tay biên soạn.',
  alternates: {
    canonical: '/du-an-tai-nguyen',
  },
  openGraph: {
    title: 'Dự án & Tài nguyên',
    description: 'Tổng hợp các công cụ đắc lực khuyên dùng để làm sản phẩm, cùng các tài liệu, cẩm nang, checklist miễn phí do Harry tự tay biên soạn.',
    url: 'https://harryshare.vn/du-an-tai-nguyen',
  },
};

export default async function ProjectsPage() {
  let items = [];
  let categories = [];

  try {
    const [dbItems, dbCategories] = await Promise.all([
      db.projectResource.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      }),
      db.category.findMany({
        where: { type: 'resource' },
        orderBy: { name: 'asc' }
      })
    ]);

    if (dbItems) items = dbItems;
    if (dbCategories) categories = dbCategories;
  } catch (err) {
    console.error('Database connection failed in Resources library, falling back to mock:', err);
    // Fallback Mock Data
    categories = [
      { id: 'cat-tool', name: 'Công cụ làm web', slug: 'cong-cu-lam-web' },
      { id: 'cat-freebie', name: 'Tài liệu & Ebook', slug: 'tai-lieu-ebook' }
    ];

    items = [
      {
        id: '1',
        title: 'Lovable AI - Trợ lý phát triển Web App thần tốc',
        slug: 'lovable-ai-tro-ly-web-app',
        description: 'Nền tảng giúp bạn xây dựng và tùy biến giao diện website, ứng dụng web bằng ngôn ngữ tự nhiên cực nhanh và mượt mà.',
        type: 'tool',
        url: 'https://lovable.dev',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        featured: true,
        category: { id: 'cat-tool', name: 'Công cụ làm web', slug: 'cong-cu-lam-web' }
      },
      {
        id: '2',
        title: 'SEO Checklist toàn diện cho Solopreneur',
        slug: 'seo-checklist-solopreneur',
        description: 'Tài liệu hướng dẫn từng bước tối ưu hóa website của bạn lên top Google mà không cần ngân sách quảng cáo lớn.',
        type: 'freebie',
        url: '#',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
        featured: true,
        category: { id: 'cat-freebie', name: 'Tài liệu & Ebook', slug: 'tai-lieu-ebook' }
      },
      {
        id: '3',
        title: 'Checklist Xây dựng Thương hiệu Cá nhân',
        slug: 'checklist-personal-branding',
        description: 'Bộ khung hành động giúp bạn định vị bản thân và thu hút 10,000 độc giả trung thành đầu tiên sau 6 tháng.',
        type: 'freebie',
        url: '#',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
        featured: false,
        category: { id: 'cat-freebie', name: 'Tài liệu & Ebook', slug: 'tai-lieu-ebook' }
      }
    ];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-12 animate-slide-up">
      {/* Header */}
      <div className="text-left max-w-2xl flex flex-col gap-3">
        <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
          🛠️ Kho tàng công cụ
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-850 leading-tight">
          Dự án & Tài nguyên
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Tổng hợp các công cụ đắc lực mình khuyên dùng để làm sản phẩm, cùng các tài liệu, cẩm nang, checklist miễn phí do mình tự tay biên soạn để đồng hành cùng bạn.
        </p>
      </div>

      {/* Interactive Tabs client */}
      <ProjectsClient initialItems={items} categories={categories} />
    </div>
  );
}
