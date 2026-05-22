import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import ProductDetailClient from '../ProductDetailClient';

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product = null;

  try {
    product = await db.product.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (err) {
    console.error('Database connection failed in Product detail page, falling back to mock:', err);
    
    // Fallback Mock Data
    const mockProducts = [
      {
        id: 'p1',
        title: 'Cố vấn 1-1: Xây dựng Sản phẩm & Thương hiệu cá nhân',
        slug: 'co-van-1-1-xay-dung-san-pham',
        description: 'Chương trình đồng hành 8 tuần giúp bạn từ số 0 phát triển một sản phẩm công nghệ hoàn chỉnh và thu hút nhóm độc giả đầu tiên.',
        content: `## Chương trình Cố vấn 1-1 Đặc biệt
        
Chào bạn! Đây là chương trình đồng hành thực chiến cao cấp nhất của mình. Mình sẽ trực tiếp làm việc cùng bạn mỗi tuần trong vòng 2 tháng để:

1. **Khảo sát & Lựa chọn ý tưởng**: Tìm ra ý tưởng sản phẩm khả thi, có tiềm năng thương mại hóa nhanh.
2. **Thiết kế sản phẩm tinh gọn (MVP)**: Loại bỏ các tính năng thừa, tập trung vào giá trị cốt lõi.
3. **Phát triển & Chuyển giao công nghệ**: Hướng dẫn bạn áp dụng Next.js, AI Coding (Vibe Coding) để làm app siêu tốc.
4. **Phát hành & Tiếp thị**: Lên phễu thu hút độc giả, tạo thương hiệu cá nhân bền vững trên mạng xã hội để có những đơn hàng đầu tiên.

### Bạn sẽ nhận được gì?
- 8 buổi Video Call 1-1 trực tiếp (mỗi buổi 90-120 phút).
- Hỗ trợ giải đáp thắc mắc không giới hạn qua tin nhắn Zalo/Telegram hàng ngày.
- Bộ tài liệu mẫu, hợp đồng, checklist vận hành độc quyền.
- Review code và thiết kế UX/UI cho sản phẩm của bạn.

> **Số lượng giới hạn**: Để đảm bảo chất lượng cố vấn cao nhất, mình chỉ nhận tối đa 2 bạn/tháng. Hãy nhấn nút Đặt mua bên cạnh, điền thông tin và mình sẽ liên hệ nói chuyện trực tiếp trước khi bắt đầu nhé!`,
        price: 15000000,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        type: 'main',
        affiliateUrl: null,
        featured: true,
        category: { name: 'Dịch vụ của Harry', slug: 'dich-vu-cua-harry' }
      },
      {
        id: 'p2',
        title: 'Cẩm nang Solopreneur Khởi nghiệp tinh gọn',
        slug: 'cam-nang-solopreneur-khoi-nghiep-tinh-gon',
        description: 'Tài liệu hơn 150 trang chứa toàn bộ bí quyết, biểu mẫu, quy trình vận hành một mô hình kinh doanh cá nhân siêu lợi nhuận.',
        content: `## Bí quyết xây dựng doanh nghiệp 1 người
        
Chào bạn! Cuốn cẩm nang này đúc kết toàn bộ hành trình 5 năm làm Solopreneur của mình, từ một Freelancer bấp bênh thu nhập đến khi sở hữu hệ thống sản phẩm tự vận hành.

### Nội dung nổi bật:
- **Tư duy Solopreneur**: Phân biệt Freelancer và Solopreneur. Cách dịch chuyển để giải phóng sức lao động.
- **Quy trình nghiên cứu thị trường**: Cách tìm kiếm vấn đề nhức nhối của khách hàng và biến nó thành giải pháp trả phí.
- **Tự động hóa tối đa**: Các công cụ no-code, low-code giúp bạn vận hành hệ thống thanh toán, email marketing, hỗ trợ khách hàng tự động mà không cần nhân sự.
- **Marketing 0 đồng**: Chiến lược viết nội dung chất lượng cao thu hút lưu lượng truy cập tự nhiên.

### Ưu đãi khi đặt mua tại đây:
- Tặng kèm file excel quản lý tài chính cá nhân dành riêng cho Solopreneur.
- Tham gia nhóm Discord hỗ trợ và trao đổi kinh nghiệm trọn đời.`,
        price: 299000,
        image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80',
        type: 'main',
        affiliateUrl: null,
        featured: false,
        category: { name: 'Sản phẩm số', slug: 'san-pham-so' }
      },
      {
        id: 'p3',
        title: 'Bàn phím cơ Keychron K2 Pro QMK/VIA',
        slug: 'ban-phim-co-keychron-k2-pro',
        description: 'Chiếc bàn phím cơ layout 75% gọn nhẹ, gõ cực êm, hỗ trợ custom phím dễ dàng qua VIA. Harry đang dùng hàng ngày.',
        content: `## Đánh giá Keychron K2 Pro sau 1 năm sử dụng
        
Nếu bạn là một Lập trình viên hoặc Người viết nội dung phải gõ phím liên tục 8-10 tiếng mỗi ngày, bàn phím cơ không còn là sở thích nữa, nó là công cụ bảo vệ cổ tay và tăng cảm hứng làm việc của bạn.

### Những điểm mình cực kì thích ở Keychron K2 Pro:
1. **Layout 75%**: Đủ phím chức năng F1-F12 và phím mũi tên nhưng cực kì gọn gàng trên bàn làm việc.
2. **QMK/VIA hỗ trợ**: Mình đã re-map lại các phím nóng để thao tác code nhanh hơn gấp đôi.
3. **Keycap PBT Double-shot**: Không bị bóng dầu sau thời gian dài sử dụng, độ cao phím ôm tay rất thoải mái.
4. **Kết nối đa thiết bị**: Chuyển đổi mượt mà giữa MacBook Pro và máy tính bàn Windows qua Bluetooth.

> **Đánh giá chung**: 9/10. Mức giá quá hời cho một chiếc bàn phím cơ build sẵn chất lượng cao hỗ trợ custom VIA. Click mua ngay dưới đây để nhận voucher giảm giá 5% tại Store đối tác chính hãng.`,
        price: 2350000,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
        type: 'affiliate',
        affiliateUrl: 'https://keychron.com.vn',
        featured: true,
        category: { name: 'Thiết bị làm việc', slug: 'thiet-bi-lam-viec' }
      }
    ];

    product = mockProducts.find(p => p.slug === slug) || null;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center gap-4">
        <h1 className="font-serif text-3xl font-bold text-stone-850">Sản phẩm không tồn tại</h1>
        <p className="text-stone-500">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ xuống.</p>
        <Link href="/san-pham" className="flex items-center gap-1.5 text-sm font-semibold text-olive hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
