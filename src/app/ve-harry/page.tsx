import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { db } from '@/lib/db';
import JsonLd from '@/components/JsonLd';
import type { Metadata } from 'next';

export const revalidate = 30; // Cache trang Về Harry trong 30 giây (ISR) để tăng tốc độ tải trang

export const metadata: Metadata = {
  title: 'Về Harry (Quang Hiếu)',
  description: 'Câu chuyện và hành trình làm nghề của Harry (Quang Hiếu) — từ lập trình viên đến Marketer, AI Automation và con đường Solopreneur.',
  alternates: { canonical: '/ve-harry' },
  openGraph: {
    title: 'Về Harry (Quang Hiếu)',
    description: 'Hành trình làm nghề thật, nói thật của một Solopreneur.',
    url: 'https://harryshare.vn/ve-harry',
    type: 'profile',
  },
};

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
    avatarUrl: "/api/media/53a545d8-073a-4a0d-b98f-a929df9a372c",
    description: "Tôi sinh năm 2000, học chuyên ngành Công nghệ phần mềm. Nhưng tốt nghiệp xong, tôi nhận ra mình không hợp ngồi một chỗ ôm máy tính cả ngày. Chân tôi muốn đi, miệng tôi muốn nói. Nhờ kiến thức công nghệ làm nền tảng, tôi bước sang tự học marketing, làm vận hành, đi bưng bê tiệc cưới, và giờ là tự làm chủ. Trang web này đơn giản là cuốn nhật ký tôi tự viết cho bản thân 10 năm sau nhìn lại, và chia sẻ lại những bài học tôi đã tự thử sai trên hành trình của mình."
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
        period: 'Năm 2026 - Nay',
        title: 'Hành trình lập nghiệp hướng tới sản phẩm sạch & ẩm thực chay',
        role: 'Lập nghiệp tự chủ',
        iconName: 'Leaf',
        description: 'Tôi chọn đi chậm lại sau giai đoạn đi làm thuê. Tôi muốn tập trung phát triển nghề sản xuất nhang sạch thảo mộc của gia đình và mở một quán chay nhỏ yên bình. Tôi nhận ra niềm vui của mình lúc này là được tự làm ra những sản phẩm lành tính, gieo những duyên tốt lành cho mọi người xung quanh.',
        lesson: 'Bài học: Sự kiên nhẫn tích lũy giá trị thực giúp tôi bình tĩnh hơn, không còn nôn nóng chạy theo những con số ngắn hạn.'
      },
      {
        period: 'Năm 2026',
        title: 'Bứt phá Marketing & Sáng tạo cùng AI tại CloudFly',
        role: 'Marketer & AI Automation Leader',
        iconName: 'Cloud',
        description: 'Tôi gia nhập CloudFly để nghiên cứu sâu về hạ tầng mạng, SEO website và ứng dụng AI tự động hóa vào marketing. Tôi tự tay xây dựng các quy trình tự động hóa quy trình làm việc cùng các trợ lý AI để giải phóng sức lao động của chính mình. Tối đến, tôi tự học thêm tiếng Anh để mở rộng thế giới quan.',
        lesson: 'Bài học: Tôi nhận ra AI không thay thế con người, nhưng biết cách tận dụng AI giúp tôi giải quyết lượng công việc khổng lồ một mình.'
      },
      {
        period: 'Năm 2025 - 2026',
        title: 'Trưởng phòng Marketing tại Tâm An Spa',
        role: 'Trưởng phòng Marketing (Online & Offline tại Sài Gòn)',
        iconName: 'Sparkles',
        description: 'Tôi nhận trách nhiệm làm marketing cho spa trong thị trường cạnh tranh gắt gao tại Sài Gòn. Tôi tự học chụp ảnh, dựng video, tự chạy quảng cáo tối ưu ngân sách. Tôi quyết định dừng lại khi thấy bản thân đang ôm đồm quá nhiều việc cùng lúc dẫn đến quá tải, không còn thời gian để thở.',
        lesson: 'Bài học: Tôi học được cách buông bớt những thứ không quan trọng để tập trung bảo toàn năng lượng cho việc cốt lõi.'
      },
      {
        period: 'Năm 2025',
        title: 'Rèn luyện sự kiên trì chịu khó tại Rex Hotel',
        role: 'Nhân viên phục vụ tiệc & buffet',
        iconName: 'Coffee',
        description: 'Tôi đi làm bưng bê tiệc cưới và buffet sáng tại khách sạn Rex. Một công việc tay chân vất vả đòi hỏi sự nhẫn nại cao, đứng liên tục nhiều giờ liền. Nhưng bù lại, tôi có cơ hội quan sát thực tế cách phục vụ khách hàng cao cấp và rèn luyện cho mình tính kiên trì, chịu khó từ những việc nhỏ nhất.',
        lesson: 'Bài học: Tôi học được sự khiêm nhường và thấu hiểu khách hàng từ những trải nghiệm tay chân bình dị.'
      },
      {
        period: 'Năm 2025',
        title: 'Xây dựng thương hiệu thực phẩm chay tại Vương Ngọc Vegan',
        role: 'Content Creator & Bán hàng đa kênh',
        iconName: 'ShoppingBag',
        description: 'Tôi phụ trách lên nội dung, làm video ngắn giới thiệu sản phẩm chay sạch trên TikTok và các sàn thương mại điện tử. Tôi chọn dừng công việc sớm khi nhận thấy định hướng phát triển lâu dài của doanh nghiệp không còn đồng nhất với mục tiêu học hỏi ngắn hạn của mình.',
        lesson: 'Bài học: Tôi học được cách dũng cảm dừng lại đúng lúc để tránh làm mất thời gian của cả hai bên.'
      },
      {
        period: 'Năm 2024 - 2025',
        title: 'Tư vấn giải pháp GoSell tại MediaStep Software Việt Nam',
        role: 'Chuyên viên tư vấn phần mềm hỗ trợ doanh nghiệp',
        iconName: 'HelpCircle',
        description: 'Tôi tư vấn giải pháp phần mềm GoSell hỗ trợ các hộ kinh doanh và doanh nghiệp vừa và nhỏ tối ưu quy trình bán hàng. Tôi lắng nghe câu chuyện kinh doanh thực tế từ nhiều chủ cửa hàng. Tôi dừng lại khi cảm thấy môi trường và bộ máy vận hành nội bộ không còn phù hợp với hệ giá trị nhân văn của mình.',
        lesson: 'Bài học: Tôi hiểu ra một sản phẩm tốt đến mấy cũng cần một bộ máy vận hành nhân văn để đi được dài hạn.'
      },
      {
        period: 'Năm 2024',
        title: 'Quản lý vận hành & Nghiên cứu món mới tại Quán Chay Ưu Đàm',
        role: 'Quản lý vận hành, điều phối bếp và order',
        iconName: 'Utensils',
        description: 'Tôi phụ trách điều phối bếp, order và chăm sóc khách hàng tại quán chay của chị hai. Tôi trực tiếp chuẩn hóa lại quy trình gọi món, trò chuyện lắng nghe phản hồi của thực khách và tự mày mò học hỏi các công thức món chay mới để hoàn thiện menu.',
        lesson: 'Bài học: Vận hành một quán ăn nhỏ dạy tôi bài học về sự chi tiết, tỉ mỉ và cái tâm đặt vào từng đĩa ăn phục vụ khách.'
      },
      {
        period: 'Năm 2024',
        title: 'Tự nghiên cứu & Sản xuất tại Thảo Mộc Hương T&T',
        role: 'Nhà sáng lập dự án thảo mộc',
        iconName: 'Sprout',
        description: 'Tôi tự nghiên cứu công thức, tự sản xuất nhang thảo mộc sạch và tự tìm khách hàng qua mạng xã hội. Tôi bán được hơn 300 sản phẩm đầu tiên. Tuy nhiên, tôi phải dừng dự án sau 3 tháng do cạn kiệt nguồn vốn dự phòng, sức khỏe suy giảm và thiếu kinh nghiệm quản trị dòng tiền.',
        lesson: 'Bài học: Dự án thất bại đầu đời dạy tôi bài học đắt giá về tầm quan trọng của dòng tiền và quản trị rủi ro khi tự kinh doanh.'
      },
      {
        period: 'Năm 2022 - 2023',
        title: 'Hoạt động cộng đồng tại Đoàn Xã Duy Sơn',
        role: 'Thành viên Hội LHTN xã Duy Sơn',
        iconName: 'Award',
        description: 'Tôi tham gia tổ chức sinh hoạt hè, quản trò và hỗ trợ hoạt động Đoàn thanh niên ở quê nhà Duy Xuyên. Tôi tự xây dựng website Đoàn xã để phục vụ công tác truyền thông tin tức. Quá trình làm việc tập thể giúp tôi tự tin đứng trước đám đông và rèn luyện sự kết nối.',
        lesson: 'Bài học: Tôi nhận ra công nghệ sẽ phát huy giá trị lớn nhất khi phục vụ cho cộng đồng và gieo những điều tốt lành.'
      },
      {
        period: 'Năm 2022 - 2023',
        title: 'Lập trình viên Front-end (Freelance Developer)',
        role: 'Front-end Developer',
        iconName: 'Code',
        description: 'Sau khi tốt nghiệp, tôi bắt đầu làm Freelance Developer thiết kế giao diện web. Công việc giúp tôi rèn luyện tư duy logic tốt. Tuy nhiên, sau 6 tháng ngồi lì trước laptop, tôi bị đau mỏi vai gáy và cảm thấy chán nản. Tôi nhận ra tính cách mình cần sự vận động và kết nối nhiều hơn.',
        lesson: 'Bài học: Tôi học cách dũng cảm lắng nghe cơ thể và bước ra khỏi vùng an toàn khi nhận ra công việc không còn phù hợp.'
      }
    ];
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harry (Quang Hiếu)',
    jobTitle: 'Creative Solopreneur',
    description: aboutSetting.description,
    image: `https://harryshare.vn${aboutSetting.avatarUrl}`,
    url: 'https://harryshare.vn/ve-harry',
    sameAs: [
      'https://www.facebook.com/q.hieu09'
    ]
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-16">
      {/* 1. Header Hero */}
      <div className="flex flex-col md:flex-row gap-10 items-center border-b border-olive/5 pb-12">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-olive/15 bg-sand shrink-0 shadow-md">
          <Image src={aboutSetting.avatarUrl} alt="Harry" fill sizes="(max-width: 768px) 144px, 176px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-4 text-center md:text-left">
          <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit mx-auto md:mx-0">
            {aboutSetting.subtitle}
          </span>
          <h1 className="font-serif text-4xl font-black text-stone-850 leading-tight">
            {aboutSetting.title}
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed whitespace-pre-line text-justify">
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
                  
                  <div className={`flex flex-col ${step.imageUrl ? 'md:flex-row md:items-center gap-6' : ''} pt-1`}>
                    <div className={`flex flex-col gap-2 ${step.imageUrl ? 'md:w-[70%] flex-1' : 'w-full'}`}>
                      <h3 className="font-serif text-lg font-bold text-stone-850 leading-snug">
                        {step.title}
                      </h3>
                      
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line text-justify">
                        {step.description}
                      </p>

                      <div className="mt-2 p-3.5 rounded-xl bg-sand/40 border border-olive/5 text-xs font-serif text-olive font-medium italic whitespace-pre-line">
                        {step.lesson}
                      </div>
                    </div>

                    {step.imageUrl && (
                      <div className="md:w-[30%] w-full shrink-0 flex items-center mt-4 md:mt-0">
                        <div className="relative w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-olive/10 shadow-sm bg-sand">
                          <Image 
                            src={step.imageUrl} 
                            alt={step.title} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 250px"
                            className="object-cover hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* 3. Connect CTA */}
      <div className="p-8 rounded-2xl bg-olive text-cream flex flex-col items-center text-center gap-5 shadow-lg relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />

        <h3 className="font-serif text-xl sm:text-2xl font-bold z-10">
          Bạn có muốn trò chuyện sâu hơn cùng mình?
        </h3>
        <p className="text-xs sm:text-sm text-cream/80 leading-relaxed max-w-lg z-10 text-justify">
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
    </>
  );
}
