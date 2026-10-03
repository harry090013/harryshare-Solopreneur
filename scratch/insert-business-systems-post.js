const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- INSERTING POST: DOANH NGHIEP CU & DOANH NGHIEP MOI ---');

  // Find category
  const catCareer = await prisma.category.findFirst({
    where: { slug: 'hanh-trinh-lam-nghe', type: 'post' }
  });

  if (!catCareer) {
    throw new Error('Category hanh-trinh-lam-nghe not found!');
  }

  const slug = 'doanh-nghiep-cu-thieu-he-thong-doanh-nghiep-moi-thieu-trai-nghiem';
  const postDate = new Date('2026-10-03T03:00:00.000Z');

  const content = `Mấy hôm nay, sau những buổi trò chuyện với bạn bè làm việc ở nhiều môi trường khác nhau, kết hợp với những gì bản thân từng trải qua từ ngày còn đi làm văn phòng cho đến lúc tự tay gầy dựng những dự án riêng, mình ngồi ngẫm lại và thấy có một nghịch lý rất thú vị về câu chuyện xây dựng hệ thống trong công việc.

Không phải là lý thuyết quản trị cao siêu trong sách vở, mà là bức tranh thực tế rất sống động giữa hai thái cực: **Doanh nghiệp lâu năm (doanh nghiệp cũ)** và **Doanh nghiệp khởi nghiệp (doanh nghiệp mới)**.

![Harry (Quang Hiếu) tại bãi biển Đà Nẵng](/images/doanh-nghiep-cu-thieu-he-thong-doanh-nghiep-moi-thieu-trai-nghiem.webp)

---

## 1. Doanh nghiệp cũ: Ôm "kho báu" nhưng thiếu bản đồ khai thác

Những doanh nghiệp đã tồn tại 5 năm, 10 năm hay lâu hơn luôn sở hữu những tài sản vô giá mà bất kỳ ai mới bước chân vào thương trường cũng phải thèm thuồng:
* Bề dày kinh nghiệm và trải nghiệm thực chiến phong phú.
* Tệp khách hàng thân thiết, trung thành đã được thử thách qua thời gian.
* Mạng lưới mối quan hệ đối tác sâu rộng trong ngành.
* Hàng núi dữ liệu giao dịch, lịch sử xử lý vấn đề và bài học thương trường.

Thế nhưng, điểm nghẽn lớn nhất của rất nhiều doanh nghiệp lâu năm là: **Có kho báu khổng lồ nhưng không chịu tổng hợp hay xây dựng hệ thống có cấu trúc rõ ràng để khai thác**.

Mọi bí quyết vận hành, thông tin khách hàng hay phương pháp xử lý sự cố dường như chỉ nằm gọn trong... "đầu của một vài cá nhân chủ chốt". Mọi thứ được giải quyết dựa trên cảm tính, thói quen cũ hoặc rải rác trong hàng chục nhóm chat, sổ tay cá nhân và các file Excel rời rạc.

Đến khi doanh nghiệp muốn mở rộng quy mô (scale-up), hay chỉ đơn giản là khi một nhân sự kỳ cựu xin nghỉ, cả một mắt xích vận hành lập tức bị rối loạn. Tri thức không được "đóng gói" thành tài sản chung của tổ chức thì doanh nghiệp dù có nền tảng vững vàng đến đâu cũng rất khó phát triển xa và bền vững được.

---

## 2. Doanh nghiệp mới: Dựng giàn giáo thật đẹp nhưng chưa đủ gạch và vữa

Ở thái cực ngược lại, các doanh nghiệp trẻ, các startup công nghệ hay những nhà sáng lập thế hệ mới lại có một tư duy rất tiến bộ:
* Chú trọng việc ứng dụng công cụ hiện đại (Notion, ERP, CRM, Slack, AI...).
* Tập trung thiết lập quy trình làm việc chuẩn (SOP), phân quyền chi tiết.
* Lưu trữ dữ liệu số hóa, hướng tới sự đồng bộ và tự động hóa ngay từ ngày đầu.

Nhưng nghịch lý ở chỗ: **Xây hệ thống khi chưa đủ trải nghiệm thực tế thì hệ thống sẽ phải đập đi sửa lại liên tục.**

Một quy trình được vẽ ra trên giấy dù có chặt chẽ và bài bản đến đâu, nhưng nếu người thiết kế chưa từng trực tiếp "lăn lộn ngoài trận địa", chưa hiểu hết tâm lý khách hàng và chưa lường trước được hàng vạn trường hợp ngoại lệ (edge cases) phát sinh trong thực tế, thì quy trình đó sẽ trở thành một chiếc áo quá chật hoặc quá rộng.

Kết quả là: Tuần này vừa áp dụng quy trình A, tuần sau thấy bất cập lại đổi sang quy trình B, tháng sau lại chuyển sang một phần mềm quản trị mới. Đội ngũ nhân sự chưa kịp quen với cách làm cũ đã phải còng lưng chạy theo học công cụ mới, tiêu tốn rất nhiều năng lượng vô ích.

---

## 3. "Phận làm nhân viên" và những nỗi niềm muôn thuở

Đứng ở góc độ một người đi làm, nhìn vào hai bức tranh trên mới thấy: **Nhảy vào chỗ nào thì cũng có cái cực riêng.**

* Nhảy vào doanh nghiệp cũ thì cực vì **thiếu quy trình**: Mọi thứ mù mờ, phải tự bơi, làm việc thủ công lặp đi lặp lại, muốn tìm lại một tài liệu cũ hay số liệu năm ngoái thì giống như mò kim đáy bể.
* Nhảy vào doanh nghiệp mới thì cực vì **quá nhiều quy trình thay đổi liên tục**: Thời gian ngồi điền biểu mẫu, log task và họp hành tối ưu hóa có khi còn nhiều hơn thời gian thực sự bắt tay vào tạo ra giá trị cho công việc.

Nhưng cũng chính nhờ được va vấp qua những trải nghiệm thực tế đó, mình mới nhận ra rằng: **Không có môi trường nào hoàn hảo, chỉ có cách chúng ta tự thích nghi và tôi luyện năng lực giải quyết vấn đề của chính mình.**

---

## 4. Triết lý của "một người lười": Đi từ Overview đến Detail

Bản thân mình là một đứa mê tối ưu hiệu suất công việc. Dù là trong học tập, lập trình phần mềm, làm marketing hay vận hành một dự án độc lập, mình luôn có thói quen tư duy: **Đi từ tổng thể đến chi tiết (From Overview to Detail)**.

Mỗi khi đứng trước một vấn đề hóc búa, mình thường có xu hướng đắm chìm để tìm cách bóc tách vấn đề một cách triệt để nhất. Tự đặt ra "Một vạn câu hỏi vì sao":
* Bản chất thực sự của vấn đề này là gì?
* Tại sao lỗi này lại lặp đi lặp lại nhiều lần?
* Bước nào trong quy trình đang là nút thắt cổ chai gây lãng phí thời gian nhất?

Nói một cách hoa mỹ thì đó là tinh thần tối ưu hóa, nhưng nói một cách trần trụi và hài hước hơn: **Thực ra anh ta là một người lười.**

Cái "lười" ở đây là cái lười rất đặc trưng của dân công nghệ:
* Lười phải làm đi làm lại một việc chân tay vô nghĩa mà máy tính hoặc hệ thống có thể tự động làm được.
* Lười phải đi dập những đám cháy vụn vặt phát sinh mỗi ngày chỉ vì sự thiếu rõ ràng ngay từ đầu.

Chính vì lười làm việc luộm thuộm, nên mình sẵn sàng bỏ ra nhiều công sức lúc ban đầu để đào sâu, nghiên cứu bản chất và thiết lập một cấu trúc rõ ràng, mạch lạc một lần — để sau đó bản thân và mọi người xung quanh đều được làm việc một cách nhẹ nhàng và hiệu quả hơn.

---

## Lời kết

Những dòng này mình ghi lại đơn giản như một "bản chụp nhanh" (snapshot) góc nhìn của bản thân ở tuổi 26, để sau này vài năm nữa khi nhìn lại, mình có thể tự mỉm cười xem nhận thức của mình lúc đó đã đi đến đâu.

Mỗi doanh nghiệp, mỗi mô hình đều có cái hay và cái dở riêng. Điều quan trọng nhất không phải là đổ lỗi cho hoàn cảnh, mà là học được cách trân trọng những trải nghiệm dù là cực nhọc nhất để biến chúng thành hành trang cho chính mình.

Các cô chú, anh chị và các bạn có thể trao đổi góc nhìn nhẹ nhàng cùng mình bên dưới phần bình luận nhé! Đừng la mình nha, mình... block á! 😆

---
Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!`;

  // 1. Upsert Post
  const upserted = await prisma.post.upsert({
    where: { slug },
    update: {
      title: 'Doanh nghiệp cũ thiếu hệ thống, doanh nghiệp mới thiếu trải nghiệm: Góc nhìn của một người mê tối ưu',
      description: 'Nghịch lý quen thuộc chốn công sở: Doanh nghiệp cũ ôm trọn kho báu kinh nghiệm nhưng thiếu hệ thống đồng bộ; doanh nghiệp mới hăng say dựng quy trình nhưng thiếu trải nghiệm cọ xát thực tế. Góc nhìn mộc mạc của một người mê tối ưu hiệu suất công việc.',
      content,
      coverImage: '/images/doanh-nghiep-cu-thieu-he-thong-doanh-nghiep-moi-thieu-trai-nghiem.webp',
      categoryId: catCareer.id,
      published: true,
      date: postDate,
      readTime: 6,
      likes: 43
    },
    create: {
      title: 'Doanh nghiệp cũ thiếu hệ thống, doanh nghiệp mới thiếu trải nghiệm: Góc nhìn của một người mê tối ưu',
      slug,
      description: 'Nghịch lý quen thuộc chốn công sở: Doanh nghiệp cũ ôm trọn kho báu kinh nghiệm nhưng thiếu hệ thống đồng bộ; doanh nghiệp mới hăng say dựng quy trình nhưng thiếu trải nghiệm cọ xát thực tế. Góc nhìn mộc mạc của một người mê tối ưu hiệu suất công việc.',
      content,
      coverImage: '/images/doanh-nghiep-cu-thieu-he-thong-doanh-nghiep-moi-thieu-trai-nghiem.webp',
      categoryId: catCareer.id,
      published: true,
      date: postDate,
      readTime: 6,
      likes: 43
    }
  });

  console.log(`✓ Post upserted: "${upserted.title}" (ID: ${upserted.id})`);

  // 2. Clear old comments for idempotency
  await prisma.comment.deleteMany({
    where: { postId: upserted.id }
  });

  // 3. Seed realistic comments
  const seededComments = [
    {
      authorName: 'Nguyễn Minh Tuấn',
      authorEmail: 'tuannguyen.ops@gmail.com',
      content: 'Đọc đoạn "doanh nghiệp mới vẽ quy trình trên giấy nhưng thiếu trải nghiệm thực tế" mà giật mình Harry ạ! Đội ngũ mình từng mất 3 tháng set up Notion với Jira cực kỳ phức tạp, cuối cùng nhân viên than phiền vì tốn quá nhiều thời gian chỉ để log task. Harry có lời khuyên nào về việc xác định thời điểm thích hợp để bắt đầu chuẩn hóa hệ thống không?',
      adminReply: 'Chào anh Tuấn, em rất đồng cảm với trải nghiệm của anh! Theo góc nhìn của em, nguyên tắc vàng là "Do it manually first, automate later" (Làm thủ công trước, tối ưu sau). Khi một quy trình lặp đi lặp lại đủ nhiều và nhóm đã thấu hiểu mọi ngóc ngách bất cập, lúc đó hẵng đưa vào hệ thống và phần mềm. Hệ thống sinh ra để phục vụ con người giải phóng sức lao động, chứ không phải để con người đi phục vụ ngược lại hệ thống anh ạ.'
    },
    {
      authorName: 'Trần Thu Hà',
      authorEmail: 'thuha.hr@outlook.com',
      content: 'Đúng là phận đi làm ở đâu cũng có cái cực riêng haha! Mình từng làm cho cả công ty gia đình 15 năm và startup 2 năm. Ở công ty cũ thì sợ nhất là mọi thứ "nằm trong đầu sếp", sếp đi vắng là cả phòng đứng hình. Bài viết phân tích rất dí dỏm mà đúng trọng tâm!',
      adminReply: 'Dạ cảm ơn chị Hà đã đồng cảm! Cái cảnh "sếp đi vắng là cả phòng đứng hình" chính là cái giá của việc để kho báu tri thức phụ thuộc vào cá nhân thay vì đóng gói thành tài sản của tổ chức. Cứ mỗi lần đổi môi trường lại cho mình thêm một bài học quý giá chị ha.'
    }
  ];

  for (const c of seededComments) {
    await prisma.comment.create({
      data: {
        postId: upserted.id,
        authorName: c.authorName,
        authorEmail: c.authorEmail,
        content: c.content,
        approved: true,
        adminReply: c.adminReply,
        createdAt: new Date(postDate.getTime() + Math.floor(Math.random() * 14400000) + 3600000)
      }
    });
    console.log(`  + Seeded comment from "${c.authorName}"`);
  }

  console.log('--- ALL DONE SUCCESSFULLY ---');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
