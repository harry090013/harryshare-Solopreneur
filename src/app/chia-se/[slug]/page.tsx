import React, { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, Bookmark } from 'lucide-react';
import { db } from '@/lib/db';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import PostComments from '@/components/PostComments';
import ArticleActionsWrapper from '@/components/ArticleActionsWrapper';
import JsonLd from '@/components/JsonLd';
import TableOfContents from '@/components/TableOfContents';
import type { Metadata } from 'next';

export const revalidate = 60;

// Cache post fetch to prevent multiple DB queries for metadata & page render
const getPost = cache(async (slug: string) => {
  try {
    return await db.post.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (err) {
    console.error('Failed to query database for post:', err);
    return null;
  }
});

// Dynamic SEO metadata generation
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Bài viết không tồn tại' };
  }

  const url = `https://harryshare.vn/chia-se/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: ['Harry (Quang Hiếu)'],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = await getPost(slug);
  let relatedPosts: any[] = [];

  // Fallbacks if DB query fails or post not found in DB
  if (!post) {
    const mockPosts = [
      {
        id: '1',
        title: 'Tư duy Product-Led Growth cho Solopreneur',
        slug: 'tu-duy-product-led-growth-cho-solopreneur',
        description: 'Làm sao để sản phẩm của bạn tự bán chính nó? Khám phá cách Solopreneur áp dụng mô hình Product-Led Growth để phát triển bền vững.',
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readTime: 6,
        date: new Date('2026-05-10'),
        views: 120,
        likes: 15,
        shares: 4,
        category: { name: 'Tư duy sản phẩm', slug: 'tu-duy-san-pham' },
        categoryId: 't1',
        content: `## Giới thiệu về Product-Led Growth (PLG)
Product-Led Growth (Tăng trưởng dẫn dắt bằng sản phẩm) là một chiến lược kinh doanh trong đó **sản phẩm chính là động lực thúc đẩy chính**...`
      }
    ];
    post = mockPosts.find(p => p.slug === slug) || null;
  }

  // Query related posts
  if (post && post.id) {
    try {
      relatedPosts = await db.post.findMany({
        where: {
          published: true,
          categoryId: post.categoryId,
          NOT: { id: post.id }
        },
        orderBy: { date: 'desc' },
        take: 3,
        include: { category: true }
      });
    } catch (err) {
      console.error('Failed to query related posts:', err);
    }
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center gap-4">
        <h1 className="font-serif text-3xl font-bold text-stone-850">Bài viết không tồn tại</h1>
        <p className="text-stone-500">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị ẩn.</p>
        <Link href="/chia-se" className="flex items-center gap-1.5 text-sm font-semibold text-olive hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại góc chia sẻ
        </Link>
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [post.coverImage],
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Harry (Quang Hiếu)',
      url: 'https://harryshare.vn'
    },
    publisher: {
      '@type': 'Organization',
      name: 'HarryShare',
      logo: {
        '@type': 'ImageObject',
        url: 'https://harryshare.vn/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://harryshare.vn/chia-se/${post.slug}`
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
        name: 'Góc chia sẻ',
        item: 'https://harryshare.vn/chia-se'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://harryshare.vn/chia-se/${post.slug}`
      }
    ]
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      
      {/* Dynamic viewport scroll progress indicator */}
      <ReadingProgressBar />

      <div className="relative max-w-3xl mx-auto">
        <TableOfContents />

        <ArticleActionsWrapper
          postId={post.id}
          postTitle={post.title}
          initialLikes={post.likes}
          initialShares={post.shares}
          initialViews={post.views}
          audioUrl={post.audioUrl}
        >
          <article className="px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-8 animate-slide-up">
            {/* Back and Category crumbs */}
            <div className="flex justify-between items-center">
              <Link href="/chia-se" className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-olive uppercase tracking-widest transition-colors cursor-pointer w-fit">
                <ArrowLeft className="w-3.5 h-3.5" /> Góc chia sẻ
              </Link>
              {post.category && (
                <Link href={`/chia-se?category=${post.category.slug}`} className="text-xs font-bold text-olive bg-olive/5 border border-olive/10 rounded-lg px-3 py-1 cursor-pointer hover:bg-olive hover:text-cream transition-all uppercase tracking-wider">
                  {post.category.name}
                </Link>
              )}
            </div>

            {/* Post Title */}
            <div className="flex flex-col gap-4">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-850 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-stone-400 text-xs font-medium font-sans border-b border-olive/5 pb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime} phút đọc
                </span>
                <span className="flex items-center gap-1.5 text-olive font-semibold bg-olive/5 px-2 py-0.5 rounded-md">
                  <Bookmark className="w-3.5 h-3.5" />
                  Đúc kết thực tế
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-olive/10 shadow-lg bg-sand">
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover" 
              />
            </div>

            {/* Markdown Rendered Content */}
            <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-850 prose-p:text-stone-700 prose-p:leading-relaxed prose-a:text-olive hover:prose-a:text-olive-dark prose-a:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-olive prose-blockquote:bg-sand/30 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg font-sans text-stone-700 text-base md:text-lg flex flex-col gap-6">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold font-serif text-stone-850 mt-8 mb-4 leading-snug border-b border-olive/5 pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold font-serif text-stone-850 mt-6 mb-3 leading-snug" {...props} />,
                  p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-stone-700 text-justify" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-olive bg-sand/30 pl-4 py-2 my-4 rounded-r-lg font-serif italic text-stone-600" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 flex flex-col gap-1.5 text-stone-700" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 flex flex-col gap-1.5 text-stone-700" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed text-justify" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-stone-850" {...props} />,
                  a: ({node, ...props}) => <a className="text-olive hover:text-olive-dark font-medium underline underline-offset-4 cursor-pointer" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Author Box */}
            <div className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md items-center sm:items-start text-center sm:text-left mt-4 shadow-sm">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-olive/10 shrink-0 bg-sand">
                <Image src="/harry_share_avt.png" alt="Harry" fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-stone-850">Harry (Quang Hiếu)</span>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">Creative Solopreneur</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  Chào bạn! Cảm ơn bạn đã đọc bài viết này. Mình hi vọng những chia sẻ chân thực từ thực tế làm sản phẩm và thương hiệu của mình mang lại giá trị hữu ích cho bạn. Hãy chia sẻ cảm nghĩ của bạn hoặc nhắn tin trực tiếp cho mình qua hộp chat AI ở góc nhé! 😊
                </p>
              </div>
            </div>

            {/* Related Posts Section (Task 5.1) */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-olive/10 flex flex-col gap-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-850">
                  Bài viết liên quan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedPosts.map((rPost) => (
                    <Link 
                      key={rPost.id} 
                      href={`/chia-se/${rPost.slug}`}
                      className="flex flex-col rounded-2xl overflow-hidden border border-olive/10 bg-cream/70 hover:border-olive/25 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-sand">
                        <Image 
                          src={rPost.coverImage} 
                          alt={rPost.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 250px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-1.5 flex-grow">
                        <span className="text-[9px] font-bold text-olive uppercase tracking-wider">
                          {rPost.category?.name || 'Góc chia sẻ'}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-stone-850 line-clamp-2 leading-snug group-hover:text-olive transition-colors">
                          {rPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <PostComments postId={post.id} />
          </article>
        </ArticleActionsWrapper>
      </div>
    </>
  );
}
