import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 30; // Cache trang Về Harry trong 30 giây (ISR) để tăng tốc độ tải trang

// Dynamically resolve custom or standard Lucide icon component on the server
const getTimelineIcon = (iconName: string) => {
  let formattedName = (iconName || 'Coffee').trim();
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
  return LucideIcons.Coffee;
};

export default async function AboutPage() {
  let aboutSetting = {
    title: "Về Harry (Quang Hiếu)",
    subtitle: "📖 Câu chuyện của mình",
    avatarUrl: "/harry_Portrait.png",
    description: "Mình không xuất phát từ đỉnh vinh quang, cũng không có bệ đỡ lớn. Hành trình 10 năm của mình là chuỗi ngày bền bỉ tích lũy, tự học và thử thách bản thân qua nhiều ngã rẽ."
  };
  let timelineSteps = [];

  try {
    // Chạy song song các truy vấn để tối ưu hóa hiệu năng và giảm độ trễ mạng
    const [dbSetting, dbTimeline] = await Promise.all([
      db.aboutSetting.findUnique({ where: { id: 'about-setting' } }),
      db.aboutTimeline.findMany({ orderBy: { order: 'asc' } })
    ]);

    if (dbSetting) {
      aboutSetting = dbSetting;
    }
    if (dbTimeline) {
      timelineSteps = dbTimeline;
    }
  } catch (error) {
    console.error('Failed to fetch about page data:', error);
  }

  if (timelineSteps.length === 0) {
    timelineSteps = [
      {
        period: 'Giai đoạn 1',
        title: 'Phục vụ bàn quán cà phê',
        role: 'Học việc & Rèn luyện kiên nhẫn',
        iconName: 'Coffee',
        description: 'Lúc mới chân ướt chân ráo bước vào đời, mình dọn dẹp, bưng bê nước và lau dọn vệ sinh. Công việc tay chân mệt mỏi nhưng dạy cho mình bài học đầu đời về sự khiêm tốn, lòng chịu đựng và cách thấu hiểu tâm lý khách hàng khi giao tiếp.',
        lesson: 'Bài học: Khách hàng luôn muốn cảm nhận sự tôn trọng và chân thành.'
      },
      {
        period: 'Giai đoạn 2',
        title: 'Bán áo thun Print-On-Demand (POD)',
        role: 'Tập tành kinh doanh & Thương mại điện tử',
        iconName: 'ShoppingBag',
        description: 'Khám phá thế giới kiếm tiền online (MMO), tự thiết kế áo thun và chạy quảng cáo Facebook nhắm tới khách hàng Mỹ. Đây là cột mốc đầu tiên giúp mình biết thế nào là phễu chuyển đổi, cách làm quảng cáo và việc đối mặt với rủi ro tài chính.',
        lesson: 'Bài học: Phải liên tục thích nghi và đổi mới để không bị đào thải.'
      },
      {
        period: 'Giai đoạn 3',
        title: 'Lập trình viên tự do (Freelance Developer)',
        role: 'Làm chủ công nghệ & Tự học lập trình',
        iconName: 'Code',
        description: 'Nhận thấy tầm quan trọng của kỹ thuật, mình tự học HTML, CSS, Javascript và các framework web. Những năm tháng cày Upwork xuyên màn đêm giúp mình làm chủ công nghệ, xây dựng tư duy giải quyết vấn đề bằng phần mềm hệ thống.',
        lesson: 'Bài học: Kỹ năng kỹ thuật giúp bạn hiện thực hóa mọi ý tưởng sản phẩm.'
      },
      {
        period: 'Giai đoạn 4',
        title: 'Content Creator & SEO Strategist',
        role: 'Kết nối sản phẩm & Tiếp thị số',
        iconName: 'Megaphone',
        description: 'Nhận ra code giỏi thôi chưa đủ, sản phẩm cần có người dùng. Mình chuyển sâu sang học về phễu marketing, SEO, viết lách sáng tạo nội dung và xây dựng thương hiệu cá nhân để phân phối sản phẩm hữu hiệu.',
        lesson: 'Bài học: Sự kết hợp giữa kỹ thuật và marketing tạo nên sức mạnh khổng lồ.'
      },
      {
        period: 'Giai đoạn 5',
        title: 'Trở thành Solopreneur tự do',
        role: 'Xây dựng cuộc đời tự chủ tài chính',
        iconName: 'Milestone',
        description: 'Hiện tại, mình độc lập vận hành các dự án cá nhân, viết blog, tạo ra các tài nguyên số hữu ích và các ứng dụng SaaS nhỏ giúp giải quyết vấn đề của cộng đồng. Mình tự làm chủ thời gian, tự do sáng tạo và chịu trách nhiệm 100% cuộc sống.',
        lesson: 'Bài học: Tự do thực sự chỉ đến khi bạn dám dũng cảm đi con đường riêng của mình.'
      }
    ];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-16">
      {/* 1. Header Hero */}
      <div className="flex flex-col md:flex-row gap-10 items-center border-b border-olive/5 pb-12">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-olive/15 bg-sand shrink-0 shadow-md">
          <Image src={aboutSetting.avatarUrl} alt="Harry" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4 text-center md:text-left">
          <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit mx-auto md:mx-0">
            {aboutSetting.subtitle}
          </span>
          <h1 className="font-serif text-4xl font-black text-stone-850 leading-tight">
            {aboutSetting.title}
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {aboutSetting.description}
          </p>
        </div>
      </div>

      {/* 2. Timeline Story */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-855 text-left">
            Chặng đường tự học & phát triển
          </h2>
          <p className="text-stone-500 text-sm text-left">
            Dưới đây là các cột mốc sự nghiệp định hình nên tư duy và triết lý làm việc hiện tại của mình.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-olive/10 ml-4 md:ml-6 pl-6 md:pl-10 flex flex-col gap-12 py-4">
          {timelineSteps.map((step, idx) => {
            const StepIcon = getTimelineIcon(step.iconName);
            return (
              <div key={step.id || idx} className="relative flex flex-col gap-3 animate-slide-up">
                {/* Node icon */}
                <div className="absolute -left-[45px] md:-left-[61px] top-0 w-10 h-10 rounded-xl bg-olive border-4 border-cream flex items-center justify-center text-cream shadow-md">
                  <StepIcon className="w-4 h-4" />
                </div>

                {/* Content card */}
                <div className="flex flex-col gap-2 p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/20 hover:bg-cream hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-olive/5 pb-2.5">
                    <span className="text-[10px] font-bold text-olive uppercase tracking-widest bg-olive/5 px-2.5 py-1 rounded-md">
                      {step.period}
                    </span>
                    <span className="text-xs font-semibold text-stone-400 font-sans">
                      {step.role}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-stone-850 pt-1 leading-snug">
                    {step.title}
                  </h3>
                  
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans mt-1 whitespace-pre-line">
                    {step.description}
                  </p>

                  <div className="mt-2 p-3.5 rounded-xl bg-sand/40 border border-olive/5 text-xs font-serif text-olive font-medium italic whitespace-pre-line">
                    {step.lesson}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Connect CTA */}
      <div className="p-8 rounded-2xl bg-olive text-cream flex flex-col items-center text-center gap-5 shadow-lg relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />

        <h3 className="font-serif text-xl sm:text-2xl font-bold z-10">
          Bạn có muốn trò chuyện sâu hơn cùng mình?
        </h3>
        <p className="text-xs sm:text-sm text-cream/80 leading-relaxed max-w-lg z-10">
          Hãy ghé thăm trang Liên hệ để gửi tin nhắn trực tiếp, hoặc đơn giản là bật khung chat ở góc phải bên dưới để tương tác ngay với Trợ lý AI của mình nhé!
        </p>
        <Link 
          href="/lien-he" 
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-cream text-olive font-semibold hover:bg-sand transition-all shadow-md cursor-pointer active:scale-95 z-10 group"
        >
          Liên hệ với Harry
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
