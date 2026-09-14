const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- UPDATING BIRTHDAY POST TO VERSION 1 CONTENT ---');

  const slug = 'sinh-nhat-tuoi-26-cang-lon-cang-muon-don-gian-ben-gia-dinh';

  const content = `Ngày trước, ở cái tuổi đôi mươi, mỗi lần đến sinh nhật là trong đầu mình lại háo hức nghĩ đến những buổi tiệc tùng đông đúc, rôm rả ngoài quán xá cùng bạn bè. Thích cái không khí náo nhiệt, thích những lời chúc rộn ràng, và đôi khi là thích cả cái cảm giác chứng tỏ bản thân đang có thật nhiều mối quan hệ.

Nhưng rồi đi qua vài năm bươn chải giữa phố thị, nếm đủ những chênh vênh của những ngày làm việc từ sáng sớm tới đêm muộn, tự mình bước ra làm tự do với bao nỗi lo toan... bước sang tuổi 26, định nghĩa về "một ngày sinh nhật trọn vẹn" trong mình tự nhiên thay đổi hẳn.

Không còn cần tiệc tùng ồn ào.  
Không cần hoa quà cầu kỳ.  
Chỉ cần được ngồi ăn một bữa cơm đạm bạc bên ba mẹ, người thân trong gia đình, nghe vài câu chuyện đời thường giản dị, nhìn thấy nụ cười của những người mình thương yêu nhất... vậy là thấy lòng mình ấm cúng và bình yên lắm rồi.

Một thước phim nhỏ lưu lại khoảnh khắc bình yên của tuổi 26, mình muốn chia sẻ cùng mọi người:

[Xem thước phim Sinh nhật tuổi 26 của Quang Hiếu (Harry) trên YouTube](https://youtu.be/EeXlTkWOB_E)

Bước sang một tuổi mới, mình nhận ra ước mơ của bản thân cũng dần thu bé lại vào những giá trị cốt lõi nhất:

🌿 **Điều ước đầu tiên và lớn nhất:** Mong cho gia đình, ba mẹ luôn luôn bình an và mạnh khỏe. Dù ngoài kia bão táp hay công việc có áp lực thế nào, chỉ cần biết sau lưng mình gia đình vẫn bình an, khỏe mạnh thì bao mệt nhọc đều tan biến.

🌿 **Điều ước cho bản thân:** Mong đôi chân mình luôn vững vàng trên những chặng đường sắp tới. Hành trình của một Solopreneur, của những dự án công nghệ và sản phẩm sạch quê mình chắc chắn còn rất dài và nhiều thử thách.

Và quan trọng nhất, mong bản thân sẽ luôn học và THỰC HÀNH được trọn vẹn hai chữ: **KIÊN TRÌ**.  
Kiên trì đi con đường đã chọn, kiên trì tích lũy từng giá trị thực, và kiên trì tử tế với cuộc đời ngay cả trong những ngày khó khăn nhất.

Một ngày sinh nhật thật ấm lòng.  
Từ tận đáy lòng, Harry xin gửi lời cảm ơn chân thành và sâu sắc nhất đến tất cả những lời chúc tốt đẹp, những tin nhắn, cuộc gọi và tình cảm thương yêu mà mọi người đã dành cho mình hôm nay. Đó là nguồn động lực vô giá để mình tiếp tục vững tin trên hành trình phía trước.

Cảm ơn vì đã luôn là một phần trên chặng đường trưởng thành của Harry! ❤️

---

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`;

  const updated = await prisma.post.update({
    where: { slug },
    data: {
      title: "Sinh nhật tuổi 26: Càng lớn, càng thèm những điều giản đơn bên gia đình",
      description: "Ở tuổi 26, không còn cần tiệc tùng ồn ào hay quà cáp cầu kỳ. Chỉ cần một bữa cơm đạm bạc bên ba mẹ, nhìn gia đình bình an mạnh khỏe là đủ đầy và ấm cúng rồi.",
      content,
      readTime: 4,
      published: true
    }
  });

  console.log('✓ Successfully updated post to Version 1:', updated.title);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
