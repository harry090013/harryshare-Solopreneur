const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const posts = [
      {
        title: "Trải nghiệm chuyển từ \"Chat\" sang \"Ủy thác\": AI Agent đã thay đổi cách mình làm việc như thế nào",
        slug: "tu-chat-sang-uy-thac-ai-agent",
        description: "Không còn là những cuộc hội thoại hỏi đáp thông thường. Năm 2026, mình đã để AI Agent tự chạy code, tự sửa lỗi và giải phóng thời gian cho mình như thế nào.",
        content: `Hai năm trước, vào khoảng năm 2024, khi ChatGPT và Claude mới bùng nổ, thói quen làm việc hằng ngày của mình và hầu hết mọi người là "chat". Chúng ta nhập một câu hỏi, AI trả lời, ta copy đoạn code hoặc bài viết đó rồi paste vào dự án. Nếu lỗi, ta lại copy lỗi thảy vào khung chat rồi đợi AI sửa. Quy trình đó lặp đi lặp lại một cách thủ công.

Nhưng đến giữa năm 2026, kỷ nguyên "Agentic AI" (AI hành động) đã thực sự thay đổi luật chơi. Mình không còn "chat" nhiều nữa. Mình chuyển sang "ủy thác".

### Khi AI không chỉ nói, mà bắt đầu làm việc

Một buổi tối tuần trước, mình muốn xây dựng tính năng "tải tài nguyên đổi email" cho trang Dự Án & Tài Nguyên trên chính website HarryShare này. Thay vì ngồi tự viết API, tự thiết kế UI Modal, rồi tự cấu hình cơ sở dữ liệu Prisma, mình chỉ cần mở terminal và gọi AI Agent (ở đây là Antigravity) với một câu lệnh mục tiêu:

*"Build luồng đổi email lấy freebie, lưu subscriber vào DB, trả về URL tải trực tiếp vì chưa có SMTP. Đảm bảo giao diện Cream/Olive đồng nhất."*

Ngay lập tức, AI Agent tự động lên danh sách công việc cần làm:
1. Đọc và phân tích \`schema.prisma\` hiện tại để hiểu cấu trúc bảng.
2. Tự động viết code API route POST nhận email và ID tài nguyên.
3. Tự viết mã nguồn component React \`FreebieModal.tsx\` bằng Client Component.
4. Tự tích hợp nó vào component lưới danh sách dự án.
5. Tự chạy lệnh \`npm run build\` cục bộ để kiểm tra xem hệ thống có lỗi biên dịch nào không.

Suốt quá trình đó, mình chỉ ngồi uống trà và theo dõi các hành động của Agent chạy trên màn hình. Khi phát hiện lỗi hoặc thiếu thư viện, nó không dừng lại hỏi mình "làm thế nào bây giờ?", mà tự đọc thông báo lỗi, tự sửa code lỗi và chạy lại lệnh kiểm tra cho đến khi hoàn toàn biên dịch thành công.

### Sự thay đổi trong vai trò của con người

Trải nghiệm này làm mình nhận ra một điều cốt lõi: vai trò của lập trình viên hay người làm sản phẩm trong kỷ nguyên Agentic không còn là viết cú pháp (syntax). Vai trò của chúng ta đã dịch chuyển thành **người thiết kế hệ thống và kiểm duyệt (Architect & Reviewer)**.

Thay vì tốn 3 tiếng gõ code và sửa các lỗi cú pháp lặt vặt, mình chỉ mất 15 phút để review cấu trúc file mà AI tạo ra, kiểm tra xem nó có đúng logic nghiệp vụ và thẩm mỹ mộc mạc của thương hiệu hay không. Việc "ủy thác" giúp giải phóng 90% sức lao động chân tay để nhường chỗ cho tư duy định hướng sản phẩm.

### Tương lai của Solopreneur

Với những Solopreneur (người làm sản phẩm độc lập), sự xuất hiện của AI Agent giống như việc bạn được cấp một đội ngũ kỹ sư phần mềm, thiết kế và viết content trung thành hoạt động 24/7. Bạn không cần một công ty chục người để vận hành một sản phẩm triệu người dùng nữa. Bạn chỉ cần một ý tưởng tốt, một tư duy sản phẩm nhạy bén, và khả năng điều phối các AI Agent làm việc nhịp nhàng.

Nếu bạn còn đang dùng AI ở mức hỏi - đáp thông thường, hãy thử tìm hiểu về AI Agent và các công cụ thực thi tự động. Nó sẽ mở ra một chương hoàn toàn mới trong cách bạn làm việc và sáng tạo.

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`,
        coverImage: "/images/tu-chat-sang-uy-thac-ai-agent.png",
        readTime: 5,
        published: true,
        date: new Date("2026-06-25T07:00:00+07:00"),
        categoryId: "86bf776d-3db4-462d-a871-324fb05e7fc3" // Công nghệ & AI
      },
      {
        title: "Khi AI viết content tràn ngập internet: Giá trị của sự \"không hoàn hảo\" trong viết lách",
        slug: "gia-tri-cua-su-khong-hoan-hao-khi-viet-blog",
        description: "Internet năm 2026 ngập tràn văn bản bóng bẩy do AI viết. Đây là lý do vì sao những vết gồ ghề, những câu chuyện vụng về nhưng thật lại là thứ duy nhất giữ chân độc giả.",
        content: `Dạo một vòng quanh các trang blog công nghệ, marketing hay thậm chí là mạng xã hội vào giữa năm 2026, mình có một cảm giác rất rõ ràng: **mệt mỏi vì sự hoàn hảo**.

Hầu hết các bài viết đều có chung một cấu trúc chuẩn chỉnh, những câu mở đầu bay bướm kiểu "Trong kỷ nguyên số phát triển vượt bậc...", những bullet point phân tích logic 1-2-3 sắc sảo và một đoạn kết luận cân đối truyền cảm hứng. Đó là dấu vết không thể trộn lẫn của nội dung được tạo hàng loạt từ các mô hình ngôn ngữ lớn (LLM). Khi việc tạo ra một bài viết 2.000 từ chỉ mất đúng 5 giây, internet lập tức bị ngập lụt trong các bài viết chuẩn chỉnh nhưng vô hồn.

Chính lúc này, mình nhận ra giá trị thực sự của sự **không hoàn hảo**.

### Độc giả đang tìm kiếm điều gì?

Người đọc năm 2026 không thiếu thông tin hay kiến thức dạng bách khoa toàn thư. Cái họ thiếu và thực sự khao khát tìm kiếm là **trải nghiệm thật của một con người bằng xương bằng thịt**.

Họ muốn đọc về:
* Một lần bạn đưa ra quyết định sai lầm trong sản phẩm và phải thức trắng đêm để rollback dữ liệu.
* Cảm giác lo lắng, overthinking của bạn khi chuẩn bị bấm nút publish một bài viết hay ra mắt sản phẩm mới.
* Những câu chữ hơi lủng củng, những cách so sánh mộc mạc nhưng phản ánh chân thực cuộc sống xung quanh bạn.

Sự hoàn hảo bóng bẩy của AI làm cho những vết xước, những điểm vụng về trong trải nghiệm của con người trở nên đáng quý hơn bao giờ hết. Đó là thứ duy nhất không thể bị sao chép bởi các thuật toán.

### Triết lý viết lách trên HarryShare

Khi mình bắt đầu xây dựng HarryShare, mình và trợ lý AI đã thống nhất một quy tắc bất di dịch: **Không bao giờ viết bài bằng giọng chuyên gia sáo rỗng hoặc lạm dụng AI để viết hộ cảm xúc**.

Mỗi bài viết ở đây phải là một ghi chép thật từ những việc mình đã làm, những cuốn sách mình đã đọc và những bài học mình tự rút ra. Có những bài viết sẽ có cấu trúc không thực sự cân đối, có những câu văn hơi dài, nhưng nó là tiếng nói thật của mình ở thời điểm viết. Mình viết trước hết cho chính bản thân mình của 10 năm sau đọc lại; và nếu bạn tìm thấy một chút đồng cảm ở đây, đó là món quà tốt lành nhất.

### Viết như một cách kết nối chân thật

Nếu bạn cũng đang xây dựng thương hiệu cá nhân hoặc viết blog trong thời đại AI này, lời khuyên chân thành của mình là hãy dũng cảm thể hiện những điểm "không hoàn hảo". 

Đừng cố gắng viết giống một cuốn sách self-help hay một chuyên gia toàn năng. Hãy kể câu chuyện thật của bạn, thừa nhận những lỗi sai, và chia sẻ cả những điều bạn chưa biết. Độc giả không kết nối với những con robot hoàn hảo; họ kết nối với những con người chân thật.

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`,
        coverImage: "/images/gia-tri-cua-su-khong-hoan-hao-khi-viet-blog.png",
        readTime: 4,
        published: true,
        date: new Date("2026-06-26T07:00:00+07:00"),
        categoryId: "43ca4023-beb9-46fa-9d0b-0300d6d5dbdf" // Thương hiệu cá nhân
      },
      {
        title: "Chạy AI offline ngay trên laptop: Vì sao mình chọn tự host mô hình thay vì dùng API đám mây?",
        slug: "tu-host-model-ai-offline-tren-laptop",
        description: "Bảo mật dữ liệu, tốc độ phản hồi và sự tự chủ. Trải nghiệm của mình khi cài đặt và chạy các mô hình ngôn ngữ lớn (LLM) offline ngay trên máy cá nhân.",
        content: `Một trong những từ khóa được tìm kiếm nhiều nhất gần đây trên các diễn đàn công nghệ là "Local AI" hoặc "Sovereign AI" (AI tự chủ). Nó phản ánh một xu hướng dịch chuyển lớn: thay vì phụ thuộc hoàn toàn vào API đám mây của OpenAI, Anthropic hay Google, các lập trình viên và doanh nghiệp đang chọn cách chạy mô hình ngôn ngữ lớn (LLM) trực tiếp trên phần cứng của chính mình.

Mình cũng đã chuyển hướng sang setup này cho các tác vụ công việc và viết lách hằng ngày. Dưới đây là những lý do thực tế vì sao chạy AI offline trên laptop lại là lựa chọn mang lại sự yên tâm tuyệt đối cho một Solopreneur.

### 1. Bảo mật dữ liệu là trên hết

Khi làm việc với các dự án cá nhân hoặc viết nhật ký, mình thường xuyên phải nạp vào AI những dữ liệu nhạy cảm: các dòng code chứa logic cốt lõi của website, bản nháp ý tưởng sản phẩm mới chưa công bố, hay thậm chí là những suy nghĩ cá nhân mang tính riêng tư sâu sắc. 

Nếu dùng các API đám mây công cộng, mặc dù các điều khoản cam kết bảo mật, dữ liệu của bạn vẫn được gửi đi qua internet và lưu trữ trên máy chủ của bên thứ ba. Với việc chạy mô hình offline thông qua Ollama hay Llama.cpp, toàn bộ thông tin chỉ nằm duy nhất trong ổ cứng laptop của bạn. Không kết nối mạng, không truyền dữ liệu ra ngoài. Sự an tâm này là vô giá.

### 2. Tiết kiệm chi phí và không phụ thuộc đường truyền

Nếu bạn dùng các API đám mây cho các tác vụ tự động hóa chạy lặp đi lặp lại liên tục, hóa đơn thanh toán cuối tháng có thể tăng lên rất nhanh. Chạy cục bộ có nghĩa là bạn chỉ tốn tiền điện để sạc laptop. Bạn có thể cho AI phân tích hàng triệu ký tự dữ liệu thô mà không lo lắng về token hay chi phí vượt định mức.

Ngoài ra, những lúc làm việc trên xe khách, tại quán cà phê sóng yếu, hoặc khi đường cáp quang biển gặp sự cố, hệ thống AI offline của bạn vẫn phản hồi ngay lập tức với độ trễ gần như bằng không.

### 3. Trải nghiệm cài đặt thực tế

Ban đầu mình nghĩ chạy mô hình cục bộ sẽ rất phức tạp và cần máy trạm GPU khủng. Nhưng thực tế vào năm 2026, nhờ sự tối ưu hóa của cộng đồng mã nguồn mở, việc chạy mô hình Llama 3 hay Mistral 7B trên một chiếc laptop MacBook Pro hoặc máy Windows có card đồ họa rời là cực kỳ mượt mà.

Chỉ với 2 câu lệnh cài đặt Ollama, mình đã có ngay một trợ lý AI thông minh chạy ngầm dưới máy. Nó hỗ trợ mình viết code nhanh, tóm tắt tài liệu thô và gợi ý các cấu trúc logic mà không tốn một xu phí thuê bao tháng.

### Lời kết

Xu hướng tự chủ công nghệ sẽ còn phát triển rất mạnh. Việc học cách tự cài đặt, quản lý và sử dụng các công cụ AI offline không chỉ giúp bạn bảo vệ tài sản trí tuệ của mình mà còn rèn luyện tư duy tự lập của một Solopreneur thực thụ.

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`,
        coverImage: "/images/tu-host-model-ai-offline-tren-laptop.png",
        readTime: 5,
        published: true,
        date: new Date("2026-06-27T07:00:00+07:00"),
        categoryId: "86bf776d-3db4-462d-a871-324fb05e7fc3" // Công nghệ & AI
      },
      {
        title: "Đừng chỉ làm \"người ra lệnh\" (Prompter): Tư duy Product của một Solopreneur trong kỷ nguyên Agentic",
        slug: "tu-prompter-sang-solopreneur-product-thinking",
        description: "Khi bất kỳ ai cũng có thể viết prompt tốt nhờ AI hỗ trợ, sự khác biệt nằm ở tư duy làm sản phẩm - thấu hiểu điểm đau thực tế của khách hàng.",
        content: `Khoảng một năm trước, cụm từ "Prompt Engineering" (Kỹ nghệ tạo câu lệnh) được ca ngợi như một kỹ năng thời thượng, mở ra cơ hội nghề nghiệp lương cao cho những ai biết cách giao tiếp với AI. Người ta tin rằng việc biết dùng đúng từ khóa, đúng cấu trúc lệnh là một lợi thế cạnh tranh lớn.

Nhưng đến nay, khi các AI tự động (AI Agent) có khả năng tự tinh chỉnh câu lệnh, tự suy luận các bước trung gian và tự tạo ra prompt tối ưu nhất cho chính nó, vị thế của "Prompter" thuần túy đã thay đổi hoàn toàn.

Nếu bạn chỉ dừng lại ở việc gõ prompt để lấy kết quả, bạn sẽ rất dễ bị thay thế. Thứ thực sự tạo nên sự khác biệt lúc này là **Tư duy sản phẩm (Product Thinking)**.

### Sự khác biệt giữa Prompter và Product Thinker

Một người viết prompt (Prompter) tập trung vào công cụ: *"Làm sao để ra lệnh cho AI viết code nhanh hơn? Làm sao để AI thiết kế ảnh đẹp hơn?"*

Một người làm sản phẩm (Product Thinker) tập trung vào vấn đề:
* Vấn đề này của khách hàng có thực sự tồn tại không, hay chỉ là do mình tự tưởng tượng ra?
* Khách hàng hiện tại đang giải quyết vấn đề đó bằng cách nào? Giải pháp của mình có giúp họ tiết kiệm thêm thời gian hay công sức một cách đáng kể không?
* Làm sao để kiểm chứng nhanh nhất ý tưởng này mà không cần tốn hàng tuần viết code phức tạp?

AI có thể giúp bạn viết code, thiết kế UI hay tạo nội dung trong nháy mắt. Nhưng AI không thể thay bạn đi nói chuyện với người dùng, cảm nhận nỗi đau của họ và đưa ra những quyết định chiến lược về việc có nên build tính năng này hay không.

### Trải nghiệm từ bản thân Harry

Khi mình chuyển từ xuất phát điểm là dân kỹ thuật (IT) sang làm Marketing và tự xây dựng các sản phẩm cá nhân, bài học lớn nhất mình học được là: **Khách hàng không mua công nghệ, họ mua giải pháp cho vấn đề của họ**.

Dù mình có thể viết những prompt cực kỳ phức tạp để bắt AI agent dựng lên một website lung linh với các tính năng hiện đại nhất, sản phẩm đó vẫn sẽ thất bại nếu không giải quyết được bất kỳ điểm đau thực tế nào của người dùng. Tư duy sản phẩm giúp mình biết cách kìm hãm sự ham thích công nghệ lại để tập trung vào điều đơn giản nhất mang lại giá trị.

### Lời khuyên cho những bạn trẻ trong thời đại mới

Nếu bạn đang muốn xây dựng sự nghiệp độc lập (Solopreneur) hoặc tạo dựng uy tín cá nhân, hãy dịch chuyển tư duy của mình:
1. Đừng chỉ học cách đặt câu hỏi cho AI, hãy học cách **phát hiện vấn đề thực tế** trong cuộc sống hằng ngày của những người xung quanh.
2. Học cách thiết lập một quy trình thử sai nhanh (MVP) để kiểm chứng giả thuyết trước khi bắt tay vào xây dựng chi tiết.
3. Rèn luyện tư duy thấu cảm để hiểu sâu sắc hành vi và tâm lý người dùng.

AI là một trợ thủ đắc lực giúp bạn rút ngắn 90% thời gian thực thi, nhưng 10% còn lại của định hướng sản phẩm và thấu cảm con người mới là thứ định nghĩa sự thành bại của bạn.

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`,
        coverImage: "/images/tu-prompter-sang-solopreneur-product-thinking.png",
        readTime: 5,
        published: true,
        date: new Date("2026-06-28T07:00:00+07:00"),
        categoryId: "8284dd6b-bd7d-4b08-bd39-d59f3697288e" // Tư duy sản phẩm
      }
    ];

    for (const post of posts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: post,
        create: post
      });
      console.log(`Upserted post: ${post.title}`);
    }
    console.log('Successfully completed database seeding for trend posts!');
  } catch (err) {
    console.error('Error inserting trend posts:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
