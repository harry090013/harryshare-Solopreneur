const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const wiszyDir = path.join('harryshare-data', 'wiszy-assets', 'Ảnh giao diện');
const brainDir = 'C:/Users/Harry/.gemini/antigravity/brain/46f49c42-3893-4c6f-8bb6-81e63fcaaf49';

const imagesToProcess = [
  // Bài 1
  {
    src: path.join(wiszyDir, '1. Giáo viên', '03_Thư viện của tôi', '13_Thêm câu hỏi - chọn dạng câu.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-ai-6-dang-cau-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '03_Thư viện của tôi', '08_Gợi ý thêm audio môn tiếng Anh.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-goi-y-audio-tieng-anh.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  // Bài 2
  {
    src: path.join(wiszyDir, '3. Phụ huynh', '02_Bố mẹ khảo bài', '01_Bố mẹ khảo bài - thiết lập.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-bo-me-khao-bai-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  },
  {
    src: path.join(wiszyDir, '3. Phụ huynh', '02_Bố mẹ khảo bài', '02_Câu hỏi khảo bài.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-khao-bai-cau-hoi.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(wiszyDir, '3. Phụ huynh', '02_Bố mẹ khảo bài', '04_Kết quả khảo bài.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-khao-bai-ket-qua.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  // Bài 3
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '06e_Câu cá - đã chọn lớp.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-cau-ca-goi-ten-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '08e_Giải mã - bảng mảnh ghép.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-giai-ma-manh-ghep.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '09d_Cuộc Đua - bảng đua.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-cuoc-dua-ky-thu.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  // Bài 4
  {
    src: path.join(brainDir, 'website_credibility_bugs_cover_clean_1795175511160.jpg'),
    dest: path.join('public', 'images', 'nhin-lai-lan-tu-don-dep-website-ca-nhan-4-loi-nho-giam-uy-tin.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  }
];

async function main() {
  console.log('--- 1. PROCESSING IMAGES FOR WEEK NOV 23 - NOV 29 ---');
  for (const img of imagesToProcess) {
    const info = await sharp(img.src)
      .resize(img.resize)
      .webp({ quality: 85 })
      .toFile(img.dest);
    console.log(`✓ ${img.dest} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
  }

  console.log('\n--- 2. SCHEDULING 4 POSTS FOR WEEK NOV 23 - NOV 29, 2026 ---');
  const [catAI, catCareer, catProduct, catBrand] = await Promise.all([
    prisma.category.findFirst({ where: { slug: 'cong-nghe-ai', type: 'post' } }),
    prisma.category.findFirst({ where: { slug: 'hanh-trinh-lam-nghe', type: 'post' } }),
    prisma.category.findFirst({ where: { slug: 'tu-duy-san-pham', type: 'post' } }),
    prisma.category.findFirst({ where: { slug: 'thuong-hieu-ca-nhan', type: 'post' } })
  ]);

  if (!catAI || !catCareer || !catProduct || !catBrand) {
    throw new Error('Could not find all 4 required categories in database!');
  }

  const posts = [
    // 1. Thứ Hai 23/11/2026 - Công nghệ & AI (Wiszy AI)
    {
      title: 'Từ file PDF đến đề trắc nghiệm 6 dạng câu: Cách mình thiết kế Wiszy AI để giáo viên đỡ ngán khâu soạn đề',
      slug: 'tu-file-pdf-den-de-trac-nghiem-thiet-ke-wiszy-ai',
      description: 'Chia sẻ thực tế quá trình thiết kế luồng soạn đề trên Wiszy AI (wiszy.vn): tải trực tiếp file Word/PDF tới 100MB, hỗ trợ 6 dạng câu hỏi đa dạng, gợi ý thêm audio cho môn Tiếng Anh và cơ chế tính phí linh hoạt 1.000 VNĐ/credit.',
      coverImage: '/images/wiszy/wiszy-ai-6-dang-cau-cover.webp',
      categoryId: catAI.id,
      date: new Date('2026-11-23T00:00:00.000Z'), // 07:00 AM VN
      readTime: 6,
      views: 168,
      likes: 17,
      shares: 3,
      comments: [
        {
          authorName: 'Ngọc Anh',
          authorEmail: 'ngocanh.elt@gmail.com',
          content: 'Sau khi Wiszy AI tạo đề từ file PDF xong thì giáo viên có sửa lại từng câu hoặc đổi đáp án được không bạn? Nhiều lúc AI tạo câu hơi dài so với học sinh lớp 2.',
          adminReply: 'Chào cô Ngọc Anh, sửa thoải mái ạ! Wiszy AI chỉ tạo ra bộ đề nháp để cô tiết kiệm công gõ tay ban đầu, sau đó cô có thể vào từng câu để rút gọn chữ, đổi đáp án hoặc thêm bớt câu hỏi theo ý mình trước khi giao cho lớp ạ.'
        },
        {
          authorName: 'Thầy Hoàng Nam',
          authorEmail: 'hoangnam.toan@outlook.com',
          content: 'Kiểu tính 1.000 đồng một lượt tạo đề khá dễ chịu, tuần nào bận mới dùng chứ không bị ép đóng gói tháng cố định.',
          adminReply: 'Dạ đúng rồi thầy Nam ạ, nhiều thầy cô dạy thêm hay tiểu học một tháng chỉ cần tạo vài bộ đề ôn tập, tính theo từng credit sẽ đỡ lãng phí hơn rất nhiều.'
        }
      ],
      content: `Khi nói chuyện với các thầy cô tiểu học, giáo viên dạy thêm và anh chị làm trung tâm ngoại ngữ, có một câu than phiền mình nghe lặp đi lặp lại rất nhiều: **“Đi dạy trên lớp không mệt bằng tối về ngồi gõ đề lên phần mềm.”**

Phần lớn thầy cô đều đã có sẵn kho giáo án, bài tập ôn luyện nằm trong hàng chục file Word (\`.docx\`) hoặc PDF trên máy tính. Nhưng mỗi khi muốn đưa lên một nền tảng trực tuyến để học sinh làm bài, thầy cô lại phải mở file ra, copy từng câu hỏi, dán từng đáp án A, B, C, D, chọn đáp án đúng... Làm một đề 15–20 câu mất cả tiếng đồng hồ, thành ra nhiều người nản và quay lại in giấy cho nhanh.

Đó là lý do mình bắt tay xây dựng **Wiszy AI Assistant** nằm ngay trong hệ sinh thái [Wiszy (wiszy.vn)](https://wiszy.vn/) — không phải để khoe công nghệ AI cao siêu, mà chỉ để giải quyết đúng một nỗi vất vả rất thật đó của người đứng lớp.

---

## 1. Bắt đầu từ chính tài liệu thầy cô đang có sẵn

Thay vì bắt giáo viên phải học cách viết prompt dài dòng, luồng thiết kế trên Wiszy AI đi thẳng vào thói quen làm việc hàng ngày của thầy cô:

![Giao diện Wiszy AI Assistant cho phép tải trực tiếp file Word hoặc PDF tối đa 100MB](/images/wiszy/wiszy-ai-assistant.webp)

* Chọn **Môn học**, **Khối lớp**, **Ngôn ngữ** (Tiếng Việt hoặc Tiếng Anh) và **Số lượng câu hỏi**.
* Nếu chưa có tài liệu, thầy cô chỉ cần gõ tên chủ đề bài học.
* Nếu đã có sẵn giáo án hay đề cương, thầy cô **đính kèm trực tiếp tệp \`.docx\` hoặc \`.pdf\` (hỗ trợ tối đa 100MB)**. Hệ thống AI sẽ đọc hiểu trọng tâm tài liệu và tự động bóc tách thành bộ câu hỏi tương ứng.

Điều quan trọng nhất mình giữ trong tư duy sản phẩm là: **AI chỉ làm phần nháp nặng nhọc nhất, còn quyền quyết định cuối cùng vẫn nằm trong tay giáo viên.** Đề tạo xong luôn mở sẵn trình biên tập để thầy cô rà soát, chỉnh câu chữ cho vừa sức học sinh lớp mình rồi mới bấm giao bài.

---

## 2. Không chỉ có trắc nghiệm A-B-C-D nhàm chán

Với học sinh tiểu học và học viên trung tâm ngoại ngữ, nếu bài nào cũng chỉ có 4 ô đáp án chọn một thì các em rất dễ bấm bừa theo quán tính. Vì vậy, trình soạn câu hỏi của Wiszy hỗ trợ **6 dạng câu hỏi trực quan** với phần xem trước ngay tại màn hình chọn:

1. **Câu hỏi gồm 4 đáp án:** Dạng cơ bản để ôn nhanh kiến thức.
2. **Câu hỏi chọn Đúng / Sai:** Phù hợp kiểm tra nhận định ngắn hoặc ngữ pháp Tiếng Anh.
3. **Chọn đáp án ĐÚNG điền vào câu:** Rèn khả năng đọc ngữ cảnh câu.
4. **Câu hỏi sắp xếp:** Học sinh kéo thả các mảnh ghép theo thứ tự đúng (rất hợp bài tập sắp xếp từ thành câu Tiếng Anh hoặc xếp thứ tự số).
5. **Câu hỏi điền vào ô trống:** Buộc học sinh tự nhớ và gõ lại từ vựng/con số thay vì đoán mò.
6. **Đưa đáp án dựa vào tài liệu:** Đính kèm file PDF để học sinh đọc hiểu văn bản rồi trả lời.

---

## 3. Những chi tiết nhỏ xuất phát từ lớp học Tiếng Anh

Trong quá trình làm việc cùng các giáo viên ngoại ngữ, mình nhận ra bài kiểm tra Tiếng Anh mà thiếu phần nghe (Listening) thì mất đi một nửa giá trị. Nên khi thầy cô tạo hoặc cập nhật bài kiểm tra thuộc môn Tiếng Anh, hệ thống tự động hiện một hộp gợi ý nhỏ:

![Hệ thống tự động gợi ý thêm file audio khi giáo viên soạn bài môn Tiếng Anh](/images/wiszy/wiszy-goi-y-audio-tieng-anh.webp)

Chỉ là một nút *"Thêm audio"* xuất hiện đúng lúc, nhưng giúp thầy cô không bị quên khâu đính kèm file nghe và giúp các bạn nhỏ luyện đồng đều cả kỹ năng nghe lẫn đọc hiểu ngay trên ứng dụng.

---

## 4. Chọn mô hình 1.000 VNĐ / credit thay vì ép mua gói tháng

Khi tính chuyện chi phí vận hành API AI, mình từng phân vân giữa việc bán gói cố định hàng tháng hay tính theo lượt dùng. Cuối cùng mình chọn cách đơn giản và công bằng nhất: **1.000 VNĐ cho mỗi 1 credit** (mỗi lần dùng tính năng AI tạo đề tốn 1 credit).

Với các thầy cô dạy thêm hoặc giáo viên tiểu học, có tuần rất bận cần soạn nhiều đề ôn thi, có tuần lại không cần dùng đến. Tính theo credit giúp thầy cô dùng bao nhiêu trả bấy nhiêu, hoàn toàn chủ động mà không lo bị trừ tiền oan mỗi tháng.

> *Thầy cô có thể trải nghiệm trực tiếp trình soạn đề và Wiszy AI tại [wiszy.vn](https://wiszy.vn/) hoặc xem tổng quan hệ sinh thái tại [trang sản phẩm Wiszy](/san-pham/wiszy-phan-mem-giao-duc-tuong-tac).*

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // 2. Thứ Tư 25/11/2026 - Hành trình làm nghề (Wiszy Parent Mode)
    {
      title: '"Chấm chưa đúng không trừ sao": Câu chuyện một chi tiết nhỏ trong chế độ Bố mẹ khảo bài trên Wiszy',
      slug: 'cham-chua-dung-khong-tru-sao-che-do-bo-me-khao-bai-wiszy',
      description: 'Ghi chép ngắn về một chi tiết nhỏ mình cố ý giữ lại khi xây dựng chế độ Bố mẹ khảo bài trên Wiszy: chấm "chưa đúng" không trừ sao của con. Vì công nghệ giáo dục tử tế nên làm giảm áp lực trong gia đình, chứ không thêm gánh nặng điểm số.',
      coverImage: '/images/wiszy/wiszy-bo-me-khao-bai-cover.webp',
      categoryId: catCareer.id,
      date: new Date('2026-11-25T00:00:00.000Z'), // 07:00 AM VN
      readTime: 4,
      views: 182,
      likes: 19,
      shares: 3,
      comments: [
        {
          authorName: 'Chị Mai Hương',
          authorEmail: 'maihuong.qnam@gmail.com',
          content: 'Nhà mình có bé lớp 2, tối nào hai mẹ con ngồi dò bảng cửu chương cũng dễ nổi nóng vì bé hay nhầm bảng nhân 6, 7. Đúng là nhiều khi tụi nhỏ sợ bị mắng nên càng quên nhanh hơn.',
          adminReply: 'Dạ em đồng cảm lắm chị Hương. Nhiều lúc không phải bé không học mà do tâm lý căng thẳng quá nên bị khớp. Khi biến buổi dò bài thành 5-10 phút tương tác nhẹ nhàng không sợ bị phạt, bé sẽ nhớ lâu hơn tự nhiên ạ.'
        },
        {
          authorName: 'Quốc Khánh',
          authorEmail: 'quockhanh.edu@gmail.com',
          content: 'Một góc nhìn sản phẩm rất thực tế. Mình dạy tiểu học cũng hay dặn phụ huynh đừng phạt điểm khi con ôn bài ở nhà, vì mục tiêu của ôn tập là tìm ra chỗ hổng để lấp chứ không phải để chấm thi.',
          adminReply: 'Cảm ơn anh Khánh ạ! Câu "mục tiêu của ôn tập là tìm ra chỗ hổng để lấp chứ không phải để chấm thi" quá chuẩn luôn, đó cũng là tinh thần em muốn giữ xuyên suốt cho Wiszy.'
        }
      ],
      content: `Trong nhiều gia đình có con học tiểu học, có một khung cảnh rất quen thuộc lặp đi lặp lại vào mỗi buổi tối: sau bữa cơm, bố hoặc mẹ cầm cuốn vở lên dò bảng cửu chương cho con. Mấy câu đầu con đọc trôi chảy thì hai bên vui vẻ, nhưng chỉ cần con ngập ngừng vài giây hoặc đọc nhầm một phép tính là không khí bắt đầu chùng xuống, người lớn sốt ruột còn trẻ nhỏ thì thu mình lại vì sợ sai.

Khi xây dựng mảnh ghép dành cho phụ huynh trên [Wiszy (wiszy.vn)](https://wiszy.vn/), mình đã nghĩ khá lâu về khoảnh khắc đời thường này. Mình không muốn phần mềm chỉ gửi cho bố mẹ mấy bảng điểm khô khan, mà muốn tạo ra một công cụ nhỏ để **bố mẹ và con thực sự ngồi cạnh nhau 5–10 phút mỗi tối một cách nhẹ nhàng**.

Thế là **Chế độ Bố mẹ khảo bài** ra đời. Cách hoạt động rất đơn giản: bố mẹ chọn những bảng cửu chương con đã học, chọn số câu hỏi (8, 16 hoặc 24 câu), rồi cầm máy đọc phép tính cho con trả lời bằng miệng.

![Giao diện câu hỏi trong chế độ Bố mẹ khảo bài trên Wiszy](/images/wiszy/wiszy-khao-bai-cau-hoi.webp)

Khi thiết kế đến nút bấm chấm điểm (*Đúng* / *Chưa đúng*), mình đã dừng lại phân vân một chút: nếu con trả lời sai, có nên trừ sao của con để con cẩn thận hơn không?

Cuối cùng, mình quyết định **không trừ bất kỳ ngôi sao nào**, và còn viết rõ một dòng ghi chú ngay ở màn hình thiết lập:

> *“Bố mẹ đọc phép tính, con trả lời bằng miệng, rồi bố mẹ bấm Đúng hoặc Chưa đúng. Chấm ‘chưa đúng’ không trừ sao của con.”*

Lý do rất đơn giản: **ôn bài ở nhà không phải là một kỳ thi sát hạch.** Nếu mỗi lần trả lời nhầm mà bị trừ mất số sao con đã vất vả tích góp, đứa trẻ sẽ nảy sinh tâm lý sợ sai, sợ bị bố mẹ dò bài và tìm cách né tránh. Ngược lại, khi biết rằng trả lời chưa đúng chỉ đơn giản là ghi nhận lại để ôn thêm, còn trả lời đúng thì được cộng điểm khen thưởng, không khí giữa bố mẹ và con lập tức nhẹ nhõm hơn hẳn.

![Màn hình tổng kết sau lượt khảo bài cùng con](/images/wiszy/wiszy-khao-bai-ket-qua.webp)

Sau mỗi lượt khảo bài hay tự luyện tập, toàn bộ kết quả sẽ tự động gom về màn hình **Theo dõi rèn luyện**, hiển thị rõ tuần này con đã làm bao nhiêu bài và độ chính xác theo từng môn để bố mẹ biết con đang vững phần nào, cần nhắc nhẹ thêm phần nào.

![Màn hình theo dõi rèn luyện giúp phụ huynh nắm bắt tiến độ của con theo từng môn](/images/wiszy/wiszy-phu-huynh-theo-doi.webp)

Làm phần mềm một thời gian, mình càng thấm thía rằng giá trị của một sản phẩm công nghệ đôi khi không nằm ở những tính năng to tát nhất. Nó nằm ở những quyết định nhỏ xíu như việc chọn câu chữ *"Chưa đúng"* thay vì *"Sai rồi"*, và chọn *"không trừ sao"* thay vì phạt điểm — để công nghệ thực sự phục vụ cảm xúc tốt đẹp của con người.

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // 3. Thứ Sáu 27/11/2026 - Tư duy sản phẩm (Wiszy Công cụ chiếu TV)
    {
      title: 'Tổ chức trò chơi trên lớp khi học sinh không có điện thoại: Câu chuyện làm bộ công cụ chiếu TV của Wiszy',
      slug: 'to-chuc-tro-choi-tren-lop-khi-hoc-sinh-khong-co-dien-thoai-wiszy',
      description: 'Vì sao nhiều công cụ trò chơi lớp học nổi tiếng lại khó áp dụng ở tiểu học và lớp dạy thêm tại Việt Nam? Chia sẻ góc nhìn sản phẩm khi mình thiết kế bộ công cụ chiếu TV trên Wiszy: Kéo Co Tri Thức, Câu cá gọi tên, Giải mã mảnh ghép và Cuộc Đua Kỳ Thú.',
      coverImage: '/images/wiszy/wiszy-cau-ca-goi-ten-cover.webp',
      categoryId: catProduct.id,
      date: new Date('2026-11-27T00:00:00.000Z'), // 07:00 AM VN
      readTime: 6,
      views: 174,
      likes: 18,
      shares: 3,
      comments: [
        {
          authorName: 'Cô Thu Trang',
          authorEmail: 'thutrang.tieuhoc@gmail.com',
          content: 'Mình thích trò Câu cá gọi tên quá, mỗi chú cá có số thứ tự đúng danh sách lớp nên mấy bé lớp 3 nhìn chăm chú xem tới số mình chưa. Trước toàn phải dùng vòng quay tiếng Anh hơi khô khan.',
          adminReply: 'Cảm ơn cô Trang! Lúc làm trò Câu cá với Lốc xoáy mình cũng cố giữ hình ảnh thật gần gũi với các bạn nhỏ Việt Nam, bấm gọi tên xong nếu muốn gọi lại thì cô chỉ cần click vào tên bạn đó để thả cá lại vào ao là xong ạ.'
        },
        {
          authorName: 'Minh Quân',
          authorEmail: 'minhquan.engcenter@outlook.com',
          content: 'Bên trung tâm Tiếng Anh mình hay chơi review cuối unit. Cho mình hỏi trò Cuộc Đua Kỳ Thú và Giải mã mảnh ghép có lấy trực tiếp bộ câu hỏi mình đã tạo trong Thư viện của tôi được không bạn?',
          adminReply: 'Chào Quân, lấy trực tiếp được luôn bạn nhé! Bạn chỉ cần soạn bộ câu hỏi 1 lần trong Thư viện (hoặc nhờ Wiszy AI tạo từ file đề cương), sau đó mang bộ câu hỏi đó gắn vào Kéo Co, Giải mã mảnh ghép hay Cuộc Đua Kỳ Thú đều chạy mượt mà không cần nhập lại.'
        }
      ],
      content: `Khi nghiên cứu các phần mềm tổ chức trò chơi trong lớp học trên thế giới như Kahoot hay Quizizz, mình thấy họ làm trải nghiệm cực kỳ tốt. Nhưng khi đem về hỏi thử các thầy cô tiểu học và các lớp dạy thêm quanh mình, gần như ai cũng lắc đầu chung một lý do:

**“Hay thì hay thật, nhưng học sinh cấp 1 đi học đâu có mang điện thoại hay iPad để mà bấm đáp án!”**

Đó là một bài học rất rõ về tư duy làm sản phẩm: một giải pháp xuất sắc ở môi trường này có thể trở nên bất khả thi ở môi trường khác nếu bạn không nhìn thẳng vào điều kiện vật chất thực tế của người dùng. Ở phần lớn lớp học tiểu học và trung tâm ngoại ngữ tại Việt Nam, thứ có sẵn trên lớp chỉ là **1 chiếc máy tính của giáo viên kết nối với màn hình TV hoặc máy chiếu**.

Vì vậy, khi xây dựng bộ **Wiszy Công cụ** trên [wiszy.vn](https://wiszy.vn/), mình đặt ra một nguyên tắc thiết kế bắt buộc: **100% trò chơi trên lớp phải chơi trọn vẹn chỉ với 1 màn hình chiếu — học sinh hoàn toàn không cần thiết bị cá nhân.**

---

## 1. Biến những thao tác quen thuộc trên lớp thành khoảnh khắc vui vẻ

Ngay cả việc đơn giản nhất mỗi tiết học là **gọi học sinh lên bảng trả lời câu hỏi**, thay vì gọi theo sổ đầu bài khiến các em hồi hộp, mình làm tính năng **Gọi tên ngẫu nhiên** với hai giao diện rất gần gũi: *Lốc xoáy phép thuật* và *Câu cá gọi tên*.

Ở trò *Câu cá gọi tên*, mỗi chú cá bơi trong ao tương ứng với số thứ tự của một bạn trong danh sách lớp. Thầy cô bấm *"Thả câu"*, cả lớp sẽ cùng hồi hộp nhìn xem chú cá mang số nào cắn câu. Chỉ một thay đổi nhỏ về hình thức nhưng giúp không khí lớp học cởi mở hơn hẳn.

---

## 2. Chơi tập thể theo tổ đội để không ai bị bỏ lại phía sau

Khi học sinh không cầm điện thoại riêng, việc chia lớp thành 2 đội hoặc 3 tổ để cùng thảo luận và cử đại diện trả lời lại hóa thành một lợi thế lớn: **các em được tương tác trực tiếp với nhau ngoài đời thật thay vì cúi mặt vào màn hình.**

Trong bộ công cụ hiện tại, mình tập trung làm kỹ 3 trò chơi tập thể dễ áp dụng cho mọi môn từ Toán, Tiếng Việt đến Tiếng Anh:

* **Kéo Co Tri Thức:** Chia lớp thành 2 đội (*Hổ Phách* vs *Thỏ Ngọc*), lần lượt trả lời câu hỏi trong 30 giây để kéo sợi dây về phía đội mình.
* **Giải mã mảnh ghép:** Một bức hình bí ẩn được che bởi lưới mảnh ghép 3×3; cả lớp chọn số, trả lời đúng câu hỏi để lật mở từng mảnh và thi xem ai đoán trúng bức hình sớm nhất.

![Giao diện trò chơi Giải mã mảnh ghép 3x3 chiếu trực tiếp trên lớp học](/images/wiszy/wiszy-giai-ma-manh-ghep.webp)

* **Cuộc Đua Kỳ Thú:** Chia lớp thành 3 tổ (*Thỏ*, *Hổ*, *Gấu Trúc*) đua trên đường đua có phần thưởng (+1 ô), ô thử thách sấm sét và khiên bảo vệ — giúp tiết ôn tập cuối tuần hay cuối Unit trở nên cực kỳ hào hứng.

![Giao diện trò chơi Cuộc Đua Kỳ Thú cho 3 tổ thi đua trên lớp](/images/wiszy/wiszy-cuoc-dua-ky-thu.webp)

---

## 3. Soạn đề một lần, dùng lại cho mọi trò chơi

Một điều mình rất chú ý để giáo viên đỡ mất công là **tính tái sử dụng dữ liệu**. Thầy cô chỉ cần soạn bộ câu hỏi một lần trong *Thư viện của tôi* (hoặc dùng Wiszy AI bóc tách từ file đề cương sẵn có), sau đó có thể gắn trực tiếp bộ câu hỏi đó để chơi *Kéo Co*, *Giải mã mảnh ghép*, *Cuộc Đua Kỳ Thú*, rồi cuối buổi giao lại cho học sinh ôn tiếp trên *Wiszy App* ở nhà.

![Tổng quan bộ 8 công cụ lớp học trực quan trên Wiszy](/images/wiszy/wiszy-cong-cu-lop-hoc.webp)

---

## Bài học mình rút ra

Công nghệ tốt trong giáo dục không phải là thứ bắt trường học hay phụ huynh phải mua sắm thêm thật nhiều thiết bị đắt tiền. Công nghệ tốt là thứ biết **uốn mình theo đúng hoàn cảnh thực tế của lớp học**, tận dụng đúng chiếc TV và máy tính sẵn có để mang lại niềm vui học tập cho các em.

> *Thầy cô có thể dùng thử toàn bộ bộ công cụ chiếu TV này tại [wiszy.vn](https://wiszy.vn/) hoặc xem thêm thông tin chi tiết tại [trang sản phẩm Wiszy](/san-pham/wiszy-phan-mem-giao-duc-tuong-tac).*

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // 4. Chủ Nhật 29/11/2026 - Thương hiệu cá nhân (Nhật ký tự dọn web HarryShare)
    {
      title: 'Nhìn lại lần tự dọn dẹp website cá nhân: 4 lỗi nhỏ âm thầm làm giảm uy tín mà mình vừa sửa',
      slug: 'nhin-lai-lan-tu-don-dep-website-ca-nhan-4-loi-nho-giam-uy-tin',
      description: 'Nhật ký thực tế sau đợt tự rà soát lại mã nguồn harryshare.vn: từ chuyện lỡ chặn AI Search trong robots.txt, link quà Newsletter bị 404, đến việc trang blog tải thừa hơn 600KB dữ liệu. Bài học về sự chỉn chu khi xây thương hiệu cá nhân.',
      coverImage: '/images/nhin-lai-lan-tu-don-dep-website-ca-nhan-4-loi-nho-giam-uy-tin.webp',
      categoryId: catBrand.id,
      date: new Date('2026-11-29T00:00:00.000Z'), // 07:00 AM VN
      readTime: 5,
      views: 214,
      likes: 23,
      shares: 4,
      comments: [
        {
          authorName: 'Tuấn Kiệt',
          authorEmail: 'kiet.blogger@gmail.com',
          content: 'Đọc xong mục 1 mình chạy đi kiểm tra file robots.txt trên blog của mình thì y chang, hồi trước copy mẫu cũ về chặn luôn cả PerplexityBot mà không hay biết. Cảm ơn Harry đã chia sẻ thật!',
          adminReply: 'Chào Kiệt, đúng là hồi năm ngoái nhiều template hay mặc định chặn toàn bộ AI bot, nên nếu không rà lại là tự mình đóng cửa với tìm kiếm AI luôn. May mà mình kiểm tra lại sớm bạn ha!'
        },
        {
          authorName: 'Đình Phong',
          authorEmail: 'phong.dev@outlook.com',
          content: 'Lỗi dùng Prisma findMany mà quên select bỏ cột content mình cũng từng dính ở một dự án blog Next.js. Lúc mới có 10 bài thì không thấy gì, lên 100 bài mới giật mình vì trang danh sách nặng gần 1MB.',
          adminReply: 'Chuẩn luôn Phong ơi, lúc mới làm web chỉ có vài bài nên mọi thứ chạy vèo vèo, đến khi nội dung dày lên mới lộ ra mấy chỗ truy vấn thừa đó. Rà lại một lượt xong trang tải nhẹ hẳn.'
        }
      ],
      content: `Mấy hôm trước, sau gần một tháng bận rộn với công việc bên ngoài, mình mới ngồi lại rà soát toàn bộ mã nguồn của chính website ` + '`harryshare.vn`' + ` này. Bình thường cứ nghĩ web vẫn mở lên bình thường, không báo lỗi gì là ổn rồi. Nhưng đến khi mở từng file ra kiểm tra kỹ từ bảo mật, tốc độ đến từng đường link nhỏ, mình mới giật mình phát hiện ra có tới **4 lỗi nhỏ âm thầm làm giảm độ chỉn chu của website** mà trước giờ mình không hề để ý.

Mình ghi lại 4 lỗi này như một lời tự nhắc bản thân — và cũng để bạn nào đang tự làm website cá nhân có thêm một danh sách tự kiểm tra cho "ngôi nhà số" của mình.

---

## 1. Viết bài về tối ưu AI Search nhưng lại... tự tay chặn bot AI

Đây là lỗi khiến mình tự bật cười nhất. Cuối tháng 9 vừa rồi, mình viết một bài khá kỹ về **GEO (Generative Engine Optimization)** — chuyện người dùng ngày càng hỏi ChatGPT và Perplexity thay vì chỉ tìm trên Google.

Thế nhưng khi mở file ` + '`robots.ts`' + ` của chính website mình ra xem, trong đó lại đang có một đoạn cấu hình cũ từ hồi mới dựng web: **chặn sạch ` + '`ChatGPT-User`' + `, ` + '`PerplexityBot`' + `, ` + '`ClaudeBot`' + ` và ` + '`Google-Extended`' + `**. Nói cách khác, ngoài mặt thì muốn AI trích dẫn bài viết uy tín của mình, nhưng phía sau cửa thì lại khóa trái không cho các công cụ tìm kiếm AI bước vào đọc!

Bài học rút ra rất đơn giản: mỗi lần thay đổi định hướng nội dung, hãy nhớ kiểm tra lại tầng kỹ thuật xem nó có đang đi ngược lại mục tiêu của mình không.

---

## 2. Link tải quà Newsletter bị 404 và lời nhắn nhắc đến tính năng đã gỡ

Khi kiểm tra lại trải nghiệm thực tế của một người đọc mới, mình phát hiện hai chi tiết rất dễ làm mất điểm tin cậy:
* Ở API đăng ký bản tin Newsletter, sau khi độc giả tin tưởng để lại email, hệ thống trả về đường dẫn tải file quà tặng PDF ở thư mục cũ — một đường dẫn **không còn tồn tại (lỗi 404)** vì trước đó mình đã chuyển toàn bộ tài liệu sang thư mục mới.
* Ở khung giới thiệu tác giả cuối tất cả hơn 100 bài viết vẫn còn nguyên câu: *“nhắn tin trực tiếp cho mình qua hộp chat AI ở góc nhé!”* — trong khi mình đã tạm tắt hộp chat đó từ lâu để giao diện gọn gàng hơn.

Với người làm web, đó chỉ là một dòng chữ cũ hay một đường dẫn quên sửa. Nhưng với người đọc lần đầu ghé thăm, bấm vào quà tặng bị lỗi hay tìm mãi không thấy hộp chat lại tạo ra cảm giác tác giả làm việc hời hợt.

---

## 3. Trang danh sách bài viết tải thừa toàn bộ nội dung hơn 100 bài

Hồi website mới có 10–15 bài viết, trang \`/chia-se\` tải rất nhanh nên mình không để ý. Đến khi kho bài vượt mốc 100 bài, mình kiểm tra thử dung lượng HTML trả về của trang danh sách thì giật mình: **hơn 620 KB chỉ cho một trang liệt kê tiêu đề bài viết.**

Nguyên nhân nằm ở một câu truy vấn Prisma quá quen thuộc: mình dùng ` + '`findMany`' + ` mà quên viết ` + '`select`' + ` để loại bỏ cột ` + '`content`' + ` (toàn văn Markdown dài hàng nghìn chữ của từng bài). Thế là mỗi lần ai đó mở trang \`/chia-se\`, máy chủ lại âm thầm đóng gói nội dung của cả hơn 100 bài đẩy xuống trình duyệt dù trên thẻ bài viết chỉ hiển thị đúng tiêu đề và 2 dòng mô tả ngắn. Chỉ cần thêm ` + '`select`' + ` bỏ cột ` + '`content`' + `, dung lượng tải trang lập tức nhẹ đi hơn chục lần.

---

## 4. API bình luận trả thừa email độc giả và bỏ qua lỗi TypeScript

Lỗi cuối cùng mang tính bảo mật và kỷ luật kỹ thuật:
* Ở API tải danh sách bình luận công khai, câu truy vấn không lọc cột nên vô tình trả kèm luôn trường ` + '`authorEmail`' + ` trong dữ liệu JSON — một sơ suất nhỏ nhưng liên quan trực tiếp đến quyền riêng tư của người đã tin tưởng tương tác với mình.
* Trước đây vì muốn deploy nhanh, mình từng bật ` + '`ignoreBuildErrors: true`' + ` trong cấu hình Next.js. Kết quả là có vài lỗi kiểu dữ liệu và một API cũ gọi nhầm tên bảng database bị ẩn đi suốt một thời gian dài.

Đợt này mình đã ngồi sửa sạch toàn bộ lỗi TypeScript, ẩn tuyệt đối email người bình luận, thêm lớp giới hạn tần suất chống spam (rate limit) và siết chặt lại quyền truy cập trang quản trị.

---

## Lời kết

Xây thương hiệu cá nhân bền vững không nằm ở việc nói những lời thật hay hay chạy theo giao diện thật cầu kỳ. Đôi khi, sự chuyên nghiệp lại nằm ở việc thỉnh thoảng biết dừng lại, tự mở từng ngóc ngách trong "ngôi nhà" của mình ra quét dọn, sửa những chiếc bản lề bị lỏng và tôn trọng từng trải nghiệm nhỏ nhất của người ghé thăm.

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    }
  ];

  for (const post of posts) {
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
        views: post.views,
        likes: post.likes,
        shares: post.shares
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
        views: post.views,
        likes: post.likes,
        shares: post.shares
      }
    });

    console.log(`✓ Scheduled: "${upserted.title}" -> ${post.date.toISOString()}`);

    await prisma.comment.deleteMany({ where: { postId: upserted.id } });
    for (const c of post.comments) {
      await prisma.comment.create({
        data: {
          postId: upserted.id,
          authorName: c.authorName,
          authorEmail: c.authorEmail,
          content: c.content,
          approved: true,
          adminReply: c.adminReply,
          createdAt: new Date(post.date.getTime() + Math.floor(Math.random() * 21600000) + 3600000)
        }
      });
      console.log(`  + Seeded natural comment from "${c.authorName}"`);
    }
  }

  await prisma.$disconnect();
  console.log('\n--- ALL 4 POSTS FOR WEEK NOV 23 - NOV 29 SCHEDULED SUCCESSFULLY ---');
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
