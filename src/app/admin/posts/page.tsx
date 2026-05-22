import React from 'react';
import PostsClient from './PostsClient';
import { db } from '@/lib/db';

export const revalidate = 0;

export default async function AdminPostsPage() {
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    // Fetch all post categories for select inputs
    categories = await db.category.findMany({
      where: { type: 'post' },
      orderBy: { name: 'asc' }
    });

    // Fetch all posts with category info
    posts = await db.post.findMany({
      orderBy: { date: 'desc' },
      include: {
        category: true
      }
    });
  } catch (err) {
    console.error('Failed to query database for admin posts page, using fallbacks:', err);

    // Dynamic Mock Categories
    categories = [
      { id: 't1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' },
      { id: 't2', name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' },
      { id: 't3', name: 'AI & Vibe Coding', slug: 'ai-vibe-coding' },
      { id: 't4', name: 'Hành trình làm nghề', slug: 'hanh-trinh-lam-nghe' }
    ];

    // Dynamic Mock Posts
    posts = [
      {
        id: 'p1',
        title: 'Tư duy Product-Led Growth cho Solopreneur',
        slug: 'tu-duy-product-led-growth-cho-solopreneur',
        description: 'Làm sao để sản phẩm của bạn tự bán chính nó? Khám phá cách Solopreneur áp dụng mô hình Product-Led Growth để phát triển bền vững.',
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readTime: 6,
        published: true,
        date: new Date('2026-05-10'),
        categoryId: 't1',
        category: categories[0],
        content: `## Giới thiệu về Product-Led Growth`
      }
    ];
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <PostsClient initialPosts={posts} categories={categories} />
    </div>
  );
}
