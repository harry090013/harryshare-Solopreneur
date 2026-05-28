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
    description: "Mình xuất thân là một dân IT - lập trình viên hướng ngoại, đam mê sáng tạo và giao tiếp. Hành trình tự học của mình là chuỗi ngày bền bỉ đi qua nhiều ngã rẽ sự nghiệp từ lập trình, kinh doanh cho đến Digital Marketing, với một mục tiêu duy nhất: kiến tạo nên những giá trị bền vững và mang lại những điều tốt lành cho mọi người xung quanh."
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
        period: 'Sau Tết 2026 - Nay',
        title: 'Hành trình lập nghiệp hướng đến sản phẩm sạch & chay',
        role: 'Lập nghiệp tự chủ',
        iconName: 'Leaf',
        description: 'Sau Tết 2026, mình quyết định đi từng bước chậm để chuẩn bị cho hành trình lập nghiệp lâu dài. Mình hướng đến việc phát triển thương hiệu nhang thảo mộc truyền thống của gia đình giữa không gian thiên nhiên yên bình, mở quán ăn và bán thực phẩm chay sạch.',
        lesson: 'Bài học: Tôi luôn tin rằng sự kiên trì và tinh thần học hỏi là yếu tố tạo ra giá trị bền vững trong công việc và cuộc sống.'
      },
      {
        period: 'Tháng 03/2026 - Nay',
        title: 'Bứt phá Marketing & Sáng tạo cùng AI tại CloudFly',
        role: 'Marketer & AI Automation Leader',
        iconName: 'Cloud',
        description: 'Đảm nhiệm vai trò Marketer tại CloudFly - một công ty công nghệ chuyên cung cấp cơ sở hạ tầng cloud. Thực chiến lượng kiến thức chuyên sâu về SEO website, chạy ads, phân tích và lên kế hoạch marketing. Đồng thời là Leader team sáng tạo cùng AI và nghiên cứu marketing automation (tự động hóa). Hàng ngày, mình kiên trì tự học tiếng Anh qua Brainkey.',
        lesson: 'Bài học: Làm bạn với AI và ứng dụng tự động hóa là chìa khóa x10 hiệu suất công việc trong thời đại số.'
      },
      {
        period: '04/2025 - 03/2026',
        title: 'Trưởng phòng Marketing tại Tâm An Spa',
        role: 'Trưởng phòng Marketing (Online & Offline tại Sài Gòn)',
        iconName: 'Sparkles',
        description: 'Chịu trách nhiệm phân tích thị trường, lập kế hoạch marketing, sáng tạo nội dung hình ảnh/video, tối ưu quy trình từ tiếp thị, remarketing đến chăm sóc khách hàng. Chạy quảng cáo tối ưu hiệu quả cao, đạt chi phí chỉ 34.000 VND / tin nhắn (trong ngành spa vô cùng cạnh tranh) và mang về 95 leads. Mình quyết định dừng lại để lên kế hoạch mới, tái xác định mục tiêu tránh kiệt sức.',
        lesson: 'Bài học: Tập trung vào mục tiêu trọng điểm để tránh làm quá nhiều việc dẫn đến kiệt sức mà không đem lại hiệu quả cao nhất.'
      },
      {
        period: 'Tháng 07/2025 (3 tháng)',
        title: 'Rèn luyện sự kiên trì chịu khó tại Rex Hotel',
        role: 'Nhân viên phục vụ tiệc & buffet',
        iconName: 'Coffee',
        description: 'Làm nhân viên phục vụ, set up tiệc cưới, buffet sáng tại Rex Hotel. Được đông đảo khách hàng yêu mến và đánh giá cao. Mình chọn dừng công việc này vì thời điểm cuối năm tăng ca khá nhiều, sức khỏe bản thân không đáp ứng được.',
        lesson: 'Bài học: Rèn luyện cho mình sự kiên trì chịu khó và cách phục vụ chu đáo.'
      },
      {
        period: '02/2025 - 05/2025',
        title: 'Sales & Marketing tại Vương Ngọc Vegan',
        role: 'Content Creator & Bán hàng đa kênh',
        iconName: 'ShoppingBag',
        description: 'Đóng vai trò Content Creator, nhân viên bán hàng kênh truyền thống (GT) và thương mại điện tử (Shopee, Tiktok). Giúp tăng nhận diện thương hiệu trên các nền tảng mạng xã hội và bán được 300 sản phẩm sạch của công ty. Chọn dừng sớm để không ảnh hưởng sâu vào hệ thống vì định hướng 5 năm của công ty khác mục tiêu ngắn hạn cá nhân.',
        lesson: 'Bài học: Lựa chọn dừng lại đúng lúc khi định hướng không đồng nhất là sự tôn trọng đối với cả hai bên.'
      },
      {
        period: '10/2024 - 01/2025',
        title: 'Tư vấn giải pháp tại MediaStep Software Việt Nam',
        role: 'Chuyên viên tư vấn phần mềm GoSell',
        iconName: 'HelpCircle',
        description: 'Tìm kiếm khách hàng, lắng nghe và tư vấn giải pháp thúc đẩy lợi nhuận cho hơn 50 doanh nghiệp nhỏ và vừa, nhận được 10 lời cảm ơn từ khách hàng. Dừng việc vì nhận thấy bộ máy vận hành chèn ép nhân viên dù sản phẩm tốt.',
        lesson: 'Bài học: Phần mềm tốt thôi chưa đủ, bộ máy vận hành tử tế và tôn trọng nhân viên mới là yếu tố quyết định.'
      },
      {
        period: 'Năm 2024 (2 tháng)',
        title: 'Vận hành dịch vụ ẩm thực tại Quán Chay Ưu Đàm',
        role: 'Quản lý vận hành, điều phối bếp và order',
        iconName: 'Utensils',
        description: 'Quản lý vận hành dưới sự dẫn dắt của chị 2. Thiết lập quy trình chuẩn cho từng vai trò, ghi nhận phản hồi của khách hàng và nghiên cứu ra món mới. Giúp quán giữ chân hơn 30 khách trung thành ghé ủng hộ hàng tuần. Dừng để tiếp tục học hỏi thêm các món chay mới.',
        lesson: 'Bài học: Vận hành thành công đến từ quy trình chuẩn chỉnh và sự tinh tế trong việc thấu hiểu khách hàng.'
      },
      {
        period: 'Năm 2024 (3 tháng)',
        title: 'Tự khởi nghiệp nhỏ với Thảo Mộc Hương T&T',
        role: 'Nghiên cứu sản xuất & Tiếp thị bán lẻ',
        iconName: 'Sprout',
        description: 'Tự nghiên cứu công thức, sản xuất, làm marketing và bán lẻ nhang thảo mộc tự nhiên. Tiếp cận và thu hút thêm 300 khách hàng từ mạng xã hội, sản phẩm thảo mộc rất được ưa chuộng cho đến ngày nay. Tạm dừng dự án vì gặp khó khăn về vốn, sức khỏe và nhân sự.',
        lesson: 'Bài học: Khởi nghiệp dạy mình cách tự đứng trên đôi chân của mình, chịu trách nhiệm tất cả khâu từ sản xuất đến bán hàng.'
      },
      {
        period: 'Năm 2022 - 2023 (1 năm)',
        title: 'Huynh trưởng hoạt động phong trào tại Đoàn Xã Duy Sơn',
        role: 'Thành viên Hội LHTN xã Duy Sơn',
        iconName: 'Award',
        description: 'Tham gia phát triển đoàn thanh niên xã với vai trò huynh trưởng quản trò sinh hoạt hè. Thiết kế website đoàn thanh niên xã đạt Top 3 website phục vụ công tác đoàn thanh niên của xã, nhận được 3 giấy khen danh hiệu thanh niên tiêu biểu năm 2023.',
        lesson: 'Bài học: Rèn luyện kỹ năng làm việc nhóm, giao tiếp, dẫn chương trình và ứng dụng công nghệ phục vụ cộng đồng.'
      },
      {
        period: 'Năm 2022 - 2023 (6 tháng)',
        title: 'Lập trình viên Front-end (Freelance Developer)',
        role: 'Front-end Developer',
        iconName: 'Code',
        description: 'Chịu trách nhiệm coding giao diện website cho các dự án bằng HTML, CSS, JavaScript (React.js) ngay sau khi tốt nghiệp chuyên ngành Công nghệ phần mềm. Dừng công việc vì bị đau và quá chán cảnh phải ngồi một chỗ ôm máy tính cả ngày.',
        lesson: 'Bài học: Hiểu rõ tính cách hướng ngoại của bản thân, không phù hợp làm coder ngồi một chỗ và cần bứt phá ra ngoài.'
      }
    ];
  }

  return (
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
