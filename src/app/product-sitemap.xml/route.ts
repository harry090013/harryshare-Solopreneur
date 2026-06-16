import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';
  let urlElements = '';

  try {
    const products = await db.product.findMany({
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    urlElements = products.map((product) => {
      const lastMod = product.createdAt.toISOString();
      return `  <url>
    <loc>${baseUrl}/san-pham/${product.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }).join('\n');
  } catch (err) {
    console.error('Sitemap product query failed:', err);
  }

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
