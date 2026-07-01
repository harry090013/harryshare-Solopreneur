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
    avatarUrl: "/harry_share_avt.webp",
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
        period: 'Năm 2026 - Nay',
        title: 'Hành trình lập nghiệp hướng tới sản phẩm sạch & ẩm thực chay',
        role: 'Lập nghiệp tự chủ',
        iconName: 'Leaf',
        description: 'Thực ra, ý tưởng về con đường riêng đã nhen nhóm trong mình từ trước, nhưng sau Tết 2026, mình quyết định đi từng bước chậm lại để chuẩn bị chu đáo nhất cho hành trình này. Không còn vội vã chạy theo những mục tiêu ngắn hạn, mình muốn hướng tới việc kinh doanh các sản phẩm sạch, phát triển nghề sản xuất nhang thảo mộc truyền thống của gia đình và mở một quán ăn chay lành mạnh giữa thiên nhiên bình yên. Mình nhận ra hạnh phúc thực sự là khi được gieo duyên lành và mang đến những giá trị an lành cho mọi người xung quanh.',
        lesson: 'Bài học: Mình luôn tin rằng sự kiên trì và tinh thần học hỏi là yếu tố tạo ra giá trị bền vững trong công việc và cuộc sống.'
      },
      {
        period: 'Năm 2026',
        title: 'Bứt phá Marketing & Sáng tạo cùng AI tại CloudFly',
        role: 'Marketer & AI Automation Leader',
        iconName: 'Cloud',
        description: 'Gia nhập CloudFly - một công ty công nghệ chuyên cung cấp cơ sở hạ tầng cloud. Tại đây, mình được đắm mình vào thế giới của công nghệ, AI và SEO website chuyên sâu. Với vai trò Leader team sáng tạo cùng AI và nghiên cứu tự động hóa (automation) cho marketing, mình không chỉ làm việc mà còn đồng hành và học cách tối ưu hóa hiệu suất cùng các trợ lý AI thông minh. Mỗi tối, mình vẫn kiên trì rèn luyện tiếng Anh qua Brainkey với ước mơ một ngày tự tin trò chuyện cùng bạn bè quốc tế.',
        lesson: 'Bài học: Làm bạn với AI và ứng dụng tự động hóa là chìa khóa x10 hiệu suất công việc trong thời đại số.'
      },
      {
        period: 'Năm 2025 - 2026',
        title: 'Trưởng phòng Marketing tại Tâm An Spa',
        role: 'Trưởng phòng Marketing (Online & Offline tại Sài Gòn)',
        iconName: 'Sparkles',
        description: 'Đảm nhận vị trí Trưởng phòng Marketing cho Tâm An Spa với sự linh hoạt giữa Sài Gòn và làm việc online. Mình trực tiếp lo từ phân tích thị trường, chụp ảnh, dựng video cho đến tối ưu quảng cáo và chăm sóc khách hàng. Thành tích đáng nhớ là xây dựng nội dung chất lượng thu hút hơn 80.000 người quan tâm và tối ưu chi phí quảng cáo xuống còn 34.000 VND/tin nhắn trong thị trường spa cực kỳ khốc liệt. Mình chọn dừng lại khi nhận ra việc ôm đồm quá nhiều mục tiêu sẽ dẫn đến kiệt sức mà không mang lại giá trị cao nhất.',
        lesson: 'Bài học: Tập trung vào mục tiêu trọng điểm là cách tốt nhất để bảo toàn năng lượng và đạt hiệu quả tối ưu.'
      },
      {
        period: 'Năm 2025',
        title: 'Rèn luyện sự kiên trì chịu khó tại Rex Hotel',
        role: 'Nhân viên phục vụ tiệc & buffet',
        iconName: 'Coffee',
        description: 'Một ngã rẽ thú vị khi mình làm nhân viên phục vụ, set up tiệc cưới và buffet sáng tại Rex Hotel. Công việc bưng bê chân tay vất vả, đòi hỏi sự kiên nhẫn cao và phục vụ khách hàng chuẩn chỉ. Được khách hàng yêu mến và phản hồi hài lòng là niềm vui lớn nhất mỗi ngày. Mình dừng công việc này do đợt cuối năm tăng ca liên tục khiến sức khỏe không đáp ứng nổi, nhưng những bài học giao tiếp tại đây vẫn là vô giá đối với mình sau này.',
        lesson: 'Bài học: Rèn luyện lòng chịu khó và thấu hiểu khách hàng từ những công việc bình dị nhất.'
      },
      {
        period: 'Năm 2025',
        title: 'Xây dựng thương hiệu thực phẩm chay tại Vương Ngọc Vegan',
        role: 'Content Creator & Bán hàng đa kênh',
        iconName: 'ShoppingBag',
        description: 'Mình phụ trách sáng tạo nội dung, xây dựng thương hiệu trên mạng xã hội, xây kênh TikTok và bán sản phẩm sạch của Vương Ngọc Vegan trên cả kênh truyền thống (GT) lẫn thương mại điện tử. Sau khi giúp tăng độ nhận diện và bán được hơn 300 sản phẩm sạch, mình chọn dừng sớm khi thấy định hướng lâu dài 5 năm của công ty không còn đồng nhất với các mục tiêu ngắn hạn của mình để tránh ảnh hưởng sâu vào hệ thống.',
        lesson: 'Bài học: Dừng lại đúng lúc khi không còn chung định hướng phát triển là sự tôn trọng đối với cả hai bên.'
      },
      {
        period: 'Năm 2024 - 2025',
        title: 'Tư vấn giải pháp GoSell tại MediaStep Software Việt Nam',
        role: 'Chuyên viên tư vấn phần mềm hỗ trợ doanh nghiệp',
        iconName: 'HelpCircle',
        description: 'Làm việc tại MediaStep Software, tư vấn giải pháp phần mềm giúp các doanh nghiệp vừa và nhỏ tối ưu quy trình bán hàng và tăng lợi nhuận. Mình đã lắng nghe câu chuyện kinh doanh của hơn 50 khách hàng, có 10 khách gửi thư cảm ơn vì sự nhiệt tình của mình. Quyết định dừng lại khi chứng kiến bộ máy vận hành chèn ép nhân viên, vì mình tin rằng một doanh nghiệp không thể bền vững nếu thiếu đi sự tử tế với nhân sự của mình.',
        lesson: 'Bài học: Phần mềm tốt thôi chưa đủ, bộ máy vận hành nhân văn mới là nền tảng của sự phát triển.'
      },
      {
        period: 'Năm 2024',
        title: 'Quản lý vận hành & Nghiên cứu món mới tại Quán Chay Ưu Đàm',
        role: 'Quản lý vận hành, điều phối bếp và order',
        iconName: 'Utensils',
        description: 'Dưới sự dẫn dắt của chị 2, mình đảm nhận việc quản lý vận hành, điều phối bếp và order tại Quán Chay Ưu Đàm. Mình trực tiếp chuẩn hóa quy trình phục vụ, lắng nghe phản hồi của khách và thử nghiệm nghiên cứu ra các món chay mới. Nhìn quán đón nhận hơn 30 khách trung thành ghé ủng hộ mỗi tuần mang lại cho mình động lực lớn. Mình dừng công việc để tiếp tục học hỏi thêm các công thức nấu chay mới.',
        lesson: 'Bài học: Vận hành quán ăn thành công đòi hỏi sự chặt chẽ trong quy trình và cái tâm đặt vào từng hương vị món ăn.'
      },
      {
        period: 'Năm 2024',
        title: 'Tự nghiên cứu & Sản xuất tại Thảo Mộc Hương T&T',
        role: 'Nhà sáng lập dự án thảo mộc',
        iconName: 'Sprout',
        description: 'Khởi nguồn từ tình yêu với sản phẩm tự nhiên, mình tự tay nghiên cứu công thức, sản xuất nhang thảo mộc và làm marketing, bán hàng cho thương hiệu Thảo Mộc Hương T&T. Bằng sức trẻ, mình thu hút được hơn 300 khách hàng từ mạng xã hội, tạo ra những sản phẩm thảo mộc được khách hàng rất ưa chuộng. Tuy nhiên, dự án phải tạm dừng sau 3 tháng do những khó khăn lớn về nguồn vốn, sức khỏe và nhân sự vận hành.',
        lesson: 'Bài học: Khởi nghiệp dạy cho mình bài học xương máu về quản trị rủi ro, dòng vốn và sự kiên cường khi đối mặt với thất bại.'
      },
      {
        period: 'Năm 2022 - 2023',
        title: 'Hoạt động cộng đồng tại Đoàn Xã Duy Sơn',
        role: 'Thành viên Hội LHTN xã Duy Sơn',
        iconName: 'Award',
        description: 'Muốn đóng góp sức trẻ cho quê hương Duy Xuyên, mình tham gia Hội LHTN xã Duy Sơn với vai trò huynh trưởng quản trò sinh hoạt hè và phát triển đoàn. Mình đã thiết kế website phục vụ công tác đoàn thanh niên xã (lọt Top 3 website xuất sắc của xã) và vinh dự nhận được 3 giấy khen thanh niên tiêu biểu năm 2023. Đây là khoảng thời gian tuyệt đẹp giúp mình cải thiện kỹ năng dẫn chương trình, làm việc nhóm và giao tiếp tự tin trước đám đông.',
        lesson: 'Bài học: Mang kiến thức công nghệ phục vụ cộng đồng và gieo những hạt mầm tích cực cho thế hệ trẻ.'
      },
      {
        period: 'Năm 2022 - 2023',
        title: 'Lập trình viên Front-end (Freelance Developer)',
        role: 'Front-end Developer',
        iconName: 'Code',
        description: 'Ngay sau khi tốt nghiệp chuyên ngành Công nghệ phần mềm vào tháng 7/2022, mình bắt đầu làm Freelance Developer, lập trình giao diện bằng HTML, CSS, JavaScript (React.js). Công việc kỹ thuật này giúp rèn luyện tư duy logic tốt, nhưng sau 6 tháng ngồi một chỗ liên tục ôm laptop, mình bị đau nhức và cảm thấy quá chán nản. Mình nhận ra tính cách hướng ngoại của bản thân cần một môi trường năng động và kết nối con người nhiều hơn là làm coder thuần túy.',
        lesson: 'Bài học: Lắng nghe tiếng nói của cơ thể và dũng cảm bước ra khỏi vùng an toàn khi nhận ra con đường hiện tại không còn phù hợp.'
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
