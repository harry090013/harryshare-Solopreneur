import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import JsonLd from '@/components/JsonLd';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://harryshare.vn'),
  title: {
    default: 'HarryShare.vn - Tư duy sản phẩm & Thương hiệu cá nhân',
    template: '%s | HarryShare',
  },
  description: 'Chia sẻ chân thực về tư duy làm sản phẩm, xây dựng thương hiệu cá nhân bền vững, thế giới Công nghệ & AI và câu chuyện hành trình làm nghề của Harry.',
  keywords: ['HarryShare', 'Tư duy sản phẩm', 'Thương hiệu cá nhân', 'Công nghệ & AI', 'Solopreneur', 'Quang Hiếu', 'Sản phẩm sạch'],
  authors: [{ name: 'Harry (Quang Hiếu)' }],
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: 'HarryShare.vn - Tư duy sản phẩm & Thương hiệu cá nhân',
    description: 'Chia sẻ chân thực về tư duy làm sản phẩm, thương hiệu cá nhân và hành trình làm nghề.',
    url: 'https://harryshare.vn',
    siteName: 'HarryShare',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'HarryShare' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HarryShare.vn - Tư duy sản phẩm & Thương hiệu cá nhân',
    description: 'Chia sẻ chân thực về tư duy làm sản phẩm, thương hiệu cá nhân và hành trình làm nghề.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HarryShare',
    url: 'https://harryshare.vn',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://harryshare.vn/chia-se?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harry (Quang Hiếu)',
    jobTitle: 'Solopreneur & Product Builder',
    knowsAbout: [
      'Product Thinking',
      'Personal Branding',
      'AI',
      'Solopreneurship',
    ],
    url: 'https://harryshare.vn',
    image: 'https://harryshare.vn/harry_share_avt.png',
    logo: 'https://harryshare.vn/logo.png',
    sameAs: [
      'https://www.facebook.com/q.hieu09',
    ],
  };

  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream bg-dot-pattern selection:bg-olive/10 selection:text-olive">
        {/* WCAG Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-olive focus:text-cream focus:shadow-lg focus:outline-none font-semibold text-sm"
        >
          Bỏ qua tới nội dung chính
        </a>

        <JsonLd data={websiteSchema} />
        <JsonLd data={personSchema} />
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Pages */}
        <main id="main-content" className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer & Floating Music Player */}
        <Footer />
        <MusicPlayer />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
