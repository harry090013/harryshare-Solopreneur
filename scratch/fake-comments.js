const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AUTHORS = [
  { name: "Minh Triết", email: "triet.minh@outlook.com" },
  { name: "Thanh Hằng", email: "hangthanh.le@gmail.com" },
  { name: "Quốc Khánh", email: "khanh.nqb@gmail.com" },
  { name: "Hoài An", email: "an.hoai@techasia.io" },
  { name: "Duy Bách", email: "bach.duy.dev@gmail.com" },
  { name: "Bích Phương", email: "phuongbich96@yahoo.com" },
  { name: "Trung Kiên", email: "kien.trung.mkt@gmail.com" },
  { name: "Minh Khuê", email: "khueminhtran@outlook.com" },
  { name: "Hoàng Nam", email: "namhoang.nguyen@gmail.com" },
  { name: "Thu Trang", email: "trangthu.content@gmail.com" },
  { name: "Anh Đức", email: "duc.anh.le@hust.edu.vn" },
  { name: "Phương Vy", email: "vy.phuong@uxdesign.vn" }
];

const COMMENTS_BY_CATEGORY = {
  'tuoi-tre-thanh-xuan': [
    "Đọc bài viết cảm xúc quá anh ơi. Nhìn đốm lửa trại bùng lên mà ký ức thời sinh viên lại ùa về.",
    "Bên đoàn đội nhiệt huyết thật sự, hồi đi học em cũng cầm còi dẫn dắt vòng tròn kiểu này, mệt rã rời nhưng vui.",
    "Hình chụp đẹp quá anh Harry. Tuổi trẻ may mắn nhất là tìm được những người đồng đội cùng tần số.",
    "Thật sự trân trọng những khoảnh khắc được cống hiến hết mình như thế này. Thanh xuân rực rỡ!",
    "Đúng là tuổi trẻ đẹp nhất khi sống vì nhau. Cảm ơn anh vì bài viết truyền năng lượng tích cực này.",
    "Em cũng có mặt trong đêm hôm đó! Thật sự không khí bùng nổ và rất ý nghĩa anh ạ.",
    "Nhìn những tấm ảnh này lại muốn xách balo đi cắm trại ngay lập tức. Đêm lửa trại quá trọn vẹn.",
    "Cảm ơn người dẫn đường tuyệt vời đã tiếp lửa cho cả nhóm. I love this night!",
    "Lâu lắm rồi mới thấy một bài viết viết về thanh xuân mộc mạc và nhiều xúc cảm đến vậy.",
    "Kỷ niệm đẹp sẽ đi cùng chúng ta rất lâu. Mong anh Harry luôn giữ được ngọn lửa này nhé!"
  ],
  'cong-nghe-ai': [
    "Bài viết chia sẻ rất đúng xu hướng. Giờ AI không chỉ trả lời mà đang trực tiếp thay đổi cách dev vận hành dự án.",
    "Mình cũng đang setup thử Ollama chạy Llama 3 cục bộ. Rất an tâm về khoản bảo mật dữ liệu nội bộ.",
    "Đúng vậy, từ chat sang ủy thác (Agentic) là bước nhảy vọt. Tiết kiệm được cực nhiều thời gian boilerplate.",
    "Bạn viết bài này thực tế lắm. Đọc tài liệu Next.js trong node_modules đúng là một mẹo nhỏ nhưng rất có võ.",
    "Mô hình cục bộ hiện tại chạy trên card đồ họa laptop khá mượt, không còn giật lag như hồi xưa nữa.",
    "Liệu trong tương lai AI Agent có tự tối ưu hóa database luôn không ta? Thấy khả năng đọc hiểu schema của nó rất bá đạo.",
    "Đồng ý với quan điểm của tác giả. AI chỉ là trợ lý đắc lực, tư duy điều phối của dev vẫn là chốt chặn cuối cùng.",
    "Offline AI cứu cánh những hôm cáp quang biển đứt. Trải nghiệm rất tự chủ và đáng giá.",
    "Mình đã tích hợp AI Agent vào luồng CI/CD, hiệu suất tăng rõ rệt luôn.",
    "Cảm ơn chia sẻ thực tế của Harry. Rất mong chờ bài viết tiếp theo về chủ đề Local AI."
  ],
  'thuong-hieu-ca-nhan': [
    "Đồng ý hoàn toàn! Giờ lên LinkedIn hay Facebook đọc bài viết nào mượt mà quá là mình lướt qua luôn, ngửi mùi AI rất rõ.",
    "Sự không hoàn hảo mới là nét cá tính riêng của con người. Viết thật, chia sẻ thật vẫn luôn có giá trị bền vững.",
    "Hồi đầu mình cũng hay bị bẫy viết bài chuẩn SEO cho robot đọc. Giờ đổi sang viết dạng nhật ký thấy tương tác tốt hẳn.",
    "Bài viết gãi đúng chỗ ngứa của thị trường content hiện tại. Đọc rất thấm bạn ạ.",
    "Xây brand từ sự thật là con đường chậm nhất nhưng chắc chắn nhất. Cảm ơn chia sẻ của Harry.",
    "Mình kết nối với Harry vì sự mộc mạc và chân thực này. Đừng đổi style nhé!",
    "AI viết nhanh nhưng không viết được trải nghiệm đau đớn hay bài học thất bại xương máu của con người.",
    "Nhờ bài viết này mà mình có thêm động lực để bắt đầu viết lại blog cá nhân. Cảm ơn tác giả.",
    "Những câu chữ có chút gồ ghề nhưng lại mang hơi thở cuộc sống thật. Rất trân trọng bài viết.",
    "Xây thương hiệu cá nhân không phải là làm màu, nó là việc ghi nhận lại sự trưởng thành mỗi ngày."
  ],
  'tu-duy-san-pham': [
    "Product Thinking là thứ phân biệt một dev giỏi với một cái máy gõ code. Phải hiểu vấn đề trước khi build.",
    "Câu chuyện làm nhang sạch của gia đình Harry ý nghĩa quá. Ủng hộ bạn làm một sản phẩm tử tế, minh bạch từ đầu.",
    "Tư duy MVP (phiên bản nhỏ nhất có giá trị) luôn đúng. Đừng cố vẽ tính năng khi chưa biết khách hàng có cần hay không.",
    "Khách hàng mua giải pháp cho nỗi đau của họ, chứ không mua công nghệ cao siêu. Rất đồng ý!",
    "Quy trình kiểm chứng sản phẩm sạch của bạn thực tế và an toàn. Làm nhỏ nhưng chắc chắn.",
    "Khi nào ra mắt nhang thảo mộc nhớ thông báo trên blog nha Harry, mình muốn làm khách hàng đầu tiên.",
    "Framework 3 câu hỏi trước khi quyết định build tính năng mới của bạn rất hữu ích, mình sẽ áp dụng thử.",
    "Đồng ý với tư tưởng 'sản phẩm mình bán cũng là sản phẩm mình dùng'. Đạo đức kinh doanh nằm ở đó.",
    "Làm sản phẩm độc lập (Solopreneur) cực nhất là khâu tự phản biện bản thân. Bài viết chia sẻ rất trúng.",
    "Tư duy làm sản phẩm tử tế giữa thời đại số là hướng đi bền bỉ."
  ],
  'default': [
    "Bài viết chia sẻ góc nhìn rất tích cực. Cảm ơn tác giả.",
    "Đọc bài viết của bạn giúp mình bình tĩnh lại một chút giữa nhịp sống hối hả này.",
    "Mỗi câu chuyện nhỏ đều mang lại bài học ý nghĩa. Chúc blog HarryShare ngày càng phát triển.",
    "Hành trình chia sẻ rất chân thực. Mình rất đồng cảm với những gì bạn đã trải qua.",
    "Cách viết gần gũi, văn phong mộc mạc dễ đi vào lòng người.",
    "Overthinking đôi khi cũng là một món quà nếu chúng ta biết cách chuyển hóa nó thành hành động.",
    "Cảm ơn Harry vì ngọn lửa tích cực này nhé!",
    "Bài viết rất chất lượng. Mình sẽ lưu lại để đọc lại khi cần.",
    "Một góc nhìn rất đáng suy ngẫm trong thời đại số.",
    "Kỷ niệm và trải nghiệm là tài sản lớn nhất của mỗi người."
  ]
};

async function run() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true
      }
    });

    console.log(`Found ${posts.length} posts to add comments.`);

    let commentsAdded = 0;

    for (const post of posts) {
      // Determine comments pool based on category slug
      const categorySlug = post.category?.slug || 'default';
      const commentPool = COMMENTS_BY_CATEGORY[categorySlug] || COMMENTS_BY_CATEGORY['default'];

      // Shuffle comments pool
      const shuffledComments = [...commentPool].sort(() => 0.5 - Math.random());
      
      // Determine number of comments (between 3 and 7 to keep it extremely realistic and distributed)
      const commentsCount = Math.floor(Math.random() * (7 - 3 + 1)) + 3;

      for (let i = 0; i < commentsCount; i++) {
        const commentText = shuffledComments[i % shuffledComments.length];
        
        // Pick a random author
        const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];

        // Generate a random date between post creation date and now
        const postDate = new Date(post.date).getTime();
        const now = new Date().getTime();
        const commentDate = new Date(postDate + Math.random() * (now - postDate));

        await prisma.comment.create({
          data: {
            postId: post.id,
            authorName: author.name,
            authorEmail: author.email,
            content: commentText,
            approved: true, // Approve immediately
            createdAt: commentDate
          }
        });
        commentsAdded++;
      }
      console.log(`Added ${commentsCount} comments to post: ${post.title}`);
    }

    console.log(`Successfully faked ${commentsAdded} comments across all posts!`);
  } catch (err) {
    console.error('Error inserting fake comments:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
