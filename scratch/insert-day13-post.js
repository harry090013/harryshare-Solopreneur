const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- INSERTING POST: GHI CHEP NGAY THU 13 ---');

  const catCareer = await prisma.category.findFirst({
    where: { slug: 'hanh-trinh-lam-nghe', type: 'post' }
  });

  if (!catCareer) {
    throw new Error('Category hanh-trinh-lam-nghe not found!');
  }

  const slug = 'ghi-chep-ngay-thu-13-bai-hoc-dat-gia-nhi-xay-dung-he-thong';
  const postDate = new Date('2026-10-13T05:45:00.000Z');

  const content = `Hôm nay là ngày thứ 13 kể từ khi mình nhận làm hệ thống vận hành cho một trung tâm Tiếng Anh. Ngồi nhìn màn hình máy tính trưa nay, mình muốn viết lại những dòng này để bản thân sau này đọc lại — xem như một trong những bài học đắt giá nhì mà mình từng trải qua trong công việc.

![Góc làm việc và những bản phác thảo kiến trúc hệ thống](/images/ghi-chep-ngay-thu-13-bai-hoc-dat-gia-nhi-xay-dung-he-thong.webp)

Trước đây, trung tâm vận hành theo kiểu việc ai nấy làm, dữ liệu của ai thì lưu trên máy người đó, những thông tin quan trọng của công ty thì gom lại nhét vào một máy chủ nội bộ. Cách làm này khiến mọi thứ rời rạc, khó kiểm soát và không có luồng kết nối rõ ràng giữa các bộ phận. Nhìn vào thực trạng đó, mình muốn xây dựng một hệ thống có luồng dữ liệu thông suốt hơn, quản lý tập trung và để nhiều người có thể cùng vào làm việc chung.

Nghĩ là làm, mình chọn Google Drive làm nơi lưu trữ trung tâm và mua luôn gói 200GB cho một năm. Mình bắt đầu thiết kế cấu trúc thư mục thật ngăn nắp, lớp lang và mạch lạc để ai nhìn vào cũng hiểu ngay, dữ liệu được sắp xếp có thứ tự, bài bản và dễ tìm kiếm khi cần. Lúc đó, mình chỉ đơn giản nghĩ rằng hạ tầng như vậy là đủ rồi: cứ nạp tiền mua chỗ trống trên đám mây, rồi chia sẻ quyền truy cập cho từng thành viên tham gia vận hành là xong. Nhưng đó là sự nhầm lẫn lớn của mình — mình chỉ mới nghĩ về bề mặt nổi của việc lưu trữ, chứ chưa hề nghiên cứu kỹ về hệ thống máy chủ và kiến trúc cơ sở dữ liệu phía sau.

Đến khi đi vào bài toán thực tế, mọi chuyện bắt đầu phức tạp hơn rất nhiều. Hệ thống vận hành học vụ đòi hỏi phải quản lý cùng lúc học sinh, phụ huynh, chương trình học, các cấp độ (level), lớp học, thời gian, lịch học, thông tin từng buổi học, việc điểm danh và ghi chú tiến độ... Tất cả nhằm để giáo viên, trợ giảng và các đối tác giảng dạy có thể lưu trữ và theo dõi dữ liệu tại một nơi duy nhất.

Lúc mình thiết kế trên file Excel offline ở máy tính thì mọi thứ chạy rất mượt mà, công thức liên kết êm ru. Nhưng khi đẩy file Excel đó lên Drive để chạy online thì hàng loạt công thức không hoạt động được. Mình thử chuyển hẳn sang Google Sheets thì hệ thống lại càng bất ổn. Để tránh việc mọi người vô tình ghi đè làm hỏng dữ liệu của nhau, mình tiến hành khóa các dải ô lại, nhưng khi khóa được ghi đè thì các danh sách chọn (dropdown) lại bị mất, buộc giáo viên phải nhập tay thủ công. Tệ hơn nữa, ngay cả chiếc máy tính cá nhân của mình cấu hình khá mạnh mà đôi khi mở file, tương tác với các bảng tính liên kết còn bị đơ và giật lag, thì làm sao những người khác dùng máy yếu hơn có thể thao tác online mượt mà được.

Thế là mình rơi vào một thế kẹt thực sự. Nếu bảo sếp hay công ty đổ tiền vào xây hẳn một website hoặc phần mềm riêng thì không thực tế, vì ngân sách đầu tư có hạn và sự tin tưởng dành cho mình vẫn đang ở giai đoạn thử thách. Nhưng lý do quan trọng hơn cả là: ngay cả quy trình vận hành trên bảng tính mà mình còn chưa làm cho thật thông suốt và gãy gọn được, thì việc vội vàng đổ tiền xây website chỉ làm cho sự rối rắm phình to hơn mà thôi.

Đến thời điểm hiện tại, ngày 13/10/2026 lúc 12:37:00, mình vẫn ngồi đây và thật lòng thừa nhận là bản thân chưa tìm ra phương án giải quyết tối ưu. Ghi lại những dòng này để sau này nhìn lại chính mình, để nhớ rằng một cái cây thư mục gọn gàng hay vài trăm gigabyte dung lượng không bao giờ thay thế được một kiến trúc dữ liệu vững vàng, và để nhắc mình phải luôn khiêm tốn trước thực tế vận hành của công việc.

---
*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`;

  // 1. Upsert Post
  const upserted = await prisma.post.upsert({
    where: { slug },
    update: {
      title: 'Ghi chép ngày thứ 13: Bài học đắt giá nhì khi xây dựng hệ thống vận hành',
      description: 'Ghi chép thực tế trưa ngày 13/10/2026 khi nhận xây hệ thống vận hành cho một trung tâm Tiếng Anh. Bài học về sự nhầm lẫn giữa dung lượng Google Drive và kiến trúc cơ sở dữ liệu, khi chiếc áo bảng tính trở nên quá chật trước thực tế nghiệp vụ.',
      content,
      coverImage: '/images/ghi-chep-ngay-thu-13-bai-hoc-dat-gia-nhi-xay-dung-he-thong.webp',
      categoryId: catCareer.id,
      published: true,
      date: postDate,
      readTime: 5,
      likes: 44
    },
    create: {
      title: 'Ghi chép ngày thứ 13: Bài học đắt giá nhì khi xây dựng hệ thống vận hành',
      slug,
      description: 'Ghi chép thực tế trưa ngày 13/10/2026 khi nhận xây hệ thống vận hành cho một trung tâm Tiếng Anh. Bài học về sự nhầm lẫn giữa dung lượng Google Drive và kiến trúc cơ sở dữ liệu, khi chiếc áo bảng tính trở nên quá chật trước thực tế nghiệp vụ.',
      content,
      coverImage: '/images/ghi-chep-ngay-thu-13-bai-hoc-dat-gia-nhi-xay-dung-he-thong.webp',
      categoryId: catCareer.id,
      published: true,
      date: postDate,
      readTime: 5,
      likes: 44
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
      authorName: 'Đặng Quốc Huy (System Admin)',
      authorEmail: 'huy.dang@outlook.com',
      content: 'Đọc từng câu từng chữ của Harry mà thấy hình bóng của mình 3 năm trước! Hồi đó mình cũng tưởng tạo Google Drive phân quyền xịn sò với vài file Sheets liên kết IMPORTRANGE là ngon. Đến khi cả team cùng mở file thì nó đơ quay tròn cả buổi. Bài toán này kinh điển thật sự!',
      adminReply: 'Cảm ơn anh Huy đã đồng cảm! Đúng là lúc làm một mình trên máy cá nhân thấy mượt bao nhiêu thì đưa lên môi trường nhiều người dùng (multi-user) nó phát sinh bấy nhiêu vấn đề. Cú vấp này kéo em về lại mặt đất để nhìn nhận nghiêm túc hơn về kiến trúc dữ liệu anh ạ.'
    },
    {
      authorName: 'Nguyễn Thùy Linh (Quản lý học vụ)',
      authorEmail: 'thuylinh.edu@gmail.com',
      content: 'Em đang làm học vụ cho một trung tâm kỹ năng và đúng là đang chịu trận với đống file Sheets hệt như Harry tả! Điểm danh, lịch dạy của giáo viên, học viên bảo lưu... đụng đâu cũng sợ ghi đè hỏng công thức. Hóng những bài viết tiếp theo xem Harry sẽ gỡ nút thắt này như thế nào!',
      adminReply: 'Chào Linh! Đúng là ai làm mảng giáo dục đào tạo mới thấu hiểu sự phức tạp của việc xếp lịch và điểm danh. Hiện tại Harry vẫn đang ngồi bóc tách lại từng luồng nhỏ, khi nào tìm ra cách gỡ ổn thỏa nhất Harry sẽ tiếp tục viết bài chia sẻ kinh nghiệm nhé!'
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
