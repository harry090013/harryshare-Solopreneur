import React from 'react';
import { db } from '@/lib/db';
import ResourcesClient from './ResourcesClient';

export const revalidate = 0;

export default async function AdminResourcesPage() {
  let resources: any[] = [];
  let categories: any[] = [];

  try {
    const [resourcesResult, categoriesResult] = await Promise.all([
      db.projectResource.findMany({
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.category.findMany({
        where: { type: 'resource' },
        orderBy: { name: 'asc' }
      })
    ]);

    resources = resourcesResult;
    categories = categoriesResult;
  } catch (err) {
    console.error('Database connection failed in resources page, using fallback:', err);
    categories = [
      { id: 'cat-tool', name: 'Công cụ làm web', slug: 'cong-cu-lam-web' },
      { id: 'cat-freebie', name: 'Tài liệu & Ebook', slug: 'tai-lieu-ebook' }
    ];
    resources = [
      {
        id: '1',
        title: 'Lovable AI - Trợ lý phát triển Web App thần tốc',
        slug: 'lovable-ai-tro-ly-web-app',
        description: 'Nền tảng giúp bạn xây dựng và tùy biến giao diện website, ứng dụng web bằng ngôn ngữ tự nhiên cực nhanh và mượt mà.',
        type: 'tool',
        url: 'https://lovable.dev',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        featured: true,
        categoryId: 'cat-tool',
        category: categories[0]
      }
    ];
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <ResourcesClient initialResources={resources} categories={categories} />
    </div>
  );
}
