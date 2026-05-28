import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting custom database seed...');

  // 1. Clean existing data
  await prisma.aboutTimeline.deleteMany({});
  await prisma.aboutSetting.deleteMany({});
  await prisma.heroSlide.deleteMany({});
  await prisma.homepageSetting.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.productOrder.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.projectResource.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.newsletter.deleteMany({});
  await prisma.icon.deleteMany({});

  console.log('Database cleaned.');

  // 2. Seed suggested icons
  console.log('Seeding icons...');
  const iconsData = [
    { name: "Layers", label: "Lớp xếp" },
    { name: "BookOpen", label: "Sách" },
    { name: "Cpu", label: "AI/Vi xử lý" },
    { name: "Lightbulb", label: "Ý tưởng" },
    { name: "PenTool", label: "Viết lách" },
    { name: "Brain", label: "Trí tuệ" },
    { name: "Code", label: "Lập trình" },
    { name: "Terminal", label: "Dòng lệnh" },
    { name: "Sparkles", label: "Sáng tạo" },
    { name: "Flame", label: "Xu hướng" },
    { name: "Globe", label: "Mạng lưới" },
    { name: "Heart", label: "Yêu thích" },
    { name: "Award", label: "Thành tựu" },
    { name: "Radio", label: "Phát sóng" },
    { name: "User", label: "Cá nhân" },
    { name: "ShoppingBag", label: "Mua sắm" }
  ];
  for (const item of iconsData) {
    await prisma.icon.create({ data: item });
  }

  // 3. Seed admins
  console.log('Seeding admins...');
  await prisma.admin.create({
    data: {
      username: "harry",
      password: "$2b$10$IH4Cfqm/BuMD1xleUUQzN.2TBBuN3L84kdnP1lNL0fHh3nDZB03z2" // harryshare2026
    }
  });

  // 4. Seed categories
  console.log('Seeding categories...');
  
  // Post Categories (Chia sẻ)
  const catProductMindset = await prisma.category.create({
    data: {
      name: "Tư duy sản phẩm",
      slug: "tu-duy-san-pham",
      description: "Khám phá triết lý xây dựng sản phẩm và tư duy giải quyết vấn đề thực tế.",
      type: "post",
      icon: "Layers"
    }
  });

  const catPersonalBranding = await prisma.category.create({
    data: {
      name: "Thương hiệu cá nhân",
      slug: "thuong-hieu-ca-nhan",
      description: "Làm thế nào để tạo dựng uy tín trong ngành và mở khóa cơ hội nghề nghiệp.",
      type: "post",
      icon: "User"
    }
  });

  const catAiVibeCoding = await prisma.category.create({
    data: {
      name: "AI & Vibe Coding",
      slug: "ai-vibe-coding",
      description: "Ứng dụng trí tuệ nhân tạo và quy trình lập trình thế hệ mới.",
      type: "post",
      icon: "Sparkles"
    }
  });

  const catCareerJourney = await prisma.category.create({
    data: {
      name: "Hành trình làm nghề",
      slug: "hanh-trinh-lam-nghe",
      description: "Chia sẻ chân thực về những cột mốc và bài học xương máu của Solopreneur.",
      type: "post",
      icon: "Code"
    }
  });

  // Resource Categories (Dự án & Tài nguyên)
  const catTools = await prisma.category.create({
    data: {
      name: "Công cụ đắc lực",
      slug: "cong-cu-dac-luc",
      description: "Các công cụ đắc lực hỗ trợ quy trình làm việc và phát triển sản phẩm.",
      type: "resource",
      icon: "Terminal"
    }
  });

  const catDocuments = await prisma.category.create({
    data: {
      name: "Tài liệu & Quà tặng",
      slug: "tai-lieu-qua-tang",
      description: "Checklist, cẩm nang và tài liệu miễn phí tự biên soạn.",
      type: "resource",
      icon: "BookOpen"
    }
  });

  // Product Categories (Sản phẩm)
  const catBooksCourses = await prisma.category.create({
    data: {
      name: "Sách & Khóa học",
      slug: "sach-khoa-hoc",
      description: "Sản phẩm tri thức tự phát triển và khuyên đọc.",
      type: "product",
      icon: "BookOpen"
    }
  });

  const catAiSaaS = await prisma.category.create({
    data: {
      name: "Giải pháp AI & SaaS",
      slug: "giai-phap-ai-saas",
      description: "Các giải pháp phần mềm thông minh hỗ trợ doanh nghiệp.",
      type: "product",
      icon: "Cpu"
    }
  });

  // 5. Seed posts
  console.log('Seeding posts...');
  const postsData = [
    {
      title: "AI & CODING: KỶ NGUYÊN AGENTIC VÀ SỨC MẠNH CỦA ANTIGRAVITY",
      slug: "ai-coding-antigravity-agentic-era",
      description: "Từ việc hỏi ChatGPT từng bước để tự gõ code đến việc ra lệnh cho Antigravity thực hiện toàn bộ dự án từ đầu đến cuối - kỷ nguyên Vibe Coding thực thụ.",
      content: "Hello mọi người, lại là Harry đây!\n\nHôm nay mình muốn nói về một chủ đề mà anh em dev nào dạo này cũng đang bàn tán xôn xao – lập trình cùng AI. Nhưng không phải là kiểu hỏi đáp thông thường đâu nhó.\n\nMọi người còn nhớ cái hồi chúng ta mới dùng ChatGPT hay Claude không?\n🫣 Hồi đó tụi mình toàn phải chat: \"Ê chỉ mình code chức năng này với\", rồi AI chỉ từng bước, rồi mình copy từng dòng, dán vô editor, chạy thử, lỗi, lại copy lỗi dán ngược lại bắt nó sửa...\nCứ lặp đi lặp lại như vậy, mệt muốn xỉu! Lúc đó AI chỉ đóng vai trò là người hướng dẫn, còn tay chân thực hiện vẫn là mình.\n\nNhưng bây giờ mọi chuyện đã khác rồi mọi người ơi. Mình đang trải nghiệm một công cụ cực kỳ bá đạo có tên là **Antigravity**.\n\nĐể mình kể cho nghe cách hoạt động của nó:\n✍🏻 Thay vì chỉ dẫn bạn từng bước, bạn chỉ cần ném toàn bộ yêu cầu dự án vào.\n✍🏻 Bạn bảo: \"Xây cho tôi một trang web Next.js bán nhang thảo mộc có thanh toán và quản lý đơn hàng\".\n✍🏻 Thế là Antigravity tự động phân tích cấu trúc dự án, tự tạo file, tự viết code, tự debug và chạy lệnh build luôn!\n✍🏻 Nó có thể đọc hiểu toàn bộ codebase của bạn, tự sửa lỗi terminal mà không cần bạn phải động tay gõ một dòng code nào.\n\nĐúng nghĩa là bạn chỉ cần \"vibe\" và ra quyết định thôi nhó!\n\n👉🏻 Đây chính là kỷ nguyên **Agentic** – nơi AI không chỉ trả lời câu hỏi, mà nó có khả năng **hành động** thay thế bạn.\n👉🏻 Lập trình viên bây giờ không còn là người ngồi gõ cú pháp (syntax) nữa, mà đã nâng tầm thành kiến trúc sư hệ thống, người định hướng sản phẩm (product thinker).\n👉🏻 Nếu bạn biết tận dụng sức mạnh của những Agent như Antigravity, bạn có thể x10, x20 năng suất của mình, tự tay làm ra những sản phẩm hoàn chỉnh chỉ trong vài tiếng đồng hồ.\n\nNên là, đừng sợ AI cướp việc, hãy sợ mình không biết cách điều khiển nó thôi nè. Hãy tập cách nói chuyện với nó, giao việc cho nó làm thay mình nhó.\n\nĐể lại comments dưới bài viết dồm thử anh em có đang dùng Agent nào xịn xò chưa i!\n\nP/s: Để hôm nào rảnh mình viết một bài chia sẻ chi tiết cách mình \"train\" Antigravity viết code cho dự án HarryShare này từ số 0 cho mọi người dồm nhó!\n\n#harrytapviet #harryshare",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-28T00:00:00.000Z"),
      categoryId: catAiVibeCoding.id,
      views: 154,
      likes: 58,
      shares: 18
    },
    {
      title: "THƯƠNG HIỆU CÁ NHÂN TRONG THỜI ĐẠI SỐ: TRAO GIÁ TRỊ, NHẬN LÒNG TIN",
      slug: "thuong-hieu-ca-nhan-thoi-dai-so",
      description: "Tại sao xây dựng thương hiệu cá nhân không phải là \"lùa gà\" mà là chìa khóa mở ra sự tự do tài chính và tạo dựng giá trị thực tế trong thời đại số.",
      content: "Um,... Bắt đầu từ đâu nhỉ...!\n\nDạo này lướt mạng xã hội, thấy người người nhà nhà làm thương hiệu cá nhân (Personal Branding). Nhiều bên làm bóng bẩy quá, nói đạo lý làm giàu nghe mà sợ.\n🫣 Thú thật là hồi xưa mình dị ứng lắm, cứ nghe tới thương hiệu cá nhân là nghĩ ngay tới mấy việc lùa gà, dạy làm giàu nhanh, hay mấy diễn giả tự phong.\n\nNhưng sau nhiều năm bôn ba qua đủ nghề, từ phục vụ Rex Hotel, bán hàng chay ở Vương Ngọc Vegan, đến chạy ads spa cho Tâm An, mình nhận ra một sự thật:\n👉🏻 Thương hiệu cá nhân thực chất chỉ là **sự tích lũy lòng tin** của mọi người dành cho bạn.\n👉🏻 Khi bạn không có mặt ở đó, người ta vẫn nhớ đến bạn vì một giá trị cụ thể nào đó bạn đã từng trao đi.\n\nTrong thời đại số và chuyển đổi số này, tại sao xây dựng thương hiệu cá nhân lại quan trọng đến thế?\n\n✍🏻 **Xây dựng lòng tin bền vững**: Giữa một rừng thông tin thật giả lẫn lộn, người ta chỉ mua hàng hoặc hợp tác với người họ tin tưởng.\n✍🏻 **Trao tặng giá trị trước, nhận lại sau**: Hãy chia sẻ những kiến thức thực tế, những bài học xương máu bạn đã trải qua mà không giấu nghề. Người nhận được giá trị sẽ tự động trân quý bạn.\n✍🏻 **Mở ra cơ hội tăng thu nhập (Income stream)**: Khi bạn có uy tín trong một ngách hẹp (ví dụ như marketing automation hay vibe coding), các cơ hội job, dự án freelance, cố vấn sẽ tự động tìm đến bạn mà bạn không cần phải đi năn nỉ xin việc.\n\nHarryShare này cũng vậy nhó. Mình viết ra trước hết là cho chính bản thân mình ghi nhớ, sau là chia sẻ điều tốt lành cho mọi người, không có lùa gà bán khóa học gì đâu nè. Nhưng từ đây, mình lại kết nối được với rất nhiều anh em chung chí hướng, mở ra bao nhiêu cơ hội mới.\n\nĐịnh vị bản thân ở ngách hẹp, kiên trì kể câu chuyện phía sau hậu trường (behind the scenes) của bạn một cách chân thành nhất. Đó chính là cách làm thương hiệu cá nhân bền vững nhất.\n\nHãy kiên trì gieo duyên lành nho Harry! Chúc anh em cũng sớm tìm thấy ngách đi riêng của mình nhó.\n\nP/s: Bài tiếp theo mình sẽ viết về triết lý \"Find Success By Limiting\" - cách thu hẹp ngách để nổi bật giữa đám đông. Anh em nhớ đón đọc i!\n\n#harrytapviet #harryshare",
      coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      date: new Date("2026-05-27T00:00:00.000Z"),
      categoryId: catPersonalBranding.id,
      views: 120,
      likes: 49,
      shares: 12
    },
    {
      title: "TƯ DUY SẢN PHẨM: MỘT SẢN PHẨM NHƯ THẾ NÀO LÀ WIN?",
      slug: "tu-duy-san-pham-nhu-the-nao-la-win",
      description: "Phân tích sâu sắc về tư duy làm sản phẩm thắng cuộc (Win) dưới góc nhìn của một người từng thất bại và học hỏi không ngừng.",
      content: "Chào mọi người ngày mới,\n\nHôm nay mình muốn ngồi lại tự sự một chút về tư duy làm sản phẩm (Product Thinking). Một chủ đề nghe có vẻ vĩ mô nhưng thực ra cực kỳ gần gũi.\n\n🫣 Trước đây khi làm dự án nhang Thảo Mộc Hương T&T, mình từng nghĩ chỉ cần sản phẩm thơm, tốt, bao bì đẹp là tự khắc người ta sẽ mua. Kết quả là sau 3 tháng phải tạm dừng vì thiếu vốn và không vận hành nổi. Đau đớn vô cùng!\nTừ thất bại đó, cộng với thời gian làm tư vấn phần mềm GoSell dồm thấy nỗi đau của hơn 50 doanh nghiệp, mình tự hỏi: **Một sản phẩm như thế nào mới được gọi là WIN?**\n\nTheo trải nghiệm của mình, một sản phẩm WIN phải hội tụ đủ các yếu tố này:\n\n✍🏻 **Giải quyết triệt để một nỗi đau thực tế (Pain Point)**: Sản phẩm của bạn không cần giải quyết mọi thứ trên đời. Chỉ cần giải quyết cực tốt một vấn đề nhức nhối của khách hàng. Khách hàng sẵn sàng trả tiền để nỗi đau đó biến mất.\n✍🏻 **Đơn giản đến mức tối đa (Simplicity)**: Đừng cố nhét quá nhiều tính năng. Người dùng bây giờ lười lắm nho! Sản phẩm càng ít bước để đạt được kết quả, sản phẩm đó càng dễ thắng.\n✍🏻 **Trải nghiệm Aha! Moment cực nhanh**: Ngay khi mở sản phẩm lên, trong vòng 30 giây đầu tiên, người dùng phải cảm nhận được giá trị cốt lõi của nó. Nếu bắt họ đăng ký rườm rà, điền form dài dòng, họ sẽ thoát ra ngay lập tức.\n✍🏻 **Có vòng lặp tăng trưởng tự thân (Product-Led Loop)**: Sản phẩm tốt là sản phẩm mà chính người dùng hiện tại sẽ giới thiệu cho người dùng mới thông qua các tính năng chia sẻ, tặng quà, hoặc đơn giản là vì nó quá tiện ích.\n\n👉🏻 Tóm lại, sản phẩm WIN không phải là sản phẩm có công nghệ phức tạp nhất, mà là sản phẩm **mang lại giá trị thực chất và dễ tiếp cận nhất** cho người dùng.\n👉🏻 Đừng bắt đầu từ việc: \"Tôi có công nghệ gì?\". Hãy bắt đầu từ việc: \"Người dùng đang đau ở đâu và tôi giúp họ giải quyết như thế nào?\".\n\nTự răn mình luôn ghi nhớ điều này khi xây dựng bất kỳ dự án nào trong tương lai nho Harry!\n\nAnh em có đồng ý với góc nhìn này của mình không? Để lại bình luận cho mình biết ý kiến với nhó!\n\nP/s: Sắp tới mình đang ấp ủ một sản phẩm số nhỏ hỗ trợ các marketer tự động hóa quy trình viết bài bằng AI. Khi nào xong sẽ gửi tặng mọi người dùng thử i!\n\n#harrytapviet #harryshare",
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      readTime: 7,
      published: true,
      date: new Date("2026-05-26T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 185,
      likes: 62,
      shares: 20
    }
  ];

  for (const item of postsData) {
    const post = await prisma.post.create({ data: item });
    
    // Seed some approved comments
    await prisma.comment.create({
      data: {
        postId: post.id,
        authorName: "Đức Anh",
        authorEmail: "ducanh@gmail.com",
        content: "Bài viết chia sẻ rất chân thành và thấm thía anh ơi! Em cũng từng chạy theo tính năng mà quên mất khách hàng thực sự cần gì.",
        approved: true
      }
    });

    await prisma.comment.create({
      data: {
        postId: post.id,
        authorName: "Minh Trang",
        authorEmail: "trangm@yahoo.com",
        content: "Giọng văn ấm áp và cực kỳ thực tế. Chúc Harry gieo thêm nhiều hạt mầm ý nghĩa nhó!",
        approved: true
      }
    });
  }

  // 6. Seed project resources
  console.log('Seeding project resources...');
  const resourcesData = [
    {
      title: "Notion Workspace: Trọn Bộ Template Quản Lý Vận Hành Và Đời Sống Miễn Phí",
      slug: "notion-workspace-template-mien-phi",
      description: "Tổng hợp các template Notion chuyên sâu về quản lý dự án, vận hành kinh doanh nhỏ và lập kế hoạch đời sống được thiết kế tinh gọn, dễ dùng.",
      type: "freebie",
      url: "https://notion.so/harryshare-templates",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
      featured: true,
      categoryId: catTools.id
    }
  ];
  for (const item of resourcesData) {
    await prisma.projectResource.create({ data: item });
  }

  // 7. Seed products (Skipped as requested)
  console.log('Seeding products... (Skipped as requested)');

  // 8. Seed Homepage Settings
  console.log('Seeding homepage settings...');
  await prisma.homepageSetting.create({
    data: {
      welcomeText: "👋 Chào bạn ghé thăm góc của Harry",
      title: "Hành trình Solopreneur: Ghi chép, Chia sẻ & Đồng hành",
      description: "Chào mừng bạn đến với góc nhỏ của Harry (Quang Hiếu). Đây là nơi mình ghi lại hành trình thực tế của một Solopreneur, chia sẻ những tài nguyên đúc kết có giá trị cao, và giới thiệu các giải pháp công nghệ đồng hành cùng sự phát triển của bạn.",
      pillar1Title: "1. Ghi lại hành trình",
      pillar1Desc: "Nhật ký ghi lại từng bước chân, những thử thách và bài học xương máu trên hành trình xây dựng sự nghiệp tự chủ của Harry.",
      pillar2Title: "2. Chia sẻ & Tặng quà",
      pillar2Desc: "Những công thức, tài liệu và bộ công cụ đắc lực được đúc kết từ thành tựu thực tế, sẵn sàng gửi tặng bạn để rút ngắn con đường tự học.",
      pillar3Title: "3. Kinh doanh & Đồng hành",
      pillar3Desc: "Giới thiệu các sản phẩm công nghệ chất lượng do mình sáng tạo và cơ hội hợp tác, đồng hành chuyên sâu cùng bạn bứt phá."
    }
  });

  // 9. Seed Hero Slideshow Images
  console.log('Seeding hero slideshow...');
  const slides = [
    { imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80", order: 0 },
    { imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", order: 1 },
    { imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80", order: 2 }
  ];
  for (const s of slides) {
    await prisma.heroSlide.create({ data: s });
  }

  // 10. Seed About Settings
  console.log('Seeding about settings...');
  await prisma.aboutSetting.create({
    data: {
      title: "Về Harry (Quang Hiếu)",
      subtitle: "📖 Câu chuyện của mình",
      avatarUrl: "/harry_Portrait.png",
      description: "Mình xuất thân là một dân IT - lập trình viên hướng ngoại, đam mê sáng tạo và giao tiếp. Hành trình tự học của mình là chuỗi ngày bền bỉ đi qua nhiều ngã rẽ sự nghiệp từ lập trình, kinh doanh cho đến Digital Marketing, với một mục tiêu duy nhất: kiến tạo nên những giá trị bền vững và mang lại những điều tốt lành cho mọi người xung quanh."
    }
  });

  // 11. Seed About Timeline Milestones
  console.log('Seeding about timeline milestones...');
  const timelineMilestones = [
    {
      period: "Năm 2026 - Nay",
      title: "Hành trình lập nghiệp hướng tới sản phẩm sạch & ẩm thực chay",
      role: "Lập nghiệp tự chủ",
      iconName: "Leaf",
      description: "Thực ra, ý tưởng về con đường riêng đã nhen nhóm trong mình từ trước, nhưng sau Tết 2026, mình quyết định đi từng bước chậm lại để chuẩn bị chu đáo nhất cho hành trình này. Không còn vội vã chạy theo những mục tiêu ngắn hạn, mình muốn hướng tới việc kinh doanh các sản phẩm sạch, phát triển nghề sản xuất nhang thảo mộc truyền thống của gia đình và mở một quán ăn chay lành mạnh giữa thiên nhiên bình yên. Mình nhận ra hạnh phúc thực sự là khi được gieo duyên lành và mang đến những giá trị an lành cho mọi người xung quanh.",
      lesson: "Bài học: Mình luôn tin rằng sự kiên trì và tinh thần học hỏi là yếu tố tạo ra giá trị bền vững trong công việc và cuộc sống.",
      order: 0
    },
    {
      period: "Năm 2026",
      title: "Bứt phá Marketing & Sáng tạo cùng AI tại CloudFly",
      role: "Marketer & AI Automation Leader",
      iconName: "Cloud",
      description: "Gia nhập CloudFly - một công ty công nghệ chuyên cung cấp cơ sở hạ tầng cloud. Tại đây, mình được đắm mình vào thế giới của công nghệ, AI và SEO website chuyên sâu. Với vai trò Leader team sáng tạo cùng AI và nghiên cứu tự động hóa (automation) cho marketing, mình không chỉ làm việc mà còn đồng hành và học cách tối ưu hóa hiệu suất cùng các trợ lý AI thông minh. Mỗi tối, mình vẫn kiên trì rèn luyện tiếng Anh qua Brainkey với ước mơ một ngày tự tin trò chuyện cùng bạn bè quốc tế.",
      lesson: "Bài học: Làm bạn với AI và ứng dụng tự động hóa là chìa khóa x10 hiệu suất công việc trong thời đại số.",
      order: 1
    },
    {
      period: "Năm 2025 - 2026",
      title: "Trưởng phòng Marketing tại Tâm An Spa",
      role: "Trưởng phòng Marketing (Online & Offline tại Sài Gòn)",
      iconName: "Sparkles",
      description: "Đảm nhận vị trí Trưởng phòng Marketing cho Tâm An Spa với sự linh hoạt giữa Sài Gòn và làm việc online. Mình trực tiếp lo từ phân tích thị trường, chụp ảnh, dựng video cho đến tối ưu quảng cáo và chăm sóc khách hàng. Thành tích đáng nhớ là xây dựng nội dung chất lượng thu hút hơn 80.000 người quan tâm và tối ưu chi phí quảng cáo xuống còn 34.000 VND/tin nhắn trong thị trường spa cực kỳ khốc liệt. Mình chọn dừng lại khi nhận ra việc ôm đồm quá nhiều mục tiêu sẽ dẫn đến kiệt sức mà không mang lại giá trị cao nhất.",
      lesson: "Bài học: Tập trung vào mục tiêu trọng điểm là cách tốt nhất để bảo toàn năng lượng và đạt hiệu quả tối ưu.",
      order: 2
    },
    {
      period: "Năm 2025",
      title: "Rèn luyện sự kiên trì chịu khó tại Rex Hotel",
      role: "Nhân viên phục vụ tiệc & buffet",
      iconName: "Coffee",
      description: "Một ngã rẽ thú vị khi mình làm nhân viên phục vụ, set up tiệc cưới và buffet sáng tại Rex Hotel. Công việc bưng bê chân tay vất vả, đòi hỏi sự kiên nhẫn cao và phục vụ khách hàng chuẩn chỉ. Được khách hàng yêu mến và phản hồi hài lòng là niềm vui lớn nhất mỗi ngày. Mình dừng công việc này do đợt cuối năm tăng ca liên tục khiến sức khỏe không đáp ứng nổi, nhưng những bài học giao tiếp tại đây vẫn là vô giá đối với mình sau này.",
      lesson: "Bài học: Rèn luyện lòng chịu khó và thấu hiểu khách hàng từ những công việc bình dị nhất.",
      order: 3
    },
    {
      period: "Năm 2025",
      title: "Xây dựng thương hiệu thực phẩm chay tại Vương Ngọc Vegan",
      role: "Content Creator & Bán hàng đa kênh",
      iconName: "ShoppingBag",
      description: "Mình phụ trách sáng tạo nội dung, xây dựng thương hiệu trên mạng xã hội, xây kênh TikTok và bán sản phẩm sạch của Vương Ngọc Vegan trên cả kênh truyền thống (GT) lẫn thương mại điện tử. Sau khi giúp tăng độ nhận diện và bán được hơn 300 sản phẩm sạch, mình chọn dừng sớm khi thấy định hướng lâu dài 5 năm của công ty không còn đồng nhất với các mục tiêu ngắn hạn của mình để tránh ảnh hưởng sâu vào hệ thống.",
      lesson: "Bài học: Dừng lại đúng lúc khi không còn chung định hướng phát triển là sự tôn trọng đối với cả hai bên.",
      order: 4
    },
    {
      period: "Năm 2024 - 2025",
      title: "Tư vấn giải pháp GoSell tại MediaStep Software Việt Nam",
      role: "Chuyên viên tư vấn phần mềm hỗ trợ doanh nghiệp",
      iconName: "HelpCircle",
      description: "Làm việc tại MediaStep Software, tư giúp các doanh nghiệp vừa và nhỏ tối ưu quy trình bán hàng và tăng lợi nhuận. Mình đã lắng nghe câu chuyện kinh doanh của hơn 50 khách hàng, có 10 khách gửi thư cảm ơn vì sự nhiệt tình của mình. Quyết định dừng lại khi chứng kiến bộ máy vận hành chèn ép nhân viên, vì mình tin rằng một doanh nghiệp không thể bền vững nếu thiếu đi sự tử tế với nhân sự của mình.",
      lesson: "Bài học: Phần mềm tốt thôi chưa đủ, bộ máy vận hành nhân văn mới là nền tảng của sự phát triển.",
      order: 5
    },
    {
      period: "Năm 2024",
      title: "Quản lý vận hành & Nghiên cứu món mới tại Quán Chay Ưu Đàm",
      role: "Quản lý vận hành, điều phối bếp và order",
      iconName: "Utensils",
      description: "Dưới sự dẫn dắt của chị 2, mình đảm nhận việc quản lý vận hành, điều phối bếp và order tại Quán Chay Ưu Đàm. Mình trực tiếp chuẩn hóa quy trình phục vụ, lắng nghe phản hồi của khách và thử nghiệm nghiên cứu ra các món chay mới. Nhìn quán đón nhận hơn 30 khách trung thành ghé ủng hộ mỗi tuần mang lại cho mình động lực lớn. Mình dừng công việc để tiếp tục học hỏi thêm các công thức nấu chay mới.",
      lesson: "Bài học: Vận hành quán ăn thành công đòi hỏi sự chặt chẽ trong quy trình và cái tâm đặt vào từng hương vị món ăn.",
      order: 6
    },
    {
      period: "Năm 2024",
      title: "Tự nghiên cứu & Sản xuất tại Thảo Mộc Hương T&T",
      role: "Nhà sáng lập dự án thảo mộc",
      iconName: "Sprout",
      description: "Khởi nguồn từ tình yêu với sản phẩm tự nhiên, mình tự tay nghiên cứu công thức, sản xuất nhang thảo mộc và làm marketing, bán hàng cho thương hiệu Thảo Mộc Hương T&T. Bằng sức trẻ, mình thu hút được hơn 300 khách hàng từ mạng xã hội, tạo ra những sản phẩm thảo mộc được khách hàng rất ưa chuộng. Tuy nhiên, dự án phải tạm dừng sau 3 tháng do những khó khăn lớn về nguồn vốn, sức khỏe và nhân sự vận hành.",
      lesson: "Bài học: Khởi nghiệp dạy cho mình bài học xương máu về quản trị rủi ro, dòng vốn và sự kiên cường khi đối mặt với thất bại.",
      order: 7
    },
    {
      period: "Năm 2022 - 2023",
      title: "Hoạt động cộng đồng tại Đoàn Xã Duy Sơn",
      role: "Thành viên Hội LHTN xã Duy Sơn",
      iconName: "Award",
      description: "Muốn đóng góp sức trẻ cho quê hương Duy Xuyên, mình tham gia Hội LHTN xã Duy Sơn với vai trò huynh trưởng quản trò sinh hoạt hè và phát triển đoàn. Mình đã thiết kế website phục vụ công tác đoàn thanh niên xã (lọt Top 3 website xuất sắc của xã) và vinh dự nhận được 3 giấy khen thanh niên tiêu biểu năm 2023. Đây là khoảng thời gian tuyệt đẹp giúp mình cải thiện kỹ năng dẫn chương trình, làm việc nhóm và giao tiếp tự tin trước đám đông.",
      lesson: "Bài học: Mang kiến thức công nghệ phục vụ cộng đồng và gieo những hạt mầm tích cực cho thế hệ trẻ.",
      order: 8
    },
    {
      period: "Năm 2022 - 2023",
      title: "Lập trình viên Front-end (Freelance Developer)",
      role: "Front-end Developer",
      iconName: "Code",
      description: "Ngay sau khi tốt nghiệp chuyên ngành Công nghệ phần mềm vào tháng 7/2022, mình bắt đầu làm Freelance Developer, lập trình giao diện bằng HTML, CSS, JavaScript (React.js). Công việc kỹ thuật này giúp rèn luyện tư duy logic tốt, nhưng sau 6 tháng ngồi một chỗ liên tục ôm laptop, mình bị đau nhức và cảm thấy quá chán nản. Mình nhận ra tính cách hướng ngoại của bản thân cần một môi trường năng động và kết nối con người nhiều hơn là làm coder thuần túy.",
      lesson: "Bài học: Lắng nghe tiếng nói của cơ thể và dũng cảm bước ra khỏi vùng an toàn khi nhận ra con đường hiện tại không còn phù hợp.",
      order: 9
    }
  ];
  for (const m of timelineMilestones) {
    await prisma.aboutTimeline.create({ data: m });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
