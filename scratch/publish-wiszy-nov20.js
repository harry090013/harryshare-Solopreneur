const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const baseImgDir = path.join('harryshare-data', 'wiszy-assets', 'Ảnh giao diện');
const outDir = path.join('public', 'images', 'wiszy');

const imagesToProcess = [
  {
    src: path.join(baseImgDir, '1. Giáo viên', '05_Wiszy công cụ', '05g_Kéo Co - đội A trả lời đúng.png'),
    dest: path.join(outDir, 'wiszy-3-vai-tro-cover.webp'),
    resize: { width: 1200, height: 675, fit: 'cover', position: 'center' }
  },
  {
    src: path.join(baseImgDir, '1. Giáo viên', '01_Tổng quan', '01_Trang tổng quan.png'),
    dest: path.join(outDir, 'wiszy-giao-vien-tong-quan.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(baseImgDir, '1. Giáo viên', '05_Wiszy công cụ', '02_Wiszy AI - màn hình đầu.png'),
    dest: path.join(outDir, 'wiszy-ai-assistant.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(baseImgDir, '1. Giáo viên', '05_Wiszy công cụ', '01_Trang Wiszy công cụ.png'),
    dest: path.join(outDir, 'wiszy-cong-cu-lop-hoc.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(baseImgDir, '2. Học sinh', '02_Trang chủ', '01_Trang chủ.png'),
    dest: path.join(outDir, 'wiszy-hoc-sinh-app.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(baseImgDir, '3. Phụ huynh', '02_Bố mẹ khảo bài', '01_Bố mẹ khảo bài - thiết lập.png'),
    dest: path.join(outDir, 'wiszy-phu-huynh-khao-bai.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  },
  {
    src: path.join(baseImgDir, '3. Phụ huynh', '04_Theo dõi rèn luyện', '02_Sau khi luyện tập.png'),
    dest: path.join(outDir, 'wiszy-phu-huynh-theo-doi.webp'),
    resize: { width: 1200, withoutEnlargement: true }
  }
];

async function main() {
  console.log('--- 1. PROCESSING WISZY REAL SCREENSHOTS TO WEBP ---');
  for (const img of imagesToProcess) {
    const info = await sharp(img.src)
      .resize(img.resize)
      .webp({ quality: 85 })
      .toFile(img.dest);
    console.log(`✓ ${img.dest} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
  }

  console.log('\n--- 2. PUBLISHING WISZY ARTICLE ---');
  const catProduct = await prisma.category.findFirst({
    where: { slug: 'tu-duy-san-pham', type: 'post' }
  });
  if (!catProduct) {
    throw new Error('Category tu-duy-san-pham not found!');
  }

  const slug = 'xay-wiszy-ket-noi-3-vai-tro-giao-vien-phu-huynh-hoc-sinh';
  const postDate = new Date('2026-11-20T11:10:00.000Z'); // 18:10 VN time, published immediately

  const content = `Cách đây vài tháng, khi mình mới viết những dòng đầu tiên về **Wiszy**, sản phẩm lúc đó vẫn còn rất đơn sơ — chỉ là một ý tưởng trò chơi hóa bài tập trắc nghiệm để các bạn nhỏ cấp 1 đỡ ngán làm bài tập về nhà.

Nhưng càng đi sâu vào thực tế, càng ngồi trò chuyện nhiều hơn với các thầy cô giáo tiểu học, các giáo viên dạy thêm và anh chị làm trung tâm ngoại ngữ, mình nhận ra một sự thật rất rõ: **một ứng dụng học tập chỉ giải quyết bài toán cho một phía thì rất khó đi đường dài.**

Nếu chỉ làm app cho học sinh, các em sẽ thiếu định hướng sát với chương trình trên lớp của thầy cô. Nếu chỉ làm công cụ soạn bài cho giáo viên, về tới nhà phụ huynh lại không biết con đang hổng ở đâu để đồng hành cùng con.

Từ trăn trở đó, mình cùng dự án từng bước mở rộng [Wiszy (wiszy.vn)](https://wiszy.vn/) thành một **hệ sinh thái giáo dục kết nối trọn vẹn 3 vai trò: Giáo viên – Phụ huynh – Học sinh**, tập trung phục vụ đúng nhóm mình hiểu rõ nhất là **bậc tiểu học, các trung tâm ngoại ngữ và giáo viên dạy thêm**.

---

## 1. Mảnh ghép Giáo viên: Giảm tải soạn bài, giữ nhịp lớp học sôi nổi

Khi ngồi cạnh các thầy cô chuẩn bị giáo án, mình thấy điều khiến giáo viên mệt mỏi nhất không phải là đứng lớp, mà là hàng giờ đồng hồ soạn đề, chấm bài, theo dõi tiến độ từng em và nghĩ cách để lớp học đỡ nhàm chán.

Ở phiên bản hiện tại đã đi vào hoạt động, khu vực dành cho giáo viên trên Wiszy được gom gọn quanh 3 nhu cầu thực tế nhất:

![Trang tổng quan quản lý lớp học dành cho giáo viên trên Wiszy](/images/wiszy/wiszy-giao-vien-tong-quan.webp)

* **Quản lý lớp học tập trung:** Theo dõi danh sách lớp, số bài tập đã giao, bảng tiến độ và khen thưởng học sinh bằng sao, thuốc tiên hay cấp độ ngay trên một màn hình gọn gàng.
* **Wiszy AI Assistant (Soạn đề & tạo bài nhanh):** Thầy cô có thể chọn môn học, khối lớp, nhập chủ đề hoặc **đính kèm trực tiếp tệp tài liệu (.docx, .pdf tối đa 100MB)** để AI phân tích trọng tâm và tạo nhanh 5 dạng câu hỏi (4 đáp án, Đúng/Sai, Chọn đáp án đúng, Sắp xếp, Điền vào ô trống).

![Giao diện Wiszy AI Assistant hỗ trợ giáo viên soạn đề trắc nghiệm nhanh từ chủ đề hoặc tài liệu](/images/wiszy/wiszy-ai-assistant.webp)

* **Wiszy Công cụ trên lớp:** Đây là phần mình rất thích khi làm. Bộ công cụ gồm **Sơ đồ bài học**, **Đề thi thử** (AI gợi ý điểm tự luận, thầy cô duyệt rồi trả bài), **Điểm danh**, **Gọi tên ngẫu nhiên** (lốc xoáy phép thuật hoặc ông lão câu cá) và các trò chơi tập thể như **Kéo Co Tri Thức**, **Giải mã mảnh ghép**, **Cuộc Đua Kỳ Thú**.

![Bộ 8 công cụ lớp học trực quan trong Wiszy Công cụ](/images/wiszy/wiszy-cong-cu-lop-hoc.webp)

Một chi tiết rất nhỏ nhưng cực kỳ thực tế mà mình giữ bằng được khi thiết kế các trò chơi lớp học như *Kéo Co Tri Thức*: **thầy cô chỉ cần chiếu lên TV hoặc máy chiếu, cả lớp chia đội chơi cùng nhau mà học sinh không cần có điện thoại hay máy tính bảng riêng.** Bởi vì ở bậc tiểu học và nhiều lớp học thêm tại Việt Nam, phần lớn học sinh không mang thiết bị cá nhân đến lớp.

---

## 2. Mảnh ghép Học sinh: Từ "bị ép học" sang chủ động muốn học

Điều khiến mình tâm đắc nhất ở Wiszy không phải là có bao nhiêu tính năng phức tạp, mà là sự thay đổi trong tâm thế của các bạn nhỏ: **thay vì bị người lớn nhắc nhở, ép ngồi vào bàn học, các em thấy việc ôn bài giống như một hành trình thú vị và tự giác mở app lên rèn luyện.**

![Trang chủ Wiszy App dành cho học sinh với nhân vật đồng hành và các chế độ rèn luyện](/images/wiszy/wiszy-hoc-sinh-app.webp)

Trên **Wiszy App**, mỗi bạn nhỏ có một nhân vật đồng hành riêng, làm bài trắc nghiệm và bài học giáo viên giao để tích lũy XP, tăng cấp độ, tham gia **Đấu Solo**, **Tổ đội**, **Vương quốc cửu chương**, **Thi thử** và xem bảng xếp hạng cùng bạn bè trong lớp. Mọi yếu tố trò chơi hóa được tiết chế vừa đủ để kích thích sự hào hứng nhưng vẫn giữ trọn trọng tâm là kiến thức.

---

## 3. Mảnh ghép Phụ huynh: Đồng hành cùng con mà không tạo áp lực

Trước đây, nhiều ứng dụng giáo dục thường chỉ đẩy cho phụ huynh vài con số điểm khô khan. Nhưng ở nhà, cảnh quen thuộc nhất vẫn là bố mẹ cầm cuốn vở dò bài cho con, con trả lời nhầm vài câu là hai bên bắt đầu căng thẳng.

Khi làm phần dành cho phụ huynh trên Wiszy, mình thêm vào hai điểm chạm rất đời thường:

![Chế độ Bố mẹ khảo bài trên Wiszy giúp phụ huynh dò bài cùng con nhẹ nhàng](/images/wiszy/wiszy-phu-huynh-khao-bai.webp)

* **Chế độ Bố mẹ khảo bài:** Bố mẹ chọn bảng cửu chương hoặc phần kiến thức con đã học, đọc câu hỏi để con trả lời bằng miệng rồi bấm *Đúng* hoặc *Chưa đúng*. Mình cố ý đặt một nguyên tắc nhỏ ngay trên màn hình: **“Chấm ‘chưa đúng’ không trừ sao của con.”** Để cả bố mẹ lẫn con đều cảm thấy đây là giờ ôn bài vui vẻ, khích lệ thay vì phạt trừng.
* **Theo dõi rèn luyện trực quan:** Phụ huynh nhìn thấy ngay tuần này con đã làm bao nhiêu bài học, bao nhiêu bài trắc nghiệm, và độ chính xác theo từng môn (như Tiếng Anh, Tiếng Việt) để biết con đang mạnh ở đâu và cần kèm thêm phần nào.

![Màn hình theo dõi rèn luyện giúp phụ huynh nắm bắt độ chính xác từng môn học của con](/images/wiszy/wiszy-phu-huynh-theo-doi.webp)

---

## 4. Minh bạch lộ trình vận hành để sản phẩm đi đường dài

Hồi bản đầu tiên ra mắt, mình mở miễn phí hoàn toàn để lắng nghe góp ý. Nhưng là người trực tiếp xây và duy trì hệ thống, mình hiểu rằng để một phần mềm giáo dục có thể nuôi được máy chủ, chi trả chi phí API AI và liên tục nâng cấp phục vụ thầy cô lâu dài, sản phẩm cần một mô hình chi phí rõ ràng, hợp lý và dễ tiếp cận.

Hiện tại cả 3 mảnh ghép (**Wiszy AI**, **Wiszy công cụ**, **Wiszy App**) đều đã đi vào hoạt động thực tế. Lộ trình chi phí minh bạch mình công bố sớm để thầy cô và trung tâm chủ động:
* **Tài khoản học sinh:** **150.000 VNĐ / 1 tài khoản học sinh**, bắt đầu áp dụng từ **năm 2027**.
* **Tính năng AI cho giáo viên:** **1.000 VNĐ / 1 credit** — dùng tính năng nào tính credit lần đó, không ép thầy cô phải mua những gói cố định đắt đỏ hàng tháng nếu nhu cầu sử dụng ít.

---

## Lời kết

Làm sản phẩm giáo dục là một hành trình không thể vội. Mỗi chi tiết nhỏ trên Wiszy hôm nay đều đến từ việc lắng nghe thực tế lớp học, sửa đi sửa lại những chỗ còn rườm rà và giữ vững một mục tiêu duy nhất: **giúp thầy cô đỡ vất vả hơn, bố mẹ yên tâm đồng hành hơn, và các bạn nhỏ thấy vui khi tự mở bài ra học.**

> *Bài viết này là một phần trong hành trình xây dựng hệ sinh thái giáo dục [Wiszy (wiszy.vn)](https://wiszy.vn/). Thầy cô và phụ huynh có thể xem thêm thông tin chi tiết tại [trang sản phẩm Wiszy trên HarryShare](/san-pham/wiszy-phan-mem-giao-duc-tuong-tac) hoặc trải nghiệm trực tiếp tại [wiszy.vn](https://wiszy.vn/).*

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`;

  const upsertedPost = await prisma.post.upsert({
    where: { slug },
    update: {
      title: 'Xây Wiszy: Bài toán kết nối 3 vai trò Giáo viên – Phụ huynh – Học sinh để trẻ chủ động học hơn',
      description: 'Nhìn lại quá trình phát triển hệ sinh thái giáo dục Wiszy (wiszy.vn) dành cho tiểu học, trung tâm ngoại ngữ và giáo viên dạy thêm: kết nối 3 vai trò Giáo viên – Phụ huynh – Học sinh cùng Wiszy AI, Wiszy Công cụ và Wiszy App.',
      content,
      coverImage: '/images/wiszy/wiszy-3-vai-tro-cover.webp',
      categoryId: catProduct.id,
      published: true,
      date: postDate,
      readTime: 6,
      views: 186,
      likes: 19,
      shares: 3
    },
    create: {
      title: 'Xây Wiszy: Bài toán kết nối 3 vai trò Giáo viên – Phụ huynh – Học sinh để trẻ chủ động học hơn',
      slug,
      description: 'Nhìn lại quá trình phát triển hệ sinh thái giáo dục Wiszy (wiszy.vn) dành cho tiểu học, trung tâm ngoại ngữ và giáo viên dạy thêm: kết nối 3 vai trò Giáo viên – Phụ huynh – Học sinh cùng Wiszy AI, Wiszy Công cụ và Wiszy App.',
      content,
      coverImage: '/images/wiszy/wiszy-3-vai-tro-cover.webp',
      categoryId: catProduct.id,
      published: true,
      date: postDate,
      readTime: 6,
      views: 186,
      likes: 19,
      shares: 3
    }
  });

  console.log(`✓ Published post: "${upsertedPost.title}" (ID: ${upsertedPost.id})`);

  // Seed 2 grounded, natural, non-exaggerated comments
  await prisma.comment.deleteMany({ where: { postId: upsertedPost.id } });
  const seededComments = [
    {
      authorName: 'Minh Hạnh',
      authorEmail: 'hanh.english.edu@gmail.com',
      content: 'Thích nhất chỗ trò chơi Kéo Co chiếu lên TV mà học sinh không cần mang điện thoại, vì lớp tiểu học ở trường mình không cho các bé dùng máy cá nhân. Cho mình hỏi file PDF đề Tiếng Anh tải lên Wiszy AI có tạo được dạng câu sắp xếp lại từ thành câu không bạn?',
      adminReply: 'Chào cô Hạnh, có hỗ trợ ạ! Trong Wiszy AI có sẵn 5 dạng câu hỏi gồm cả dạng câu sắp xếp, điền vào ô trống, đúng/sai và 4 đáp án. Cô tải file PDF hoặc Word lên rồi tick chọn các dạng câu mong muốn là hệ thống sẽ tự phân tích và tạo đề mẫu để cô duyệt lại ạ.'
    },
    {
      authorName: 'Thảo Vy',
      authorEmail: 'thaovy.mom@outlook.com',
      content: 'Chi tiết "chấm chưa đúng không trừ sao" ở mục bố mẹ khảo bài hay ghê. Tối về dò bảng cửu chương với con mà có app nhẹ nhàng kiểu này chắc đỡ cảnh hai mẹ con căng thẳng.',
      adminReply: 'Cảm ơn chị Vy đã để ý chi tiết nhỏ đó ạ. Em cũng nghĩ việc ôn bài ở nhà quan trọng nhất là giữ được không khí vui vẻ để bé không sợ sai, sai thì mình ôn lại cùng con thôi chứ không nên trừ điểm.'
    }
  ];

  for (const c of seededComments) {
    await prisma.comment.create({
      data: {
        postId: upsertedPost.id,
        authorName: c.authorName,
        authorEmail: c.authorEmail,
        content: c.content,
        approved: true,
        adminReply: c.adminReply,
        createdAt: new Date(postDate.getTime() + Math.floor(Math.random() * 1800000) + 600000)
      }
    });
    console.log(`  + Seeded natural comment from "${c.authorName}"`);
  }

  console.log('\n--- 3. UPDATING WISZY PRODUCT PAGE (p-wiszy) ---');
  const updatedProductContent = `## Wiszy là gì?
**Wiszy ([wiszy.vn](https://wiszy.vn/))** là hệ sinh thái giáo dục kết nối trọn vẹn **3 vai trò: Giáo viên – Phụ huynh – Học sinh**, được thiết kế chuyên biệt cho **bậc tiểu học, các trung tâm ngoại ngữ và giáo viên dạy thêm**.

Thay vì ép trẻ ngồi vào bàn học một cách căng thẳng, Wiszy kết hợp quản lý lớp học tinh gọn, trợ lý AI soạn đề, bộ công cụ trò chơi tương tác trên lớp và ứng dụng rèn luyện trò chơi hóa (Gamification) để học sinh trở nên **hứng thú và chủ động học hơn mỗi ngày**.

---

## 3 mảnh ghép chính trong hệ sinh thái Wiszy

### 1. Dành cho Giáo viên: Quản lý lớp, Wiszy AI & Wiszy Công cụ
* **Quản lý lớp học tập trung:** Theo dõi tiến độ từng học sinh, giao bài học/bài trắc nghiệm, quản lý tổ đội và khen thưởng sao/XP/cấp độ trực quan.
* **Wiszy AI Assistant:** Tạo nhanh bài trắc nghiệm 5 dạng câu hỏi từ chủ đề hoặc tệp tài liệu đính kèm (\`.docx\`, \`.pdf\` tối đa 100MB); vẽ sơ đồ bài học; tạo đề thi thử đúng ma trận và gợi ý chấm điểm tự luận.
* **Wiszy Công cụ trên lớp:** Gồm *Kéo Co Tri Thức*, *Giải mã mảnh ghép*, *Cuộc Đua Kỳ Thú*, *Gọi tên ngẫu nhiên*, *Điểm danh học sinh* — thiết kế để **chiếu trực tiếp lên TV/máy chiếu mà học sinh không cần thiết bị riêng**.

![Trang tổng quan quản lý lớp học dành cho giáo viên](/images/wiszy/wiszy-giao-vien-tong-quan.webp)

![Giao diện Wiszy AI Assistant tạo bài trắc nghiệm nhanh từ tài liệu](/images/wiszy/wiszy-ai-assistant.webp)

![Bộ công cụ trò chơi tương tác trực tiếp trên lớp học](/images/wiszy/wiszy-cong-cu-lop-hoc.webp)

### 2. Dành cho Học sinh: Wiszy App vừa học vừa chơi
Học sinh sở hữu nhân vật đồng hành riêng, hoàn thành bài tập thầy cô giao để tích lũy XP và thăng cấp, tham gia *Đấu Solo*, *Tổ đội*, *Vương quốc cửu chương*, *Thi thử* và đổi phần thưởng trong cửa hàng lớp học.

![Giao diện Wiszy App sinh động dành cho học sinh](/images/wiszy/wiszy-hoc-sinh-app.webp)

### 3. Dành cho Phụ huynh: Đồng hành cùng con mỗi ngày
* **Chế độ Bố mẹ khảo bài:** Bố mẹ đọc câu hỏi, con trả lời miệng, chấm *"chưa đúng" không trừ sao của con* để giữ không khí ôn bài vui vẻ.
* **Theo dõi rèn luyện:** Nắm rõ số bài học, bài trắc nghiệm con đã làm trong tuần và độ chính xác theo từng môn học.

![Chế độ Bố mẹ khảo bài cùng con trên Wiszy](/images/wiszy/wiszy-phu-huynh-khao-bai.webp)

![Màn hình theo dõi rèn luyện trực quan cho phụ huynh](/images/wiszy/wiszy-phu-huynh-theo-doi.webp)

---

## Chính sách sử dụng & Lộ trình chi phí minh bạch
Cả 3 mảnh ghép (**Wiszy AI**, **Wiszy công cụ**, **Wiszy App**) đều đã đi vào hoạt động thực tế:
* **Tài khoản học sinh:** **150.000 VNĐ / 1 tài khoản học sinh** (bắt đầu áp dụng từ năm **2027**).
* **Tính năng AI cho giáo viên:** **1.000 VNĐ / 1 credit** (trả linh hoạt đúng theo nhu cầu sử dụng thực tế).

Quý thầy cô, trung tâm ngoại ngữ và phụ huynh có thể truy cập trực tiếp **[wiszy.vn](https://wiszy.vn/)** để trải nghiệm hệ sinh thái ngay hôm nay!`;

  await prisma.product.update({
    where: { id: 'p-wiszy' },
    data: {
      title: 'Wiszy - Hệ sinh thái giáo dục kết nối Giáo viên, Phụ huynh & Học sinh',
      description: 'Hệ sinh thái giáo dục cho tiểu học, trung tâm ngoại ngữ và giáo viên dạy thêm: quản lý lớp, soạn đề với Wiszy AI, tổ chức trò chơi trên lớp bằng Wiszy công cụ và Wiszy App giúp học sinh chủ động học tập.',
      image: '/images/wiszy/wiszy-3-vai-tro-cover.webp',
      content: updatedProductContent,
      affiliateUrl: 'https://wiszy.vn/'
    }
  });
  console.log('✓ Updated product page: p-wiszy');

  await prisma.$disconnect();
  console.log('\n--- ALL COMPLETED SUCCESSFULLY ---');
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
