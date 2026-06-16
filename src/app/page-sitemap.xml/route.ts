import { NextResponse } from 'next/server';

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

  const urlElements = staticRoutes.map((route) => {
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
