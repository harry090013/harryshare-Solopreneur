import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harryshare.vn';

  // Static routes
  const staticRoutes = [
    '',
    '/chia-se',
    '/du-an-tai-nguyen',
    '/san-pham',
    '/lien-he',
    '/ve-harry',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let postRoutes: any[] = [];
  let productRoutes: any[] = [];

  try {
    // Dynamic post routes
    const posts = await db.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    postRoutes = posts.map((post) => ({
      url: `${baseUrl}/chia-se/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Sitemap post query failed:', err);
  }

  try {
    // Dynamic product routes
    const products = await db.product.findMany({
      select: { slug: true, createdAt: true },
    });

    productRoutes = products.map((product) => ({
      url: `${baseUrl}/san-pham/${product.slug}`,
      lastModified: product.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error('Sitemap product query failed:', err);
  }

  return [...staticRoutes, ...postRoutes, ...productRoutes];
}
