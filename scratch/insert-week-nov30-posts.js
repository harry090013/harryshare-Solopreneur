const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const wiszyDir = path.join('harryshare-data', 'wiszy-assets', 'Ảnh giao diện');

const imagesToProcess = [
  // Bài 1: Vương quốc cửu chương
  {
    src: path.join(wiszyDir, '2. Học sinh', '13_Vương quốc cửu chương', '01_Vương quốc cửu chương.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-vuong-quoc-cuu-chuong-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  },
  {
    src: path.join(wiszyDir, '2. Học sinh', '13_Vương quốc cửu chương', '06_Làng Khởi Đầu x2.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-lang-khoi-dau-x2.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(wiszyDir, '2. Học sinh', '13_Vương quốc cửu chương', '07_Chặng Học - đếm nhảy.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-chang-hoc-dem-nhay.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  // Bài 2: Sơ đồ bài học
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '03b_Sơ đồ bài học - mở sơ đồ.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-so-do-bai-hoc-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '03b_Sơ đồ bài học - mở sơ đồ.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-so-do-bai-hoc-full.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  // Bài 3: Đề thi thử
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '04b_Đề thi thử - theo dõi bài làm.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-de-thi-thu-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'top' }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '04b_Đề thi thử - theo dõi bài làm.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-de-thi-thu-theo-doi.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '05_Wiszy công cụ', '04c_Đề thi thử - xem bài học sinh.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-de-thi-thu-xem-bai.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  // Bài 4: Cộng đồng chia sẻ đề
  {
    src: path.join(wiszyDir, '1. Giáo viên', '04_Cộng đồng', '01_Trang cộng đồng.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-cong-dong-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'top' }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '04_Cộng đồng', '01_Trang cộng đồng.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-cong-dong-full.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(wiszyDir, '1. Giáo viên', '04_Cộng đồng', '04_Sau khi bấm Sử dụng - bài vào Thư viện.png'),
    dest: path.join('public', 'images', 'wiszy', 'wiszy-cong-dong-su-dung.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  }
];

async function main() {
  console.log('--- 1. PROCESSING 11 REAL WISZY SCREENSHOTS TO WEBP ---');
  for (const img of imagesToProcess) {
    const info = await sharp(img.src)
      .resize(img.resize)
      .webp({ quality: 85 })
      .toFile(img.dest);
    console.log(`✓ ${img.dest} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
  }

  console.log('\n--- 2. SCHEDULING 4 WISZY POSTS FOR WEEK NOV 30 - DEC 06, 2026 ---');
  const catWiszy = await prisma.category.findFirst({
    where: { slug: 'wiszy', type: 'post' }
  });
  if (!catWiszy) {
    throw new Error('Category "wiszy" not found in database!');
  }

  const posts = [
    // 1. Thứ Hai 30/11/2026
    {
      title: 'Vương quốc cửu chương: Làm sao để trẻ lớp 2 hiểu bản chất phép nhân thay vì học vẹt?',
      slug: 'vuong-quoc-cuu-chuong-tre-hieu-ban-chat-phep-nhan-wiszy',
      description: 'Chia sẻ cách mình thiết kế Vương Quốc Cửu Chương trên Wiszy (wiszy.vn): giúp học sinh lớp 2–3 hiểu bản chất phép nhân qua chặng đếm nhảy, chinh phục từng vùng đất và hạ Boss thay vì đọc vẹt căng thẳng.',
      coverImage: '/images/wiszy/wiszy-vuong-quoc-cuu-chuong-cover.webp',
      categoryId: catWiszy.id,
      date: new Date('2026-11-30T00:00:00.000Z'), // 07:00 AM VN
      readTime: 5,
      views: 176,
      likes: 18,
      shares: 3,
      comments: [
        {
          authorName: 'Chị Mỹ Linh',
          authorEmail: 'mylinh.mom2@gmail.com',
          content: 'Bé nhà mình năm nay lên lớp 2, đọc xuôi từ 2x1 đến 2x10 thì vanh vách mà hỏi ngang 2x7 là đứng hình. Cho mình hỏi trên Wiszy bé có thể chỉ luyện riêng bảng 2, bảng 3 trước không bạn?',
          adminReply: 'Chào chị Linh, được luôn ạ! Trong Vương Quốc Cửu Chương mỗi bảng nhân là một vùng đất riêng (bắt đầu từ Làng Khởi Đầu x2). Bé học chắc và vượt qua thử thách bảng nào thì mới mở khóa sang bảng tiếp theo, nên không bị quá tải đâu chị.'
        },
        {
          authorName: 'Cô Ngọc Bích',
          authorEmail: 'ngocbich.gv@outlook.com',
          content: 'Mình thích cách cho các em đi qua bước đếm nhảy trước khi vào bảng nhân. Khi trẻ hiểu 2x4 là 4 bước nhảy thêm 2 thì lỡ quên vẫn tự nhẩm ra được chứ không bị học vẹt.',
          adminReply: 'Cảm ơn cô Bích đã chia sẻ góc nhìn chuyên môn ạ! Lúc thiết kế tụi mình cũng dựa đúng vào cách dạy của các cô tiểu học để biến bước đếm nhảy thành một chặng chơi ngắn cho bé dễ hình dung.'
        }
      ],
      content: `Hầu như bạn nhỏ nào khi bước vào lớp 2, lớp 3 cũng từng trải qua "cửa ải" mang tên **bảng cửu chương**.

Cách học phổ biến nhất mà nhiều thế hệ tụi mình từng trải qua là cầm tờ bìa in sẵn đọc đi đọc lại cho thuộc lòng: *"hai lần một là hai, hai lần hai là bốn..."*. Kết quả rất quen thuộc: nếu đọc xuôi từ đầu đến cuối thì trôi chảy lắm, nhưng hễ bố mẹ hay thầy cô hỏi ngang một phép tính bất kỳ kiểu *"ba nhân bảy bằng mấy?"* là bé lại phải lẩm nhẩm đọc ngược từ đầu bảng.

Đó là dấu hiệu của việc **học vẹt mà chưa kịp chạm vào bản chất của phép nhân**.

Khi xây dựng tính năng **Vương Quốc Cửu Chương** trên [Wiszy (wiszy.vn)](https://wiszy.vn/), mình đặt mục tiêu không làm thêm một trang trắc nghiệm phép nhân đơn thuần, mà tạo ra một hành trình để trẻ **hiểu trước, luyện quen tay rồi mới chinh phục thử thách**.

---

## 1. Chia nhỏ thành từng "vùng đất" để trẻ không bị ngợp

Nhìn cả một tờ giấy in kín đặc từ bảng 2 đến bảng 9, ngay cả người lớn còn thấy ngán huống chi trẻ 7–8 tuổi. Vì vậy, trên Wiszy, mỗi bảng nhân được tách thành một vùng đất riêng trên bản đồ, bắt đầu từ **Làng Khởi Đầu x2**.

![Giao diện Làng Khởi Đầu x2 trong Vương Quốc Cửu Chương trên Wiszy](/images/wiszy/wiszy-lang-khoi-dau-x2.webp)

Trẻ chỉ cần tập trung hoàn thành từng bảng một, không bị phân tâm bởi những bảng quá khó chưa học tới. Khi đã vững bảng hiện tại và hạ gục được "Boss" cuối chặng, vùng đất của bảng tiếp theo mới chính thức mở khóa. Cảm giác tự tay mở khóa một vùng đất mới tạo ra động lực tự nhiên hơn rất nhiều so với lời nhắc *"học thuộc đi con"*.

---

## 2. Chặng đếm nhảy: Hiểu bản chất phép nhân là phép cộng lặp lại

Trước khi bước vào các câu hỏi tính nhanh, các em đi qua **Chặng Học — đếm nhảy**.

![Chặng Học đếm nhảy giúp học sinh hiểu bản chất phép nhân thay vì học vẹt](/images/wiszy/wiszy-chang-hoc-dem-nhay.webp)

Thay vì ép nhớ máy móc \`2 × 4 = 8\`, hình ảnh bước nhảy đều đặn \`2 → 4 → 6 → 8\` giúp trẻ nhìn thấy bằng mắt thường rằng nhân 2 thực chất là mỗi bước cộng thêm 2. Khi đã hiểu quy luật này, kể cả lúc vào phòng kiểm tra bị quên ngang một phép tính, trẻ vẫn có thể tự nhẩm tiếp từ mốc gần nhất thay vì hoảng hốt bỏ trống.

---

## 3. Khép kín vòng lặp ôn tập cùng bố mẹ ở nhà

Sau khi bé tự khám phá và luyện trên *Vương Quốc Cửu Chương*, buổi tối bố mẹ có thể mở ngay **Chế độ Bố mẹ khảo bài** tích hợp sẵn để đọc nhanh 8 hoặc 16 phép tính cho con trả lời miệng trong 5 phút.

Sự kết hợp giữa **trẻ tự chơi để hiểu trên app** và **bố mẹ đồng hành nhẹ nhàng ngoài đời thật** giúp bảng cửu chương không còn là nỗi sợ mỗi buổi tối nữa.

> *Phụ huynh và thầy cô tiểu học có thể cho các bé trải nghiệm Vương Quốc Cửu Chương trực tiếp tại [wiszy.vn](https://wiszy.vn/) hoặc xem thêm các bài viết khác cùng chủ đề tại mục [Hành trình Wiszy](/chia-se/chu-de/wiszy).*

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // 2. Thứ Tư 02/12/2026
    {
      title: 'Biến bài giảng chữ dài thành sơ đồ trực quan trong 1 phút: Tính năng Sơ đồ bài học trên Wiszy',
      slug: 'bien-bai-giang-thanh-so-do-truc-quan-wiszy-ai',
      description: 'Giới thiệu tính năng Sơ đồ bài học trên Wiszy Công cụ: nhập tên bài để AI tóm tắt các ý chính, chọn hơn 15 bố cục trực quan (Vòng tròn, Con đường, Nét vẽ tay...) và tải ảnh PNG hoặc in ngay cho học sinh.',
      coverImage: '/images/wiszy/wiszy-so-do-bai-hoc-cover.webp',
      categoryId: catWiszy.id,
      date: new Date('2026-12-02T00:00:00.000Z'), // 07:00 AM VN
      readTime: 5,
      views: 192,
      likes: 20,
      shares: 4,
      comments: [
        {
          authorName: 'Cô Thanh Mai',
          authorEmail: 'thanhmai.tnxh@gmail.com',
          content: 'Mình dạy môn Tự nhiên và Xã hội rất hay cần vẽ mấy sơ đồ kiểu Vòng tuần hoàn của nước hay chuỗi thức ăn. Có sẵn nút chuyển sang Nét vẽ tay rồi tải ảnh PNG bỏ vào slide PowerPoint tiện thật.',
          adminReply: 'Dạ đúng trúng mục tiêu tụi mình làm tính năng này luôn cô Mai ạ! Nhiều cô bảo vẽ mấy mũi tên trên PowerPoint căn chỉnh lâu quá, nên mình làm sẵn hơn chục mẫu bố cục để cô chỉ cần chốt nội dung rồi bấm tải ảnh hoặc in trực tiếp.'
        },
        {
          authorName: 'Hữu Tín',
          authorEmail: 'huutin.daythem@outlook.com',
          content: 'Sơ đồ tạo ra xong có tự sửa chữ từng ô hoặc đổi bảng màu được không bạn?',
          adminReply: 'Chào Tín, sửa thoải mái từng ô ở cột bên trái nhé! Bạn cũng có thể thêm bớt ý, đổi thứ tự lên xuống, chọn 4 bảng màu khác nhau và bật/tắt chế độ Nét vẽ tay ngay trực tiếp trên màn hình.'
        }
      ],
      content: `Khi soạn giáo án cho học sinh tiểu học hoặc ôn tập cuối chương ở lớp dạy thêm, thầy cô nào cũng biết một điều: **đưa cho học sinh một trang toàn chữ là chữ thì các em đọc 3 dòng là nản, nhưng tóm gọn lại thành một chiếc sơ đồ 4–5 ý có màu sắc và mũi tên thì các em nhớ ngay tại lớp.**

Khó khăn duy nhất nằm ở chỗ: **vẽ một cái sơ đồ cho gọn đẹp mất quá nhiều thời gian.** Mở PowerPoint hay Canva ra kéo từng hình chữ nhật, căn từng mũi tên, chỉnh cỡ chữ sao cho không bị tràn khung... nhiều khi vẽ xong một trang tóm tắt mất trọn cả tiếng buổi tối.

Đó là lý do mình thêm tính năng **Sơ đồ bài học** vào bộ công cụ trên [Wiszy (wiszy.vn)](https://wiszy.vn/) — để AI gánh phần bố cục và căn chỉnh đồ họa, còn thầy cô chỉ cần tập trung vào kiến thức cốt lõi.

---

## 1. Từ một tên bài học đến sơ đồ gọn gàng trong vài chục giây

Thay vì phải tự vẽ từ trang giấy trắng, quy trình tạo sơ đồ trên Wiszy được rút gọn tối đa:

![Giao diện thiết kế Sơ đồ bài học trực quan trên Wiszy Công cụ](/images/wiszy/wiszy-so-do-bai-hoc-full.webp)

* Thầy cô chỉ cần nhập tên bài (ví dụ: *Vòng tuần hoàn của nước — Tự nhiên và Xã hội · Lớp 2*).
* **Wiszy AI** tự động gợi ý các nhánh ý chính ngắn gọn, dễ hiểu đúng lứa tuổi (như *Bốc hơi → Ngưng tụ → Mưa → Chảy về biển*).
* Ở cột bên trái, thầy cô toàn quyền chỉnh sửa lại từng câu chữ, đổi biểu tượng (icon), đảo thứ tự lên xuống hoặc xóa bớt nhánh chưa cần thiết.

---

## 2. Hơn 15 mẫu bố cục và chế độ "Nét vẽ tay" thân thiện

Mỗi loại kiến thức lại hợp với một cách trình bày trực quan khác nhau: quy trình khép kín hợp dạng *Vòng tròn* hoặc *Mũi tên vòng*, các bước tiến triển hợp *Con đường* hoặc *Bậc thang 3D*, còn phân cấp kiến thức lại hợp *Kim tự tháp* hay *Lưới thẻ*.

Trên màn hình thiết kế, chỉ cần bấm chọn giữa hơn **15 mẫu bố cục** có sẵn, đổi bảng màu hoặc gạt nút **Nét vẽ tay** để sơ đồ trông mềm mại, gần gũi như tranh vẽ bảng.

---

## 3. Tải ảnh PNG hoặc bấm In ngay cho cả lớp

Làm xong, thầy cô có ngay hai lựa chọn thực tế nhất:
* **Tải ảnh PNG độ nét cao:** Chèn thẳng vào slide PowerPoint chiếu trên lớp hoặc gửi vào nhóm Zalo phụ huynh để các em xem lại bài ở nhà.
* **Bấm In trực tiếp:** In ra giấy A4 phát cho học sinh dán vào vở ôn tập cuối kỳ.

Với mình, đây là cách ứng dụng AI dễ chịu và thực tế nhất trong giáo dục: AI không thay thầy cô đứng giảng, mà chỉ lặng lẽ làm giúp những thao tác căn chỉnh đồ họa tốn công để thầy cô có thêm thời gian nghỉ ngơi và chăm chút cho học trò.

> *Thầy cô có thể dùng thử Sơ đồ bài học ngay trong mục Wiszy Công cụ tại [wiszy.vn](https://wiszy.vn/) hoặc đọc thêm các chia sẻ khác trong mục [Wiszy](/chia-se/chu-de/wiszy).*

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // 3. Thứ Sáu 04/12/2026
    {
      title: 'Chấm đề thi thử và đọc "câu nào lớp sai nhiều": Góc nhìn dữ liệu giúp giáo viên dạy đỡ mệt hơn',
      slug: 'cham-de-thi-thu-va-doc-cau-nao-lop-sai-nhieu-wiszy',
      description: 'Mang tư duy phân tích dữ liệu vào tính năng Đề thi thử trên Wiszy (wiszy.vn): tự chấm trắc nghiệm, AI gợi ý điểm tự luận để giáo viên duyệt, xuất Excel và tự thống kê "Câu nào lớp sai nhiều" cùng phổ điểm.',
      coverImage: '/images/wiszy/wiszy-de-thi-thu-cover.webp',
      categoryId: catWiszy.id,
      date: new Date('2026-12-04T00:00:00.000Z'), // 07:00 AM VN
      readTime: 5,
      views: 166,
      likes: 17,
      shares: 3,
      comments: [
        {
          authorName: 'Cô Lan Chi',
          authorEmail: 'lanchi.toan3@gmail.com',
          content: 'Mình thích nhất bảng "Câu nào lớp sai nhiều" xếp sẵn từ câu sai nhiều nhất lên trên. Chấm bài giấy xong toàn chỉ kịp ghi điểm tổng chứ chẳng bao giờ đủ sức thống kê xem cả lớp hay sai câu nào.',
          adminReply: 'Dạ cảm ơn cô Chi! Hồi mới làm tính năng này mình cũng nghĩ điểm tổng chỉ là phần ngọn, còn biết chính xác câu nào cả lớp hổng kiến thức mới giúp tiết chữa bài hôm sau nhẹ nhàng và hiệu quả hơn nhiều ạ.'
        },
        {
          authorName: 'Thầy Đức Minh',
          authorEmail: 'ducminh.english@gmail.com',
          content: 'Có nút Xuất Excel là điểm cộng lớn luôn, cuối tháng cần tổng hợp báo cáo gửi trung tâm hoặc phụ huynh đỡ phải gõ lại từng bạn.',
          adminReply: 'Cảm ơn thầy Minh! Mình cũng làm việc với trung tâm ngoại ngữ nên hiểu cảnh cuối tháng tổng hợp điểm rất tốn công, có sẵn nút Xuất Excel sẽ đỡ mất thời gian nhập liệu thủ công lắm ạ.'
        }
      ],
      content: `Mỗi mùa kiểm tra giữa kỳ hay cuối kỳ, nhìn các thầy cô tiểu học và giáo viên dạy thêm ôm cả xấp 35–40 bài kiểm tra giấy về nhà chấm xuyên đêm, mình nhận ra có một nghịch lý rất đáng tiếc:

Thầy cô tốn rất nhiều công sức chấm từng câu, cộng từng điểm lẻ để ra con số tổng kết 7 điểm, 8 điểm, 9 điểm... Nhưng đến khi chấm xong cả lớp thì đã quá mệt, **không còn đủ thời gian để thống kê lại xem: rốt cuộc cả lớp đang sai nhiều nhất ở câu nào và hổng đúng mảng kiến thức nào?**

Khi mang nền tảng làm IT và phân tích dữ liệu của mình vào xây dựng tính năng **Đề thi thử** trên [Wiszy (wiszy.vn)](https://wiszy.vn/), mình muốn biến công đoạn kiểm tra từ việc "chấm lấy điểm" thành một công cụ **chẩn đoán lỗ hổng kiến thức cực nhanh** cho giáo viên.

---

## 1. AI gợi ý chấm tự luận, nhưng thầy cô luôn là người duyệt cuối cùng

Một đề kiểm tra thực tế ở tiểu học không chỉ có trắc nghiệm mà luôn có phần tự luận. Trên màn hình **Theo dõi bài làm** của Wiszy:

![Màn hình Theo dõi bài làm, Phổ điểm và thống kê Câu nào lớp sai nhiều trên Wiszy](/images/wiszy/wiszy-de-thi-thu-theo-doi.webp)

* Phần **trắc nghiệm** được hệ thống tự chấm ngay khi học sinh nộp bài.
* Phần **tự luận**, AI sẽ đọc bài làm và **gợi ý mức điểm cùng lời phê nháp**, sau đó chuyển sang trạng thái chờ duyệt. Thầy cô chỉ cần bấm **Xem bài**, kiểm tra lại nhanh, chỉnh điểm hoặc sửa lời phê theo giọng văn của mình rồi mới bấm **Trả bài**.
* Hệ thống còn hiển thị thêm các tín hiệu nhỏ như số lần học sinh rời khỏi trang làm bài, và có sẵn nút **Xuất Excel** để thầy cô lưu sổ điểm hoặc gửi báo cáo cho trung tâm mà không phải nhập tay lại.

![Giao diện giáo viên xem chi tiết bài làm và duyệt điểm cho từng học sinh](/images/wiszy/wiszy-de-thi-thu-xem-bai.webp)

---

## 2. Giá trị lớn nhất nằm ở bảng "Câu nào lớp sai nhiều"

Ngay bên dưới danh sách học sinh, hệ thống tự động tổng hợp hai biểu đồ trực quan: **Phổ điểm cả lớp** và bảng **Câu nào lớp sai nhiều** (tự động đẩy những câu có tỷ lệ làm đúng thấp nhất lên đầu).

Nhờ bảng thống kê này, sáng hôm sau bước vào tiết chữa bài, thầy cô không cần giảng lại đều đều từ Câu 1 đến Câu 12 nữa. Những câu cả lớp đã đạt \`100% đúng\` có thể lướt nhanh khen ngợi, và dành trọn thời gian quý báu để giải kỹ lại 2–3 dạng bài mà đa số học sinh đang nhầm lẫn (ví dụ: *đổi đơn vị đo độ dài* hay *so sánh số lớn gấp mấy lần số bé*).

---

## Góc nhìn của người làm sản phẩm

Dữ liệu trong giáo dục không cần những bảng biểu phức tạp kiểu doanh nghiệp lớn. Chỉ cần trả lời gọn ghẽ cho giáo viên đúng một câu hỏi: **"Tiết sau mình cần ôn kỹ lại phần nào cho lớp?"** — là công nghệ đã thực sự giúp người dạy đỡ mệt hơn rất nhiều.

> *Thầy cô có thể trải nghiệm tính năng Đề thi thử tại [wiszy.vn](https://wiszy.vn/) hoặc xem thêm các bài viết khác về sản phẩm trong mục [Wiszy](/chia-se/chu-de/wiszy).*

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
    },

    // 4. Chủ Nhật 06/12/2026
    {
      title: 'Xây Cộng đồng chia sẻ đề trên Wiszy: Triết lý cho đi trước để thầy cô không ai phải soạn lại từ con số 0',
      slug: 'xay-cong-dong-chia-se-de-tren-wiszy-triet-ly-cho-di-truoc',
      description: 'Câu chuyện phía sau Diễn đàn Cộng đồng bài học và bài trắc nghiệm trên Wiszy (wiszy.vn): vì sao mình xây tính năng 1 click "Sử dụng" mang đề về thư viện cá nhân để cộng đồng giáo viên cùng đỡ vất vả.',
      coverImage: '/images/wiszy/wiszy-cong-dong-cover.webp',
      categoryId: catWiszy.id,
      date: new Date('2026-12-06T00:00:00.000Z'), // 07:00 AM VN
      readTime: 5,
      views: 196,
      likes: 21,
      shares: 4,
      comments: [
        {
          authorName: 'Cô Bảo Ngọc',
          authorEmail: 'baongoc.tieuhoc@gmail.com',
          content: 'Mình mới ra trường đi dạy lớp 2 năm đầu, có sẵn kho đề cộng đồng lọc theo từng môn từng bài thế này đỡ áp lực hẳn. Cho mình hỏi khi bấm Sử dụng mang về thư viện riêng rồi mình sửa câu hỏi thì có làm thay đổi bài gốc của người đăng không bạn?',
          adminReply: 'Chào cô Ngọc, hoàn toàn không ảnh hưởng đến bài gốc đâu ạ! Khi cô bấm Sử dụng, hệ thống sẽ tạo một bản sao độc lập đưa vào Thư viện của cô để cô tự do chỉnh sửa cho vừa sức lớp mình nhé.'
        },
        {
          authorName: 'Anh Tuấn',
          authorEmail: 'anhtuan.solopreneur@gmail.com',
          content: 'Rất đồng tình với góc nhìn chống lãng phí công sức lặp lại. Một nền tảng giáo dục có kho nội dung cộng đồng mở như thế này sẽ giữ chân người dùng bền hơn nhiều so với chỉ bán công cụ trống.',
          adminReply: 'Cảm ơn Tuấn đã chia sẻ góc nhìn! Đúng là khi mới mở một công cụ mà trống trơn thì ai cũng ngại bắt đầu, có sẵn kho bài tử tế để thầy cô trải nghiệm ngay sẽ dễ đi vào thực tế lớp học hơn nhiều.'
        }
      ],
      content: `Có một sự lãng phí rất lớn nhưng lại diễn ra âm thầm mỗi tối trong ngành giáo dục:

Cùng một bài *Toán lớp 2 — Phép cộng qua 10* hay *Tiếng Anh Unit 1*, đang có hàng ngàn thầy cô giáo khắp mọi miền đất nước ngồi mở máy tính và... **gõ lại từng câu hỏi gần như giống hệt nhau**. Mạnh ai nấy soạn, soạn xong lưu trong máy cá nhân, năm sau thầy cô trẻ mới vào nghề lại bắt đầu gõ lại từ con số 0.

Ngay từ những ngày đầu xây dựng ` + '`harryshare.vn`' + `, mình luôn giữ một niềm tin mộc mạc: **“Cho đi trước, chia sẻ thật.”** Và khi làm hệ sinh thái [Wiszy (wiszy.vn)](https://wiszy.vn/), mình cũng mang đúng tinh thần đó vào tính năng **Cộng đồng bài học, bài trắc nghiệm (Diễn đàn Wiszy)**.

---

## 1. Một kho bài tập mở, lọc rõ theo môn học và khối lớp

Thay vì để mỗi giáo viên bước vào một ứng dụng trống trơn và tự xoay xở từ đầu, Diễn đàn Wiszy tập hợp sẵn kho bài học và bài trắc nghiệm phân chia rõ ràng theo từng môn (*Toán học, Tiếng Việt, Tiếng Anh, Khoa học, Tin học, Lịch sử, Địa lý, Tự nhiên và Xã hội...*) và từng khối lớp.

![Diễn đàn Cộng đồng bài học và bài trắc nghiệm với hàng chục trang đề mẫu trên Wiszy](/images/wiszy/wiszy-cong-dong-full.webp)

Thầy cô chỉ cần lọc đúng môn, đúng khối lớp mình đang dạy, bấm **Xem trước** để kiểm tra kỹ nội dung từng câu hỏi xem có hợp với học sinh của mình hay không.

---

## 2. Một cú bấm "Sử dụng" — mang về thư viện riêng để tùy biến

Nếu thấy một bộ đề hay và sát chương trình, thầy cô chỉ cần bấm **Sử dụng**. Hệ thống lập tức nhân bản bộ đề đó đưa thẳng vào mục **Thư viện của tôi**.

![Sau khi bấm Sử dụng, bộ bài tập được sao chép ngay vào Thư viện cá nhân của giáo viên](/images/wiszy/wiszy-cong-dong-su-dung.webp)

Từ bản sao độc lập này, thầy cô có thể chỉnh lại vài câu chữ cho hợp trình độ lớp mình, thêm 1–2 câu nâng cao hoặc gắn thẳng vào các trò chơi chiếu TV như *Kéo Co Tri Thức*, *Cuộc Đua Kỳ Thú* — hoàn toàn không làm ảnh hưởng đến bài gốc của người chia sẻ.

---

## 3. Khi cộng đồng cùng chia sẻ, người hưởng lợi lớn nhất là học trò

Mình tin rằng thương hiệu cá nhân hay một sản phẩm giáo dục bền vững không bao giờ lớn lên nhờ việc giữ khư khư tài nguyên cho riêng mình. Khi một thầy cô chia sẻ bộ đề tâm huyết lên cộng đồng, hàng chục thầy cô khác tiết kiệm được hàng giờ đồng hồ gõ phím — và khoảng thời gian quý giá đó lại được dành ngược lại cho việc lắng nghe, kèm cặp những bạn học sinh còn yếu trên lớp.

Đó là vòng tròn giá trị tử tế mà mình luôn muốn duy trì trên cả HarryShare lẫn Wiszy.

> *Thầy cô có thể khám phá kho bài tập cộng đồng tại [wiszy.vn](https://wiszy.vn/) hoặc xem trọn bộ các bài viết chia sẻ về hành trình sản phẩm trong chuyên mục [Wiszy](/chia-se/chu-de/wiszy).*

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

    console.log(`✓ Scheduled [${catWiszy.name}]: "${upserted.title}" -> ${post.date.toISOString()}`);

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
  console.log('\n--- ALL 4 WISZY POSTS FOR WEEK NOV 30 - DEC 06 SCHEDULED SUCCESSFULLY ---');
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
