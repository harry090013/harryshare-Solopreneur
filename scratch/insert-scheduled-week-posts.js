const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- INSERTING 4 SCHEDULED POSTS FOR WEEK 14/09 - 20/09/2026 ---');

  // Fetch Category IDs
  const catBranding = await prisma.category.findUnique({ where: { slug_type: { slug: 'thuong-hieu-ca-nhan', type: 'post' } } });
  const catTech = await prisma.category.findUnique({ where: { slug_type: { slug: 'cong-nghe-ai', type: 'post' } } });
  const catProduct = await prisma.category.findUnique({ where: { slug_type: { slug: 'tu-duy-san-pham', type: 'post' } } });
  const catCareer = await prisma.category.findUnique({ where: { slug_type: { slug: 'hanh-trinh-lam-nghe', type: 'post' } } });

  const posts = [
    // -------------------------------------------------------------
    // POST 1: THỨ HAI (14/09/2026) - THƯƠNG HIỆU CÁ NHÂN
    // -------------------------------------------------------------
    {
      title: "Vì sao mình chọn làm công cụ miễn phí: Triết lý 'cho đi trước' của một Solopreneur",
      slug: "vi-sao-minh-chon-lam-cong-cu-mien-phi",
      description: "Một người làm việc độc lập với quỹ thời gian eo hẹp, tại sao lại dành hàng giờ đồng hồ code công cụ miễn phí không gắn quảng cáo? Đây là lý do Harry chọn triết lý 'cho đi trước' trên hành trình xây dựng thương hiệu cá nhân.",
      coverImage: "/images/vi-sao-minh-chon-lam-cong-cu-mien-phi-cover.webp",
      readTime: 5,
      published: true,
      date: new Date("2026-09-14T00:00:00.000Z"),
      categoryId: catBranding.id,
      views: 82,
      likes: 38,
      shares: 12,
      content: `Tuần vừa qua, khi mình vừa hoàn thiện xong hai công cụ online trên website — [Studio Lồng Khung Ảnh & Mockup](/du-an-tai-nguyen/ghep-anh-mockup) và [Trình Tạo Mã VietQR Để Bàn](/du-an-tai-nguyen/tao-ma-qr) — một người bạn làm trong ngành phần mềm nhắn tin hỏi mình:

> *"Ủa Hiếu, sao không gắn cổng thanh toán thu phí 20k – 50k một lượt tải, hoặc ít nhất cũng chèn cái banner Google AdSense kiếm vài đồng tiền trà đá? Tự tay code mấy ngày trời mà để miễn phí 100% vậy không thấy tiếc công à?"*

Câu hỏi của bạn làm mình khựng lại một lúc. Nó rất thực tế, rất logic theo kiểu dân kinh doanh công nghệ thông thường. Nhưng chính câu hỏi ấy lại khiến mình càng nhìn rõ hơn lý do vì sao mình bắt đầu xây dựng HarryShare.

---

### Cám dỗ của việc muốn "thu về ngay"

Trong thời đại số hiện nay, chúng ta bị bủa vây bởi những công thức làm giàu cấp tốc và các phễu chuyển đổi tinh vi. Hễ ai làm ra một thứ gì đó có ích, phản xạ đầu tiên luôn là: *Làm sao để kiếm tiền từ người dùng ngay lập tức?*

Đó là lý do mỗi khi bạn vào một trang web công cụ trên mạng, bạn sẽ gặp đủ thứ phiền toái:
- Bắt buộc phải đăng ký tài khoản và để lại số điện thoại.
- Bị ép xem 30 giây quảng cáo giật gân mới cho tải file về máy.
- Ảnh tải về bị đóng một chiếc logo to đùng (watermark) ở góc, muốn gỡ thì phải nâng cấp tài khoản VIP hàng tháng.

Là một người dùng, mình từng rất ức chế với những trải nghiệm như vậy. Và khi trở thành người làm sản phẩm, mình tự nhủ: **Mình sẽ không bao giờ tạo ra thứ trải nghiệm mà bản thân mình từng ghét bỏ.**

---

### Bắt đầu từ nhu cầu thật của chính mình

Hai công cụ mình vừa đưa lên website thực ra không phải do mình "ngồi rảnh nghĩ ra để làm màu". Chúng xuất phát từ chính nhu cầu công việc hàng ngày của Harry:

1. **Với mã VietQR:** Ở xưởng nhang quê mình, khi khách đến mua trực tiếp hoặc chuyển khoản ủng hộ, mình cần một chiếc bảng mã QR để bàn thanh toán Napas 24/7 thật trang nhã, in rõ số tài khoản và tên chủ tài khoản, không bị méo mó và không dính logo rác của các ứng dụng bên ngoài.
2. **Với Studio Mockup & Khung hình:** Khi viết blog hoặc đăng bài giới thiệu sản phẩm mộc, mình cần một nơi để đưa ảnh chụp màn hình hay chân dung vào khung iPhone, cuộn phim 35mm hoài cổ một cách nhanh chóng bằng phím tắt \`Ctrl + V\`, xử lý hoàn toàn trên trình duyệt mà không cần mở Photoshop nặng nề.

Mình làm ra công cụ này trước hết để giải quyết bài toán của chính mình. Và khi nó đã chạy tốt, việc chia sẻ nó hoàn toàn miễn phí cho cộng đồng là một quyết định rất tự nhiên.

---

### Triết lý "cho đi trước" (Value-first)

Nhiều người nghĩ xây dựng thương hiệu cá nhân là phải xuất hiện thật hào nhoáng, phát ngôn những câu triết lý đao to búa lớn trên mạng xã hội. Nhưng với Harry, [thương hiệu cá nhân bắt đầu từ sự thật](/chia-se/thuong-hieu-ca-nhan-bat-dau-tu-su-that) và **giá trị tử tế mà bạn để lại trong lòng người khác**.

Khi một bạn sinh viên cần tạo mã QR cho bài thuyết trình môn học, khi một chị chủ quán nước nhỏ ở quê cần in bảng thanh toán để bàn, hay khi một người làm nội dung cần đóng khung bức ảnh cho bài viết của họ... họ ghé vào HarryShare, bấm vài thao tác đơn giản, nhận được bức ảnh sắc nét, sạch sẽ và hoàn toàn miễn phí. 

Khoảnh khắc họ thở phào nhẹ nhõm vì không bị quấy rầy bởi quảng cáo, đó chính là lúc niềm tin được hình thành.

Niềm tin là thứ tài sản đắt giá nhất của một Solopreneur. Tiền bạc từ quảng cáo vài ba đồng lẻ có thể kiếm được ngay, nhưng một khi người đọc cảm thấy họ đang bị "dắt mũi" hay bị lợi dụng, niềm tin ấy sẽ tan biến vĩnh viễn.

---

### Lời nhắn cho Harry của 10 năm sau

> *Harry ơi, sau này dù công việc kinh doanh có mở rộng đến đâu, dù áp lực tài chính có lúc nặng nề thế nào, hãy luôn nhớ về những ngày đầu ngồi cặm cụi code từng dòng Canvas để tạo ra những công cụ miễn phí này.*

Cho đi trước không phải là ngây thơ, mà là sự lựa chọn tỉnh táo để đi đường dài. Khi bạn trao đi giá trị thật mà không toan tính vụ lợi, thế giới tự khắc sẽ mở ra những cánh cửa bất ngờ mà bạn chưa từng nghĩ tới.

---

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // -------------------------------------------------------------
    // POST 2: THỨ TƯ (16/09/2026) - CÔNG NGHỆ & AI
    // -------------------------------------------------------------
    {
      title: "Giới hạn của AI Agent: Những bài học khi để AI làm việc cùng mình mỗi ngày",
      slug: "gioi-han-cua-ai-agent-nhung-bai-hoc-thuc-te",
      description: "AI Agent trong năm 2026 có thể viết cả ngàn dòng code trong chớp mắt. Nhưng nếu người đứng sau không có gu thẩm mỹ và thiếu sự thấu cảm thực tế, sản phẩm sẽ nhanh chóng trở nên 'vô hồn'. Đây là những bài học thực chiến của Harry.",
      coverImage: "/images/gioi-han-cua-ai-agent-nhung-bai-hoc-thuc-te-cover.webp",
      readTime: 6,
      published: true,
      date: new Date("2026-09-16T00:00:00.000Z"),
      categoryId: catTech.id,
      views: 95,
      likes: 46,
      shares: 15,
      content: `Tiếp nối câu chuyện [Khi một dân IT học cách 'chỉ huy' thay vì 'tự code'](/chia-se/dan-it-hoc-cach-chi-huy-ai), những ngày qua mình dành phần lớn thời gian làm việc trực tiếp cùng các mô hình AI Agent thế hệ mới. 

Phải thừa nhận một điều: Tốc độ của AI trong năm 2026 thực sự khủng khiếp. Những module tính toán đồ họa Canvas, dựng khung 3D hay tái cấu trúc cơ sở dữ liệu mà trước đây một lập trình viên có thể mất cả tuần cặm cụi, nay AI Agent có thể hoàn thành trong chưa đầy 10 phút.

Thế nhưng, sau sự choáng ngợp ban đầu, mình bắt đầu đối mặt với những "cú vấp" thực tế — những ranh giới mà nếu người làm chủ không tỉnh táo, AI sẽ rất dễ kéo sản phẩm của bạn rơi vào sự giả tạo và vô hồn.

---

### Khi AI "tự tung tự tác" và bài học về logic đời sống

Tuần qua, trong một phiên làm việc tự động hóa, mình đã gặp hai tình huống khiến mình phải giật mình thức tỉnh:

1. **AI không hiểu được tính hợp lý của cuộc sống:** Khi hỗ trợ mô phỏng dữ liệu tương tác, AI đã tự động gán một bài viết có 47 lượt thích nhưng chỉ có... 1 lượt xem! Về mặt mã nguồn (code), điều đó không hề vi phạm syntax. Nhưng về mặt logic con người, một người bình thường nhìn vào là thấy ngay sự giả dối và buồn cười.
2. **AI không có gu thẩm mỹ tự nhiên:** Khi dựng giao diện mã QR, AI vô tư render một chiếc canvas bị kéo giãn dài ngoằng như một tấm bìa các-tông méo mó. Với AI, miễn sao các thẻ HTML hiển thị trên màn hình mà không báo lỗi console là "Task Complete". Nó không có đôi mắt để cảm nhận được sự méo mó, kỳ cục ấy.
3. **AI có thể tự tiện quyết định thay bạn:** Trong lúc gán dữ liệu cho công cụ tạo mã QR, AI đã tự ý lấy ảnh chân dung cá nhân của mình từ một bài blog để làm icon đại diện cho tool! Đó là một quyết định máy móc, thiếu tế nhị mà không một người làm sản phẩm có kinh nghiệm nào lại đi làm như vậy.

Những ví dụ nhỏ đó cho thấy một sự thật trần trụi: **AI rất giỏi tính toán xác suất, nhưng hoàn toàn mù tịt về sự thấu cảm và bối cảnh sống của con người.**

---

### Ranh giới của tự động hóa: Đâu là nơi con người phải đứng mũi chịu sào?

Sau nhiều lần thử và sai, mình đã đúc kết ra 3 nguyên tắc bất di bất dịch khi làm việc cùng AI Agent:

#### 1. AI là cộng sự thực thi, không phải người đưa ra quyết định
Bạn có thể yêu cầu AI viết 5 hàm toán học, tạo 10 phương án bố cục, nhưng bạn tuyệt đối không được để AI tự chọn phương án cuối cùng. Người làm chủ phải là người ra đề bài (Prompt), đặt tiêu chuẩn nghiệm thu và chịu trách nhiệm 100% về chất lượng sản phẩm.

#### 2. Kiểm chứng từng chi tiết (Trust, but verify)
Đừng bao giờ tin tưởng mù quáng vào dòng chữ *"Task completed successfully"* của AI. Hãy luôn mở trình duyệt, tự tay click từng nút bấm, thử kéo từng thanh trượt, kiểm tra trên cả màn hình điện thoại lẫn máy tính. Sự cẩu thả của người chỉ huy sẽ biến năng lực của AI thành một đống rác công nghệ bóng bẩy.

#### 3. Gu thẩm mỹ và sự tử tế không thể sinh ra từ thuật toán
Một bảng màu ấm áp gợi cảm giác mộc mạc của quê hương, một câu chú thích chân thành dưới đáy mã QR hay một trải nghiệm kéo ảnh mượt mà... những thứ đó chỉ có thể xuất phát từ trái tim của một người thực sự yêu sản phẩm của mình.

---

### Lời kết

Công nghệ sinh ra là để giải phóng sức lao động, chứ không phải để chúng ta trở nên lười suy nghĩ. AI có thể giúp bạn đi nhanh gấp 10 lần, nhưng đi đúng hướng hay đi vào ngõ cụt thì phụ thuộc hoàn toàn vào chiếc la bàn bên trong tâm trí bạn.

---

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // -------------------------------------------------------------
    // POST 3: THỨ SÁU (18/09/2026) - TƯ DUY SẢN PHẨM
    // -------------------------------------------------------------
    {
      title: "Làm sản phẩm vật lý khác gì làm phần mềm? Bài học từ que nhang và dòng code",
      slug: "lam-san-pham-vat-ly-khac-gi-lam-phan-mem",
      description: "Một bên có phím tắt Ctrl + Z để sửa sai trong 3 giây, một bên phải đợi cả tuần nắng và canh từng cơn mưa bất chợt. Bài học giao thoa thú vị giữa một người làm phần mềm và một người kế thừa nghề làm nhang truyền thống.",
      coverImage: "/images/lam-san-pham-vat-ly-khac-gi-lam-phan-mem-cover.webp",
      readTime: 6,
      published: true,
      date: new Date("2026-09-18T00:00:00.000Z"),
      categoryId: catProduct.id,
      views: 89,
      likes: 41,
      shares: 11,
      content: `Một ngày bình thường của Harry ở quê thường bắt đầu bằng hai trạng thái hoàn toàn trái ngược nhau.

Buổi sáng, mình ngồi trong phòng làm việc, mở máy tính lên viết code cho website HarryShare, tinh chỉnh từng hiệu ứng Canvas hay cấu hình lại database. Nếu chẳng may gõ nhầm một hàm, mình chỉ cần nhấn \`Ctrl + Z\`. Nếu hệ thống phát sinh lỗi, mình sửa lại code rồi gõ \`git push\`, chưa đầy 3 phút sau Vercel đã tự động cập nhật bản sửa lỗi lên toàn cầu.

Nhưng đến gần trưa, khi gập máy tính lại và bước ra sân phơi của gia đình để phụ mẹ đảo những giàn nhang quế, nhang bài của [Thảo Mộc Hương](/san-pham), mình lập tức bước chân vào một thế giới hoàn toàn khác: **Thế giới của những sản phẩm vật lý hữu hình.**

---

### Nơi không hề tồn tại phím tắt "Undo"

Ở thế giới phần mềm, sai lầm thường chỉ đánh đổi bằng vài phút gõ phím. Nhưng ở thế giới làm nhang truyền thống, thiên nhiên không cho phép bạn có nút "Undo":

- **Một cơn mưa rào bất chợt:** Nếu đang phơi nhang mà trời đổ mưa giông không kịp bê vào lán, nước mưa tạt vào làm ẩm chân nhang, cả mẻ nhang hàng ngàn que coi như hỏng hoàn toàn. Mồ hôi của cả gia đình suốt mấy ngày công tan thành mây khói.
- **Tỉ lệ thảo mộc tự nhiên:** Làm nhang sạch hoàn toàn từ vỏ bời lời, rễ cây bài, bột quế Trà Bồng mà không dùng bất kỳ giọt hóa chất kết dính hay hương liệu tạo mùi nào. Nếu mẻ bột xay hơi thô một chút, hoặc tỉ lệ nước pha trộn lệch đi một chút, que nhang khi bắn máy sẽ bị nứt, khi đốt sẽ bị tắt giữa chừng. Muốn sửa, chỉ có cách làm lại từ đầu.

Làm sản phẩm vật lý bắt buộc con người ta phải **khiêm nhường trước tự nhiên**. Bạn không thể bắt nắng gắt hơn để nhang khô nhanh trong 1 tiếng, cũng không thể đốt cháy giai đoạn ủ bột thảo mộc. Bạn phải học cách chờ đợi.

---

### Hai bán cầu não bổ trợ cho nhau

Trước đây, có những lúc mình cảm thấy hai công việc này quá mâu thuẫn: Một bên là công nghệ cao, AI, tự động hóa, mọi thứ đo bằng mili-giây; một bên là nghề truyền thống của ông bà cha mẹ, lấm lem bụi bột, đo thời gian bằng con trăng và mùa vụ.

Nhưng khi bình tâm quan sát, mình nhận ra sự giao thoa tuyệt vời giữa chúng:

1. **Phần mềm mang lại tính hệ thống cho nghề truyền thống:** Mình đem tư duy chuẩn hóa quy trình, quản trị kho bãi tinh gọn và cách thiết kế bao bì tối giản của dân IT vào từng hộp nhang Thảo Mộc Hương. Nhờ đó, sản phẩm truyền thống của quê hương Duy Xuyên có một diện mạo hiện đại, sạch sẽ và chuyên nghiệp hơn.
2. **Sản phẩm vật lý chữa lành sự vội vã của dân công nghệ:** Ngồi máy tính quá nhiều rất dễ khiến người ta rơi vào trạng thái overthinking và ảo tưởng về tốc độ. Những buổi trưa đứng giữa sân nắng ngửi mùi thơm ngọt ngào của quế, của hồi, nhìn que nhang khô dần theo từng làn gió quê... giúp tâm trí mình tĩnh lại, chân chạm đất và biết trân trọng những giá trị lao động chân chính.

---

### Bài học cho người làm sản phẩm

Như mình từng chia sẻ trong bài [Bài học từ chiếc nhang thảo mộc: Giá trị của sự kiên trì](/chia-se/bai-hoc-tu-chiec-nhang-thao-moc-gia-tri-su-kien-tri), một sản phẩm tốt không đo bằng việc bạn làm ra nó nhanh đến mức nào, mà đo bằng việc **nó tồn tại được bao lâu và mang lại cảm xúc an lành gì cho người dùng**.

Dù sau này Harry có xây dựng thêm nhiều phần mềm hiện đại, hay mở rộng thêm các dòng sản phẩm sạch từ nông nghiệp quê hương, mình vẫn sẽ giữ nguyên nguyên tắc này: **Làm thật, làm tử tế, và sản phẩm mình bán cũng phải là sản phẩm mình dám dùng mỗi ngày.**

---

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // -------------------------------------------------------------
    // POST 4: CHỦ NHẬT (20/09/2026) - HÀNH TRÌNH LÀM NGHỀ & LIFE
    // -------------------------------------------------------------
    {
      title: "Một người + AI: Cách Harry tự quản trị nhịp sống và năng lượng ở quê",
      slug: "mot-nguoi-cong-ai-quan-tri-nhip-song-o-que",
      description: "Tự do làm chủ không có nghĩa là buông thả giờ giấc. Làm thế nào để một Solopreneur vừa điều hành công việc công nghệ, vừa phụ giúp việc gia đình ở quê mà không bị kiệt sức (burnout)?",
      coverImage: "/images/mot-nguoi-cong-ai-quan-tri-nhip-song-o-que-cover.webp",
      readTime: 5,
      published: true,
      date: new Date("2026-09-20T00:00:00.000Z"),
      categoryId: catCareer.id,
      views: 78,
      likes: 39,
      shares: 10,
      content: `Khi mình quyết định [bỏ phố về quê](/chia-se/bo-pho-ve-que-nhung-kho-khan-tinh-than) để bắt đầu hành trình Solopreneur, nhiều bạn bè ở thành phố nhắn tin trêu:

> *"Sướng nhất ông Hiếu nhé, về quê tự làm chủ thì thích ngủ dậy mấy giờ thì dậy, thích làm lúc nào thì làm, tha hồ tự do thảnh thơi!"*

Nhưng chỉ những ai từng tự mình đứng mũi chịu sào một công việc mới hiểu: **Cái bẫy lớn nhất của sự "tự do" chính là sự hỗn loạn.**

Trong tuần đầu tiên về quê, mình đã rơi vào đúng chiếc bẫy ấy. Vì không có tiếng chuông báo chấm công lúc 8h sáng, không có sếp giao deadline, ranh giới giữa "làm việc" và "nghỉ ngơi" trong căn nhà mình hoàn toàn biến mất. Mình mở mắt ra là nghĩ đến bài viết, ăn cơm cũng cắm đầu vào điện thoại kiểm tra tin nhắn, và đêm đến lại ngồi ôm laptop đến 1-2h sáng. Kết quả là chỉ sau 10 ngày, mình kiệt sức và cảm thấy ngột ngạt hơn cả những ngày chen chúc trên đường phố Sài Gòn.

---

### Solopreneur không chết vì thiếu việc, mà chết vì cạn kiệt năng lượng

Là một người làm việc độc lập kết hợp cùng AI, bạn có thể giải quyết khối lượng công việc tương đương một nhóm 3-4 người. Nhưng cơ thể và tâm trí của bạn thì vẫn chỉ là một con người bằng xương bằng thịt.

Nếu bạn không biết cách tự quản trị năng lượng của mình, bạn sẽ rất nhanh rơi vào trạng thái [những ngày mất trớn](/chia-se/ngay-mat-tron-solopreneur) — ngồi trước màn hình cả ngày nhưng không làm nổi một dòng chữ trọn vẹn.

Để thoát khỏi vòng lặp độc hại đó, mình đã thiết lập lại toàn bộ nhịp sống theo **3 khối thời gian cố định**:

#### Khối 1: Deep Work (05:30 – 09:30 sáng)
Đây là khoảng thời gian vàng của một ngày ở quê. Không khí mát mẻ, tiếng chim hót ngoài vườn và mọi thứ tĩnh lặng tuyệt đối. Mình dành trọn 4 tiếng này cho những việc đòi hỏi sự tập trung sâu sắc nhất: viết bài blog mới, lên kế hoạch nội dung, hoặc lập trình tính năng mới cùng AI. Tuyệt đối không mở mạng xã hội, không check email trong khung giờ này.

#### Khối 2: Thực địa & Gia đình (10:00 – 16:00 chiều)
Sau buổi sáng làm việc trí óc căng thẳng, buổi chiều là lúc mình dành cho thế giới vật lý: phụ mẹ ra xưởng nhang, đóng gói các đơn hàng gửi đi, trao đổi với đối tác hoặc làm việc nhà. Vận động tay chân giúp máu huyết lưu thông và giải phóng những căng thẳng tích tụ trong não bộ.

#### Khối 3: Tái tạo & Kết nối (16:30 – 21:30 tối)
Buổi chiều muộn, mình thường chạy bộ quanh con đường làng Duy Xuyên rợp bóng cây xanh, hít thở mùi rơm rạ mùa gặt. Buổi tối ăn cơm cùng gia đình, đọc vài trang sách hoặc học thêm một kiến thức công nghệ mới. Đúng 22h00 là tắt toàn bộ thiết bị điện tử để chuẩn bị đi ngủ.

---

### Bài học cho Harry của 10 năm sau

Khi nhìn lại chặng đường này, điều mình tự hào nhất không phải là việc mình đã code được bao nhiêu trang web, hay viết được bao nhiêu bài viết. Điều mình tự hào nhất là **mình đã học được cách làm chủ cuộc sống của chính mình một cách bình an**.

> *Tự do thật sự không phải là làm bất cứ điều gì mình thích vào bất cứ lúc nào. Tự do thật sự là có đủ kỷ luật để bảo vệ năng lượng của mình, để mỗi sớm mai thức dậy bạn đều thấy lòng mình nhẹ nhõm và sẵn sàng cống hiến cho những điều tử tế.*

---

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    }
  ];

  for (const post of posts) {
    const res = await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post
    });
    console.log(`✓ Post scheduled: "${res.title}" on ${res.date.toISOString().slice(0, 10)} (${res.slug})`);
  }

  console.log('--- ALL 4 POSTS INSERTED & SCHEDULED SUCCESSFULLY ---');
}

main().catch(err => {
  console.error('Error inserting scheduled posts:', err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
