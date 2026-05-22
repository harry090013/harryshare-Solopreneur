import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
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
  title: 'HarryShare.vn - Tư duy sản phẩm & Thương hiệu cá nhân',
  description: 'Chia sẻ chân thực về tư duy làm sản phẩm, xây dựng thương hiệu cá nhân bền vững, làn sóng AI & Vibe Coding và câu chuyện hành trình 10 năm làm nghề của Harry.',
  keywords: ['HarryShare', 'Tư duy sản phẩm', 'Thương hiệu cá nhân', 'Vibe Coding', 'Solopreneur', 'Quang Hiếu', 'SaaS', 'AI'],
  authors: [{ name: 'Harry (Quang Hiếu)' }],
  openGraph: {
    title: 'HarryShare.vn - Tư duy sản phẩm & Thương hiệu cá nhân',
    description: 'Chia sẻ chân thực về tư duy làm sản phẩm, thương hiệu cá nhân và hành trình làm nghề.',
    url: 'https://harryshare.vn',
    siteName: 'HarryShare',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream bg-dot-pattern selection:bg-olive/10 selection:text-olive">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Pages */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Floating AI Assistant Chatbot */}
        <ChatWidget />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
