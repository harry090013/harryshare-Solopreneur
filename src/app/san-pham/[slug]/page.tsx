import React, { cache } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import ProductDetailClient from '../ProductDetailClient';
import JsonLd from '@/components/JsonLd';
import type { Metadata } from 'next';

export const revalidate = 60;

// Cache product retrieval
const getProduct = cache(async (slug: string) => {
  try {
    return await db.product.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (err) {
    console.error('Failed to query database for product:', err);
    return null;
  }
});

// Dynamic metadata generation
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Sản phẩm không tồn tại' };
  }

  const url = `https://harryshare.vn/san-pham/${product.slug}`;
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      title: product.title,
      description: product.description,
      url,
      type: 'website',
      images: [{ url: product.image, width: 1200, height: 630, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = await getProduct(slug);

  if (!product) {
    const mockProducts = [
      {
        id: 'p1',
        title: 'Cố vấn 1-1: Xây dựng Sản phẩm & Thương hiệu cá nhân',
        slug: 'co-van-1-1-xay-dung-san-pham',
        description: 'Chương trình đồng hành 8 tuần giúp bạn từ số 0 phát triển một sản phẩm công nghệ hoàn chỉnh và thu hút nhóm độc giả đầu tiên.',
        content: 'Chương trình cố vấn đặc biệt...',
        price: 15000000,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        type: 'main',
        affiliateUrl: null,
        featured: true,
        category: { name: 'Dịch vụ của Harry', slug: 'dich-vu-cua-harry' }
      }
    ];
    product = mockProducts.find(p => p.slug === slug) || null;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center gap-4">
        <h1 className="font-serif text-3xl font-bold text-stone-850">Sản phẩm không tồn tại</h1>
        <p className="text-stone-500">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ xuống.</p>
        <Link href="/san-pham" className="flex items-center gap-1.5 text-sm font-semibold text-olive hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.image],
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: `https://harryshare.vn/san-pham/${product.slug}`
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://harryshare.vn'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cửa hàng',
        item: 'https://harryshare.vn/san-pham'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://harryshare.vn/san-pham/${product.slug}`
      }
    ]
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ProductDetailClient product={product} />
    </>
  );
}
