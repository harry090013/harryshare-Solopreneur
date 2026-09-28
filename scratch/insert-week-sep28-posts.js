const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- INSERTING SCHEDULED POSTS FOR WEEK SEP 28 - OCT 04, 2026 ---');

  // Query categories
  const catAI = await prisma.category.findFirst({ where: { slug: 'cong-nghe-ai', type: 'post' } });
  const catProduct = await prisma.category.findFirst({ where: { slug: 'tu-duy-san-pham', type: 'post' } });
  const catCareer = await prisma.category.findFirst({ where: { slug: 'hanh-trinh-lam-nghe', type: 'post' } });
  const catBrand = await prisma.category.findFirst({ where: { slug: 'thuong-hieu-ca-nhan', type: 'post' } });

  if (!catAI || !catProduct || !catCareer || !catBrand) {
    throw new Error('Could not find all required categories in database!');
  }

  const posts = [
    // 1. Thứ Ba 29/09/2026 - Công nghệ & AI
    {
      title: 'Tối ưu hóa công cụ tìm kiếm AI (GEO): Khi người dùng hỏi ChatGPT và Perplexity thay vì Google',
      slug: 'toi-uu-hoa-cong-cu-tim-kiem-ai-geo-chatgpt-perplexity',
      description: 'Tìm hiểu về GEO (Generative Engine Optimization) - xu hướng tối ưu hóa mới khi người dùng chuyển từ gõ từ khóa trên Google sang trò chuyện trực tiếp với ChatGPT, Perplexity hay Claude. Những thay đổi cốt lõi về cấu trúc nội dung, độ tin cậy dữ liệu và thẩm quyền chuyên gia để được AI trích dẫn làm nguồn.',
      coverImage: '/images/toi-uu-hoa-cong-cu-tim-kiem-ai-geo-chatgpt-perplexity.webp',
      categoryId: catAI.id,
      date: new Date('2026-09-29T07:00:00.000Z'),
      readTime: 7,
      likes: 45,
      comments: [
        {
          authorName: 'Lê Hoàng Long',
          authorEmail: 'longle.seo@gmail.com',
          content: 'Bài viết rất đúng thời điểm! Bên mình làm SEO dịch vụ năm nay chứng kiến lượng click từ Google Search giảm tầm 15-20%, nhưng traffic từ nguồn Perplexity và ChatGPT referrals lại tăng vọt. Harry cho mình hỏi về kỹ thuật schema markup, liệu việc bổ sung JSON-LD Article và Author chi tiết có giúp AI bot dễ hiểu và trích dẫn bài viết hơn không?',
          adminReply: 'Chào Long, câu hỏi rất thực chiến! Trải nghiệm của Harry với website cho thấy schema markup (đặc biệt là Schema Person, Article và About) là chiếc cầu nối kỹ thuật cực kỳ quan trọng. Khi bot của Perplexity hay GPTBot quét qua, JSON-LD giúp mô hình xác định ngay thực thể tác giả và ngữ cảnh nội dung mà không mất công suy luận. Bạn cứ đầu tư làm chuẩn schema nhé!'
        },
        {
          authorName: 'Nguyễn Phương Mai',
          authorEmail: 'mai.contentcreator@gmail.com',
          content: 'Em rất thích ý "Information Gain" mà anh Harry chia sẻ. Đúng là nếu chỉ viết lại những gì ChatGPT vốn đã biết thì nó chẳng có lý do gì để dẫn link tới mình. Nhưng với những người mới bắt đầu làm blog, chưa có nhiều số liệu hay nghiên cứu lớn thì làm sao để tạo ra "Information Gain" vậy anh?',
          adminReply: 'Chào Mai, đừng quá áp lực về nghiên cứu lớn em nhé. "Information Gain" đối với một cá nhân đơn giản là: nhật ký một thử nghiệm thực tế thất bại, một lỗi code em đã mất 3 tiếng mới gỡ được kèm giải pháp, hoặc một quy trình làm việc nhỏ em đã tự tinh chỉnh cho riêng mình. Chính sự chân thật và chi tiết nhỏ đó là thứ AI không thể tự bịa ra được.'
        }
      ],
      content: `Nếu quan sát thói quen tìm kiếm thông tin của chính mình và những người xung quanh trong một năm trở lại đây, bạn sẽ nhận thấy một sự chuyển dịch rất rõ ràng: **Số lần chúng ta mở Google để gõ từ khóa đang giảm dần, nhường chỗ cho những câu hỏi trực tiếp trên ChatGPT, Perplexity hay Claude.**

Trước đây, quy trình tìm kiếm kinh điển là: Gõ từ khóa -> Google trả về 10 đường link xanh -> Nhấp vào từng trang web -> Đọc lướt qua hàng loạt đoạn mở đầu dài dòng chuẩn SEO -> Tự tổng hợp thông tin mình cần.

Còn hiện tại, người dùng chỉ cần hỏi: *"Tôi muốn cấu hình caching cho Next.js 16 trên Vercel tối ưu nhất thì làm thế nào?"* hoặc *"So sánh chi phí thực tế giữa Cloudflare R2 và AWS S3 cho dự án nhỏ"*. Trong vòng 3 giây, mô hình AI đọc quét hàng chục nguồn, tổng hợp câu trả lời ngắn gọn, chính xác và kèm theo 2-3 đường link dẫn chứng để người đọc bấm vào kiểm tra nếu muốn.

Sự dịch chuyển từ "Search Engine" (Công cụ tìm kiếm) sang "Answer Engine" (Công cụ trả lời) đã khai sinh ra một khái niệm mới: **GEO — Generative Engine Optimization (Tối ưu hóa cho công cụ tìm kiếm tạo sinh)**.

Vậy GEO khác gì so với SEO truyền thống, và làm sao để nội dung trên website của bạn được các mô hình AI ưu tiên trích dẫn làm nguồn đáng tin cậy?

---

## 1. Sự khác biệt bản chất giữa SEO truyền thống và GEO

Để thích ứng, trước hết chúng ta cần hiểu rõ sự khác biệt trong cách thức vận hành giữa bot tìm kiếm truyền thống và mô hình ngôn ngữ lớn (LLM):

* **SEO truyền thống tối ưu cho thuật toán xếp hạng (Ranking Algorithms):** Google bot quét trang web, phân tích mật độ từ khóa, thẻ H1/H2, số lượng backlink trỏ về và các chỉ số kỹ thuật để xếp trang web của bạn vào một danh sách thứ bậc từ 1 đến 10.
* **GEO tối ưu cho năng lực tổng hợp ngữ nghĩa (Semantic Synthesis):** Các công cụ như Perplexity hay ChatGPT Search không chỉ xếp hạng link; chúng "đọc hiểu" nội dung của bạn. Khi nhận câu hỏi của người dùng, LLM sẽ tìm kiếm những đoạn văn bản có **mật độ thông tin cao (high information density)**, giải thích trực diện và có tính xác thực cao để trích xuất thành câu trả lời.

Trong thế giới của GEO, mục tiêu của bạn không còn là lọt vào Top 10 đường link để người dùng bấm vào xem banner quảng cáo, mà là trở thành **nguồn tham chiếu có thẩm quyền (Cited Authority)** mà AI tin cậy đưa vào câu trả lời cuối cùng.

---

## 2. Ba yếu tố cốt lõi giúp nội dung được AI ưu tiên trích dẫn

Qua quá trình thử nghiệm và theo dõi lưu lượng truy cập thực tế từ các nguồn AI Referrals trỏ về website, mình nhận thấy có 3 yếu tố quyết định việc nội dung của bạn có được LLM "chọn mặt gửi vàng" hay không:

### Yếu tố 1: Trực diện và mật độ ngữ nghĩa cao (Semantic Density)
Các mô hình AI hoạt động dựa trên ngữ cảnh (context window) có giới hạn. Chúng ưu tiên những đoạn văn bản cung cấp câu trả lời rõ ràng, súc tích ngay trong 1-2 câu đầu tiên của mỗi đề mục.

Những bài viết mở đầu bằng 500 từ sáo rỗng kiểu: *"Trong thời đại công nghệ 4.0 hiện nay, việc tìm kiếm thông tin đóng vai trò vô cùng quan trọng đối với cuộc sống của mỗi chúng ta..."* sẽ bị AI bỏ qua hoặc đánh giá thấp.

Thay vào đó, hãy viết theo cấu trúc kim tự tháp ngược:
1. Đưa ra câu trả lời trực tiếp hoặc định nghĩa cốt lõi ngay đầu đoạn.
2. Liệt kê các luận điểm bằng gạch đầu dòng rõ ràng.
3. Bổ sung dẫn chứng, ví dụ minh họa cụ thể ở phía sau.

### Yếu tố 2: Giá trị gia tăng thông tin độc quyền (Information Gain)
Đây là tiêu chí quan trọng nhất. Nếu bài viết của bạn chỉ tổng hợp lại những kiến thức lý thuyết chung chung vốn đã có đầy trên Wikipedia hay các trang tin tức lớn, AI sẽ tự trả lời bằng kiến thức nền của nó mà không cần trích dẫn website của bạn.

AI chỉ dẫn link tới bạn khi bài viết chứa **Information Gain (Thông tin mới có giá trị)**:
* Một số liệu thống kê thực nghiệm do chính bạn đo đạc.
* Một trường hợp thử nghiệm thất bại và bài học rút ra mà chưa ai từng viết.
* Bảng so sánh chi tiết dựa trên trải nghiệm sử dụng thực tế (thay vì sao chép thông số trên trang chủ nhà cung cấp).
* Những góc nhìn phản biện có chiều sâu dựa trên trải nghiệm làm nghề thực tế.

Chính những chi tiết chân thực mang tính cá nhân đó là thứ mà AI không thể tự suy luận ra được, và nó bắt buộc phải dẫn link về bài viết của bạn để bảo đảm tính khách quan.

### Yếu tố 3: Dấu chân số và thực thể tác giả minh bạch (Entity Authority)
Các công cụ tìm kiếm AI rất sợ hiện tượng "ảo giác" (hallucination) và tin giả. Do đó, thuật toán của chúng luôn kiểm tra chéo thực thể (Entity) của nguồn tin:
* Tác giả bài viết là ai? Có trang giới thiệu minh bạch và chuyên môn liên quan không?
* Website có cấu trúc dữ liệu chuẩn (Schema Markup: Article, Person, FAQ) để bot dễ hiểu ngữ cảnh không?
* Tác giả có tính nhất quán về mặt chủ đề trong thời gian dài hay không?

Một website cá nhân nhỏ nhưng chuyên sâu, kiên định chia sẻ về một lĩnh vực cụ thể trong nhiều năm sẽ có độ tin cậy đối với AI cao hơn rất nhiều so với một trang web tổng hợp đăng tải đủ thứ chủ đề tạp nham.

---

## 3. Những thói quen cũ cần từ bỏ khi làm nội dung thời AI

Khi bước sang kỷ nguyên GEO, một số thói quen làm SEO máy móc thời kỳ trước đã trở nên lỗi thời, thậm chí phản tác dụng:

* **Không nhồi nhét từ khóa gượng gạo:** Viết lặp đi lặp lại một cụm từ khóa chính xác chỉ khiến bài viết trở nên khó đọc với con người và bị AI đánh giá là nội dung chất lượng thấp (spam).
* **Không dùng AI xào nấu lại bài viết của người khác:** Việc dùng prompt yêu cầu ChatGPT viết lại 10 bài viết trên Google rồi đăng lên web chỉ tạo ra rác dữ liệu. Mô hình AI sau đó sẽ dễ dàng nhận diện cấu trúc văn phong quen thuộc và bỏ qua bài viết đó.
* **Không câu kéo độ dài vô nghĩa:** Bài viết dài 3.000 từ không còn giá trị nếu nó chỉ chứa lượng thông tin tương đương một bài 800 từ được chắt lọc kỹ lưỡng.

---

## Lời kết

GEO không phải là một thủ thuật kỹ thuật đen (black-hat) để đánh lừa thuật toán. Bản chất của GEO là đưa việc làm nội dung quay trở lại với giá trị nguyên bản nhất: **Tạo ra nội dung thực sự hữu ích, sâu sắc và giải quyết được vấn đề của người đọc.**

Khi bạn viết bằng trải nghiệm thật, có cấu trúc mạch lạc và số liệu rõ ràng, bạn không chỉ phục vụ tốt độc giả là con người, mà các cỗ máy AI thông minh nhất cũng sẽ tự khắc tìm đến bạn như một nguồn tham chiếu uy tín.

---
Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!`
    },

    // 2. Thứ Tư 30/09/2026 - Tư duy sản phẩm
    {
      title: 'Kiểm chứng nhu cầu thị trường trước khi làm: 3 bước xác thực ý tưởng không tốn tiền quảng cáo',
      slug: 'kiem-chung-nhu-cau-thi-truong-truoc-khi-lam-san-pham',
      description: 'Sai lầm lớn nhất của người làm sản phẩm là dành hàng tháng trời viết code hay sản xuất hàng loạt cho một thứ không ai cần. 3 bước thực tế giúp một solopreneur xác thực nhu cầu thị trường, kiểm tra mức độ sẵn sàng chi trả mà không tốn tiền chạy ads.',
      coverImage: '/images/kiem-chung-nhu-cau-thi-truong-truoc-khi-lam-san-pham.webp',
      categoryId: catProduct.id,
      date: new Date('2026-09-30T07:00:00.000Z'),
      readTime: 6,
      likes: 41,
      comments: [
        {
          authorName: 'Đặng Tuấn Anh',
          authorEmail: 'tuananh.startup@gmail.com',
          content: 'Bài viết chạm đúng nỗi đau của mình năm ngoái! Từng bỏ 4 tháng cùng 1 bạn dev cày ngày cày đêm làm một app quản lý thói quen ăn uống, ra mắt thì bạn bè tải ủng hộ xong không ai vào lại, lỗ mất mấy chục triệu tiền server và công sức. Nếu đọc được bài này sớm hơn thì mình đã làm landing page đo lường trước.',
          adminReply: 'Chào Tuấn Anh, cảm ơn bạn đã chia sẻ. Harry tin hầu như ai làm sản phẩm công nghệ cũng từng "dính chưởng" bài học đau thương này ít nhất một lần. Nhìn lại thì đó là học phí cần thiết để mình khiêm tốn hơn và luôn đặt nhu cầu thực tế của người dùng lên trước sự bay bổng của bản thân.'
        },
        {
          authorName: 'Minh Thư (Solopreneur)',
          authorEmail: 'thu.freelancer@yahoo.com',
          content: 'Em rất tâm đắc nguyên tắc "The Mom Test". Nhiều khi hỏi người thân bạn bè họ khen lấy khen để làm mình ảo tưởng. Nhưng anh Harry cho em hỏi, nếu làm bài kiểm tra Pre-order mà không có ai đặt trước thì mình nên bỏ luôn ý tưởng hay đổi góc tiếp cận (messaging) ạ?',
          adminReply: 'Chào Thư, khi không có người đặt trước, Harry thường kiểm tra 2 thứ: Một là thông điệp (messaging) đã đánh trúng nỗi đau chưa, hai là kênh tiếp cận (audience) có đúng tệp không. Em thử đổi cách diễn đạt 1-2 lần trên các nhóm khách hàng khác nhau. Nếu sau 2-3 lần điều chỉnh mà vẫn im ắng, hãy dũng cảm chuyển sang ý tưởng khác, việc dừng lại sớm là một chiến thắng vì em tiết kiệm được hàng tháng trời.'
        }
      ],
      content: `Khoảnh khắc nguy hiểm nhất của một người làm sản phẩm hay một Solopreneur thường không phải là lúc cạn kiệt ý tưởng, mà là **khoảnh khắc bạn vừa nảy ra một ý tưởng mà bạn tin là xuất chúng**.

Trong đầu bạn lúc đó tràn ngập viễn cảnh rực rỡ: Tính năng này sẽ tiện lợi biết bao, giao diện sẽ đẹp mắt thế nào, và khi ra mắt chắc chắn mọi người sẽ đổ xô vào sử dụng. Bạn hào hứng mở máy tính lên viết code thâu đêm, hoặc vội vã liên hệ các xưởng sản xuất để đặt hàng mẫu hàng trăm triệu đồng.

Nhưng thực tế nghiệt ngã là: Thống kê của CB Insights chỉ ra rằng hơn **42% các dự án khởi nghiệp thất bại vì lý do số 1: Không có nhu cầu thị trường (No Market Need)**. Nói một cách đau lòng nhưng trần trụi: Chúng ta đã tốn công sức làm ra một thứ rất đẹp, rất mượt mà, nhưng lại không ai thực sự cần nó đủ nhiều để mở ví trả tiền.

Để không lãng phí thời gian và tiền bạc, dưới đây là quy trình 3 bước xác thực nhu cầu thị trường mà mình luôn áp dụng trước khi bắt tay vào làm bất kỳ sản phẩm nào.

---

## Bước 1: Đi săn những tiếng than phiền thực tế (Problem Discovery)

Quy tắc đầu tiên: **Đừng bắt đầu bằng giải pháp, hãy bắt đầu bằng nỗi đau thực tế.**

Thay vì ngồi trong phòng kín tưởng tượng người dùng cần gì, hãy đi đến những nơi người dùng đang bức xúc than phiền về công việc hàng ngày của họ:
* **Các đánh giá 1 sao, 2 sao:** Mở App Store, Google Play hoặc các gian hàng Shopee của những sản phẩm tương tự trên thị trường. Đọc kỹ phần đánh giá tiêu cực: Người dùng đang bực mình vì điều gì? Tính năng nào bị lỗi? Dịch vụ nào chưa được đáp ứng?
* **Các hội nhóm cộng đồng chuyên ngành:** Lướt qua các diễn đàn, nhóm Facebook, Reddit nơi khách hàng mục tiêu sinh hoạt. Tìm kiếm các bài viết có từ khóa như: *"Có ai biết cách...", "Làm sao để...", "Có công cụ nào giúp..."*.
* **Quan sát các giải pháp chắp vá (Workarounds):** Nếu thấy ai đó đang phải dùng Google Sheets kết hợp với Zalo và xuất file thủ công mỗi ngày chỉ để theo dõi đơn hàng, đó chính là dấu hiệu của một nhu cầu có thật chưa được giải quyết trọn vẹn.

Khi bạn tìm thấy ít nhất 15-20 người độc lập cùng phàn nàn về cùng một vấn đề cụ thể, bạn mới có cơ sở để bước sang bước tiếp theo.

---

## Bước 2: Phỏng vấn sâu mà không để lộ giải pháp (Nguyên lý The Mom Test)

Một cái bẫy rất phổ biến khi đi hỏi ý kiến là bạn hào hứng kể: *"Mình định làm một website/ứng dụng như thế này, bạn thấy có hay không?"*. 

Người nghe — vì lịch sự hoặc muốn động viên bạn — sẽ luôn gật đầu: *"Ý tưởng hay đấy, khi nào ra mắt nhớ gửi mình dùng thử nhé!"*. Nhưng đến khi sản phẩm hoàn thành và bạn đề nghị họ trả tiền, họ sẽ im lặng hoặc bảo: *"Hiện tại mình chưa có nhu cầu"*.

Để có được sự thật khách quan, hãy áp dụng nguyên tắc trong cuốn sách kinh điển **The Mom Test**: Phỏng vấn khách hàng tiềm năng về cuộc sống và hành vi thực tế của họ trong quá khứ, tuyệt đối không nói về ý tưởng tương lai của bạn.

Những câu hỏi mang lại giá trị thật:
1. *"Lần gần nhất bạn gặp rắc rối với việc [X] là khi nào? Chuyện gì đã xảy ra lúc đó?"* (Hỏi về sự việc cụ thể đã diễn ra, không hỏi giả định).
2. *"Hiện tại bạn đang giải quyết việc đó bằng cách nào?"* (Nếu họ chưa từng tìm cách giải quyết, vấn đề đó chưa đủ đau).
3. *"Bạn đã từng bỏ tiền ra mua phần mềm/dịch vụ nào để xử lý việc này chưa? Tại sao bạn lại chọn nó?"* (Kiểm tra lịch sử chi trả thực tế).

Nếu câu trả lời cho thấy họ thường xuyên tốn thời gian, bực bội và đã từng sẵn sàng chi tiền cho các giải pháp tạm thời, bạn đã có một tín hiệu thị trường rất tích cực.

---

## Bước 3: Tạo bài kiểm tra mức độ sẵn sàng chi trả (Smoke Test / Pre-order)

Lời khen ngợi trên mạng xã hội là miễn phí, chỉ có **sự sẵn sàng hành động hoặc chi trả** mới là thước đo duy nhất của nhu cầu.

Trước khi viết một dòng code hay sản xuất hàng loạt, hãy tạo một bài kiểm tra cam kết tối giản:
* **Với sản phẩm số (Software / Template / Ebook):** Dựng một Landing Page đơn giản trong 1 buổi chiều (bằng Next.js hoặc công cụ no-code). Trang web mô tả chính xác vấn đề và giải pháp kèm theo một nút bấm: *"Đặt trước để nhận ưu đãi 50%"* hoặc *"Tham gia danh sách chờ có giới hạn (Waitlist)"*. Nếu là đặt trước, bạn có thể tích hợp cổng thanh toán cọc hoặc yêu cầu để lại thông tin liên hệ xác nhận.
* **Với sản phẩm vật lý (như sản phẩm thảo mộc):** Làm thủ công một mẻ mẫu nhỏ (Batch test), đóng gói mộc mạc và gửi tặng/bán thử giá gốc cho 20 người dùng trải nghiệm đầu tiên kèm điều kiện phỏng vấn cảm nhận chân thực sau 2 tuần.

Nếu bạn không thể thuyết phục được 10-20 người xa lạ đăng ký danh sách chờ hoặc đặt cọc trước giải pháp của bạn khi nó còn trên giấy, thì việc bạn dành thêm 3 tháng để hoàn thiện nó cũng sẽ không thay đổi được kết quả.

---

## Lời kết

Xác thực nhu cầu thị trường không làm giảm đi sự sáng tạo của bạn, mà nó giúp sự sáng tạo đó được đặt đúng chỗ và mang lại giá trị thiết thực cho cộng đồng.

Là một người làm việc độc lập với nguồn lực có hạn, việc học cách kiểm chứng nhanh, chấp nhận sai sớm và buông bỏ những ý tưởng không có nhu cầu thực tế chính là kỹ năng quan trọng nhất giúp bạn tồn tại và đi đường dài.

---
Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!`
    },

    // 3. Thứ Sáu 02/10/2026 - Hành trình làm nghề
    {
      title: 'Bóc tách chi phí thực tế để duy trì một website cá nhân độc lập trong một năm',
      slug: 'boc-tach-chi-phi-thuc-te-duy-tri-website-ca-nhan-mot-nam',
      description: 'Chi tiết bảng kê chi phí tài chính và thời gian để vận hành website cá nhân harryshare.vn trong 1 năm: tên miền, database PostgreSQL, hosting Vercel, dịch vụ email, API AI. Lời khuyên thiết thực để một người mới bắt đầu có thể sở hữu một website độc lập với ngân sách gần như 0 đồng.',
      coverImage: '/images/boc-tach-chi-phi-thuc-te-duy-tri-website-ca-nhan-mot-nam.webp',
      categoryId: catCareer.id,
      date: new Date('2026-10-02T07:00:00.000Z'),
      readTime: 7,
      likes: 48,
      comments: [
        {
          authorName: 'Vũ Quốc Hưng',
          authorEmail: 'hungvu.frontend@gmail.com',
          content: 'Bảng bóc tách chi tiết và minh bạch quá Harry ơi! Mình cũng đang dùng stack Next.js + Vercel + Supabase, công nhận chi phí infra thời nay rẻ hơn hồi xưa dùng VPS cPanel rất nhiều. Nhưng cho mình hỏi về backup database PostgreSQL, Harry đang dùng cơ chế tự động nào để đề phòng sự cố không?',
          adminReply: 'Chào Hưng! Đúng vậy, stack hiện đại tiết kiệm rất nhiều chi phí. Về backup, Harry dùng cơ chế daily automated backup có sẵn của database provider, kết hợp định kỳ chạy script export dump file cục bộ về máy tính và lưu trữ bản mã hóa trên cloud storage dự phòng. Cẩn tắc vô áy náy bạn ạ.'
        },
        {
          authorName: 'Thảo Nguyên',
          authorEmail: 'thaonguyen.copywriter@gmail.com',
          content: 'Em không biết code nhiều, đọc bài thấy anh Harry bảo có thể làm website với chi phí chỉ khoảng 300k - 500k/năm thích quá. Nếu không tự code Next.js được thì người làm viết lách như em nên dùng nền tảng nào vừa rẻ vừa dễ dùng vậy anh?',
          adminReply: 'Chào Nguyên, nếu không có nền tảng code, em hoàn toàn có thể bắt đầu với Substack (hoàn toàn miễn phí chỉ tốn tiền mua tên miền riêng nếu thích), Ghost hoặc dùng Notion kết hợp Super/Fruition. Đừng để rào cản kỹ thuật cản bước em bắt đầu viết nhé!'
        }
      ],
      content: `Khi trò chuyện về việc xây dựng thương hiệu cá nhân và sở hữu một "ngôi nhà số" riêng trên internet, câu hỏi đầu tiên mà nhiều bạn thường hỏi mình là:

*"Để tự xây và duy trì một website cá nhân chỉn chu như harryshare.vn thì mỗi năm tốn khoảng bao nhiêu tiền? Chi phí máy chủ hàng tháng có nặng gánh với một người làm tự do không?"*

Nhiều người vẫn mang định kiến từ thời kỳ trước: Muốn có một trang web động chạy mượt mà, có cơ sở dữ liệu lưu bài viết, bình luận và quản trị riêng thì phải thuê máy chủ ảo (VPS), mua hosting cPanel đắt đỏ hàng tháng và tốn hàng triệu đồng tiền bảo trì.

Nhưng trong hệ sinh thái công nghệ hiện đại năm 2026, câu trả lời thực tế có thể sẽ khiến bạn bất ngờ. Hôm nay, mình muốn bóc tách toàn bộ các khoản chi phí thực tế mà mình đang chi trả để vận hành website này trong suốt một năm qua.

---

## 1. Bóc tách chi tiết từng hạng mục chi phí

Hạ tầng của harryshare.vn được xây dựng trên stack hiện đại: **Next.js 16 (App Router), Tailwind CSS v4, Prisma ORM kết nối cơ sở dữ liệu PostgreSQL**, và triển khai trực tiếp trên nền tảng đám mây Vercel.

Dưới đây là chi tiết từng khoản chi tiêu:

### Hạng mục 1: Tên miền chính thức (Domain Name)
Đây là khoản chi phí duy nhất mang tính bắt buộc nếu bạn muốn xây dựng sự nhận diện chuyên nghiệp.
* **Chi phí thực tế:** Tên miền quốc gia \`.vn\` có phí đăng ký ban đầu khoảng 500.000đ – 650.000đ, phí duy trì định kỳ các năm tiếp theo khoảng 350.000đ – 450.000đ/năm. (Nếu bạn chọn các đuôi quốc tế phổ biến như \`.com\` hay \`.me\`, chi phí chỉ khoảng 250.000đ – 320.000đ/năm).
* **Đánh giá:** Khoản đầu tư xứng đáng nhất để sở hữu "sổ đỏ" thương hiệu trọn đời.

### Hạng mục 2: Máy chủ lưu trữ và triển khai (Hosting on Vercel)
* **Chi phí thực tế:** **0 đồng (Miễn phí hoàn toàn với gói Hobby).**
* Nhờ áp dụng kiến trúc Server Components kết hợp Static Site Generation (SSG) và Incremental Static Regeneration (ISR), phần lớn các trang bài viết của website được tạo sẵn thành các file tĩnh và lưu trữ trên mạng lưới phân phối nội dung toàn cầu (Edge CDN). Băng thông 100GB/tháng của gói miễn phí trên Vercel là quá đủ để phục vụ từ 50.000 đến 100.000 lượt truy cập hàng tháng mà không tốn một xu tiền hosting.

### Hạng mục 3: Cơ sở dữ liệu (PostgreSQL Database)
* **Chi phí thực tế:** **0 đồng (Miễn phí qua Supabase / Neon / Render).**
* Website sử dụng PostgreSQL được quản trị trên đám mây. Các nhà cung cấp hiện nay đều có gói Free Tier hào phóng (500MB lưu trữ dữ liệu text, đủ chứa hàng chục nghìn bài viết và hàng trăm nghìn bình luận). Tốc độ truy vấn qua Prisma cực nhanh và độ ổn định đạt 99.9%.

### Hạng mục 4: Hộp thư điện tử theo tên miền (Custom Domain Email)
Có một địa chỉ email dạng \`contact@harryshare.vn\` giúp tăng độ tin cậy khi trao đổi công việc với đối tác.
* **Chi phí thực tế:** **0 đồng.**
* Thay vì trả 6$/tháng cho Google Workspace, bạn hoàn toàn có thể sử dụng tính năng **Email Routing miễn phí của Cloudflare** để chuyển tiếp toàn bộ thư gửi đến tên miền về hòm thư Gmail cá nhân, hoặc dùng gói miễn phí vĩnh viễn cho 5 tài khoản của Zoho Mail.

### Hạng mục 5: Chi phí AI hỗ trợ và công cụ phụ trợ (AI Credits & Tools)
* **Chi phí thực tế:** Dao động từ **50.000đ – 100.000đ/tháng** (khoảng 600.000đ – 1.200.000đ/năm).
* Khoản này không bắt buộc cho việc vận hành website, nhưng mình dùng để chi trả cho các API hỗ trợ như OpenAI hoặc Anthropic phục vụ việc kiểm tra chính tả, tạo tóm tắt nội dung tự động và tối ưu hóa từ khóa.

---

## 2. Bảng tổng hợp chi phí vận hành một năm

Để bạn dễ hình dung, dưới đây là bảng so sánh giữa hai cấp độ đầu tư:

| Hạng mục | Gói Tối Giản (Cho người mới bắt đầu) | Cấu hình Thực Tế của HarryShare |
|---|---|---|
| **Tên miền** | Tên miền \`.com\` (~280.000đ/năm) | Tên miền \`.vn\` (~450.000đ/năm) |
| **Hosting** | Vercel / GitHub Pages (0đ) | Vercel Edge Network (0đ) |
| **Database** | Supabase Free Tier (0đ) | PostgreSQL Managed Cloud (0đ) |
| **Email tên miền** | Cloudflare Email Forwarding (0đ) | Cloudflare Email Routing (0đ) |
| **SSL / Bảo mật** | Tự động miễn phí qua Cloudflare/Vercel (0đ) | Tự động miễn phí (0đ) |
| **Công cụ AI & Tiện ích** | Tận dụng bản miễn phí (0đ) | API AI hỗ trợ (~800.000đ/năm) |
| **TỔNG CỘNG** | **~280.000đ / NĂM (~23.000đ/tháng)** | **~1.250.000đ / NĂM (~104.000đ/tháng)** |

Con số thực tế cho thấy: Chi phí tài chính để duy trì một website cá nhân độc lập hiện đại thậm chí còn thấp hơn tiền một ly cà phê mỗi tháng.

---

## 3. Khoản chi phí đắt đỏ nhất: Thời gian và Sự nhất quán

Sau khi bóc tách các con số kỹ thuật, điều mình muốn nhắn nhủ nhất đến bạn là: **Tiền bạc chưa bao giờ là rào cản lớn nhất để sở hữu một website cá nhân.**

Khoản chi phí đắt đỏ nhất mà bạn phải chuẩn bị chính là:
* **Thời gian học hỏi:** Khoảng thời gian kiên trì ngồi tìm hiểu cách vận hành, cấu hình DNS tên miền và xử lý các lỗi kỹ thuật nhỏ ban đầu.
* **Chi phí của sự nhất quán:** Cảm giác cô đơn khi viết những bài đầu tiên mà chưa có ai đọc, và kỷ luật ngồi vào bàn phím đều đặn mỗi tuần để biến website thành một kho tàng tri thức sống động theo năm tháng.

Website không phải là một chiến dịch ngắn hạn; nó là một tài sản số tích lũy giá trị theo thời gian. Khi bạn đầu tư sự chân thành và thời gian vào nó, giá trị mà bạn nhận lại sau vài năm sẽ vượt xa mọi con số chi phí ban đầu.

---
Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!`
    },

    // 4. Chủ Nhật 04/10/2026 - Thương hiệu cá nhân
    {
      title: 'Bảo vệ uy tín cá nhân trên không gian mạng: 3 nguyên tắc minh bạch khi chia sẻ kiến thức công khai',
      slug: 'bao-ve-uy-tin-ca-nhan-tren-khong-gian-mang-3-nguyen-tac-minh-bach',
      description: 'Trong thời đại ai cũng có thể trở thành "chuyên gia" sau một đêm nhờ AI, uy tín cá nhân là tài sản quý giá nhất nhưng cũng dễ tổn thương nhất. 3 nguyên tắc minh bạch về nguồn gốc dữ liệu, ranh giới năng lực và dũng cảm nhận sai để giữ sự tin cậy lâu dài.',
      coverImage: '/images/bao-ve-uy-tin-ca-nhan-tren-khong-gian-mang-3-nguyen-tac-minh-bach.webp',
      categoryId: catBrand.id,
      date: new Date('2026-10-04T07:00:00.000Z'),
      readTime: 6,
      likes: 44,
      comments: [
        {
          authorName: 'Trần Trọng Hiếu',
          authorEmail: 'hieutran.marketing@gmail.com',
          content: 'Một bài viết rất thấm thía vào sáng Chủ Nhật! Bây giờ lướt mạng xã hội sợ nhất là các bạn trẻ gắn mác chuyên gia, khoe số liệu ảo rồi bán khóa học lùa gà. Việc dám thừa nhận ranh giới năng lực của mình là một sự can đảm hiếm thấy trong thời buổi cạnh tranh chú ý khốc liệt này.',
          adminReply: 'Cảm ơn anh Hiếu đã đồng cảm. Harry luôn tự nhắc mình rằng người đọc bây giờ rất tinh tế, họ cảm nhận được ngay sự giả tạo hay chân thật qua từng câu chữ. Cứ sống thật, làm thật thì tâm mình mới bình an và đi đường dài được anh ạ.'
        },
        {
          authorName: 'Lâm Diệu Vy',
          authorEmail: 'dieuvy.lam@outlook.com',
          content: 'Em rất thích tinh thần "Public Correction" của anh Harry. Đôi khi em viết bài trên blog cá nhân mà bị ai đó bắt lỗi kiến thức là em thấy sợ hãi và xấu hổ muốn xóa bài ngay. Đọc bài của anh giúp em có một góc nhìn mới: nhận sai công khai chính là cách chứng minh sự chuyên nghiệp và cầu thị của mình.',
          adminReply: 'Chào Vy, tâm lý sợ sai là hoàn toàn tự nhiên của con người. Nhưng khi em coi việc chia sẻ là một hành trình cùng học hỏi với độc giả thay vì đứng ở trên cao dạy bảo, em sẽ thấy việc được người khác chỉ ra điểm chưa đúng là một món quà giúp mình hoàn thiện nhanh hơn rất nhiều.'
        }
      ],
      content: `Bước vào kỷ nguyên số với sự bùng nổ của các công cụ AI tạo sinh, việc sản xuất một bài viết trau chuốt, một bản kế hoạch kinh doanh chi tiết hay một slide thuyết trình đẹp mắt đã trở nên dễ dàng hơn bao giờ hết. Chỉ với vài câu lệnh, bất kỳ ai cũng có thể khoác lên mình tấm áo của một "chuyên gia" am hiểu mọi lĩnh vực.

Nhưng chính vì việc tạo ra nội dung bóng bẩy trở nên quá rẻ, **sự tin cậy và uy tín cá nhân (Personal Credibility) lại trở thành thứ tài sản khan hiếm và đắt giá nhất**.

Người đọc ngày nay rất thông minh. Họ đã bắt đầu ngán ngẩm trước những bài viết đao to búa lớn, những danh xưng tự phong hào nhoáng và những con số thành công không rõ nguồn gốc. Họ tìm kiếm những tiếng nói chân thực — những con người dám nói sự thật về những gì mình biết, những gì mình chưa biết, và cả những lần mình vấp ngã.

Warren Buffett từng có một câu nói nổi tiếng: *"Phải mất 20 năm để xây dựng danh tiếng, nhưng chỉ cần 5 phút là có thể hủy hoại nó"*. Trên hành trình xây dựng thương hiệu cá nhân và viết blog công khai, dưới đây là 3 nguyên tắc minh bạch mà mình luôn lấy làm kim chỉ nam để bảo vệ uy tín của chính mình.

---

## 1. Minh bạch về nguồn gốc: Phân định rõ trải nghiệm thật và kiến thức vay mượn

Một trong những cám dỗ lớn nhất của người làm nội dung là **nhận vơ kiến thức của người khác làm thành tựu của mình**.

Khi đọc được một case study xuất sắc từ nước ngoài hay dùng AI tổng hợp một phương pháp mới, ranh giới giữa việc "chia sẻ lại kiến thức" và "tỏ ra mình là người đã làm được việc đó" là rất mong manh:
* **Nếu đó là việc bạn trực tiếp làm:** Hãy chia sẻ chi tiết bối cảnh, số liệu thực tế, những trở ngại bạn đã gặp phải và cảm xúc chân thật trong quá trình thực hiện.
* **Nếu đó là kiến thức bạn học hỏi hoặc trích dẫn:** Hãy ghi rõ nguồn tác giả gốc, cuốn sách bạn đã đọc hoặc bài viết đã truyền cảm hứng cho bạn.
* **Nếu nội dung có sự trợ giúp của AI:** Hãy thẳng thắn xem AI như một cộng sự hỗ trợ tra cứu và biên tập, không che giấu hay thần thánh hóa kết quả.

Sự minh bạch này không làm bạn trở nên kém cỏi trong mắt người đọc; trái lại, nó chứng minh bạn là một người làm nghề có đạo đức, tôn trọng bản quyền trí tuệ và có tinh thần học hỏi nghiêm túc.

---

## 2. Rõ ràng về ranh giới năng lực (Circle of Competence)

Một căn bệnh phổ biến trên mạng xã hội là "Hội chứng chuyên gia toàn năng". Có những người hôm nay bàn luận về lập trình phần mềm, ngày mai đưa ra lời khuyên đầu tư tài chính, ngày kia lại dạy cách nuôi dạy con cái và phán xét các vấn đề vĩ mô của xã hội.

Việc cố tỏ ra mình hiểu biết mọi thứ là con đường nhanh nhất dẫn đến sự mất uy tín.

Nguyên tắc của mình là luôn xác định rõ **Vòng tròn năng lực của bản thân**:
* Hãy kiên định chia sẻ sâu về những lĩnh vực bạn thực sự có trải nghiệm cọ xát hàng ngày: Với mình, đó là việc làm sản phẩm thực tế, xây dựng hệ thống công nghệ tinh gọn và những bài học từ cuộc sống của một Solopreneur tại quê nhà.
* Với những lĩnh vực nằm ngoài chuyên môn, hãy có sự khiêm tốn trí tuệ để nói rằng: *"Đây là góc nhìn mang tính tham khảo từ góc độ cá nhân của mình, không phải lời khuyên chuyên gia"*, hoặc đơn giản là: *"Vấn đề này mình chưa có đủ trải nghiệm để đưa ra nhận định"*.

Người ta tôn trọng bạn không phải vì bạn biết tất cả mọi thứ, mà vì bạn luôn trung thực với những gì mình biết.

---

## 3. Dũng cảm đính chính và nhận sai công khai (Radical Accountability)

Không ai trong chúng ta là hoàn hảo. Khi chia sẻ hàng trăm bài viết về kỹ thuật, sản phẩm hay quy trình làm việc, chắc chắn sẽ có lúc bạn đưa ra một nhận định chưa chuẩn xác, một dòng code chưa tối ưu hoặc một số liệu bị nhầm lẫn.

Khi có độc giả hoặc đồng nghiệp để lại bình luận phản biện chỉ ra lỗi sai, bạn sẽ có hai lựa chọn:
1. **Lựa chọn tự ái:** Xóa bình luận, xóa bài viết hoặc cố gắng tranh cãi, ngụy biện để bảo vệ cái tôi của mình.
2. **Lựa chọn chính trực:** Gửi lời cảm ơn chân thành đến người đã đóng góp ý kiến, cập nhật lại bài viết kèm theo một ghi chú đính chính công khai (Public Update Note).

Trải nghiệm thực tế cho thấy, việc dám thẳng thắn nói: *"Cảm ơn bạn đã chỉ ra điểm thiếu sót này, mình đã cập nhật lại bài viết cho chính xác hơn"* không hề làm giảm uy tín của bạn. Ngược lại, nó khiến độc giả cảm nhận được sự cầu thị, tinh thần trách nhiệm và sự chuyên nghiệp thực sự của tác giả.

---

## Lời kết

Thương hiệu cá nhân không phải là một vở kịch được dàn dựng công phu để thu hút đám đông nhất thời. Thương hiệu cá nhân là hệ quả tự nhiên của những việc bạn làm mỗi ngày khi không có ai nhìn thấy, và sự nhất quán trong những gì bạn nói khi đứng trước công chúng.

Khi bạn lấy **sự thật làm nền tảng và sự minh bạch làm nguyên tắc sống**, bạn sẽ không bao giờ phải sống trong nỗi sợ hãi bị "bóc phốt". Bạn có thể ngủ ngon mỗi đêm và bình thản bước đi trên con đường của riêng mình.

---
Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!`
    }
  ];

  for (const post of posts) {
    // 1. Upsert Post
    const upserted = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        description: post.description,
        content: post.content,
        coverImage: post.coverImage,
        categoryId: post.categoryId,
        published: true,
        date: post.date,
        readTime: post.readTime,
        likes: post.likes
      },
      create: {
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
        coverImage: post.coverImage,
        categoryId: post.categoryId,
        published: true,
        date: post.date,
        readTime: post.readTime,
        likes: post.likes
      }
    });
    console.log(`- Upserted post: "${upserted.title}" on ${post.date.toISOString().split('T')[0]}`);

    // 2. Clear old comments for idempotency
    await prisma.comment.deleteMany({
      where: { postId: upserted.id }
    });

    // 3. Insert seeded comments
    for (const c of post.comments) {
      await prisma.comment.create({
        data: {
          postId: upserted.id,
          authorName: c.authorName,
          authorEmail: c.authorEmail,
          content: c.content,
          approved: true,
          adminReply: c.adminReply,
          createdAt: new Date(post.date.getTime() + Math.floor(Math.random() * 28800000) + 3600000)
        }
      });
      console.log(`  + Seeded comment from "${c.authorName}"`);
    }
  }

  console.log('--- ALL 4 SCHEDULED POSTS & COMMENTS INSERTED SUCCESSFULLY ---');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
