import React from 'react';
import { db } from '@/lib/db';
import ChiaSeClient from '../../ChiaSeClient';
import type { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ search?: string }>;
}

// Caching query function to avoid duplicate calls for metadata and render
const getCategoryData = React.cache(async (categorySlug: string) => {
  try {
    const [category, dbPosts, dbCategories] = await Promise.all([
      db.category.findFirst({
        where: { slug: categorySlug, type: 'post' }
      }),
      db.post.findMany({
        where: { published: true },
        orderBy: { date: 'desc' },
        include: { category: true }
      }),
      db.category.findMany({
        where: { type: 'post' }
      })
    ]);
    return { category, dbPosts, dbCategories };
  } catch (err) {
    console.error('Database connection failed in CategoryPage data fetching:', err);
    return { category: null, dbPosts: [], dbCategories: [] };
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const { category } = await getCategoryData(categorySlug);

  const title = category ? `${category.name} | Chủ đề chia sẻ` : 'Chủ đề chia sẻ';
  const description = category?.description || `Tổng hợp bài viết chất lượng về chủ đề ${category?.name || categorySlug} của Harry.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/chia-se/chu-de/${categorySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://harryshare.vn/chia-se/chu-de/${categorySlug}`,
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const { category, dbPosts, dbCategories } = await getCategoryData(categorySlug);
  const resolvedSearchParams = await searchParams;
  const urlSearch = resolvedSearchParams.search || '';

  // Fallback mocks if DB connection is empty/failed
  let posts = dbPosts || [];
  let categories = dbCategories || [];

  if (posts.length === 0 && categories.length === 0) {
    categories = [
      { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' },
      { id: '2', name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' },
      { id: '3', name: 'Công nghệ & AI', slug: 'cong-nghe-ai' },
      { id: '4', name: 'Hành trình làm nghề', slug: 'hanh-trinh-lam-nghe' },
    ];
    
    posts = [
      {
        id: '1',
        title: 'Mọi sản phẩm tốt đều nên bắt đầu từ việc giải quyết nỗi đau của chính mình',
        slug: 'moi-san-pham-tot-deu-nen-bat-dau-tu-noi-dau-cua-chinh-minh',
        description: 'Đừng cố gắng xây dựng giải pháp cho một vấn đề tưởng tượng. Hãy giải quyết nỗi đau thực tế của chính bạn trước.',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        readTime: 5,
        date: new Date(),
        category: { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' }
      }
    ];
  }

  // Filter posts for this category
  const categoryFilteredPosts = posts.filter(
    (post) => post.category?.slug === categorySlug
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-12 animate-slide-up">
      {/* Page Header */}
      <div className="text-left max-w-2xl flex flex-col gap-3">
        <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
          🏷️ Chủ đề: {category?.name || categorySlug}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-850 leading-tight">
          {category?.name || 'Danh mục chia sẻ'}
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          {category?.description || `Tổng hợp các bài chia sẻ chất lượng của Harry xoay quanh chủ đề ${category?.name || categorySlug}.`}
        </p>
      </div>

      <ChiaSeClient 
        initialPosts={categoryFilteredPosts} 
        categories={categories} 
        urlCategory={categorySlug}
        urlSearch={urlSearch}
      />
    </div>
  );
}
