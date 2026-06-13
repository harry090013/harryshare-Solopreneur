import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting custom database seed...');

  // Only seed if database is empty to prevent overwriting user changes
  const postCount = await prisma.post.count();
  if (postCount > 0) {
    console.log('Database already has data. Skipping seed to protect user modifications.');
    return;
  }

  console.log('Database is empty. Proceeding with seed...');

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
      name: "Công nghệ & AI",
      slug: "cong-nghe-ai",
      description: "Khám phá thế giới công nghệ, ứng dụng trí tuệ nhân tạo để tối ưu hóa cuộc sống và công việc.",
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
      title: "Vì sao mình tạo HarryShare?",
      slug: "vi-sao-minh-tao-harryshare",
      description: "Trải lòng của Quang Hiếu về lý do bắt đầu trang blog HarryShare – cuốn nhật ký công khai ghi lại hành trình học hỏi, làm việc và định vị bản thân giữa cuộc sống nhiều biến động.",
      content: `Đã có lúc mình tự hỏi, tại sao con người lại có nhu cầu ghi chép nhiều đến thế? Có người viết nhật ký bằng sổ tay, có người chụp ảnh, có người lưu giữ bằng những dòng trạng thái ngắn trên mạng xã hội. Bản thân mình trước đây thường giữ mọi suy nghĩ trong đầu. Là một người có xu hướng overthinking, đầu óc mình giống như một căn phòng chứa đầy những mảnh lego rời rạc, lúc nào cũng tự sắp xếp, tự suy diễn rồi lại tự phá bỏ. Sự luẩn quẩn đó đôi khi khiến mình kiệt sức. Cho đến một ngày, mình nhận ra nếu không viết chúng ra, những suy nghĩ ấy sẽ mãi mãi bị giam cầm và đè nặng lên tâm trí mình mỗi ngày.

Mình chỉ muốn có một nơi để ghi lại mọi thứ.

Chỉ đơn giản là đặt xuống những suy nghĩ, những trải nghiệm, những bài học và cả những lần thử sai trên hành trình trưởng thành. Đó chính là lý do đầu tiên và giản dị nhất để HarryShare ra đời. 

Mình là Quang Hiếu (mọi người vẫn hay gọi là Harry). Mình xuất thân từ dân IT, tốt nghiệp chuyên ngành phần mềm, nhưng rồi dòng đời đưa đẩy và bản thân lựa chọn rẽ lối sang làm Marketing. Đến nay, mình đã có khoảng 2 năm kinh nghiệm làm Marketing trong môi trường công nghệ. Trên hành trình đi qua những ngã rẽ đó, mình đã trải nghiệm nhiều môi trường khác nhau, từ những công việc tay chân như phục vụ nhà hàng, đến tư vấn giải pháp phần mềm cho doanh nghiệp, rồi tự tay làm marketing cho thương hiệu nhang thảo mộc truyền thống lâu đời của gia đình. 

Mỗi chặng đường đi qua đều để lại cho mình những vết sẹo và cả những bông hoa. Có những lần thất bại vì thiếu vốn, thiếu kinh nghiệm vận hành; có những khi kiệt sức vì ôm đồm quá nhiều thứ; và cũng có cả những khoảnh khắc hạnh phúc khi sản phẩm mình làm ra được khách hàng trân quý đón nhận. Tất cả những điều đó đã nhào nặn nên mình của ngày hôm nay: một người trẻ biết nhìn nhận cuộc sống một cách lý trí hơn, trưởng thành hơn và luôn cố gắng tìm kiếm góc nhìn tích cực trong mọi hoàn cảnh.

Nhiều người hỏi mình xây dựng HarryShare để làm gì? Có phải để làm thương hiệu cá nhân để sau này bán hàng, lùa gà hay bán khóa học không? 

Mình muốn làm rõ một điều ngay từ đầu: HarryShare tuyệt đối không phải là một trang blog dạy đời. Mình không đứng trên sân khấu để khuyên bảo ai phải sống thế này hay thế kia. Mình viết trang web này trước hết là viết cho chính bản thân mình trước. Mình viết cho Quang Hiếu của 10 năm sau đọc lại, để sau này nhìn lại chặng đường tuổi trẻ, mình biết mình đã từng trăn trở điều gì, đã nỗ lực ra sao và đã không bỏ cuộc như thế nào.

Mình tin vào triết lý "cho đi trước, nhận lại sau". Nếu trong lúc mình ghi chép cho chính mình, có một ai đó vô tình ghé qua đây, đọc được những câu chuyện của mình, thấy bóng dáng họ trong đó và học hỏi được điều gì đó hữu ích cho công việc hay cuộc sống của họ, thì đó là giá trị tốt lành mà mình rất hạnh phúc khi chia sẻ được.

Về lâu dài, mình cũng có ước mơ xây dựng một doanh nghiệp tử tế của riêng mình, phát triển những sản phẩm sạch gắn liền với thiên nhiên – như truyền thống làm nhang thảo mộc của gia đình. Nhưng đó là câu chuyện của tương lai, khi mình đã tích lũy đủ năng lực, sự chín chắn và lòng tin bền vững từ mọi người. Còn hiện tại, mình chỉ muốn bắt đầu bằng sự chân thật nhất: viết thật, học thật và chia sẻ những giá trị thực tế.

Cảm ơn bạn đã ghé thăm góc nhỏ của mình. Hy vọng bạn sẽ tìm thấy một chút bình yên hoặc một góc nhìn mới mẻ tại HarryShare.`,
      coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-30T00:00:00.000Z"),
      categoryId: catCareerJourney.id,
      views: 45,
      likes: 12,
      shares: 3,
      comments: [
        {
          authorName: "Đức Anh",
          authorEmail: "ducanh@gmail.com",
          content: "Đọc những dòng tự sự của anh Hiếu thấy bình yên lạ kỳ. Chúc anh luôn vững vàng trên hành trình Solopreneur này và lan tỏa nhiều giá trị hơn nữa nhé.",
          approved: true
        },
        {
          authorName: "Minh Trang",
          authorEmail: "trangm@yahoo.com",
          content: "Rất đồng cảm với câu 'chỉ muốn có một nơi để ghi lại mọi thứ'. Nhiều khi viết ra là cách tốt nhất để đối thoại với chính mình.",
          approved: true
        }
      ]
    },
    {
      title: "Mình mê công nghệ vì mình thích giải quyết vấn đề",
      slug: "minh-me-cong-nghe-vi-thich-giai-quyet-van-de",
      description: "Công nghệ chỉ thực sự đẹp khi nó phục vụ cuộc sống và giải quyết các bài toán thực tế. Chia sẻ góc nhìn thực tế của một người mê công nghệ và cách ứng dụng AI làm bạn đồng hành tư duy.",
      content: `Hồi còn đi học chuyên ngành Công nghệ phần mềm, mình từng bị cuốn vào những thuật toán phức tạp, những dòng code dài dằng dặc và các định nghĩa kỹ thuật cao siêu. Lúc đó, mình nghĩ công nghệ là một thế giới xa vời dành cho những bộ óc siêu việt. Nhưng sau khi ra trường, đi làm và bắt đầu cọ xát với thực tế kinh doanh, thế giới quan của mình về công nghệ đã thay đổi hoàn toàn.

Mình nhận ra mình mê công nghệ không phải vì muốn tỏ ra sành điệu hay theo kịp xu hướng. Mình mê công nghệ đơn giản vì mình thích giải quyết vấn đề.

Đối với mình, công nghệ hay nhất khi nó làm cuộc sống của chúng ta nhẹ nhàng hơn, giúp những công việc phức tạp trở nên trơn tru và hiệu quả hơn. Khi nhìn thấy ai đó đang loay hoay với một quy trình thủ công lặp đi lặp lại, hoặc gặp khó khăn trong việc quản lý dữ liệu, mình luôn cảm thấy tò mò. Mình thích đi tìm câu trả lời tối ưu nhất cho những bài toán đó bằng cách tận dụng sức mạnh của phần mềm và tự động hóa.

Trong thời đại số hiện nay, sự phát triển của trí tuệ nhân tạo (AI) đã mở ra những khả năng hoàn toàn mới. Mình không xem AI như một thứ phép màu có thể thay thế con người hoàn toàn, mà coi nó như một người bạn đồng hành suy nghĩ (thinking partner). 

Mỗi ngày làm việc, khi đối mặt với một chiến dịch Marketing mới hay một vấn đề kỹ thuật trên website, mình thường ngồi "thảo luận" với các công cụ AI như ChatGPT, Claude hay Gemini. Mình đặt câu hỏi, phản biện lại câu trả lời của AI và cùng nó bóc tách từng khía cạnh của vấn đề. Cách làm việc này giúp mình bớt overthinking, sắp xếp lại suy nghĩ ngăn nắp hơn và đưa ra quyết định nhanh hơn rất nhiều.

Tuy nhiên, mình luôn giữ một nguyên tắc rõ ràng khi sử dụng công nghệ: một công cụ tốt không được làm mình lười đi, mà phải giúp tư duy của mình rõ ràng hơn. Nếu chúng ta chỉ phụ thuộc vào AI để nó làm thay mọi thứ mà không chịu suy nghĩ sâu xa, chúng ta sẽ dần đánh mất khả năng giải quyết vấn đề thực tế. Công nghệ chỉ là phương tiện, con người mới là thực thể định hướng và ra quyết định.

Đừng học công nghệ vì nỗi sợ bị bỏ lại phía sau (FOMO). Hãy học công nghệ vì bạn muốn tìm một giải pháp tốt hơn cho cuộc sống và công việc của mình mỗi ngày. Khi bạn thay đổi góc nhìn từ "học công cụ" sang "giải quyết vấn đề", bạn sẽ thấy công nghệ trở nên gần gũi, thực tế và thú vị hơn rất nhiều.`,
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      readTime: 4,
      published: true,
      date: new Date("2026-05-29T00:00:00.000Z"),
      categoryId: catAiVibeCoding.id,
      views: 38,
      likes: 15,
      shares: 2,
      comments: [
        {
          authorName: "Quốc Bảo",
          authorEmail: "quocbao@gmail.com",
          content: "Thích góc nhìn thực tế này của anh. Công nghệ đúng là nên làm cuộc sống nhẹ đi chứ không phải làm mình rối hơn.",
          approved: true
        },
        {
          authorName: "Thu Thảo",
          authorEmail: "thuthao@gmail.com",
          content: "Em cũng đang tập cách dùng AI như một thinking partner. Công nhận nó giúp bớt overthinking và mở rộng góc nhìn rất nhiều.",
          approved: true
        }
      ]
    },
    {
      title: "Vì sao một dân IT như mình lại chọn Marketing?",
      slug: "vi-sao-dan-it-nhu-minh-lai-chon-marketing",
      description: "Chia sẻ chân thực về hành trình chuyển mình từ một lập trình viên thích giao tiếp sang thế giới của Marketing, và cách tư duy logic giúp giải quyết các bài toán thương hiệu.",
      content: `Khi mình quyết định dừng công việc lập trình freelance để bước sang làm Marketing, rất nhiều bạn bè và đồng nghiệp cũ đã ngạc nhiên. Họ hỏi mình: "Đang làm coder ngồi máy lạnh gõ code lương ổn định, sao lại nhảy sang làm cái ngành suốt ngày phải chạy theo deadline quảng cáo, viết bài viết lách làm gì cho mệt?".

Thực ra, quyết định đó không phải là một sự bộc phát hay "bộc lộ thất bại". Đó là kết quả của một quá trình tự quan sát bản thân sâu sắc.

Ngay sau khi tốt nghiệp chuyên ngành Công nghệ phần mềm, mình dành hơn nửa năm làm freelance developer. Công việc viết code giúp mình rèn luyện tư duy logic rất tốt, nhưng việc ngồi một chỗ liên tục 8-10 tiếng trước màn hình laptop khiến cơ thể mình lên tiếng và bản thân cảm thấy thiếu thốn sự kết nối con người. Mình nhận ra mình là một người hướng ngoại, thích giao tiếp, thích quan sát tâm lý con người và mong muốn nhìn thấy sản phẩm mình làm ra mang lại giá trị trực tiếp cho khách hàng như thế nào. Và thế là, mình chọn Marketing làm ngã rẽ tiếp theo.

Khi mới bắt đầu bước vào Marketing, mình cũng từng gặp nhiều bỡ ngỡ. Nhưng rất nhanh sau đó, mình phát hiện ra nền tảng IT không hề mất đi. Ngược lại, nó là một lợi thế cực kỳ lớn giúp mình làm Marketing khác biệt:

Thứ nhất, đó là **tư duy hệ thống và logic**. Marketing hiện đại không chỉ có sự bay bổng của ngôn từ hay hình ảnh. Nó cần dữ liệu, cần đo lường và tối ưu hóa hệ thống. Khi lập kế hoạch SEO website, thiết lập các phễu marketing tự động (marketing automation) hay phân tích hành vi người dùng trên trang web, mình sử dụng chính tư duy phân tích của một lập trình viên để bóc tách số liệu.

Thứ hai, đó là **khả năng tự xây dựng giải pháp**. Nhờ biết code và hiểu cấu trúc web, mình có thể tự tay tối ưu trải nghiệm người dùng (UX/UI) trên website mà không cần phải chờ đợi hay phụ thuộc vào đội ngũ kỹ thuật. Việc thấu hiểu cách vận hành của hệ thống giúp mình triển khai các chiến dịch online marketing nhanh chóng và mượt mà hơn.

Đối với mình, Marketing không phải là việc làm màu hay tìm cách quảng cáo quá sự thật để bán được hàng. Marketing chân chính là thấu hiểu sâu sắc nỗi đau của khách hàng và dùng tư duy sản phẩm để mang đến cho họ giải pháp phù hợp nhất. Nền tảng IT giúp mình xây dựng phần "xương cốt" vững chắc về kỹ thuật và dữ liệu, còn Marketing cho mình phần "hồn" để kết nối cảm xúc với con người.

Mình không hề bỏ lại IT phía sau. Mình chỉ đơn giản là mang theo tư duy kỹ thuật đi cùng trên hành trình chinh phục thế giới Marketing rộng lớn.`,
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-28T00:00:00.000Z"),
      categoryId: catPersonalBranding.id,
      views: 52,
      likes: 21,
      shares: 4,
      comments: [
        {
          authorName: "Hoàng Nam",
          authorEmail: "hoangnam@gmail.com",
          content: "Điểm giao thoa giữa logic kỹ thuật và thấu hiểu con người rất thú vị. Sự kết hợp này chắc chắn tạo nên lợi thế lớn cho anh.",
          approved: true
        },
        {
          authorName: "Hương Giang",
          authorEmail: "huonggiang@gmail.com",
          content: "Marketing dựa trên dữ liệu và quy trình tự động hóa đang là xu hướng. Thật tuyệt khi anh mang tư duy IT vào ngành này.",
          approved: true
        }
      ]
    },
    {
      title: "Solopreneur trong đầu mình là gì?",
      slug: "solopreneur-trong-dau-minh-la-gi",
      description: "Solopreneur không phải là một trào lưu hào nhoáng để thể hiện bản thân. Đó là hành trình tự chịu trách nhiệm và kiên trì kiến tạo những giá trị thực tế.",
      content: `Thời gian gần đây, cụm từ "Solopreneur" (người khởi nghiệp tự chủ) xuất hiện rất nhiều trên các phương tiện truyền thông. Nhiều người mô tả hành trình này rất hào nhoáng: tự do thời gian, làm việc ở bất cứ đâu mình thích, làm chủ chính mình và có nguồn thu nhập thụ động khổng lồ. 

Tuy nhiên, khi bắt tay vào tự xây dựng những dự án nhỏ của riêng mình, mình nhận ra bức tranh thực tế không hề lung linh như vậy.

Solopreneur trong định nghĩa của mình không phải là làm một mình cho ngầu, càng không phải là một lối thoát lười biếng để trốn tránh việc đi làm công sở. Thực chất, đó là hành trình bạn phải tự chịu trách nhiệm 100% với mọi quyết định của mình. Khi không còn sếp chỉ việc, không còn quy trình có sẵn của công ty, bạn vừa phải là người định hướng chiến lược, vừa phải là người trực tiếp bắt tay vào thực thi từng việc nhỏ nhất – từ viết content, tối ưu SEO, quản lý database đến chăm sóc khách hàng.

Tại sao mình lại chọn con đường này?

Bởi vì mình muốn tự tay kiến tạo những giá trị thực tế và có quyền kiểm soát chất lượng sản phẩm của mình. Khi làm việc trong các tổ chức lớn, đôi khi chúng ta phải thỏa hiệp với những quy trình cồng kềnh hoặc những định hướng kinh doanh không đồng nhất với giá trị cá nhân. Trở thành một Solopreneur cho phép mình được sống và làm việc đúng với niềm tin của bản thân: minh bạch, chân thực và tử tế.

Để chuẩn bị cho hành trình này, mình tin rằng việc đầu tiên cần xây dựng không phải là sản phẩm thương mại để kiếm tiền ngay, mà là **xây dựng niềm tin**. Trong thế giới số đầy rẫy những lời hứa hẹn quá mức, lòng tin của khách hàng là tài sản quý giá nhất và cũng khó tích lũy nhất. Đó là lý do mình chọn đi chậm lại, bắt đầu bằng việc chia sẻ những giá trị miễn phí và viết nhật ký hành trình thật trên HarryShare.

Làm Solopreneur cũng giống như việc bạn tự mình chèo lái một con thuyền nhỏ trên đại dương. Sẽ có những ngày giông bão, tự nghi ngờ bản thân và kiệt sức. Nhưng cảm giác được tự do quyết định hướng đi và tự tay tạo ra sản phẩm mang lại giá trị thật cho người dùng là một trải nghiệm vô cùng xứng đáng.`,
      coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      readTime: 4,
      published: true,
      date: new Date("2026-05-27T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 61,
      likes: 19,
      shares: 5,
      comments: [
        {
          authorName: "Anh Tuấn",
          authorEmail: "anhtuan@gmail.com",
          content: "Rất chân thực anh ơi. Nhiều người cứ nghĩ Solopreneur là tự do nhàn hạ, nhưng thực ra là gánh vác 100% trách nhiệm.",
          approved: true
        },
        {
          authorName: "Thanh Vân",
          authorEmail: "thanhvan@gmail.com",
          content: "Bắt đầu từ sự chân thật và lòng tin là con đường bền vững nhất. Chúc anh gặt hái được nhiều quả ngọt!",
          approved: true
        }
      ]
    },
    {
      title: "Một sản phẩm \"win\" nên bắt đầu từ vấn đề thật",
      slug: "mot-san-pham-win-nen-bat-dau-tu-van-de-that",
      description: "Phân tích về tư duy sản phẩm thắng cuộc (Win). Tại sao một sản phẩm tốt không bắt đầu từ công nghệ cao siêu, mà từ việc hiểu sâu sắc và giải quyết tốt nhất một nỗi đau thực tế.",
      content: `Trong quá khứ, mình từng có một ảo tưởng rất lớn khi làm sản phẩm. Mình nghĩ chỉ cần sản phẩm của mình có chất lượng tốt, bao bì đẹp và bản thân mình thấy thích là tự khắc khách hàng sẽ tìm đến mua. Kết quả thực tế đã cho mình một bài học nhớ đời khi dự án phải tạm dừng sau vài tháng vận hành vì không giải quyết được bài toán đầu ra và dòng tiền.

Từ thất bại của bản thân, cộng với khoảng thời gian tư vấn giải pháp cho nhiều khách hàng doanh nghiệp, mình bắt đầu tự hỏi: **Thế nào là một sản phẩm WIN thực thụ?**

Nhà mình nhận ra một sản phẩm WIN không nhất thiết phải sở hữu công nghệ phức tạp nhất hay nhiều tính năng nhất. Sản phẩm thắng cuộc là sản phẩm giải quyết triệt để một nỗi đau có thật (Pain Point) của khách hàng một cách đơn giản và dễ dàng nhất.

Khi xây dựng bất kỳ sản phẩm nào, chúng ta nên bám sát các nguyên lý cốt lõi sau:

Một là, **bắt đầu từ nỗi đau thật**. Thay vì ngồi trong phòng kín và tự vẽ ra nhu cầu của thị trường, hãy đi ra ngoài, lắng nghe những khó khăn, những sự bất tiện mà mọi người đang gặp phải trong cuộc sống hoặc công việc hàng ngày. Khách hàng không mua sản phẩm của bạn vì nó có tính năng gì, họ trả tiền để nỗi đau của họ được biến mất.

Hai là, **sự đơn giản tối đa**. Người dùng trong thời đại số rất thiếu kiên nhẫn. Nếu sản phẩm của bạn bắt họ phải đọc hướng dẫn sử dụng quá dài dòng hoặc trải qua quá nhiều bước đăng ký phức tạp để nhận được giá trị, họ sẽ rời đi ngay lập tức. Hãy làm cho sản phẩm đơn giản nhất có thể để khách hàng cảm nhận được giá trị cốt lõi ngay lập tức.

Ba là, **tạo ra khoảnh khắc \"Aha!\" nhanh nhất**. Đây là khoảnh khắc người dùng lần đầu tiên trải nghiệm giá trị thực tế của sản phẩm và nhận ra: \"À, hóa ra công cụ này thực sự giúp ích cho mình!\". Rút ngắn thời gian dẫn đến khoảnh khắc này chính là chìa khóa để giữ chân người dùng ở lại lâu dài.

Tóm lại, tư duy sản phẩm đúng đắn không bắt đầu bằng câu hỏi: \"Tôi có thể xây dựng công nghệ gì?\". Nó phải bắt đầu bằng câu hỏi: \"Khách hàng đang gặp khó khăn gì và tôi có thể giúp họ giải quyết vấn đề đó một cách đơn giản nhất như thế nào?\". Khắc ghi bài học này sẽ giúp mình và cả bạn tránh được những vết xe đổ lãng phí nguồn lực để xây dựng nên những sản phẩm thực sự có giá trị cho cộng đồng.`,
      coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      readTime: 4,
      published: true,
      date: new Date("2026-05-26T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 74,
      likes: 28,
      shares: 6,
      comments: [
        {
          authorName: "Khánh Linh",
          authorEmail: "khanhlinh@gmail.com",
          content: "Bài học quá đắt giá! Em từng làm một app rất đẹp nhưng chẳng ai dùng vì chỉ là nhu cầu tự vẽ ra.",
          approved: true
        },
        {
          authorName: "Minh Triết",
          authorEmail: "minhtriet@gmail.com",
          content: "Simplicity và Aha! moment là 2 yếu tố em tâm đắc nhất. Cảm ơn anh đã chia sẻ bài viết cô đọng này.",
          approved: true
        }
      ]
    },
    {
      title: "Công nghệ hay nhất khi nó làm cuộc sống nhẹ hơn",
      slug: "cong-nghe-lam-cuoc-song-nhe-hon",
      description: "Góc nhìn cân bằng về công nghệ: không phải để nhồi nhét tính năng hay chạy đua AI, mà để giải phóng thời gian và giúp cuộc sống thường nhật trở nên nhẹ nhàng, bình yên hơn.",
      content: `Chúng ta đang sống trong một kỷ nguyên mà mỗi ngày thức dậy đều có một công cụ AI mới ra đời, một bản cập nhật phần mềm mới được phát hành, hay một xu hướng công nghệ mới thu hút hàng triệu lượt thảo luận. Người ta đua nhau học cách dùng prompt, cách tích hợp API, cách tự động hóa mọi quy trình để x10, x20 hiệu suất. Bản thân mình, là một người xuất thân từ dân IT và đang làm Marketing trong ngành công nghệ, cũng từng bị cuốn vào làn sóng đó. Có những ngày, mình dành cả tiếng đồng hồ chỉ để thiết lập một hệ thống tự động hóa phức tạp để rồi nhận ra, nó chỉ giúp mình tiết kiệm được đúng 5 phút mỗi tuần.

Chính lúc đó, mình tự hỏi bản thân: Ý nghĩa thực sự của công nghệ là gì?

Mình nhận ra, công nghệ hay nhất và đẹp nhất không phải là khi nó phức tạp nhất hay sở hữu nhiều tính năng cao siêu nhất. Công nghệ tốt nhất là khi nó làm cuộc sống của chúng ta nhẹ nhàng hơn.

Nhẹ nhàng ở đây không có nghĩa là lười biếng hay trốn tránh công việc. Nhẹ nhàng có nghĩa là giải phóng tâm trí chúng ta khỏi những tác vụ lặp đi lặp lại vô vị, để dành năng lượng cho những việc thực sự quan trọng: suy nghĩ sáng tạo, đưa ra chiến lược, hoặc đơn giản là có thêm thời gian để thở, để uống một tách cà phê và chăm sóc đời sống tinh thần của chính mình.

In cuộc sống hàng ngày, mình ứng dụng công nghệ theo một cách rất thực dụng. Mình dùng các công cụ lưu trữ ghi chú đám mây để giải phóng bộ nhớ của não bộ, không cần phải cố nhớ mọi việc cần làm. Mình dùng chatbot AI như một người bạn để thảo luận ý tưởng, phản biện góc nhìn khi viết lách hay lên kế hoạch. Khi gặp một quy trình làm việc tẻ nhạt, mình thiết lập một luồng tự động hóa đơn giản để máy móc tự xử lý. 

Nhưng điều quan trọng là, mình luôn biết điểm dừng. 

Mình không cố biến cuộc sống của mình thành một chuỗi các thuật toán khô khan. Mình không cố gắng tối ưu hóa từng giây từng phút bằng công cụ. Mình hiểu rằng, công nghệ là công cụ để phục vụ con người, chứ không phải để biến con người thành những cỗ máy chạy đua với hiệu suất.

Nếu bạn đang cảm thấy mệt mỏi trước làn sóng công nghệ dồn dập ngoài kia, hãy thử đi chậm lại một chút. Đừng cố gắng học mọi công cụ mới chỉ vì sợ bị bỏ lại. Hãy bắt đầu từ chính những khó khăn nhỏ nhất trong ngày của bạn, và tìm kiếm một giải pháp công nghệ đơn giản nhất để giải quyết nó. Khi công nghệ giúp cuộc sống của bạn nhẹ nhàng và bình yên hơn, đó mới là lúc nó thực sự phát huy giá trị cao nhất.`,
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      readTime: 4,
      published: true,
      date: new Date("2026-05-25T00:00:00.000Z"),
      categoryId: catAiVibeCoding.id,
      views: 89,
      likes: 31,
      shares: 4,
      comments: [
        {
          authorName: "Quốc Bảo",
          authorEmail: "quocbao@gmail.com",
          content: "Thích góc nhìn thực tế này của anh. Công nghệ đúng là nên làm cuộc sống nhẹ đi chứ không phải làm mình rối hơn.",
          approved: true
        },
        {
          authorName: "Thu Thảo",
          authorEmail: "thuthao@gmail.com",
          content: "Em cũng đang tập cách dùng AI như một thinking partner. Công nhận nó giúp bớt overthinking và mở rộng góc nhìn rất nhiều.",
          approved: true
        }
      ]
    },
    {
      title: "Thương hiệu cá nhân không phải là lùa gà nếu bắt đầu từ sự thật",
      slug: "thuong-hieu-ca-nhan-bat-dau-tu-su-that",
      description: "Triết lý xây dựng thương hiệu cá nhân sạch: thương hiệu cá nhân không phải là phô trương, đạo lý làm giàu sáo rỗng, mà là tích lũy lòng tin bắt đầu từ những điều chân thật nhất.",
      content: `Thú thật, trước đây mình từng rất dị ứng với cụm từ "Thương hiệu cá nhân". Mỗi lần nghe đến nó, đầu óc mình lại tự động liên tưởng đến những hình ảnh bóng bẩy trên mạng xã hội: những bộ vest lịch lãm chụp hình bên xe sang, những câu đạo lý làm giàu sáo rỗng, hay những lời hứa hẹn thay đổi cuộc đời nhanh chóng của các diễn giả tự phong. Đối với một người thích sự mộc mạc và rõ ràng như mình, những điều đó tạo cảm giác giả tạo và gượng ép. 

Nhưng sau này, khi bước chân vào làm Marketing và quan sát kỹ hơn cách các mối quan hệ kinh doanh vận hành, mình đã thay đổi góc nhìn.

Thương hiệu cá nhân thực chất không có gì cao siêu hay xấu xa. Nó đơn giản là **sự tích lũy lòng tin** của người khác dành cho bạn. Đó là những gì người ta nói về bạn khi bạn không có mặt trong phòng. 

Và thương hiệu cá nhân sẽ tuyệt đối không phải là "lùa gà" nếu nó được bắt đầu và xây dựng từ chính sự thật.

Trong thời đại số mà thông tin thật giả lẫn lộn, người đọc và khách hàng ngày càng thông minh hơn. Họ có thể dễ dàng nhận ra đâu là những nội dung được tô vẽ bóng bẩy để chuẩn bị bán hàng, và đâu là những chia sẻ chân thành từ trải nghiệm thực tế. Vì vậy, cách làm thương hiệu cá nhân bền vững nhất chính là sự chân thật:

Một là, **chia sẻ trải nghiệm thật**. Đừng cố vẽ nên một hình ảnh hoàn hảo, không tì vết. Hãy dũng cảm chia sẻ cả những lần bạn thử sai, những thất bại và bài học xương máu mà bạn đã trải qua. Người đọc tin tưởng bạn không phải vì bạn luôn đúng, mà vì bạn dám thật thà đối diện với những sai lầm của mình.

Hai là, **cho đi giá trị trước**. Thay vì vội vã thiết lập phễu bán hàng hay kêu gọi người khác mua sản phẩm của mình, hãy kiên trì viết và chia sẻ những kiến thức hữu ích mà bạn tích lũy được mà không giấu nghề. Khi bạn trao đi giá trị đủ lớn để giúp cuộc sống của người khác tốt hơn, lòng tin sẽ tự động được gieo mầm.

Ba là, **nhất quán giữa lời nói và hành động**. Sản phẩm bạn bán phải là sản phẩm bạn tin tưởng và tự mình sử dụng. Giá trị bạn chia sẻ trên mạng phải đồng nhất với cách bạn sống và làm việc ở ngoài đời thực.

Góc nhỏ HarryShare này cũng là nơi mình thực hành triết lý xây dựng thương hiệu cá nhân sạch. Mình viết trước hết để lưu giữ hành trình của bản thân, chia sẻ những gì mình thực sự hiểu và làm được. Mình tin rằng, cứ kiên trì gieo những duyên lành chân thật, quả ngọt của sự tin tưởng sẽ tự khắc đến mà không cần bất kỳ lời nói cường điệu nào.`,
      coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-24T00:00:00.000Z"),
      categoryId: catPersonalBranding.id,
      views: 94,
      likes: 41,
      shares: 5,
      comments: [
        {
          authorName: "Anh Tuấn",
          authorEmail: "anhtuan@gmail.com",
          content: "Rất chân thực anh ơi. Nhiều người cứ nghĩ làm thương hiệu cá nhân là phô trương, nhưng từ sự thật mới là thứ bền nhất.",
          approved: true
        },
        {
          authorName: "Thanh Vân",
          authorEmail: "thanhvan@gmail.com",
          content: "Em rất thích tinh thần chia sẻ 'behind the scenes' của anh. Chúc anh gieo thêm nhiều hạt mầm ý nghĩa!",
          approved: true
        }
      ]
    },
    {
      title: "Tại sao mình thích tự xây thứ của riêng mình?",
      slug: "tai-sao-minh-thich-tu-xay-thu-cua-rieng-minh",
      description: "Bài viết pillar về động lực sâu sắc của Solopreneur: tại sao việc kiến tạo một sản phẩm nhỏ nhưng do chính mình làm chủ lại mang đến sự tự chủ và hạnh phúc thực sự.",
      content: `Trong suốt chặng đường đi làm thuê qua nhiều vị trí khác nhau, mình luôn hoàn thành tốt nhiệm vụ được giao. Mình học hỏi nhanh, thích ứng tốt và được đồng nghiệp quý mến. Thế nhưng, trong sâu thẳm, mình luôn có một cảm giác chưa trọn vẹn. Mỗi khi nhìn thấy một quy trình chưa tối ưu, một sản phẩm còn nhiều lỗi trải nghiệm của công ty, mình muốn thay đổi nhưng bộ máy vận hành cồng kềnh và những quyết định từ trên xuống thường không cho phép mình làm điều đó.

Cảm giác đó thúc đẩy mình đi đến một quyết định: Mình muốn tự xây dựng một thứ gì đó của riêng mình.

Tự xây thứ của riêng mình không phải vì mình muốn làm chủ để oai, hay để khoe khoang chức danh Founder trên trang cá nhân. Đối với mình, động lực sâu sắc nhất nằm ở hai chữ: **Tự chủ** và **Trách nhiệm**.

Khi bạn tự tay xây dựng một sản phẩm, một trang web hay một dự án nhỏ, bạn có toàn quyền quyết định về chất lượng và định hướng của nó. Bạn không cần phải thỏa hiệp với những giá trị mà bản thân thấy không đúng chỉ để chạy theo các chỉ số KPI ngắn hạn của ban giám đốc. Bạn được tự do thử nghiệm những ý tưởng mới, tự chịu trách nhiệm hoàn toàn nếu nó thất bại, và tự rút ra bài học cho chính mình. Sự tự do lựa chọn và dám chịu trách nhiệm đó mang lại cho mình một nguồn năng lượng sống và làm việc vô cùng mạnh mẽ.

Hơn thế nữa, việc tự mình làm chủ một sản phẩm nhỏ dạy cho mình tư duy bao quát (generalist setup). Bạn không còn chỉ là một mắt xích nhỏ trong dây chuyền. Bạn phải học cách nhìn toàn cảnh: từ nghiên cứu hành vi người dùng, thiết kế giao diện, viết code, làm nội dung đến cách tiếp cận khách hàng. Quá trình đó bắt buộc bạn phải phát triển toàn diện và trưởng thành nhanh chóng.

Đương nhiên, tự xây dựng lối đi riêng đồng nghĩa với việc bạn phải đối mặt với sự cô đơn và những rủi ro tài chính không báo trước. Sẽ không có mức lương cố định đổ về tài khoản mỗi tháng, cũng không có quy trình sẵn có để bạn làm theo. Nhưng cảm giác nhìn thấy đứa con tinh thần của mình được hoàn thiện từng chút một, và nhận được những phản hồi trân quý từ những người dùng đầu tiên là một niềm hạnh phúc rất khó tả.

Dự án HarryShare này là bước đi đầu tiên trong hành trình tự chủ của mình. Nó là phòng thí nghiệm nhỏ, nơi mình tự tay gõ từng dòng code, viết từng bài chia sẻ và kiến tạo những giá trị tử tế. Mình tin rằng, chỉ cần ta kiên trì gieo trồng những hạt mầm tốt lành bằng chính đôi tay của mình, khu vườn của riêng ta sẽ có ngày đơm hoa kết trái.`,
      coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      date: new Date("2026-05-23T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 110,
      likes: 47,
      shares: 8,
      comments: [
        {
          authorName: "Đức Anh",
          authorEmail: "ducanh@gmail.com",
          content: "Tự chủ và Trách nhiệm - 2 từ khóa quá hay anh ơi. Tự mình làm chủ cái nhỏ trước cũng dạy mình lớn lên rất nhiều.",
          approved: true
        },
        {
          authorName: "Minh Trang",
          authorEmail: "trangm@yahoo.com",
          content: "Chúc khu vườn nhỏ HarryShare của anh Hiếu ngày càng đơm hoa kết trái ngọt ngào nha!",
          approved: true
        }
      ]
    },
    {
      title: "Overthinking và lý do mình chọn viết ra",
      slug: "overthinking-va-ly-do-minh-chon-viet-ra",
      description: "Một bài viết nhẹ nhàng, chân thật về thói quen overthinking của Quang Hiếu, và cách đặt những suy nghĩ ngổn ngang lên trang giấy giúp tâm trí bình tĩnh và lý trí hơn.",
      content: `Mình tự nhận mình là một kẻ overthinking chính hiệu. Đầu óc mình rất ít khi chịu im lặng. Chỉ cần một tình huống nhỏ xảy ra trong ngày – một email công việc chưa rõ ý, một quyết định Marketing cần đưa ra, hay thậm chí là một lời nhận xét bâng quơ của người quen – cũng có thể kích hoạt cả một chuỗi suy nghĩ dài dằng dặc trong đầu mình. Mình sẽ tự động phân tích mọi kịch bản có thể xảy ra, suy diễn các hướng đi tiêu cực nhất rồi lại cố tìm giải pháp cho những vấn đề thậm chí chưa từng tồn tại.

Sự suy nghĩ quá mức đó đã có lúc làm mình kiệt sức, mất ngủ và tự nghi ngờ bản thân. 

Nhưng rồi, sau nhiều lần chật vật tự đối thoại, mình tìm ra một liều thuốc giải đơn giản mà hiệu quả đến bất ngờ: **Viết ra**.

Khi những suy nghĩ ngổn ngang còn nằm trong đầu, chúng giống như một cuộn len bị rối nùi. Bạn càng cố gỡ trong tư tưởng, cuộn len càng thắt chặt lại. Nhưng khi bạn cầm bút đặt lên trang giấy, hoặc mở máy tính lên gõ từng dòng chữ, một điều kỳ diệu sẽ xảy ra: bạn bắt buộc phải chuyển hóa những cảm xúc mơ hồ thành những ngôn từ có cấu trúc. 

Quá trình viết ra giúp mình đạt được ba điều:

Thứ nhất, nó tạo ra **khoảng cách an toàn**. Khi nhìn những suy nghĩ của mình được hiển thị trên trang giấy, mình không còn cảm thấy mình đang "ở trong" mớ hỗn độn đó nữa. Mình có thể quan sát chúng từ bên ngoài như một người quan sát độc lập và khách quan hơn.

Thứ hai, nó giúp mình **lọc bỏ ảo tưởng**. Rất nhiều nỗi sợ do overthinking tạo ra thực chất chỉ là do trí tưởng tượng tự vẽ lên. Khi viết ra và nhìn nhận lại một cách lý trí, mình nhận ra: "À, hóa ra câu chuyện này không tệ đến thế, và mình hoàn toàn có thể kiểm soát được."

Thứ thích, viết ra giúp mình **nhìn thấy hướng tích cực**. Trong mỗi tình huống khó khăn, mình luôn tự đặt câu hỏi trên giấy: Nếu nhìn theo hướng tiêu cực thì sao? Và nếu nhìn theo hướng tích cực, mình sẽ học được bài học gì? Việc chủ động lựa chọn góc nhìn tích cực giúp thế giới quan của mình trở nên nhẹ nhàng và đẹp đẽ hơn rất nhiều.

HarryShare này cũng bắt đầu từ chính thói quen viết ấy. Mình viết trước hết là để tự chữa lành và sắp xếp lại tâm trí của mình. Nếu bạn cũng là một kẻ overthinking giống mình, mỗi khi cảm thấy đầu óc quá tải, đừng cố suy nghĩ thêm nữa. Hãy thử lấy một tờ giấy, đặt bút xuống và viết ra tất cả những gì đang chạy trong đầu. Bạn sẽ thấy lòng mình nhẹ đi và mọi thứ dần trở nên rõ ràng hơn rất nhiều.`,
      coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-22T00:00:00.000Z"),
      categoryId: catCareerJourney.id,
      views: 76,
      likes: 35,
      shares: 3,
      comments: [
        {
          authorName: "Khánh Linh",
          authorEmail: "khanhlinh@gmail.com",
          content: "Viết ra đúng là cách tốt nhất để giải phóng tâm trí. Em cũng có thói quen viết journal mỗi khi đầu óc quá tải.",
          approved: true
        },
        {
          authorName: "Minh Triết",
          authorEmail: "minhtriet@gmail.com",
          content: "Cách phân tích cuộn len rối rất hình tượng anh ơi. Cảm ơn anh vì bài viết rất đồng điệu này.",
          approved: true
        }
      ]
    },
    {
      title: "Vì sao mình bắt đầu nghĩ về sản phẩm sạch?",
      slug: "vi-sao-minh-bat-dau-nghi-ve-san-pham-sach",
      description: "Hành trình chiêm nghiệm về sản phẩm sạch, lý do gia đình Quang Hiếu gắn bó với nhang thảo mộc truyền thống tự nhiên và khát vọng làm ra những sản phẩm an lành, tử tế.",
      content: `Trong xã hội hiện đại, chúng ta đang bị bủa vây bởi sự vội vã và những sản phẩm công nghiệp sản xuất hàng loạt. Thực phẩm chứa hóa chất bảo quản, đồ dùng tiện lợi chứa vi nhựa, và cả những mùi hương nhân tạo nồng hắc được tạo nên từ các hợp chất hóa học tổng hợp. Đi qua những ngày tháng làm việc căng thẳng ở thành phố lớn, có những lúc trở về nhà, mình cảm thấy ngột ngạt trước sự thiếu vắng của tự nhiên.

Cảm giác đó, cộng với nền tảng truyền thống lâu đời của gia đình, đã nhen nhóm trong mình câu hỏi: Tại sao mình không hướng tới việc xây dựng những sản phẩm sạch thực sự?

Gia đình mình có truyền thống làm nhang tự nhiên lâu đời. Từ nhỏ, mình đã lớn lên cùng mùi thơm mộc mạc của các loại thảo mộc, hương trầm và những nguyên liệu thô được chuẩn bị thủ công. Đó không phải là mùi hương hóa chất tạo cảm giác nồng nặc và gây nhức đầu, mà là mùi hương nhẹ nhàng, ấm áp giúp tâm trí lắng dịu lại sau một ngày dài. Nhang thảo mộc không chỉ là một sản phẩm tâm linh hay thói quen sinh hoạt thường nhật, với gia đình mình, đó là sự gắn kết với tự nhiên và sự trân quý sức khỏe của người dùng.

Khi mình bắt đầu bước vào tìm hiểu nghiêm túc về quy trình làm nhang và tư duy sản phẩm sạch, mình đặt ra ba nguyên tắc cốt lõi:

Một là, **Minh bạch**. Một sản phẩm sạch đúng nghĩa không nên chỉ sạch trên lời quảng cáo. Mình muốn người dùng hiểu rõ sản phẩm chứa những gì, nguyên liệu từ đâu, và quy trình chuẩn bị thủ công gắn liền với tự nhiên ra sao. Sự thật chính là nền tảng của niềm tin.

Hai là, **Sản phẩm mình bán phải là sản phẩm mình dùng**. Mỗi hộp nhang, mỗi sản phẩm thảo mộc làm ra trước hết phải an toàn cho chính gia đình mình và những người thân yêu sử dụng hàng ngày. Nếu bản thân mình còn e ngại về chất lượng, tuyệt đối không bao giờ được mang trao đến tay khách hàng.

Ba là, **Tử tế dài hạn**. Xây dựng sản phẩm sạch đòi hỏi dòng vốn bền bỉ và sự kiên trì đi qua nhiều khó khăn về nguồn nguyên liệu và quy trình sản xuất thủ công tốn thời gian. Nó không thể mang lại lợi nhuận nhanh chóng như hàng công nghiệp hóa chất. Nhưng mình tin rằng, việc kinh doanh tử tế, tạo công ăn việc làm lành mạnh và mang lại sự an lành cho đời sống tinh thần của bà con mới là giá trị bền vững nhất.

Ước mơ về một thương hiệu sản phẩm sạch tử tế vẫn đang được mình nỗ lực chuẩn bị từng bước nhỏ mỗi ngày. Mình không vội vã rao bán, mình chọn đi chậm lại để thấu hiểu sản phẩm sâu sắc hơn. Và hành trình chuẩn bị đó, mình muốn ghi lại từng chút một trên HarryShare, như một lời tự nhắc nhở bản thân luôn giữ vững cái tâm ban đầu khi làm nghề.`,
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-05-21T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 125,
      likes: 54,
      shares: 9,
      comments: [
        {
          authorName: "Hương Giang",
          authorEmail: "huonggiang@gmail.com",
          content: "Tuyệt vời quá anh ơi. Sản phẩm sạch từ cái tâm gia đình thế này thì cực kỳ đáng quý và ủng hộ ạ.",
          approved: true
        },
        {
          authorName: "Quốc Bảo",
          authorEmail: "quocbao@gmail.com",
          content: "Sản phẩm mình bán cũng là sản phẩm mình dùng - triết lý đơn giản nhưng cực kỳ giá trị. Hóng ngày sản phẩm ra mắt!",
          approved: true
        }
      ]
    },
    {
      title: "Ngày bà nội mất, mình chọn dừng lại để bắt đầu lại thực sự",
      slug: "ngay-ba-noi-mat-minh-chon-dung-lai-de-bat-dau-lai",
      description: "Một bài viết tự sự sâu lắng về cột mốc ngày 01/06/2026 – khi biến cố lớn của gia đình thúc đẩy Quang Hiếu rời bỏ công việc Marketing tại CloudFly để định hình lại cuộc sống, rèn luyện sức khỏe và bắt tay tái khởi nghiệp Thảo Mộc Hương lần thứ hai.",
      content: `Ngày 01/06/2026 sẽ mãi là một cột mốc khắc sâu vào tâm khảm của mình. Đó là ngày bà nội mình qua đời.

Sự ra đi của bà là một nỗi đau quá lớn, một khoảng trống không gì bù đắp nổi trong cuộc đời mình. Trong những ngày đứng bên linh cữu của bà, nhìn dòng người đến viếng rồi đi, mình nhận ra cuộc đời này thực sự quá đỗi ngắn ngủi và vô thường. Những cuồng quay công việc thường nhật, những mục tiêu KPI Marketing, những cuộc họp kéo dài... bỗng chốc trở nên nhỏ bé trước ranh giới của sự sinh tử.

Khoảnh khắc đó, mình tự hỏi bản thân: "Nếu ngày mai mình cũng ra đi, liệu mình đã sống một cuộc đời trọn vẹn và đúng nghĩa chưa?"

Câu trả lời lúc đó là một khoảng lặng. Và đó cũng là lúc mình biết mình phải đưa ra những quyết định thay đổi cuộc đời.

### Quyết định dừng lại ở CloudFly

Ngay trong tuần đó, mình đã quyết định xin nghỉ công việc Marketing tại CloudFly – một công ty cung cấp cơ sở hạ tầng Cloud mà mình đã gắn bó và học hỏi được rất nhiều. Đó không phải là một quyết định bốc đồng. Mình biết ơn CloudFly, biết ơn những người anh em đồng nghiệp và những bài học Marketing thực chiến tại đây.

Nhưng khi cuộc sống bắt mình dừng lại để đối diện với nỗi đau lớn nhất, mình hiểu rằng hệ giá trị ưu tiên trong mình đã hoàn toàn thay đổi. Mình không thể tiếp tục bán sức khỏe và thời gian cho những guồng quay cố định mà bỏ quên đi những điều cốt lõi nhất của cuộc sống.

### Hành trình rèn luyện để mạnh mẽ hơn

Quyết định rời bỏ một công việc ổn định để bước vào thế giới tự do luôn đi kèm với sự chông chênh. Nhưng lần này, mình chuẩn bị một tâm thế rất khác thông qua ba cam kết lớn cho bản thân:

**1. Rèn luyện sức khỏe làm gốc**
Trước đây, mình thường bỏ bê bản thân, thức khuya chạy deadline và xem nhẹ những cảnh báo của cơ thể. Nhưng khi đi qua biến cố, mình nhận ra một cơ thể yếu ớt không thể gánh vác nổi một tinh thần lớn lao, càng không thể là điểm tựa cho những người mình yêu thương. Mình chọn quay lại tập luyện, ăn uống lành mạnh và lắng nghe cơ thể mình mỗi ngày. Sức khỏe bền bỉ chính là nền tảng đầu tiên để mình đi đường dài.

**2. Làm chủ thời gian bằng công việc tự do**
Mình chuyển dịch sang làm các công việc freelance. Không còn những khung giờ văn phòng gò bó, mình tự lên lịch trình, tự chịu trách nhiệm với hiệu suất của mình. Làm tự do không có nghĩa là làm ít đi, mà là mình được quyền chọn lựa thời gian và không gian làm việc. Quan trọng hơn, mình có thể ở bên cạnh gia đình khi cần thiết mà không phải xin phép bất kỳ ai.

**3. Tái khởi nghiệp Thảo Mộc Hương lần thứ hai**
Và điều ý nghĩa nhất, đây là lúc mình bắt tay vào nghiên cứu và tái khởi động dự án Thảo Mộc Hương một cách nghiêm túc nhất. Đây là lần thứ hai mình bắt đầu với nó. Không còn sự vội vàng, không còn những tư duy chộp giật của một người trẻ muốn chứng tỏ bản thân. Thảo Mộc Hương lần này là sự tiếp nối truyền thống làm nhang sạch của gia đình, được vun đắp bằng tư duy sản phẩm tử tế, minh bạch từ nguyên liệu đến quy trình. Mình muốn làm ra những sản phẩm thực sự sạch, thực sự an lành để dâng lên tổ tiên và chia sẻ với những người có cùng phong cách sống.

### Nỗi đau làm điểm tựa cho sự trưởng thành

Đi qua giông bão, người ta thường chọn cách gục ngã hoặc đứng dậy mạnh mẽ hơn. Mình chọn vế thứ hai. Nỗi đau mất mát không làm mình yếu đuối đi, mà nó đã trở thành một thứ ánh sáng soi rọi, giúp mình nhìn rõ đâu là điều thực sự quan trọng trong cuộc đời ngắn ngủi này.

Thảo Mộc Hương tái khởi, sức khỏe được phục hồi, và một cuộc sống tự chủ đang bắt đầu. Mình viết những dòng này trước hết để ghi nhớ quyết tâm của chính mình, và nếu bạn cũng đang đứng trước những chông chênh của cuộc đời, hy vọng bạn cũng sẽ tìm thấy sức mạnh để tự tay kiến tạo lại cuộc sống của mình.`,
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      date: new Date("2026-06-01T00:00:00.000Z"),
      categoryId: catCareerJourney.id,
      views: 120,
      likes: 64,
      shares: 12,
      comments: [
        {
          authorName: "Đức Huy",
          authorEmail: "duchuy@gmail.com",
          content: "Chia buồn cùng anh và gia đình. Quyết định nghỉ việc để tự chủ cuộc sống và làm sản phẩm truyền thống thực sự rất dũng cảm.",
          approved: true
        },
        {
          authorName: "Hoàng Mai",
          authorEmail: "hoangmai@gmail.com",
          content: "Đọc bài viết cảm nhận được sự chín chắn và định hướng rõ ràng của anh. Chúc Thảo Mộc Hương lần này sẽ thành công rực rỡ!",
      ]
    },
    {
      title: "Sản phẩm mình bán cũng phải là sản phẩm mình dùng",
      slug: "san-pham-minh-ban-cung-phai-la-san-pham-minh-dung",
      description: "Với mình, nguyên tắc tối thượng của một Solopreneur là sự chân thực. Sản phẩm mình bán cho khách hàng cũng chính là thứ mình dùng hàng ngày.",
      coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-06-12T00:00:00.000Z"),
      categoryId: catProductMindset.id,
      views: 85,
      likes: 42,
      shares: 8,
      content: `Có một câu hỏi mà mình luôn tự hỏi mỗi khi bắt tay vào thiết kế một tính năng mới hay chọn lựa một sản phẩm để chia sẻ với mọi người: *"Nếu là người dùng, mình có thực sự bỏ tiền ra mua nó không?"*. 

Trong thời đại số hóa, việc tạo ra một sản phẩm chưa bao giờ dễ dàng đến thế. Chỉ cần vài dòng code, một vài mẫu thiết kế có sẵn, hoặc một nguồn hàng nhập sỉ từ xa, bất kỳ ai cũng có thể tự gắn mác "nhà sáng lập" hay "chủ cửa hàng". Nhưng có một ranh giới rất lớn giữa việc "tạo ra sản phẩm để bán" và "tạo ra sản phẩm để dùng". Với mình, nguyên tắc tối thượng của một Solopreneur là sự chân thực. Sản phẩm mình bán cho khách hàng cũng chính là thứ mình dùng hàng ngày.

### Sự chân thực không nằm ở lời quảng cáo

Khi bước chân vào con đường làm Solopreneur, mình nhận ra tài sản lớn nhất không phải là nguồn vốn hay công nghệ vượt trội, mà chính là lòng tin từ những người đồng hành. Lòng tin đó không được xây dựng bằng những slogan bóng bẩy hay những chiến dịch quảng cáo rầm rộ. Nó được xây dựng từ một thứ đơn giản hơn nhiều: sự chân thực.

Nếu bạn bán một phần mềm quản lý công việc, nhưng hàng ngày bạn vẫn dùng sổ tay hoặc một ứng dụng của đối thủ để ghi chép, sản phẩm của bạn thiếu đi linh hồn. Nếu mình muốn chia sẻ với bạn về một template Notion quản lý đời sống, mình phải là người đã sống cùng nó suốt nhiều tháng trời, tự tay sửa từng lỗi nhỏ khi nó phát sinh trong quá trình vận hành thực tế của chính mình.

Điều này lại càng đúng khi mình nghĩ về hướng đi dài hạn cho những sản phẩm vật lý sau này. Gia đình mình vốn có truyền thống làm nhang sạch lâu đời từ nguyên liệu tự nhiên. Mình lớn lên trong mùi thơm của các loại thảo mộc, thảo dược thiên nhiên. Khi bắt đầu nhen nhóm ý tưởng phát triển thương hiệu Thảo Mộc Hương, câu hỏi đầu tiên xuất hiện trong đầu mình không phải là: *"Thị trường cần gì để bán chạy nhất?"*, mà là: *"Nén nhang này gia đình mình có thắp lên bàn thờ tổ tiên mỗi ngày hay không?"*. 

Câu trả lời bắt buộc phải là: *"Có, và đó phải là thứ tốt nhất mình có thể làm ra."*

### Khi người bán cũng là người dùng khó tính nhất

Khi bạn là người dùng chính sản phẩm của mình, bạn sẽ có một góc nhìn hoàn toàn khác. Bạn sẽ không chấp nhận những hạt bụi nhỏ trên giao diện, không chấp nhận những lỗi giật lag dù là nhỏ nhất trên website, và chắc chắn sẽ không chấp nhận một nén nhang thảo mộc có pha lẫn tạp chất hóa học để giảm chi phí sản xuất.

Tự trải nghiệm sản phẩm giúp mình phát hiện ra những điểm bất tiện mà nếu chỉ đứng ở góc độ người bán, mình sẽ dễ dàng tặc lưỡi bỏ qua. 
- Một dòng mô tả chưa rõ nghĩa trên blog.
- Một nút nhấn quá nhỏ trên giao diện di động.
- Một mùi hương nhang cần được điều chỉnh tỉ lệ bột keo bời lời để khói bay lên được thanh nhẹ và an lành nhất.

Tất cả những chi tiết siêu nhỏ đó chỉ có thể được tìm thấy và tối ưu khi ta đặt mình vào vị trí của người dùng cuối một cách kiên trì.

### Cho đi giá trị thật để nhận lại niềm tin bền vững

Mô hình kinh doanh tinh gọn của một Solopreneur không cần hàng triệu khách hàng đại trà. Nó cần những người đồng điệu - những người thực sự cảm nhận được cái tâm và chất lượng của sản phẩm. Và cách duy nhất để tìm được những người như thế là chia sẻ chân thực nhất những gì mình đang làm và đang sống.

Sản phẩm mình bán cũng phải là sản phẩm mình dùng. Đó không chỉ là một nguyên tắc kinh doanh, mà là phong cách sống của mình. Mình muốn thong thả đi qua từng chặng đường, hoàn thiện từng sản phẩm nhỏ một cách tử tế nhất, thà chậm một chút nhưng chắc chắn và minh bạch.

Nếu bạn cũng đang trên hành trình xây dựng một dự án của riêng mình, hãy thử đặt câu hỏi đó cho bản thân. Có thể bạn sẽ tìm thấy một định hướng rõ ràng và bình yên hơn cho con đường phía trước.`
      ,
      comments: [
        {
          authorName: "Minh Thư",
          authorEmail: "minhthu@gmail.com",
          content: "Hoàn toàn đồng ý với anh. Xây dựng thương hiệu bền vững cần sự chân thực và đặt cái tâm vào sản phẩm đầu tiên.",
          approved: true
        },
        {
          authorName: "Quốc Anh",
          authorEmail: "quocanh@gmail.com",
          content: "Một tư duy làm sản phẩm rất đáng quý từ Solopreneur. Em hóng sản phẩm Thảo Mộc Hương ra mắt chính thức.",
          approved: true
        }
      ]
    },
    {
      title: "Mình không bỏ IT, mình mang IT đi cùng trên hành trình Marketing",
      slug: "it-mang-di-cung-hanh-trinh-marketing",
      description: "Nhiều người nghĩ mình đổi ngành là bỏ phí background IT cũ. Nhưng thực tế, tư duy logic của dân kỹ thuật lại chính là lợi thế giúp mình làm Marketing khác đi.",
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-06-12T01:00:00.000Z"),
      categoryId: catPersonalBranding.id,
      views: 94,
      likes: 51,
      shares: 10,
      content: `Một trong những câu hỏi mình nhận được nhiều nhất từ bạn bè và đồng nghiệp cũ là: *"Học IT ra đi làm Marketing chi cho phí bằng cấp vậy?"*. 

Vào thời điểm mình quyết định chuyển dịch hướng đi sự nghiệp từ một lập trình viên phần mềm sang làm Digital Marketing, bản thân mình cũng đã từng tự vấn rất nhiều. Có những đêm nằm suy nghĩ, mình tự hỏi liệu 4 năm học lập trình cùng những dòng code khô khan có bị trôi tuột xuống sông xuống biển khi mình bước chân vào thế giới của content, thương hiệu và cảm xúc khách hàng. Nhưng đi qua hơn 2 năm thực chiến, mình nhận ra một sự thật thú vị: mình chưa từng bỏ IT, mình chỉ đang mang tư duy IT đi cùng trên hành trình Marketing của mình.

### Lợi thế của "cái đầu lạnh" dân kỹ thuật

Thế giới Marketing thường được mô tả là vùng đất của sự bay bổng, sáng tạo và cảm xúc. Nhưng trong thời đại số hóa ngày nay, Marketing hiện đại là sự giao thoa mạnh mẽ giữa nghệ thuật truyền tải thông điệp và khoa học phân tích dữ liệu. Đây chính là nơi tư duy IT của mình bắt đầu phát huy thế mạnh.

Lập trình viên được rèn luyện để giải quyết vấn đề (problem-solving) bằng cách bóc tách một hệ thống lớn thành những module nhỏ hoạt động độc lập và logic. Khi chuyển sang làm Marketing, mình cũng nhìn một chiến dịch hay một kế hoạch xây dựng thương hiệu cá nhân y hệt như vậy.
- Thay vì viết nội dung theo cảm hứng, mình thiết lập một "hệ thống tư duy nội dung" (Content Framework) rõ ràng, phân chia theo tỷ lệ phần trăm các cột trụ nội dung (pillars) tương tự như cách thiết kế cấu trúc thư mục dự án.
- Thay vì phỏng đoán hành vi người dùng, mình đọc các báo cáo số liệu, phân tích tỷ lệ chuyển đổi, đường đi của người dùng trên trang (user flow) bằng tư duy thuật toán.

Tuy quan điểm kỹ thuật giúp mình không bị cảm tính kéo đi quá xa khi đưa ra các quyết định tiếp thị.

### Biến công nghệ thành trợ thủ đắc lực

Học IT giúp mình có một khả năng tự học và làm quen với công cụ rất nhanh. Khi trào lưu AI hay các giải pháp tự động hóa (automation) bùng nổ, thay vì lo lắng hay từ chối, mình nhanh chóng đón nhận và đưa chúng vào quy trình làm việc hằng ngày.
- Mình tự tay setup và tùy biến website HarryShare.vn bằng Next.js và Tailwind thay vì sử dụng các công cụ kéo thả có sẵn để tối ưu hóa tốc độ tải trang và trải nghiệm người dùng.
- Mình viết các script nhỏ để tự động hóa quy trình thu thập dữ liệu, phân loại bình luận hay quản lý hòm thư liên hệ của độc giả.

Công nghệ không làm mình lười đi hay đánh mất bản sắc sáng tạo, nó là cánh tay nối dài giúp mình có thêm thời gian để tập trung vào việc tạo ra những nội dung thực sự sâu sắc và chạm tới người đọc.

### Trải nghiệm không bao giờ lãng phí

Hành trình dịch chuyển này dạy mình một bài học lớn: tuổi trẻ không có trải nghiệm nào là lãng phí cả. Những ngày tháng thức đêm fix bug lập trình tưởng chừng như xa lạ với công việc hiện tại, thực chất lại là bệ đỡ giúp mình có một góc nhìn sắc bén và khác biệt trong ngành Marketing.

Nếu bạn cũng là một dân kỹ thuật đang nhen nhóm ý định lấn sân sang các lĩnh vực nghệ thuật, kinh doanh, hay ngược lại, hãy tin rằng kiến thức cũ luôn có cách để tỏa sáng theo một cách rất riêng. Điều quan trọng không phải là bạn đứng ở đâu, mà là cách bạn mang những giá trị mình tích lũy được để làm mới thế giới mới của mình.`
      ,
      comments: [
        {
          authorName: "Thanh Tùng",
          authorEmail: "thanhtung@gmail.com",
          content: "Mình cũng là dân IT chuyển sang Marketing và thấy tư duy hệ thống giúp ích cực kỳ nhiều luôn.",
          approved: true
        },
        {
          authorName: "Mai Anh",
          authorEmail: "maianh@gmail.com",
          content: "Bài viết truyền cảm hứng lắm anh ơi. Không có kiến thức nào là bỏ phí cả.",
          approved: true
        }
      ]
    },
    {
      title: "Một công cụ tốt không làm mình lười hơn, nó giúp mình rõ ràng hơn",
      slug: "cong-cu-tot-giup-tu-duy-ro-rang",
      description: "Mình dùng AI không phải để lười suy nghĩ, mà để bóc tách vấn đề, tổ chức tư duy và loại bỏ những áp lực không tên trong công việc.",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      readTime: 4,
      published: true,
      date: new Date("2026-06-12T02:00:00.000Z"),
      categoryId: catAiVibeCoding.id,
      views: 70,
      likes: 38,
      shares: 6,
      content: `Dạo gần đây, khi đi đâu cũng nghe người ta bàn tán về việc AI sẽ thay thế lập trình viên, viết bài thay cho copywriter hay làm hộ mọi công việc văn phòng, mình chợt nhận ra có một sự hiểu lầm rất lớn về vai trò của công cụ trong đời sống.

Có một thực tế là nhiều người đang dùng ChatGPT hay Claude như một chiếc máy chép phạt. Họ quăng cho AI một yêu cầu ngắn củn cỡn, rồi copy-paste nguyên văn câu trả lời dài dòng, sáo rỗng đưa lên website hay gửi cho khách hàng. Đối với mình, cách dùng đó không chỉ làm giảm chất lượng công việc mà còn đang dần thui chột khả năng tư duy độc lập của chính họ. Mình luôn tin rằng: Một công cụ tốt không làm mình lười hơn, nó giúp suy nghĩ của mình trở nên rõ ràng và sắc bén hơn.

### Dùng AI làm bạn đồng hành cùng tư duy

Thay vì bắt AI làm hết mọi việc từ A đến Z, mình thường đặt AI vào vai trò của một người bạn phản biện (sparring partner) - một người đồng hành cùng tư duy.

Khi gặp một vấn đề phức tạp trong công việc hay cuộc sống khiến bản thân dễ rơi vào trạng thái overthinking, mình sẽ viết ra những luồng suy nghĩ lộn xộn trong đầu, cấu trúc chúng lại và gửi cho AI kèm theo yêu cầu: *"Hãy chỉ ra những điểm chưa hợp lý trong lập luận này của tôi"* hoặc *"Hãy giúp tôi bóc tách vấn đề này thành 3 bước đơn giản nhất có thể giải quyết ngay lập tức"*.

Lúc này, AI hoạt động giống như một chiếc gương phản chiếu. Nó giúp mình sắp xếp lại mớ bòng bong trong đầu thành những gạch đầu dòng mạch lạc, giúp mình nhìn rõ bản chất của vấn đề mà không bị cảm xúc hay sự quá tải thông tin che mờ.

### Công cụ giải phóng sức lao động cơ bắp

Trong quá trình xây dựng website HarryShare.vn, mình ứng dụng AI rất nhiều trong việc viết code (vibe coding). Tuy nhiên, mình không để AI tự quyết định kiến trúc hệ thống hay logic cốt lõi. 
- Mình sử dụng AI để tạo ra các hàm tiện ích (helper functions) nhỏ, các cấu hình boilerplate khô khan hoặc viết unit test - những phần việc mang tính lặp đi lặp lại và tốn thời gian.
- Nhờ giải phóng được năng lượng khỏi những tác vụ "cơ bắp" đó, mình có nhiều thời gian và tâm trí hơn để tập trung thiết kế luồng trải nghiệm người dùng thật mượt mà, tối ưu hóa bố cục giao diện hay ngồi viết những bài chia sẻ thật sâu sắc gửi đến các bạn.

Đó chính là giá trị cốt lõi của công nghệ: nó giúp ta rảnh tay để làm những phần việc thực sự cần đến sự thấu cảm, trải nghiệm và tư duy sáng tạo của con người.

### Làm chủ công nghệ thay vì để công nghệ dẫn dắt

Một chiếc búa tốt chỉ giúp người thợ đóng đinh nhanh hơn, chứ không thể biến một người chưa biết gì thành một kiến trúc sư giỏi. Công cụ AI hay bất kỳ phần mềm nào cũng vậy, giá trị của chúng phụ thuộc hoàn toàn vào năng lực tư duy và cái tâm của người sử dụng.

Nếu bạn đang cảm thấy bị ngợp trước sự phát triển quá nhanh của công nghệ, hãy thử thay đổi góc nhìn. Đừng cố gắng học thuộc lòng mọi tính năng của một công cụ mới, hãy tập trung rèn luyện tư duy đặt câu hỏi, tư duy bóc tách vấn đề và giữ cho mình một cái đầu tỉnh táo. Công nghệ sinh ra là để phục vụ đời sống, để làm cho cuộc sống của bạn nhẹ nhàng và rõ nét hơn mỗi ngày.`
      ,
      comments: [
        {
          authorName: "Khánh Linh",
          authorEmail: "khanhlinh@gmail.com",
          content: "Đồng ý ạ. Nhiều người đang dùng AI viết bài một cách thụ động, đọc rất sáo rỗng.",
          approved: true
        },
        {
          authorName: "Tuấn Hải",
          authorEmail: "tuanhai@gmail.com",
          content: "Dùng AI làm bạn phản biện tư duy là cách dùng thông minh nhất.",
          approved: true
        }
      ]
    },
    {
      title: "Làm Marketing trong công ty công nghệ dạy mình điều gì?",
      slug: "marketing-trong-cong-ty-cong-nghe-bai-hoc",
      description: "Trải nghiệm thực tế từ một công việc thực sự giúp mình hiểu sâu sắc về sản phẩm, khách hàng và cách tự học để thích nghi nhanh trong môi trường công nghệ.",
      coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      date: new Date("2026-06-12T03:00:00.000Z"),
      categoryId: catCareerJourney.id,
      views: 110,
      likes: 58,
      shares: 11,
      content: `Trải qua hơn 2 năm đảm nhận vai trò Marketing tại một công ty công nghệ, mình thường nhìn lại khoảng thời gian này giống như một khóa học thực chiến đặc biệt. Nó không chỉ giúp mình nâng cao chuyên môn mà quan trọng hơn, nó đã rèn giũa và thay đổi hoàn toàn tư duy của mình về cách làm việc, cách học hỏi và cách đối mặt với những thử thách.

Môi trường công nghệ vốn nổi tiếng với tốc độ thay đổi nhanh chóng, áp lực cao và yêu cầu sự thích nghi liên tục. Dưới đây là ba bài học lớn nhất mà mình tự đúc kết lại cho hành trình trưởng thành của bản thân.

### 1. Đừng bán tính năng, hãy giải quyết nỗi đau của khách hàng

Khi làm việc chung với các kỹ sư và lập trình viên phát triển sản phẩm, mình nhận ra một khoảng cách rất lớn giữa những gì người làm sản phẩm tự hào và những gì khách hàng thực sự quan tâm. Các lập trình viên thường say sưa nói về những công nghệ mới nhất họ áp dụng, những dòng code tối ưu hay những tính năng phức tạp họ vừa xây dựng. Nhưng khách hàng thì không quan tâm đến những điều đó. Họ chỉ hỏi một câu duy nhất: *"Sản phẩm này có giúp tôi giải quyết được vấn đề của tôi nhanh hơn, rẻ hơn không?"*.

Bài học này thay đổi hoàn toàn cách mình viết content và lên chiến dịch tiếp thị. Mình học cách dịch chuyển ngôn ngữ từ mô tả tính năng khô khan sang giải thích giá trị thực tế. Đừng nói phần mềm của bạn có tính năng tự động hóa bằng AI, hãy nói nó giúp họ tiết kiệm được 2 tiếng làm việc mỗi ngày để có thể về nhà ăn cơm tối cùng gia đình.

### 2. Tốc độ tự học là chìa khóa sinh tồn

Trong ngành công nghệ, kiến thức bạn học được ngày hôm nay có thể đã trở nên lỗi thời vào ngày mai. Một công cụ mới xuất hiện, một thuật toán tìm kiếm thay đổi, hay một mô hình AI mới ra đời có thể làm thay đổi hoàn toàn cuộc chơi chỉ sau một đêm.

Môi trường này dạy mình cách dẹp bỏ nỗi sợ hãi trước những cái mới và rèn luyện kỹ năng tự học siêu tốc. 
- Không có ai cầm tay chỉ việc, mình học cách đọc tài liệu kỹ thuật, tự mày mò thử nghiệm các công cụ mới và chấp nhận việc thử sai liên tục.
- Việc đối mặt với những thứ chưa biết giúp mình vượt qua hội chứng impostor syndrome (hội chứng kẻ giả mạo) và nhận ra rằng: không ai biết hết mọi thứ, người chiến thắng là người có khả năng học hỏi và thích nghi nhanh nhất.

### 3. Tư duy làm chủ và chịu trách nhiệm 100%

Làm việc trong một đội nhóm nhỏ nhưng có tính tự chủ cao giúp mình sớm định hình tư duy Solopreneur. Khi được giao một dự án, mình học cách tự lên kế hoạch, tự quản lý tiến độ, tự tìm kiếm giải pháp khi gặp khó khăn và quan trọng nhất là dám chịu trách nhiệm 100% với kết quả cuối cùng, dù đó là thành công hay thất bại.

Không còn thói quen đổ lỗi cho hoàn cảnh hay chờ đợi sự hướng dẫn chi tiết từ cấp trên, mình chủ động tìm cách tối ưu hóa quy trình làm việc và đề xuất các giải pháp khả thi nhất. Tư duy chịu trách nhiệm này chính là bệ đỡ vững chắc nhất cho mình khi quyết định xây dựng các dự án cá nhân sau này.

Những năm tháng lăn lộn trong công ty công nghệ đã mang lại cho mình nhiều hơn là một công việc kiếm sống. Đó là nơi mình được rèn luyện cả về tư duy logic, sự kiên trì lẫn cái đầu lạnh để sẵn sàng vững bước trên con đường Solopreneur mà mình đã chọn.`
      ,
      comments: [
        {
          authorName: "Ngọc Lan",
          authorEmail: "ngoclan@gmail.com",
          content: "Bài học về việc tập trung giải quyết nỗi đau của khách hàng luôn là bài học xương máu nhất.",
          approved: true
        },
        {
          authorName: "Văn Dũng",
          authorEmail: "vandung@gmail.com",
          content: "Tốc độ tự học đúng là chìa khóa sống còn trong ngành công nghệ hiện nay.",
          approved: true
        }
      ]
    },
    {
      title: "Mọi sản phẩm tốt đều nên bắt đầu từ việc giải quyết nỗi đau của chính mình",
      slug: "moi-san-pham-tot-deu-nen-bat-dau-tu-noi-dau-cua-chinh-minh",
      description: "Tại sao việc giải quyết vấn đề của bản thân lại là điểm khởi đầu tốt nhất cho các Solopreneur? Chia sẻ bài học thực tế từ việc xây dựng các công cụ nhỏ của Harry.",
      coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      categoryId: catProductMindset.id,
      date: new Date("2026-06-12T08:00:00.000Z"),
      content: `## Bắt đầu từ những gì khó chịu nhất

Trong những ngày đầu tiên chập chững bước chân vào con đường xây dựng các dự án cá nhân, mình thường mắc một sai lầm rất phổ biến: cố gắng nghĩ ra những ý tưởng thật to tát. Mình muốn làm một nền tảng quản trị công việc toàn diện cho doanh nghiệp, một mạng xã hội kết nối các Solopreneur, hay một hệ thống tự động hóa marketing siêu đẳng. Kết quả là gì? Mình bị ngợp bởi khối lượng tính năng khổng lồ, code mãi không xong, rồi chán nản và bỏ cuộc giữa chừng.

Cho đến một ngày, mình nhận ra những thứ thực sự hữu ích lại bắt nguồn từ việc giải quyết một sự khó chịu nhỏ của chính mình trong cuộc sống hàng ngày.

Là một người có thói quen ghi chép liên tục nhưng lại dùng một chiếc điện thoại cũ có cấu hình khá yếu, mình thấy ứng dụng Notion load cực kỳ chậm mỗi khi cần ghi nhanh một ý tưởng. Thế là mình tự hỏi: *Tại sao mình không tự code ra một trang note siêu nhẹ, chỉ có đúng một ô text để lưu nhanh vào database cá nhân?* 

Sản phẩm thô sơ đó được mình code xong chỉ trong vòng 3 tiếng đồng hồ. Nó không có định dạng đẹp đẽ, không có cộng tác nhóm, nhưng nó giải quyết đúng 100% nỗi đau của mình: mở app lên là ghi được ngay, không trễ một giây nào.

---

## Tại sao giải quyết nỗi đau của bản thân là "lợi thế bất công"?

Khi bạn tự mình xây dựng một sản phẩm để giải quyết vấn đề của chính mình, bạn có hai lợi thế cực kỳ lớn mà không một cuộc nghiên cứu thị trường đắt đỏ nào có thể mang lại:

### 1. Bạn hiểu nỗi đau đó một cách sâu sắc nhất
Bạn không cần phải đoán mò xem khách hàng muốn gì, họ gặp khó khăn ở bước nào, hay họ có sẵn sàng trả tiền cho tính năng này không. Bạn chính là khách hàng đầu tiên. Mọi trải nghiệm khó chịu hay mượt mà, bạn đều là người cảm nhận trực tiếp nhất.

### 2. Vòng lặp phản hồi (Feedback loop) diễn ra tức thì
Bạn code xong tính năng mới vào buổi sáng, trải nghiệm nó vào buổi trưa, phát hiện ra lỗi và sửa nó ngay vào buổi chiều. Không có khoảng trễ giao tiếp giữa lập trình viên và khách hàng. Sự nhanh nhạy này giúp sản phẩm tiến hóa với tốc độ chóng mặt.

---

## Bài học cho các Solopreneur trên hành trình xây sản phẩm

Nếu bạn cũng đang nhen nhóm ý định xây dựng một sản phẩm nhỏ, hãy thử bắt đầu bằng việc quan sát cuộc sống và công việc của chính mình:

* **Tìm kiếm sự lặp lại:** Việc gì bạn đang phải làm thủ công hàng ngày và tốn nhiều thời gian?
* **Tìm kiếm sự ức chế:** Công cụ nào bạn đang dùng hàng ngày nhưng luôn cảm thấy nó thiếu một tính năng cốt lõi nào đó hoặc quá rườm rà?
* **Đơn giản hóa tối đa:** Đừng cố xây dựng một con phi thuyền. Hãy xây một chiếc xe đạp chạy tốt trước đã.

Sản phẩm đầu tiên của bạn có thể không giúp bạn giàu lên ngay lập tức, nhưng nó chắc chắn sẽ dạy bạn cách đưa một ý tưởng từ bản thảo ra đời thực. Và quan trọng hơn cả, khi bạn giải quyết được vấn đề của chính mình, chắc chắn ngoài kia sẽ có những người khác cũng đang gặp vấn đề tương tự và cần đến giải pháp của bạn.`,
      comments: [
        {
          authorName: "Khánh An",
          authorEmail: "khanhan@outlook.com",
          content: "Đọc bài viết thấy thấm thía quá anh ơi. Em cũng đang loay hoay vẽ ra sản phẩm to tát rồi bỏ dở. Chắc phải bắt đầu nhỏ lại thôi.",
          approved: true
        },
        {
          authorName: "Duy Mạnh",
          authorEmail: "manh.duy@gmail.com",
          content: "Lợi thế lớn nhất của Solopreneur đúng là tốc độ thử sai và thấu cảm sản phẩm. Cảm ơn bài viết thực tế của anh Harry!",
          approved: true
        }
      ]
    },
    {
      title: "Thương hiệu cá nhân không phải là cố gắng diễn để giống một ai đó",
      slug: "thuong-hieu-ca-nhan-khong-phai-la-co-gang-dien",
      description: "Xây dựng thương hiệu cá nhân bằng cách sống thật với chính mình. Bài học từ hành trình ghi chép và chia sẻ công khai không màu mè của Harry.",
      coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      categoryId: catPersonalBranding.id,
      date: new Date("2026-06-13T09:00:00.000Z"),
      content: `## Chiếc mặt nạ "chuyên gia" bóng bẩy

Trên các mạng xã hội nghề nghiệp hiện nay, mình thấy một trào lưu rất phổ biến: ai cũng cố gắng xây dựng cho mình một hình tượng thật hoàn hảo. Những bài đăng khoe thành tích vượt bậc, những thuật ngữ đắt đỏ, và những lời khuyên đạo lý được đóng gói rất bóng bẩy. 

Thành thật mà nói, mình cũng từng rơi vào cái bẫy đó. 

Những ngày đầu làm thương hiệu cá nhân, mình cố gắng viết những bài viết thật 'ngầu', sử dụng nhiều từ tiếng Anh chuyên ngành marketing, và cố tỏ ra mình là người biết tuốt. Nhưng sau mỗi bài đăng như vậy, mình lại cảm thấy vô cùng trống rỗng và mệt mỏi. Trống rỗng vì mình biết đó không phải là mình đời thực – một cậu thanh niên IT rẽ ngang sang Marketing vẫn đang mò mẫm tự học mỗi ngày. Mệt mỏi vì việc phải gồng lên để 'diễn' cho tròn vai chuyên gia thực sự rất tốn năng lượng.

Và mình đã quyết định dừng lại. Mình cởi bỏ chiếc mặt nạ đó xuống và bắt đầu viết thật hơn.

---

## Sức mạnh của sự chân thật và hành trình không màu mè

Khi mình bắt đầu chia sẻ về những lần chạy chiến dịch marketing thất bại, những bài học xương máu khi tự làm sản phẩm, hay những trăn trở của một người có xu hướng overthinking, một điều kỳ diệu đã xảy ra: **Số người tương tác và nhắn tin trò chuyện với mình tăng lên rõ rệt.**

Họ tìm đến mình không phải vì mình là một siêu sao marketing đứng trên bục giảng dạy đời, mà vì họ thấy bóng dáng của chính họ trong những câu chuyện thử sai của mình. Họ tin tưởng sự chân thành đó.

Thương hiệu cá nhân bền vững nhất không được xây dựng từ những lời nói dối hay sự tô vẽ quá đà. Nó được xây dựng từ:

1. **Sự nhất quán giữa nói và làm:** Bạn chia sẻ những gì bạn thực sự trải nghiệm và làm việc hàng ngày.
2. **Sự dám thừa nhận thiếu sót:** Không ai biết hết mọi thứ. Thừa nhận mình chưa biết và đang học hỏi là biểu hiện của sự tự tin thực sự, chứ không phải yếu kém.
3. **Giá trị thực tế trao đi:** Viết blog để giúp đỡ người đi sau rút ngắn con đường tự học, chứ không phải để đánh bóng cái tôi của bản thân.

---

## Lời nhắn gửi cho những bạn đang bắt đầu

Đừng sợ hành trình của mình còn quá mới mẻ hay chưa có thành tựu gì to lớn để chia sẻ. Mỗi chặng đường bạn đi qua, mỗi lỗi sai bạn vừa sửa đều là những tư liệu vô giá.

Hãy nhớ rằng: **Người đọc thích kết nối với một con người bằng xương bằng thịt có những vết sẹo và câu chuyện thật, chứ không phải một hình mẫu robot hoàn hảo không tì vết.** 

Hãy cứ là chính mình, chia sẻ một cách chân thành và kiên trì. Thương hiệu cá nhân của bạn sẽ tự động được định hình từ chính những giá trị thật mà bạn gieo trồng mỗi ngày.`,
      comments: [
        {
          authorName: "Minh Anh",
          authorEmail: "minhanh.nguyen@gmail.com",
          content: "Đồng cảm sâu sắc với anh Hiếu. Em cũng đang loay hoay vươn mình trên LinkedIn. Đọc bài viết thấy nhẹ lòng hẳn.",
          approved: true
        },
        {
          authorName: "Văn Lâm",
          authorEmail: "lamv@yahoo.com",
          content: "Sống thật và viết thật là thứ bền vững nhất. Chúc blog HarryShare luôn giữ vững tinh thần này anh nhé!",
          approved: true
        }
      ]
    },
    {
      title: "AI không cướp đi sự sáng tạo, nó cướp đi sự lười biếng của bạn",
      slug: "ai-khong-cuop-di-su-sang-tao-no-cuop-di-su-luoi-bieng",
      description: "Cách sử dụng AI như một người bạn phản biện tư duy và nâng cao năng suất làm việc mỗi ngày thay vì phụ thuộc một cách thụ động.",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      readTime: 5,
      published: true,
      categoryId: catAiVibeCoding.id,
      date: new Date("2026-06-13T10:00:00.000Z"),
      content: `## Nỗi sợ hãi mang tên "AI thay thế con người"

Mấy năm gần đây, đi đâu mình cũng nghe thấy những lời cảnh báo đầy lo âu: *AI sắp thay thế lập trình viên, AI sắp cướp việc của copywriter, AI làm thiết kế đẹp hơn con người.* Nhiều bạn trẻ mới ra trường cảm thấy hoang mang vì sợ ngách nghề nghiệp của mình sẽ biến mất trước khi kịp tích lũy kinh nghiệm.

Là một người làm việc trực tiếp với code và marketing công nghệ, mình cũng từng dành nhiều giờ để thử nghiệm mọi công cụ AI mới nhất. Và kết luận của mình là: **AI không cướp đi sự sáng tạo. Cái nó cướp đi thực chất là sự lười biếng của chúng ta.**

AI cực kỳ giỏi trong việc thực thi những tác vụ có tính lặp đi lặp lại hoặc tổng hợp thông tin sẵn có. Nếu công việc hàng ngày của bạn chỉ là viết những bài viết chuẩn SEO vô hồn theo công thức, dịch thuật thô, hoặc viết những đoạn code mẫu đơn giản – thì đúng vậy, bạn sẽ bị thay thế. Nhưng đó không phải là sự sáng tạo thực sự. Đó chỉ là sự thực thi chăm chỉ mà thôi.

---

## Biến AI thành một "Thinking Partner" phản biện tư duy

Thay vì lười biếng phó mặc hoàn toàn cho AI viết bài hay code hộ (để rồi nhận lại những sản phẩm sáo rỗng, thiếu cá tính), cách tiếp cận thông minh là biến AI thành một **cộng sự phản biện tư duy** đắc lực:

* **Phản biện logic:** Khi viết xong một outline bài viết hay một giải pháp kỹ thuật, mình thường hỏi AI: *'Điểm yếu trong lập luận này của tôi là gì? Có trường hợp góc (edge case) nào tôi đã bỏ sót trong đoạn code này không?'*
* **Mở rộng góc nhìn:** AI có thể nhanh chóng đưa ra 5-10 góc tiếp cận khác nhau cho cùng một vấn đề, giúp mình thoát khỏi lối mòn suy nghĩ (overthinking tiêu cực).
* **Tối ưu hóa thời gian thực thi:** Bắt AI làm những việc tẻ nhạt như định dạng dữ liệu, viết các hàm bổ trợ đơn giản, để dành 80% năng lượng đầu óc cho việc tư duy kiến trúc hệ thống và thấu hiểu khách hàng.

---

## Kỷ nguyên của những câu hỏi đúng

Trong thời đại thông tin ngập tràn và AI có thể trả lời mọi thứ, giá trị của một người không nằm ở chỗ họ **nhớ được bao nhiêu câu trả lời**, mà nằm ở việc họ **dám và biết đặt ra những câu hỏi đúng (prompting)**.

Để đặt được câu hỏi chất lượng, bạn phải có tư duy bóc tách vấn đề sâu sắc, có vốn sống thực tế và có sự thấu cảm con người. Đó là những thứ mà thuật toán AI không bao giờ tự sinh ra được.

Vì thế, thay vì sợ hãi AI, hãy bắt đầu học cách làm việc cùng nó. Hãy nâng cấp tư duy của chính mình lên một tầm cao mới, bắt AI phải phục vụ cho trí tưởng tượng của bạn, và giữ cho mình một cái đầu tỉnh táo để đưa ra những quyết định sáng suốt nhất.`,
      comments: [
        {
          authorName: "Quốc Bảo",
          authorEmail: "baoq@gmail.com",
          content: "Góc nhìn rất chuẩn ạ. Người lười dùng AI viết bài đọc là biết ngay, rất sáo rỗng. Phải dùng nó làm bạn phản biện mới đúng tầm.",
          approved: true
        },
        {
          authorName: "Hải Yến",
          authorEmail: "haiyen.dev@gmail.com",
          content: "Em dùng AI để giải thích code và tìm edge case cực kỳ tốt luôn. Tiết kiệm thời gian tự bơi rất nhiều.",
          approved: true
        }
      ]
    },
    {
      title: "Marketing công nghệ - Nơi logic của IT gặp gỡ sự thấu cảm con người",
      slug: "marketing-cong-nghe-noi-logic-cua-it-gap-go-su-thau-cam",
      description: "Trải lòng về những bài học thực tế sau 2 năm làm Marketing trong các doanh nghiệp công nghệ dưới góc nhìn của một cựu lập trình viên.",
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      categoryId: catCareerJourney.id,
      date: new Date("2026-06-13T10:30:00.000Z"),
      content: `## Ngã rẽ bất ngờ của một dân IT

Nếu bạn hỏi mình của 5 năm trước rằng: *'Sau này cậu có làm Marketing không?'*, chắc chắn mình sẽ cười lớn và lắc đầu. Khi đó, thế giới của mình chỉ xoay quanh những dòng lệnh, cấu trúc dữ liệu logic, và những đêm thức trắng để fix bug phần mềm. Đối với một dân IT chính hiệu, Marketing trong mắt mình lúc ấy là một thứ gì đó khá mơ hồ, bay bổng và đầy cảm tính.

Nhưng dòng đời đưa đẩy và bản thân lựa chọn dấn thân. Đến nay, mình đã có 2 năm kinh nghiệm làm Marketing trong môi trường công nghệ. 

Hành trình bước qua ngã rẽ này đã dạy cho mình một bài học lớn: **IT và Marketing không hề đối lập nhau. Ngược lại, chúng là mảnh ghép hoàn hảo để tạo nên những bứt phá độc đáo.**

---

## Khi logic kỹ thuật hỗ trợ sự thấu cảm con người

Marketing công nghệ (Tech Marketing) đòi hỏi sự kết hợp nhuần nhuyễn giữa tư duy logic sắc bén của kỹ thuật và sự thấu cảm tinh tế đối với con người:

### 1. Tư duy IT làm nền tảng cho hệ thống Marketing
Nền tảng kỹ thuật giúp mình không bị bỡ ngỡ trước sự bùng nổ của các công cụ MarTech (Marketing Technology). Mình có thể tự tay cấu hình các phễu tự động hóa (marketing automation), phân tích dữ liệu số (data analytics) một cách khoa học mà không cần đợi đội ngũ kỹ thuật hỗ trợ. Mọi quyết định tối ưu hóa chiến dịch đều dựa trên số liệu thực tế chứ không phải phỏng đoán cảm tính.

### 2. Sự thấu cảm Marketing làm mềm mại những dòng code
Một lập trình viên giỏi thường tập trung vào việc code sao cho tối ưu và chạy không lỗi. Nhưng một marketer giỏi lại dạy mình câu hỏi quan trọng hơn: *'Người dùng thực tế cảm thấy thế nào khi bấm vào cái nút này? Sản phẩm này giải quyết nỗi đau nào của họ trong đời thực?'* Sự thấu cảm này giúp mình nhìn sản phẩm bằng con mắt của một con người bình thường, từ đó thiết kế ra những trải nghiệm tinh tế hơn.

---

## Tuổi trẻ không có trải nghiệm nào là lãng phí

Nhìn lại chặng đường đã qua, mình nhận ra không có kiến thức hay kỹ năng nào mình từng học là bỏ phí. Những ngày tháng thức đêm lập trình tưởng chừng như xa lạ với công việc làm marketing hiện tại, thực chất lại là lợi thế cạnh tranh độc nhất của mình trong ngành.

Nó cho phép mình hiểu sản phẩm công nghệ một cách sâu sắc để viết nội dung chân thực nhất, nói chuyện cùng ngôn ngữ với đội ngũ kỹ sư phát triển, và xây dựng các hệ thống vận hành trơn tru cho riêng mình.

Nếu bạn cũng đang đứng trước những quyết định rẽ hướng sự nghiệp, hay đang lo lắng kiến thức cũ của mình không dùng được ở ngách mới – hãy tin rằng sự kết hợp giữa các lĩnh vực tưởng chừng khác biệt thường là nơi gieo mầm cho những năng lực độc đáo nhất của bạn.`,
      comments: [
        {
          authorName: "Thế Vinh",
          authorEmail: "vinh.the@gmail.com",
          content: "Đọc bài viết truyền cảm hứng quá anh. Sự kết hợp giữa IT và Marketing đúng là vũ khí cực mạnh trong thời đại số hiện nay.",
          approved: true
        },
        {
          authorName: "Bích Phương",
          authorEmail: "phuongb@gmail.com",
          content: "Rất đồng cảm với câu 'không có trải nghiệm nào là lãng phí'. Chúc anh Hiếu gieo thêm nhiều hạt mầm ý nghĩa!",
          approved: true
        }
      ]
    }
  ];

  for (const postItem of postsData) {
    const { comments, ...item } = postItem;
    const post = await prisma.post.create({ data: item });
    
    if (comments && comments.length > 0) {
      for (const comment of comments) {
        await prisma.comment.create({
          data: {
            postId: post.id,
            ...comment
          }
        });
      }
    }
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
    { imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", order: 1 },
    { imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80", order: 2 }
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
      avatarUrl: "/harry_share_avt.png",
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
      lesson: "Bài học: Làm bạn với AI và ứng dụng tự động hóa là khóa học x10 hiệu suất công việc trong thời đại số.",
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
