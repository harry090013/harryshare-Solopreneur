import React from 'react';
import ChiaSeClient from './ChiaSeClient';
import { db } from '@/lib/db';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Góc chia sẻ',
  description: 'Tất cả bài học xương máu về tư duy sản phẩm, thương hiệu cá nhân, Công nghệ & AI và hành trình Solopreneur của Harry.',
  alternates: { canonical: '/chia-se' },
};

interface SearchParams {
  category?: string;
  search?: string;
}

export default async function ChiaSePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  let posts: any[] = [];
  let categories: any[] = [];

  const resolvedParams = await searchParams;
  const urlCategory = resolvedParams.category || 'all';
  const urlSearch = resolvedParams.search || '';

  try {
    const [dbPosts, dbCategories] = await Promise.all([
      db.post.findMany({
        where: { published: true },
        orderBy: { date: 'desc' },
        include: { category: true }
      }),
      db.category.findMany({
        where: { type: 'post' }
      })
    ]);

    if (dbPosts) posts = dbPosts;
    if (dbCategories) categories = dbCategories;
  } catch (err) {
    console.error('Database query failed in ChiaSePage, using mock fallbacks:', err);
    categories = [
      { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' },
      { id: '2', name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' },
      { id: '3', name: 'Công nghệ & AI', slug: 'cong-nghe-ai' },
      { id: '4', name: 'Hành trình làm nghề', slug: 'hanh-trinh-lam-nghe' },
    ];

    posts = [
      {
        id: '1',
        title: 'Mình mê công nghệ vì mình thích giải quyết vấn đề',
        slug: 'minh-me-cong-nghe-vi-thich-giai-quyet-van-de',
        description: 'Công nghệ chỉ thực sự đẹp khi nó phục vụ cuộc sống và giải quyết các bài toán thực tế.',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        readTime: 4,
        date: new Date('2026-05-18'),
        category: { id: '3', name: 'Công nghệ & AI', slug: 'cong-nghe-ai' }
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

      <ChiaSeClient 
        initialPosts={posts} 
        categories={categories} 
        urlCategory={urlCategory}
        urlSearch={urlSearch}
      />
    </div>
  );
}
