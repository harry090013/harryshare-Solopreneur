import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, Bookmark } from 'lucide-react';
import { db } from '@/lib/db';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import PostInteractions from '@/components/PostInteractions';
import PostComments from '@/components/PostComments';
// import AudioReader from '@/components/AudioReader';

export const revalidate = 60;

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post = null;

  try {
    post = await db.post.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (err) {
    console.error('Database connection failed in Post detail page, falling back to mock:', err);
    
    // Fallback Mock Data
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
        content: `## Giới thiệu về Product-Led Growth (PLG)

Product-Led Growth (Tăng trưởng dẫn dắt bằng sản phẩm) là một chiến lược kinh doanh trong đó **sản phẩm chính là động lực thúc đẩy chính** cho việc thu hút khách hàng, chuyển đổi và giữ chân người dùng. Đối với một Solopreneur (người khởi nghiệp đơn độc), PLG không chỉ là một chiến lược mà còn là phao cứu sinh giúp bạn tối ưu hóa thời gian và nguồn lực hạn hẹp của mình.

### Tại sao Solopreneur cần PLG?

Khi bạn làm việc một mình, bạn không thể vừa code sản phẩm, vừa làm marketing 24/7, vừa chăm sóc khách hàng bằng tay. Bạn cần một cỗ máy tự vận hành:
1. **Tiết kiệm chi phí**: Giảm thiểu chi phí chạy quảng cáo đắt đỏ.
2. **Tự động hóa phễu bán hàng**: Người dùng trải nghiệm và tự nâng cấp lên bản trả phí.
3. **Độ tin cậy cao**: Khách hàng tin vào trải nghiệm thực tế hơn là những lời quảng cáo sáo rỗng.

### Các bước áp dụng PLG cho sản phẩm của bạn

#### 1. Thiết lập trải nghiệm "Aha! Moment" cực nhanh
"Aha! Moment" là khoảnh khắc người dùng lần đầu tiên nhận ra giá trị cốt lõi của sản phẩm.
- **Lời khuyên**: Hãy loại bỏ mọi rào cản đăng ký rườm rà. Hãy cho họ trải nghiệm tính năng tốt nhất ngay lập tức.
- *Ví dụ*: Đối với một công cụ tạo ảnh bằng AI, hãy cho họ tạo thử 3 ảnh miễn phí mà không cần bắt nhập thẻ tín dụng hay xác thực email phức tạp.

#### 2. Xây dựng cơ chế lan truyền (Viral Loops)
Hãy tạo điều kiện để người dùng hiện tại giới thiệu thêm người dùng mới.
- **Mã mời nhận quà**: Giống như Dropbox hay Airbnb đã từng làm.
- **Watermark tinh tế**: Khi người dùng xuất báo cáo hoặc sản phẩm từ công cụ của bạn, hãy đính kèm logo nhỏ gọn dẫn về website của bạn.

#### 3. Thu thập phản hồi liên tục và lặp đi lặp lại
Đừng đoán khách hàng muốn gì. Hãy nhìn cách họ tương tác với sản phẩm qua các công cụ đo lường (như Hotjar hoặc Mixpanel) và lắng nghe trực tiếp từ hòm thư góp ý.

Chúc các bạn Solopreneur sớm xây dựng được sản phẩm tự tăng trưởng bền vững!`
      },
      {
        id: '2',
        title: 'Xây dựng thương hiệu cá nhân bền vững từ số 0',
        slug: 'xay-dung-thuong-hieu-ca-nhan-ben-vung-tu-so-0',
        description: 'Thương hiệu cá nhân không phải là phô trương. Nó là việc bạn kiên trì chia sẻ giá trị thực của mình đến đúng đối tượng.',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
        readTime: 8,
        date: new Date('2026-05-15'),
        views: 245,
        likes: 35,
        shares: 12,
        category: { name: 'Thương hiệu cá nhân', slug: 'thuong-hieu-ca-nhan' },
        content: `## Thương hiệu cá nhân là gì?

Nhiều người lầm tưởng rằng xây dựng thương hiệu cá nhân là phải làm video nhảy múa trên TikTok, hay viết những bài viết bóng bẩy kể về thành công trên LinkedIn. Thực chất:
> "Thương hiệu cá nhân là những gì người ta nói về bạn khi bạn không có mặt ở trong phòng." - Jeff Bezos

Nó là sự tích lũy niềm tin từ cộng đồng thông qua giá trị thực tế mà bạn mang lại.

---

### Phân tích 3 trụ cột của thương hiệu cá nhân bền vững

#### 1. Định vị bản thân (Positioning)
Bạn muốn người khác nhớ đến mình vì chuyên môn gì? Hãy chọn một ngách đủ hẹp nhưng có nhu cầu đủ lớn.
*Thay vì*: "Tôi là Lập trình viên Full-stack"
*Hãy chọn*: "Tôi là Lập trình viên giúp các Solopreneur xây dựng SaaS siêu tốc bằng Next.js và Supabase".

#### 2. Nhất quán và Kiên trì (Consistency)
Không quan trọng bạn viết hay đến đâu, nếu bạn chỉ viết 1 bài mỗi tháng rồi biến mất, không ai nhớ đến bạn.
- Tạo lịch đăng bài cố định (ví dụ: Thứ Ba và Thứ Sáu hàng tuần).
- Sử dụng phong cách thiết kế, phông chữ và tông giọng (tone of voice) đồng nhất trên tất cả các kênh.

#### 3. Chia sẻ giá trị "Behind the scenes"
Đừng chỉ khoe kết quả mỹ mãn. Hãy chia sẻ hành trình bạn giải quyết vấn đề, những lỗi sai ngớ ngẩn bạn đã mắc và cách bạn vượt qua nó. Sự tổn thương và tính chân thực chính là chất keo kết nối mạnh mẽ nhất giữa bạn và độc giả.

### Bắt đầu từ đâu?

1. **Viết blog cá nhân**: Đừng phụ thuộc hoàn toàn vào Facebook hay LinkedIn. Một website cá nhân (như trang HarryShare này) chính là ngôi nhà số đích thực của bạn.
2. **Chia sẻ miễn phí**: Trao đi trước khi nhận lại. Tạo ra các checklist, cẩm nang chất lượng và gửi tặng độc giả của bạn.
3. **Lắng nghe tích cực**: Trò chuyện, phản hồi bình luận và giải đáp thắc mắc của độc giả chân thành.

Thương hiệu cá nhân không thể xây dựng sau một đêm. Hãy tận hưởng hành trình này!`
      }
    ];

    post = mockPosts.find(p => p.slug === slug) || null;
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

  return (
    <>
      {/* Dynamic viewport scroll progress indicator */}
      <ReadingProgressBar />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-8 animate-slide-up">
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

        {/* AI Bilingual Audio Reader (Temporarily hidden)
        <AudioReader content={post.content} title={post.title} />
        */}

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

        {/* Dynamic interactions bar */}
        <PostInteractions
          postId={post.id}
          initialViews={post.views}
          initialLikes={post.likes}
          initialShares={post.shares}
          postTitle={post.title}
        />

        {/* Author Box */}
        <div className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md items-center sm:items-start text-center sm:text-left mt-4 shadow-sm">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-olive/10 shrink-0 bg-sand">
            <Image src="/harry_Portrait.png" alt="Harry" fill sizes="64px" className="object-cover" />
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

        {/* Comments Section */}
        <PostComments postId={post.id} />
      </article>
    </>
  );
}
