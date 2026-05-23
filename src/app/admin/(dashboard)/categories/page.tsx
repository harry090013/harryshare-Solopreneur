import React from 'react';
import { db } from '@/lib/db';
import CategoriesClient from './CategoriesClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  let icons: any[] = [];

  try {
    // Fetch all categories with count of posts, resources, and products
    categories = await db.category.findMany({
      include: {
        _count: {
          select: { 
            posts: true,
            resources: true,
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    icons = await db.icon.findMany({
      orderBy: {
        label: 'asc'
      }
    });
  } catch (err) {
    console.error('Database connection failed in categories page, using fallback:', err);
    categories = [
      { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham', description: 'Bài viết tư duy', type: 'post', icon: 'Sparkles', _count: { posts: 1, resources: 0, products: 0 } },
      { id: '2', name: 'Công cụ lập trình', slug: 'cong-cu-lap-trinh', description: 'Tài nguyên lập trình', type: 'resource', icon: 'Code', _count: { posts: 0, resources: 2, products: 0 } },
      { id: '3', name: 'Dịch vụ chính', slug: 'dich-vu-chinh', description: 'Sản phẩm kinh doanh', type: 'product', icon: 'Briefcase', _count: { posts: 0, resources: 0, products: 1 } },
    ];
  }

  // Fallback suggestions for icons if db is empty
  const defaultIcons = [
    { name: 'Sparkles', label: 'Lấp lánh' },
    { name: 'Code', label: 'Lập trình' },
    { name: 'Briefcase', label: 'Công việc' },
    { name: 'BookOpen', label: 'Sách & Đọc' },
    { name: 'Laptop', label: 'Thiết bị công nghệ' },
    { name: 'Bookmark', label: 'Đánh dấu' },
    { name: 'Tag', label: 'Thẻ phân loại' },
    { name: 'Layers', label: 'Lớp xếp' },
    { name: 'Coffee', label: 'Đời sống' },
    { name: 'Heart', label: 'Tương tác' },
    { name: 'Link', label: 'Liên kết' },
    { name: 'Tool', label: 'Công cụ' },
  ];

  const formattedIcons = icons.length > 0 ? icons.map(i => ({
    id: i.id,
    name: i.name,
    label: i.label
  })) : defaultIcons.map((i, idx) => ({ id: `icon-${idx}`, ...i }));

  const formattedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    type: c.type || 'post',
    icon: c.icon || 'Layers',
    _count: {
      posts: c._count?.posts || 0,
      resources: c._count?.resources || 0,
      products: c._count?.products || 0,
    }
  }));

  return <CategoriesClient initialCategories={formattedCategories} initialIcons={formattedIcons} />;
}
