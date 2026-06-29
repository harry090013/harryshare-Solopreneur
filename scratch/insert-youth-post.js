const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // 1. Create or upsert Category "Tuổi trẻ & Thanh Xuân"
    const category = await prisma.category.upsert({
      where: { 
        slug_type: {
          slug: 'tuoi-tre-thanh-xuan',
          type: 'post'
        }
      },
      update: {
        name: 'Tuổi trẻ & Thanh Xuân',
        description: 'Ghi lại những khoảnh khắc nhiệt huyết, những hoạt động đoàn đội và kỷ niệm thanh xuân đáng nhớ của Harry.',
        type: 'post',
        icon: 'Flame'
      },
      create: {
        name: 'Tuổi trẻ & Thanh Xuân',
        slug: 'tuoi-tre-thanh-xuan',
        description: 'Ghi lại những khoảnh khắc nhiệt huyết, những hoạt động đoàn đội và kỷ niệm thanh xuân đáng nhớ của Harry.',
        type: 'post',
        icon: 'Flame'
      }
    });

    console.log(`Category created/updated: ${category.name} (ID: ${category.id})`);

    // 2. Create the post
    const postData = {
      title: "Thanh xuân của mình không chỉ là những ngày tháng trôi qua...",
      slug: "thanh-xuan-cua-harry-khong-chi-la-ngay-thang-troi-qua",
      description: "Thanh xuân của Harry, may mắn thay, không chỉ là những ngày tháng trôi qua… mà là những khoảnh khắc được sống hết mình cùng tuổi trẻ.",
      content: `Thanh xuân của mình, may mắn thay, không chỉ là những ngày tháng lặng lẽ trôi qua… mà là chuỗi những khoảnh khắc được sống hết mình, được cháy trọn vẹn cùng nhiệt huyết của tuổi trẻ. 💙

Có những lúc mình cầm chiếc máy ảnh trên tay, lùi lại phía sau để lưu giữ từng nụ cười, từng ánh mắt ngập tràn niềm vui của mọi người. 

Có những lúc mình cầm chiếc còi chỉ huy, đứng giữa sân để kết nối tinh thần đồng đội, truyền đi ngọn lửa của sự gắn kết. 

Lại có những lúc mình cầm chiếc micro để dẫn dắt, để khuấy động không khí, để cùng tất cả mọi người tạo nên những phút giây thật sự đáng nhớ trong cuộc đời.

Mình luôn cảm thấy biết ơn sâu sắc vì bản thân được tin tưởng, được mọi người trao quyền và được đứng ở nơi có thể bung tỏa hết nguồn năng lượng nhiệt huyết của mình. 

![Harry đồng hành cùng hoạt động đoàn đội](/harrydoanvien2.jpg)

Đêm hôm qua, khi nhìn vòng tròn của hơn 100 bạn thanh niên cùng nắm tay nhau, cùng hát ca và cháy hết mình bên ánh lửa trại bập bùng, mình đã thực sự cảm nhận được một điều thiêng liêng: **Tuổi trẻ đẹp nhất khi chúng ta không sống một mình, mà sống cùng nhau, vì nhau và vì những điều ý nghĩa.**

![Đêm lửa trại rực rỡ và những khoảnh khắc kết nối](/harrydoanvien3.jpg)

Chương trình đêm qua không chỉ đơn thuần là một hoạt động thành công. 

Đối với mình, đó là một trang ký ức vô giá, một phần thanh xuân rực rỡ mà mỗi khi nhớ lại, mình sẽ luôn cảm thấy vô cùng tự hào.

Cảm ơn tất cả mọi người vì đã cùng nhau tạo nên một đêm thật đẹp và trọn vẹn. 

*I love you guys, I love these moments. Thank you so much.* 🔥💙

*Nếu bạn tìm thấy một chút thanh xuân của mình trong câu chuyện này, hãy chia sẻ cùng mình ở phần bình luận nhé!*`,
      coverImage: "/harrydoanvien1.jpg",
      readTime: 3,
      published: true,
      date: new Date("2026-06-29T07:00:00+07:00"),
      categoryId: category.id
    };

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData
    });

    console.log(`Post created/updated: ${post.title}`);
  } catch (err) {
    console.error('Error inserting post:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
