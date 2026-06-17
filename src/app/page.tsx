import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, BookOpen, ExternalLink, Download, Calendar, Clock, Compass 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { db } from '@/lib/db';
import HeroSlideshow from '@/components/HeroSlideshow';

export const revalidate = 30; // Cache trang chủ trong 30 giây (ISR) để đạt tốc độ tải trang tối đa

// Dynamically resolve custom or standard Lucide icon component on the server
const getTopicIcon = (iconName: string) => {
  let formattedName = (iconName || 'Layers').trim();
  if (formattedName.includes('-')) {
    formattedName = formattedName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  } else {
    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  }
  const IconComponent = (LucideIcons as any)[formattedName];
  if (IconComponent) {
    return IconComponent;
  }
  return Compass;
};

export default async function Home() {
  let topics = [];
  let latestPosts = [];
  let featuredResources = [];
  let slides: { id: string; imageUrl: string; order: number }[] = [];

  let homepageSetting = {
    welcomeText: "👋 Chào bạn ghé thăm góc của Harry",
    title: "Hành trình Solopreneur: Ghi chép, Chia sẻ & Đồng hành",
    description: "Chào mừng bạn đến với góc nhỏ của Harry (Quang Hiếu). Đây là nơi mình ghi lại hành trình thực tế của một Solopreneur, chia sẻ những tài nguyên đúc kết có giá trị cao, và giới thiệu các giải pháp công nghệ đồng hành cùng sự phát triển của bạn.",
    pillar1Title: "1. Ghi lại hành trình",
    pillar1Desc: "Nhật ký ghi lại từng bước chân, những thử thách và bài học xương máu trên hành trình xây dựng sự nghiệp tự chủ của Harry.",
    pillar2Title: "2. Chia sẻ & Tặng quà",
    pillar2Desc: "Những công thức, tài liệu và bộ công cụ đắc lực được đúc kết từ thành tựu thực tế, sẵn sàng gửi tặng bạn để rút ngắn con đường tự học.",
    pillar3Title: "3. Kinh doanh & Đồng hành",
    pillar3Desc: "Giới thiệu các sản phẩm công nghệ chất lượng do mình sáng tạo và cơ hội hợp tác, đồng hành chuyên sâu cùng bạn bứt phá."
  };

  try {
    const now = new Date();
    // Chạy song song toàn bộ truy vấn cơ sở dữ liệu để tối ưu hóa hiệu năng
    const [dbSetting, dbSlides, dbTopics, dbLatestPosts, dbFeaturedResources] = await Promise.all([
      db.homepageSetting.findUnique({ where: { id: 'hero-setting' } }),
      db.heroSlide.findMany({ orderBy: { order: 'asc' } }),
      db.category.findMany({
        where: { type: 'post' },
        include: { posts: { where: { published: true, date: { lte: now } } } }
      }),
      db.post.findMany({
        where: { published: true, date: { lte: now } },
        orderBy: { date: 'desc' },
        take: 3,
        include: { category: true }
      }),
      db.projectResource.findMany({
        where: { featured: true },
        take: 3
      })
    ]);

    if (dbSetting) homepageSetting = dbSetting;
    if (dbSlides && dbSlides.length > 0) slides = dbSlides;
    if (dbTopics) topics = dbTopics;
    if (dbLatestPosts) latestPosts = dbLatestPosts;
    if (dbFeaturedResources) featuredResources = dbFeaturedResources;

  } catch (error) {
    console.error('Database connection failed in Homepage, falling back to mock data:', error);
    
    // Static Fallback Data
    topics = [
      { id: '1', name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham', description: 'Khám phá triết lý xây dựng sản phẩm, tư duy giải quyết vấn đề và cách tối ưu trải nghiệm.', icon: 'Layers', posts: [1] },
      { id: '2', name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan', description: 'Truyền tải giá trị bản thân, tạo dựng uy tín trong ngành và mở khóa cơ hội sự nghiệp.', icon: 'UserCheck', posts: [1] },
      { id: '3', name: 'Công nghệ & AI', slug: 'cong-nghe-ai', description: 'Khám phá thế giới công nghệ, ứng dụng trí tuệ nhân tạo để tối ưu hóa cuộc sống và công việc.', icon: 'Sparkles', posts: [1] },
      { id: '4', name: 'Hành trình làm nghề', slug: 'hanh-trinh-lam-nghe', description: 'Chia sẻ chân thực về những cột mốc thăng trầm từ khi chạy bàn quán cafe đến Solopreneur.', icon: 'Compass', posts: [1] },
    ];

    latestPosts = [
      {
        id: '1',
        title: 'Mình mê công nghệ vì mình thích giải quyết vấn đề',
        slug: 'minh-me-cong-nghe-vi-thich-giai-quyet-van-de',
        description: 'Công nghệ chỉ thực sự đẹp khi nó phục vụ cuộc sống và giải quyết các bài toán thực tế. Chia sẻ góc nhìn thực tế của một người mê công nghệ và cách ứng dụng AI làm bạn đồng hành tư duy.',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        readTime: 4,
        date: new Date('2026-05-18'),
        category: { name: 'Công nghệ & AI', slug: 'cong-nghe-ai' }
      },
      {
        id: '2',
        title: 'Xây dựng thương hiệu cá nhân bền vững từ số 0',
        slug: 'xay-dung-thuong-hieu-ca-nhan-ben-vung-tu-so-0',
        description: 'Thương hiệu cá nhân không phải là phô trương bóng bẩy. Nó là việc kiên trì chia sẻ giá trị thực đến đúng đối tượng.',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
        readTime: 8,
        date: new Date('2026-05-15'),
        category: { name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' }
      },
      {
        id: '3',
        title: 'Tư duy Product-Led Growth cho Solopreneur',
        slug: 'tu-duy-product-led-growth-cho-solopreneur',
        description: 'Làm sao để sản phẩm tự bán chính nó? Khám phá cách Solopreneur áp dụng mô hình PLG để phát triển bền vững.',
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readTime: 6,
        date: new Date('2026-05-10'),
        category: { name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' }
      }
    ];

    featuredResources = [
      {
        id: '1',
        title: 'Lovable AI - Trợ lý phát triển Web App thần tốc',
        description: 'Nền tảng giúp bạn xây dựng và tùy biến giao diện website bằng ngôn ngữ tự nhiên cực nhanh.',
        type: 'tool',
        url: 'https://lovable.dev',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '2',
        title: 'SEO Checklist toàn diện cho Solopreneur',
        description: 'Tài liệu hướng dẫn từng bước tối ưu hóa website của bạn lên top Google không mất đồng quảng cáo nào.',
        type: 'freebie',
        url: '#',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  if (slides.length === 0) {
    slides = [
      { id: 'default-1', imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80", order: 0 },
      { id: 'default-2', imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", order: 1 },
      { id: 'default-3', imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80", order: 2 }
    ];
  }

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6 text-left animate-fade-in">
              <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
                {homepageSetting.welcomeText}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-850 leading-tight">
                {homepageSetting.title}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed font-sans text-justify">
                {homepageSetting.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href="/chia-se" 
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-olive text-cream font-medium hover:bg-olive-dark shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 group"
                >
                  Khám phá chia sẻ
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/ve-harry" 
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-olive/20 text-olive bg-cream/50 backdrop-blur-xs font-medium hover:bg-olive/5 transition-all cursor-pointer active:scale-95"
                >
                  Về mình
                </Link>
              </div>
            </div>

            {/* Right Slideshow */}
            <HeroSlideshow slides={slides} />
          </div>
        </div>
      </section>

      {/* 2. Brand Pillars Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-cream/45 border border-olive/10 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1 rounded-full w-fit mx-auto">
              Định vị giá trị
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-850">
              3 Trụ Cột Hành Trình của Harry
            </h2>
            <p className="text-stone-500 text-sm font-sans">
              Định hướng bản thân và cam kết mang lại giá trị thực tế đến với độc giả và đối tác.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-olive/5 bg-cream/80 hover:border-olive/20 hover:shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-olive/10 flex items-center justify-center text-olive">
                <LucideIcons.Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-850">
                {homepageSetting.pillar1Title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-sans text-justify">
                {homepageSetting.pillar1Desc}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-olive/5 bg-cream/80 hover:border-olive/20 hover:shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-olive/10 flex items-center justify-center text-olive">
                <LucideIcons.Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-850">
                {homepageSetting.pillar2Title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-sans text-justify">
                {homepageSetting.pillar2Desc}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-olive/5 bg-cream/80 hover:border-olive/20 hover:shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-olive/10 flex items-center justify-center text-olive">
                <LucideIcons.Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-850">
                {homepageSetting.pillar3Title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-sans text-justify">
                {homepageSetting.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Topics Grid (4 Categories) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <h2 className="font-serif text-3xl font-extrabold text-stone-850">
              Các cụm nội dung chính
            </h2>
            <p className="text-stone-500 text-sm">
              Những bài viết của mình xoay quanh 4 chủ đề cốt lõi giúp bạn tự tin làm sản phẩm công nghệ và định vị thương hiệu bản thân.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic) => {
              const Icon = getTopicIcon(topic.icon);
              return (
                <Link
                  key={topic.id}
                  href={`/chia-se?category=${topic.slug}`}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 hover:bg-cream hover:shadow-md transition-all group cursor-pointer animate-slide-up"
                >
                  <div className="w-10 h-10 rounded-xl bg-olive/5 flex items-center justify-center text-olive group-hover:bg-olive group-hover:text-cream transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif font-bold text-stone-800 group-hover:text-olive transition-colors leading-snug">
                      {topic.name}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed font-sans line-clamp-3 text-justify">
                      {topic.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-olive uppercase tracking-widest flex items-center gap-1 mt-auto">
                    Xem chi tiết
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Recent Notes (Ghi chép mới) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-end border-b border-olive/5 pb-4">
            <div className="flex flex-col gap-1.5 text-left">
              <h2 className="font-serif text-3xl font-extrabold text-stone-850">
                Ghi chép mới nhất
              </h2>
              <p className="text-stone-500 text-sm">Những đúc kết, góc nhìn thực tế được cập nhật hàng tuần.</p>
            </div>
            <Link 
              href="/chia-se" 
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-olive hover:text-olive-dark transition-colors cursor-pointer group"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article 
                key={post.id}
                className="flex flex-col gap-4 rounded-2xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 hover:bg-cream hover:shadow-lg transition-all duration-300 group"
              >
                {/* Cover Image */}
                <Link href={`/chia-se/${post.slug}`} className="relative h-48 w-full overflow-hidden block cursor-pointer">
                  <Image 
                    src={post.coverImage} 
                    alt={post.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                    className="object-cover" 
                  />
                  <div className="absolute top-3 left-3 bg-cream/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-olive border border-olive/10 shadow-xs uppercase tracking-wider">
                    {post.category?.name}
                  </div>
                </Link>

                {/* Article Info */}
                <div className="flex flex-col gap-3 p-5 pt-1 flex-1">
                  <div className="flex items-center gap-3.5 text-stone-400 text-[11px] font-medium font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {post.readTime} phút đọc
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-850 group-hover:text-olive transition-colors leading-snug line-clamp-2">
                    <Link href={`/chia-se/${post.slug}`} className="cursor-pointer">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-stone-600 text-xs leading-relaxed font-sans line-clamp-3 text-justify">
                    {post.description}
                  </p>

                  <Link 
                    href={`/chia-se/${post.slug}`}
                    className="text-xs font-bold text-olive tracking-widest uppercase flex items-center gap-1.5 mt-auto pt-2 cursor-pointer"
                  >
                    Đọc bài viết
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center sm:hidden mt-2">
            <Link 
              href="/chia-se" 
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-olive/20 text-olive text-sm font-semibold cursor-pointer"
            >
              Xem tất cả chia sẻ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Projects & Resources (Dự án & Tài nguyên số nổi bật) */}
      {featuredResources.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            <div className="text-left border-b border-olive/5 pb-4 flex flex-col gap-1.5">
              <h2 className="font-serif text-3xl font-extrabold text-stone-850">
                Dự án & Tài nguyên nổi bật
              </h2>
              <p className="text-stone-500 text-sm">Các công cụ đắc lực và bộ tài liệu miễn phí hỗ trợ bạn tối đa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.map((resource) => (
                <div 
                  key={resource.id}
                  className="flex flex-col rounded-2xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 hover:bg-cream hover:shadow-lg transition-all group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-sand">
                    <Image 
                      src={resource.image} 
                      alt={resource.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                      className="object-cover" 
                    />
                    <div className="absolute top-3 left-3 bg-cream/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-olive border border-olive/10 shadow-xs uppercase tracking-wider">
                      {resource.type === 'tool' ? 'Công cụ khuyên dùng' : 'Tài nguyên miễn phí'}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-serif font-bold text-stone-850 leading-snug group-hover:text-olive transition-colors line-clamp-1">
                      {resource.title}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed font-sans line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <a 
                      href={resource.url} 
                      target={resource.url.startsWith('http') ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-olive uppercase tracking-widest mt-auto pt-4 group-hover:text-olive-dark transition-colors"
                    >
                      {resource.type === 'tool' ? (
                        <>
                          Khám phá công cụ
                          <ExternalLink className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Tải tài liệu ngay
                          <Download className="w-3.5 h-3.5" />
                        </>
                      )}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
