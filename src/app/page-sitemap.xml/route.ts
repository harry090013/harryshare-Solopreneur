import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';
  const now = new Date().toISOString();

  const staticRoutes = [
    '',
    '/chia-se',
    '/du-an-tai-nguyen',
    '/san-pham',
    '/lien-he',
    '/ve-harry',
  ];

  let dynamicRoutes: string[] = [];

  try {
    const categories = await db.category.findMany({
      where: { type: 'post' },
      select: { slug: true }
    });
    dynamicRoutes = categories.map(cat => `/chia-se/chu-de/${cat.slug}`);
  } catch (err) {
    console.error('Failed to query categories for sitemap:', err);
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const urlElements = allRoutes.map((route) => {
    const priority = route === '' ? '1.0' : '0.8';
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
