const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- PREPARING BIRTHDAY POST FOR HARRY (AGE 26) ---');

  // 1. Download YouTube maxresdefault thumbnail and convert to 1200x675 WebP
  const coverUrl = 'https://i.ytimg.com/vi/EeXlTkWOB_E/maxresdefault.jpg';
  const outCoverPath = path.join(__dirname, '..', 'public', 'images', 'sinh-nhat-tuoi-26-cang-lon-cang-muon-don-gian-ben-gia-dinh-cover.webp');

  try {
    const res = await fetch(coverUrl);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await sharp(buffer)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(outCoverPath);
    console.log('✓ Created cover image:', outCoverPath);
  } catch (err) {
    console.error('Error downloading thumbnail, falling back to hqdefault:', err);
    const fallbackRes = await fetch('https://i.ytimg.com/vi/EeXlTkWOB_E/hqdefault.jpg');
    const arrayBuffer = await fallbackRes.arrayBuffer();
    await sharp(Buffer.from(arrayBuffer))
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(outCoverPath);
    console.log('✓ Created fallback cover image:', outCoverPath);
  }

  // 2. Fetch category ID for "tuoi-tre-thanh-xuan"
  const cat = await prisma.category.findUnique({
    where: {
      slug_type: {
        slug: 'tuoi-tre-thanh-xuan',
        type: 'post'
      }
    }
  });

  if (!cat) {
    throw new Error('Category tuoi-tre-thanh-xuan not found');
  }

  // 3. Post data
  const postData = {
    title: "Sinh nhật tuổi 26: Càng lớn, càng muốn đơn giản bên gia đình",
    slug: "sinh-nhat-tuoi-26-cang-lon-cang-muon-don-gian-ben-gia-dinh",
    description: "Bước sang tuổi 26, không còn háo hức với những bữa tiệc ồn ào. Một bữa cơm đạm bạc bên ba mẹ, nhìn gia đình bình an mạnh khỏe là đủ đầy. Mong bản thân vững bước chân và học - hành được hai chữ Kiên Trì.",
    coverImage: "/images/sinh-nhat-tuoi-26-cang-lon-cang-muon-don-gian-ben-gia-dinh-cover.webp",
    readTime: 4,
    published: true,
    date: new Date("2026-09-14T04:00:00.000Z"),
    categoryId: cat.id,
    views: 112,
    likes: 54,
    shares: 19,
    content: `Ngày trước, ở cái tuổi đôi mươi, mỗi lần đến dịp sinh nhật là trong đầu mình lại háo hức nghĩ đến những buổi tiệc tùng đông đúc, rôm rả ngoài quán xá cùng bạn bè. Thích cái không khí náo nhiệt, thích nhận được thật nhiều lời chúc rộn ràng, và đôi khi là thích cả cái cảm giác chứng tỏ bản thân đang có thật nhiều mối quan hệ xã hội.

Nhưng rồi đi qua vài năm bươn chải giữa phố thị Sài Gòn, nếm đủ những chênh vênh của những ngày làm việc từ sáng sớm tới đêm muộn, rồi quyết định [rời văn phòng về quê](/chia-se/nghi-viec-van-phong-tuoi-26-tu-bat-an-den-lam-chu) để bắt đầu hành trình tự làm chủ... bước sang tuổi 26, định nghĩa về "một ngày sinh nhật trọn vẹn" trong mình tự nhiên thay đổi hẳn.

---

### Càng lớn, càng thèm sự giản đơn bên mâm cơm nhà

Không còn cần tiệc tùng ồn ào đèn hoa rực rỡ.  
Không cần những món quà cầu kỳ đắt đỏ.  

Ở tuổi 26, niềm vui sinh nhật của Harry đơn giản chỉ là được ngồi ăn một bữa cơm đạm bạc bên ba mẹ và những người thân yêu trong gia đình ở quê. Nghe ba kể vài câu chuyện đời thường quanh xóm làng, nhìn mẹ tất bật xới từng chén cơm nóng hổi, cùng nhau cười đùa bên mâm cơm... vậy thôi là đã thấy lòng mình ấm cúng và bình yên lạ kỳ.

Những điều giản dị ấy, lúc trẻ người ta thường vô tình lướt qua để mải miết chạy theo những ánh hào quang lấp lánh bên ngoài. Chỉ đến khi tự mình bước ra đời va vấp, mới thấm thía rằng: **Gia đình chính là chốn neo đậu bình yên và vững chãi nhất của cuộc đời.**

---

### Thước phim kỷ niệm tuổi 26

Dưới đây là một thước phim ngắn lưu lại khoảnh khắc bình yên và ấm áp trong ngày sinh nhật tuổi 26, Harry muốn chia sẻ một chút niềm vui nhỏ này cùng tất cả mọi người:

[Xem thước phim Sinh nhật tuổi 26 của Quang Hiếu (Harry) trên YouTube](https://youtu.be/EeXlTkWOB_E)

---

### Những tâm nguyện tuổi 26: Gia đình và hai chữ "Kiên Trì"

Bước sang tuổi 26, những ước mơ to tát ngày nào dần được mình thu bé lại vào những giá trị cốt lõi và thực tế nhất:

1. **Mong gia đình luôn bình an, mạnh khỏe:** Đây là điều ước lớn nhất và thiêng liêng nhất của Harry. Dù ngoài kia công việc có áp lực, thương trường có biến động hay [những ngày mất trớn](/chia-se/ngay-mat-tron-solopreneur) có làm mình mỏi mệt, chỉ cần biết ba mẹ và người thân vẫn mạnh khỏe, bình an sau lưng thì bao nhọc nhằn đều tan biến.
2. **Mong bản thân vững bước chân trên chặng đường sắp tới:** Con đường của một Solopreneur, của việc phát triển [Thảo Mộc Hương](/san-pham) kết hợp cùng công nghệ và các công cụ miễn phí tử tế chắc chắn còn rất dài và nhiều thử thách. Mình mong đôi chân mình luôn vững, cái đầu luôn tỉnh táo và trái tim luôn ấm nóng.
3. **Học và hành được trọn vẹn 2 chữ: KIÊN TRÌ:**  
   - Kiên trì với con đường đã chọn dù có lúc cô đơn.  
   - Kiên trì tích lũy từng giá trị thực, làm từng việc nhỏ một cách chỉn chu nhất.  
   - Kiên trì tử tế với mọi người và kiên nhẫn với chính bản thân mình trên hành trình hoàn thiện mỗi ngày.

---

### Lời cảm ơn từ tận đáy lòng

Một ngày sinh nhật thật ấm lòng và trọn vẹn.

Từ tận đáy lòng, Harry xin gửi lời cảm ơn chân thành và sâu sắc nhất đến tất cả những lời chúc tốt đẹp, những tin nhắn, cuộc gọi và tình cảm thương yêu mà gia đình, bạn bè, anh em đồng nghiệp và những người bạn theo dõi hành trình của Harry đã dành cho mình hôm nay. 

Đó là món quà tinh thần vô giá để Harry tiếp tục vững tin bước tiếp. Cảm ơn mọi người vì đã luôn là một phần tốt lành trên chặng đường trưởng thành của Harry!

---

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ, hoặc kết nối với mình nhé!*`
  };

  const res = await prisma.post.upsert({
    where: { slug: postData.slug },
    update: postData,
    create: postData
  });

  console.log(`✓ Post published successfully on HarryShare website: "${res.title}" (${res.slug})`);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
