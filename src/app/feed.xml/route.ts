import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';
  
  let posts: any[] = [];
  try {
    const now = new Date();
    posts = await db.post.findMany({
      where: { published: true, date: { lte: now } },
      orderBy: { date: 'desc' },
      take: 20,
      include: { category: true }
    });
  } catch (err) {
    console.error('Failed to fetch posts for RSS feed:', err);
  }

  const itemsXml = posts.map((post) => {
    const postUrl = `${baseUrl}/chia-se/${post.slug}`;
    const pubDate = new Date(post.date).toUTCString(); // Standard RFC-822 format for RSS
    
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[HarryShare.vn - Góc chia sẻ]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[Tất cả bài học xương máu về tư duy sản phẩm, thương hiệu cá nhân, Công nghệ & AI và hành trình Solopreneur của Harry.]]></description>
    <language>vi</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
