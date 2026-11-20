import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/quan-tri-harry/',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
      {
        // Allow AI Search / Answer Engines (GEO) to index public articles
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Claude-SearchBot',
          'Google-Extended',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: [
          '/quan-tri-harry/',
          '/api/',
          '/_next/',
        ],
      },
      {
        // Keep bulk scraper bots restricted
        userAgent: [
          'CCBot',
          'Omgilibot',
        ],
        disallow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
