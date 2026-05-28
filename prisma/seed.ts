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
      title: "Tư duy Product-Led Growth cho Solopreneur",
      slug: "tu-duy-product-led-growth-cho-solopreneur",
      description: "Làm sao để sản phẩm của bạn tự bán chính nó? Khám phá cách Solopreneur áp dụng mô hình Product-Led Growth để phát triển bền vững.",
      content: "## Giới thiệu về Product-Led Growth (PLG)\n\nProduct-Led Growth (Tăng trưởng dẫn dắt bằng sản phẩm) là một chiến lược kinh doanh trong đó **sản phẩm chính là động lực thúc đẩy chính** cho việc thu hút khách hàng, chuyển đổi và giữ chân người dùng. Đối với một Solopreneur (người khởi nghiệp đơn độc), PLG không chỉ là một chiến lược mà còn là phao cứu sinh giúp bạn tối ưu hóa thời gian và nguồn lực hạn hẹp của mình.\n\n### Tại sao Solopreneur cần PLG?\n\nKhi bạn làm việc một mình, bạn không thể vừa code sản phẩm, vừa làm marketing 24/7, vừa chăm sóc khách hàng bằng tay. Bạn cần một cỗ máy tự vận hành:\n1. **Tiết kiệm chi phí**: Giảm thiểu chi phí chạy quảng cáo đắt đỏ.\n2. **Tự động hóa phễu bán hàng**: Người dùng trải nghiệm và tự nâng cấp lên bản trả phí.\n3. **Độ tin cậy cao**: Khách hàng tin vào trải nghiệm thực tế hơn là những lời quảng cáo sáo rỗng.\n\n### Các bước áp dụng PLG cho sản phẩm của bạn\n\n#### 1. Thiết lập trải nghiệm \"Aha! Moment\" cực nhanh\n\"Aha! Moment\" là khoảnh khắc người dùng lần đầu tiên nhận ra giá trị cốt lõi của sản phẩm.\n- **Lời khuyên**: Hãy loại bỏ mọi rào cản đăng ký rườm rà. Hãy cho họ trải nghiệm tính năng tốt nhất ngay lập tức.\n- *Ví dụ*: Đối với một công cụ tạo ảnh bằng AI, hãy cho họ tạo thử 3 ảnh miễn phí mà không cần bắt nhập thẻ tín dụng hay xác thực email phức tạp.\n\n#### 2. Xây dựng cơ chế lan truyền (Viral Loops)\nHãy tạo điều kiện để người dùng hiện tại giới thiệu thêm người dùng mới.\n- **Mã mời nhận quà**: Giống như Dropbox hay Airbnb đã từng làm.\n- **Watermark tinh tế**: Khi người dùng xuất báo cáo hoặc sản phẩm từ công cụ của bạn, hãy đính kèm logo nhỏ gọn dẫn về website của bạn.\n\n#### 3. Thu thập phản hồi liên tục và lặp đi lặp lại\nĐừng đoán khách hàng muốn gì. Hãy nhìn cách họ tương tác với sản phẩm qua các công cụ đo lường (như Hotjar hoặc Mixpanel) và lắng nghe trực tiếp từ hòm thư góp ý.\n\nChúc các bạn Solopreneur sớm xây dựng được sản phẩm tự tăng trưởng bền vững!",
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      date: new Date("2026-05-10T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 124,
      likes: 42,
      shares: 12
    },
    {
      title: "Xây dựng thương hiệu cá nhân bền vững từ số 0",
      slug: "xay-dung-thuong-hieu-ca-nhan-ben-vung-tu-so-0",
      description: "Thương hiệu cá nhân không phải là phô trương. Nó là việc bạn kiên trì chia sẻ giá trị thực của mình đến đúng đối tượng.",
      content: "## Thương hiệu cá nhân là gì?\n\nNhiều người lầm tưởng rằng xây dựng thương hiệu cá nhân là phải làm video nhảy múa trên TikTok, hay viết những bài viết bóng bẩy kể về thành công trên LinkedIn. Thực chất:\n> \"Thương hiệu cá nhân là những gì người ta nói về bạn khi bạn không có mặt ở trong phòng.\" - Jeff Bezos\n\nNó là sự tích lũy niềm tin từ cộng đồng thông qua giá trị thực tế mà bạn mang lại.\n\n---\n\n### Phân tích 3 trụ cột của thương hiệu cá nhân bền vững\n\n#### 1. Định vị bản thân (Positioning)\nBạn muốn người khác nhớ đến mình vì chuyên môn gì? Hãy chọn một ngách đủ hẹp nhưng có nhu cầu đủ lớn.\n*Thay vì*: \"Tôi là Lập trình viên Full-stack\"\n*Hãy chọn*: \"Tôi là Lập trình viên giúp các Solopreneur xây dựng SaaS siêu tốc bằng Next.js và Supabase\".\n\n#### 2. Nhất quán và Kiên trì (Consistency)\nKhông quan trọng bạn viết hay đến đâu, nếu bạn chỉ viết 1 bài mỗi tháng rồi biến mất, không ai nhớ đến bạn.\n- Tạo lịch đăng bài cố định (ví dụ: Thứ Ba và Thứ Sáu hàng tuần).\n- Sử dụng phong cách thiết kế, phông chữ và tông giọng (tone of voice) đồng nhất trên tất cả các kênh.\n\n#### 3. Chia sẻ giá trị \"Behind the scenes\"\nĐừng chỉ khoe kết quả mỹ mãn. Hãy chia sẻ hành trình bạn giải quyết vấn đề, những lỗi sai ngớ ngẩn bạn đã mắc và cách bạn vượt qua nó. Sự tổn thương và tính chân thực chính là chất keo kết nối mạnh mẽ nhất giữa bạn và độc giả.\n\n### Bắt đầu từ đâu?\n\n1. **Viết blog cá nhân**: Đừng phụ thuộc hoàn toàn vào Facebook hay LinkedIn. Một website cá nhân (như trang HarryShare này) chính là ngôi nhà số đích thực của bạn.\n2. **Chia sẻ miễn phí**: Trao đi trước khi nhận lại. Tạo ra các checklist, cẩm nang chất lượng và gửi tặng độc giả của bạn.\n3. **Lắng nghe tích cực**: Trò chuyện, phản hồi bình luận và giải đáp thắc mắc của độc giả chân thành.\n\nThương hiệu cá nhân không thể xây dựng sau một đêm. Hãy tận hưởng hành trình này!",
      coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      readTime: 8,
      published: true,
      date: new Date("2026-05-15T00:00:00.000Z"),
      categoryId: catPersonalBranding.id,
      views: 95,
      likes: 31,
      shares: 8
    },
    {
      title: "Vibe Coding - Kỷ nguyên mới của các nhà sáng tạo công nghệ",
      slug: "vibe-coding-ky-nguyen-moi-cua-cac-nha-sang-tao-cong-nghe",
      description: "Lập trình viên tương lai sẽ không viết code từng dòng nữa. Chúng ta sẽ \"vibe\" cùng AI để biến ý tưởng thành sản phẩm thực tế chỉ trong vài phút.",
      content: "## Khái niệm \"Vibe Coding\" bắt nguồn từ đâu?\n\nThời gian gần đây, thuật ngữ **Vibe Coding** nổi lên như một hiện tượng trong giới công nghệ toàn cầu. Nó dùng để mô tả phong cách lập trình mới: Con người giữ vai trò kiến trúc sư, chỉ đạo ý tưởng và thiết kế giao diện, trong khi AI chịu trách nhiệm viết từng dòng mã nguồn, sửa lỗi (debugging) và triển khai (deployment).\n\nBạn không cần phải căng thẳng ngồi gõ phím cành cạch suốt đêm nữa. Bạn chỉ cần giữ tâm thế thư thái, \"vibe\" cùng AI và định hướng sản phẩm.\n\n---\n\n### Sự dịch chuyển kỹ năng của Lập trình viên hiện đại\n\nTrong kỷ nguyên Vibe Coding, kỹ năng viết cú pháp (syntax) ngôn ngữ lập trình không còn là lợi thế độc quyền. Những kỹ năng sau đây sẽ lên ngôi:\n\n1. **Tư duy sản phẩm (Product Mindset)**: Biết khách hàng thực sự cần gì, thiết kế luồng trải nghiệm (user flow) sao cho tối ưu và đơn giản nhất.\n2. **Khả năng giao tiếp với AI (Prompt Engineering)**: Biết cách mô tả chi tiết, rõ ràng và logic để AI hiểu đúng thiết kế hệ thống và tạo ra code chuẩn xác.\n3. **Khả năng đọc hiểu và thẩm định hệ thống**: Bạn không cần viết code, nhưng bạn phải hiểu cấu trúc hệ thống để biết AI đang làm đúng hay sai và định hướng gỡ lỗi khi có sự cố.\n\n### Trải nghiệm thực tế của Harry\n\nTrang web HarryShare.vn này cùng toàn bộ các tính năng chatbot AI nổi, trình phát nhạc sáo trúc và hệ thống Admin Dashboard đều được mình phát triển thông qua việc tận dụng triệt để sức mạnh của các trợ lý AI. Mình chỉ cần lên kế hoạch chi tiết, phác thảo thiết kế và chỉ dẫn AI thực hiện từng module nhỏ một cách khoa học.\n\nKết quả là một ứng dụng Next.js hoàn thiện cực kỳ premium được hoàn thành chỉ trong vòng chưa đầy 1 ngày! Đây là minh chứng rõ nét cho thấy bất kỳ ai có tư duy sản phẩm tốt đều có thể tạo ra những phần mềm tuyệt đẹp và có giá trị cao mà không bị giới hạn bởi rào cản kỹ thuật.\n\nHãy đón nhận làn sóng này và trở thành một siêu chiến binh công nghệ mới nhé!",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-18T00:00:00.000Z"),
      categoryId: catAiVibeCoding.id,
      views: 312,
      likes: 89,
      shares: 24
    },
    {
      title: "Hành trình từ cậu bé phục vụ bàn đến Solopreneur tự do",
      slug: "hanh-trinh-tu-cau-be-phuc-vu-ban-den-solopreneur-tu-do",
      description: "Nhìn lại chặng đường 10 năm bôn ba qua đủ nghề: Phục vụ bàn, bán áo thun POD, lập trình tự do, làm marketing và cuối cùng là tự xây dựng sản phẩm của riêng mình.",
      content: "## Bắt đầu từ vạch âm: Cậu bé chạy bàn quán cà phê\n\nMười năm trước, khi mới chân ướt chân ráo bước vào đời, công việc đầu tiên của mình là chạy bàn tại một quán cà phê nhỏ với mức lương ít ỏi. Lúc đó, khái niệm \"công nghệ\", \"start-up\" hay \"tự do tài chính\" là một điều gì đó vô cùng xa xỉ. \n\nNhưng chính những năm tháng bê nước dọn bàn, chịu đựng những phàn nàn của khách hàng đã dạy cho mình bài học đầu tiên cực kỳ quý giá về **dịch vụ khách hàng** và **sự kiên nhẫn**.\n\n---\n\n### Các cột mốc đáng nhớ trong hành trình 10 năm\n\n#### Giai đoạn 1: Bán áo thun Print-On-Demand (POD)\nSau khi gom góp được chút vốn, mình tập tành kinh doanh POD cho thị trường Mỹ. Đây là lần đầu tiên mình học về thiết kế đồ họa cơ bản, chạy quảng cáo Facebook và hiểu thế nào là thương mại điện tử quốc tế. Có những lúc kiếm được tiền, nhưng cũng có lúc tài khoản quảng cáo bị khóa sạch, vốn liếng bay màu.\n\n#### Giai đoạn 2: Lập trình tự do (Freelance Developer)\nNhận ra công nghệ là tương lai, mình tự học lập trình web. Những đêm thức trắng sửa bug đến mờ mắt để kịp bàn giao cho khách hàng nước ngoài trên Upwork. Freelance đem lại thu nhập tốt nhưng mình nhanh chóng nhận ra: *Mình vẫn đang bán thời gian lấy tiền. Nếu dừng làm việc, nguồn thu nhập cũng biến mất.*\n\n#### Giai đoạn 3: Rẽ hướng làm Content & Marketing\nKhông dừng lại ở việc code thuê, mình đi sâu vào nghiên cứu phễu marketing, SEO và tâm lý học hành vi của khách hàng. Sự kết hợp giữa kỹ năng lập trình và tư duy marketing đã tạo ra một bước ngoặt lớn trong sự nghiệp của mình.\n\n#### Giai đoạn 4: Trở thành Solopreneur (Xây dựng sản phẩm riêng)\nHiện tại, mình đang tự vận hành các dự án cá nhân, viết blog chia sẻ kiến thức và xây dựng các sản phẩm SaaS nhỏ hỗ trợ cộng đồng. Không còn sếp, không còn deadline áp đặt từ người khác, mình tự do sáng tạo và chịu trách nhiệm 100% cho cuộc đời mình.\n\n### Lời nhắn gửi từ Harry\n\n> \"Hành trình ngàn dặm luôn bắt đầu từ một bước chân nhỏ bé.\"\n\nNếu bạn đang cảm thấy bế tắc trong công việc hiện tại, hãy nhớ rằng mọi kỹ năng bạn học được hôm nay - dù là nhỏ nhất như giao tiếp, viết lách hay chỉnh sửa ảnh - đều sẽ là những mảnh ghép vô cùng quan trọng cho bức tranh thành công của bạn trong tương lai.\n\nHãy kiên trì đi con đường của mình nhé!",
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      readTime: 10,
      published: true,
      date: new Date("2026-05-20T00:00:00.000Z"),
      categoryId: catCareerJourney.id,
      views: 220,
      likes: 67,
      shares: 19
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
        content: "Bài viết rất chất lượng anh ơi! Em cũng đang tự học phát triển SaaS và thấy tư duy này cực kỳ đúng đắn.",
        approved: true
      }
    });

    await prisma.comment.create({
      data: {
        postId: post.id,
        authorName: "Minh Trang",
        authorEmail: "trangm@yahoo.com",
        content: "Cảm ơn tác giả đã chia sẻ hành trình thực tế đầy cảm hứng này.",
        approved: false // Chưa duyệt
      }
    });
  }

  // 6. Seed project resources
  console.log('Seeding project resources...');
  const resourcesData = [
    {
      title: "Lovable AI - Trợ lý phát triển Web App thần tốc",
      slug: "lovable-ai-tro-ly-web-app",
      description: "Nền tảng giúp bạn xây dựng và tùy biến giao diện website, ứng dụng web bằng ngôn ngữ tự nhiên cực nhanh và mượt mà.",
      type: "tool",
      url: "https://lovable.dev",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      featured: true,
      categoryId: catTools.id
    },
    {
      title: "SEO Checklist toàn diện cho Solopreneur",
      slug: "seo-checklist-solopreneur",
      description: "Tài liệu hướng dẫn từng bước tối ưu hóa website của bạn lên top Google mà không cần ngân sách quảng cáo lớn.",
      type: "freebie",
      url: "https://example.com/download-seo",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
      featured: true,
      categoryId: catDocuments.id
    },
    {
      title: "Checklist Xây dựng Thương hiệu Cá nhân",
      slug: "checklist-personal-branding",
      description: "Bộ khung hành động giúp bạn định vị bản thân và thu hút 10,000 độc giả trung thành đầu tiên sau 6 tháng.",
      type: "freebie",
      url: "https://example.com/download-brand",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
      featured: false,
      categoryId: catDocuments.id
    }
  ];
  for (const item of resourcesData) {
    await prisma.projectResource.create({ data: item });
  }

  // 7. Seed products
  console.log('Seeding products...');
  
  // Main Product (Sản phẩm chính chủ)
  const productBook = await prisma.product.create({
    data: {
      title: "Sách giấy: Hành trình của một Solopreneur",
      slug: "sach-hanh-trinh-solopreneur",
      description: "Bản đồ chi tiết hướng dẫn bạn từng bước tự xây dựng hệ thống sản phẩm số từ số 0 để đạt được tự do trong cuộc sống.",
      content: "### Giới thiệu về Cuốn sách\n\nCuốn sách này đúc kết toàn bộ hành trình 10 năm lăn lộn qua đủ ngành nghề của Harry để trở thành một Solopreneur thành công. Đây không chỉ là một cuốn sách lý thuyết, mà là một cẩm nang thực chiến chứa đầy biểu đồ, check-list và ví dụ thực tế.\n\n### Bạn sẽ học được gì từ cuốn sách?\n\n- **Chương 1**: Vượt qua rào cản tâm lý từ làm thuê sang làm chủ.\n- **Chương 2**: Phương pháp tìm kiếm ý tưởng sản phẩm ngách có lợi nhuận cao.\n- **Chương 3**: Quy trình đóng gói sản phẩm và định giá tối ưu.\n- **Chương 4**: Cách tự thiết lập hệ thống Marketing tự vận hành.\n\n### Cách thức đặt hàng\n\nHiện tại cuốn sách đang được phát hành giới hạn. Bạn hãy điền vào form đặt hàng bên cạnh, tôi sẽ chủ động liên hệ gửi sách và tặng kèm bộ tài liệu bổ trợ qua Email cho bạn.",
      price: 199000,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
      type: "main",
      featured: true,
      categoryId: catBooksCourses.id
    }
  });

  // Affiliate Product
  await prisma.product.create({
    data: {
      title: "Cursor - Trình soạn thảo Code tích hợp AI đỉnh nhất hiện nay",
      slug: "cursor-ai-code-editor",
      description: "Công cụ code thông minh nhất thế giới giúp tăng 200% hiệu suất lập trình của bạn nhờ sự hỗ trợ đắc lực của mô hình ngôn ngữ lớn ngay trong IDE.",
      content: "### Tại sao Cursor lại thay thế VS Code?\n\nCursor là một bản fork hoàn hảo của VS Code, có nghĩa là tất cả các extensions, phím tắt và settings yêu thích của bạn đều hoạt động ngay lập tức. Nhưng sức mạnh thực sự của Cursor nằm ở AI được tích hợp sâu sắc:\n\n- **Copilot++**: Tự động dự đoán dòng code tiếp theo dựa trên hành vi thực tế của bạn.\n- **Chat trực tiếp với Codebase**: Hỏi AI về bất kỳ hàm hoặc cấu trúc nào trong toàn bộ thư mục dự án.\n- **Tự động sửa lỗi**: AI giải mã log lỗi terminal và tự động áp dụng bản sửa lỗi chỉ với 1 click.\n\n### Đăng ký sử dụng qua link giới thiệu dưới đây để nhận ưu đãi sử dụng bản Pro thử nghiệm miễn phí.",
      price: null,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80",
      type: "affiliate",
      affiliateUrl: "https://cursor.sh/?via=harry",
      featured: true,
      categoryId: catAiSaaS.id
    }
  });

  // Seed sample order
  await prisma.productOrder.create({
    data: {
      productId: productBook.id,
      customerName: "Nguyễn Văn Hùng",
      customerEmail: "vanhung@gmail.com",
      customerPhone: "0987654321",
      note: "Vui lòng ký tặng cho mình vào sách nhé!",
      status: "pending"
    }
  });

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
