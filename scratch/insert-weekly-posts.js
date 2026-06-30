const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const posts = [
      {
        title: "Gia đình mình có truyền thống làm nhang, và câu hỏi về một sản phẩm tử tế",
        slug: "truyen-thong-lam-nhang-va-san-pham-tu-te",
        description: "Sinh ra trong một gia đình làm nhang truyền thống, mình bắt đầu tự hỏi: làm thế nào để tiếp nối và phát triển một sản phẩm sạch, tử tế giữa thời đại số?",
        content: `Khi còn là một đứa trẻ lớn lên ở vùng quê, mùi khói nhang thô mộc, ấm áp của gia đình luôn là một phần ký ức sâu đậm nhất của mình. Nhà mình có truyền thống làm nhang lâu đời. Từ nhỏ, mình đã quen với việc nhìn ông bà, cha mẹ tỉ mẩn chuẩn bị từng tăm tre, trộn bột keo bời lời, nhào vỏ quế, trầm hương để tạo ra những nén nhang thơm lành tự nhiên. 

Lớn lên, đi học IT rồi chuyển sang làm Marketing ở thành phố lớn, nhịp sống bận rộn đôi khi làm mình quên đi những mùi hương mộc mạc ấy. Nhưng mỗi lần về quê, ngửi thấy mùi trầm, mùi vỏ bưởi phơi khô trên sân nhà, mình lại thấy tâm hồn mình dịu lại. Đó cũng là lúc mình bắt đầu tự hỏi: **Tại sao một sản phẩm gần gũi, tốt lành như vậy của gia đình lại chưa thể tiếp cận rộng rãi hơn đến những người trẻ đô thị đang ngày đêm đối mặt với áp lực và khói bụi?**

### Từ tư duy kỹ thuật đến ước mơ sản phẩm sạch

Mặc dù có background công nghệ, nhưng khi nghĩ về sản phẩm truyền thống của gia đình, mình lại không muốn tiếp cận nó bằng cách "tối ưu hóa quy mô" hay sản xuất hàng loạt bằng hóa chất nhân tạo. 

Thời đại ngày nay, chỉ cần thêm một chút hương liệu hóa học, người ta có thể làm ra hàng vạn cây nhang trong một ngày với mùi thơm nồng nặc và giá thành siêu rẻ. Nhưng đó không phải là con đường tử tế. Nhang hóa chất không chỉ ảnh hưởng đến sức khỏe người tiêu dùng mà còn làm mất đi giá trị thiêng liêng, tĩnh lặng vốn có của nén nhang thảo mộc.

Vì vậy, mình chọn đi theo con đường khó hơn: **Sản phẩm sạch, minh bạch và chân thực.**

* **Sạch từ nguyên liệu**: Chỉ sử dụng các nguyên liệu hoàn toàn từ tự nhiên (trầm hương, quế, tăm tre mộc không nhuộm màu hóa học).
* **Minh bạch quy trình**: Chia sẻ thật câu chuyện làm ra sản phẩm, không thần thánh hóa, không tâng bốc công dụng.
* **Sản phẩm mình bán cũng phải là sản phẩm mình dùng**: Mỗi sản phẩm đưa ra thị trường trước hết phải là thứ mình và gia đình sử dụng hằng ngày với sự an tâm tuyệt đối.

### Một doanh nghiệp nhỏ tử tế

Mong ước của mình không phải là xây dựng một tập đoàn sản xuất nhang khổng lồ. Mình muốn xây dựng một mô hình kinh doanh nhỏ nhưng chắc chắn, tạo công ăn việc làm ổn định cho bà con lối xóm ở quê, để gia đình cùng làm và vẫn có thời gian để chăm sóc đời sống tinh thần, tu tập.

Đó là một hành trình dài và đòi hỏi nhiều thử nghiệm. Nhưng mình tin rằng, giữa một thế giới đầy rẫy những quảng cáo thổi phồng, một sản phẩm đi lên từ lòng tin, sự thật và truyền thống gia đình sẽ luôn tìm được những người đón nhận trân trọng.

*Nếu bạn cũng quan tâm đến lối sống xanh, sản phẩm tự nhiên hoặc có chung những suy tư về sản phẩm tử tế, hãy chia sẻ cùng mình ở phần bình luận nhé!*`,
        coverImage: "/images/truyen-thong-lam-nhang-va-san-pham-tu-te.png",
        readTime: 4,
        published: true,
        date: new Date("2026-07-01T07:00:00+07:00"),
        categoryId: "8284dd6b-bd7d-4b08-bd39-d59f3697288e" // Tư duy sản phẩm
      },
      {
        title: "Học công cụ hay học cách giải quyết vấn đề?",
        slug: "hoc-cong-cu-hay-giai-quyet-van-de",
        description: "Công nghệ thay đổi theo từng tháng, nhưng nỗi đau của người dùng thì luôn ở đó. Câu chuyện về việc thoát khỏi cái bẫy chạy đua học công cụ mới.",
        content: `Trong thế giới công nghệ hiện nay, đặc biệt là từ khi AI phát triển vượt bậc, chúng ta rất dễ rơi vào trạng thái hoang mang mang tên "Sợ bị bỏ lại". Hôm nay người ta nói về mô hình ngôn ngữ này, ngày mai có một công cụ AI tạo video khác ra mắt, tuần sau lại có một framework lập trình mới được ca ngợi là tối ưu hơn.

Nhiều bạn trẻ hỏi mình: *"Làm sao để học kịp hết tất cả các công cụ này hả anh? Em sợ nếu không biết dùng Claude 3.5, GPT-5 hay các tool automation thì sẽ bị đào thải mất."*

Câu trả lời của mình luôn là: **Đừng tập trung học công cụ. Hãy tập trung học cách giải quyết vấn đề.**

### Cái bẫy của việc chạy đua công nghệ

Công cụ (tools) thay đổi liên tục theo tháng, thậm chí theo tuần. Nếu bạn dành toàn bộ thời gian của mình chỉ để chạy theo học cách bấm nút này, cấu hình tham số kia của một phần mềm cụ thể, bạn đang xây dựng năng lực của mình trên một nền cát lún. Khi công cụ đó lỗi thời hoặc bị thay thế bởi một AI thông minh hơn, lợi thế cạnh tranh của bạn sẽ biến mất.

Ngược lại, bản chất của các vấn đề trong kinh doanh và cuộc sống thì hầu như không thay đổi:
* Khách hàng luôn muốn quy trình làm việc của họ nhanh hơn và bớt thủ công hơn.
* Người dùng luôn muốn một giao diện dễ sử dụng, không cần suy nghĩ nhiều.
* Doanh nghiệp luôn muốn tối ưu hóa chi phí và tăng tỷ lệ chuyển đổi.

Khi bạn có tư duy phân tích sâu sắc để bóc tách một vấn đề phức tạp thành các nhiệm vụ nhỏ, bạn sẽ nhận ra công cụ chỉ là phương tiện để thực thi. Hôm nay bạn dùng công cụ A, ngày mai bạn có thể dễ dàng chuyển sang dùng công cụ B nếu nó giải quyết bài toán tốt hơn.

### Trải nghiệm từ quá trình chuyển đổi của bản thân

Khi mình đi từ xuất phát điểm IT (Kỹ thuật) sang làm Marketing, rào cản lớn nhất của mình không phải là học cách sử dụng các công cụ SEO hay quảng cáo. Rào cản lớn nhất là học cách **lắng nghe và thấu cảm người dùng**.

Khi mình hiểu sâu sắc độc giả của HarryShare đang gặp khó khăn gì (ví dụ: họ cần những bài học thực tế, mộc mạc chứ không cần những định nghĩa học thuật khô khan), mình có thể dùng bất kỳ công cụ nào để tiếp cận họ. Mình có thể dùng một trang web viết bằng Next.js, hoặc chỉ đơn giản là viết note trên điện thoại rồi chụp ảnh lại gửi đi. Giá trị nằm ở giải pháp cho nỗi đau của họ, chứ không nằm ở công nghệ mình dùng để xây dựng nó.

### Lời khuyên thực tế cho bạn

1. **Hiểu rõ vấn đề trước khi chọn công cụ**: Đừng vội mở phần mềm lên gõ code hay prompt. Hãy lấy tờ giấy ra viết rõ: *"Bài toán mình cần giải quyết ở đây là gì? Đo lường thành công bằng cách nào?"*
2. **Học công cụ theo nhu cầu thực tế**: Chỉ học một công cụ mới khi bạn thực sự có một dự án cần dùng đến nó. Đọc tài liệu vừa đủ để giải quyết task hiện tại, đừng cố học hết lý thuyết xuông.
3. **Rèn luyện tư duy hệ thống**: Tập trung vào cách thiết kế quy trình, cách dữ liệu luân chuyển và cách các thành phần tương tác với nhau. Đó mới là tài sản trí tuệ đi cùng bạn trọn đời.

Công cụ là người đầy tớ tốt nhưng là người chủ tồi. Đừng để các xu hướng công nghệ dẫn dắt bạn, hãy là người làm chủ mục tiêu và giải pháp của chính mình.

*Nếu bạn có câu chuyện nào về việc loay hoay giữa ma trận công cụ, hãy chia sẻ cùng mình ở bên dưới nhé!*`,
        coverImage: "/images/hoc-cong-cu-hay-giai-quyet-van-de.png",
        readTime: 5,
        published: true,
        date: new Date("2026-07-03T07:00:00+07:00"),
        categoryId: "86bf776d-3db4-462d-a871-324fb05e7fc3" // Công nghệ & AI
      },
      {
        title: "Sống chậm lại để chọn thứ đáng bền bỉ",
        slug: "song-cham-lai-de-chon-thu-ben-bi",
        description: "Giữa áp lực phải nhanh, phải có kết quả ngay của xã hội, mình học cách dừng lại, quan sát kỹ hơn để chọn ra điều mình sẵn sàng đi lâu dài.",
        content: `Một trong những căn bệnh phổ biến nhất của thời đại số là sự vội vã. Chúng ta thức dậy với hàng chục thông báo trên điện thoại, đi làm với áp lực công việc dồn dập, và lướt mạng xã hội với những câu chuyện thành công chớp nhoáng của người khác. Tất cả tạo nên một nỗi sợ vô hình: **Nếu mình không chạy thật nhanh, mình sẽ bị bỏ lại phía sau.**

Bản thân mình từng là nạn nhân của lối suy nghĩ đó. Có những thời điểm mình bị overthinking nặng nề, đầu óc lúc nào cũng quay cuồng với hàng tá ý tưởng: phải học thêm kỹ năng này, phải xây thêm dự án kia, phải tối ưu hóa năng suất đến từng phút. 

Nhưng kết quả thu về chỉ là sự kiệt sức và cảm giác trống rỗng. Đi nhanh mà không có định hướng rõ ràng giống như việc bạn chạy thục mạng trên một chiếc máy chạy bộ: bạn tốn rất nhiều năng lượng nhưng thực chất vẫn đứng yên một chỗ.

Đó là lúc mình nhận ra giá trị của việc **sống chậm lại**.

### Học cách dừng lại để quan sát

Sống chậm lại không phải là lười biếng hay buông xuôi. Sống chậm thực chất là một quyết định chủ động để **lọc bỏ tiếng ồn** xung quanh và tập trung vào những gì thực sự cốt lõi.

Khi mình chủ động giảm bớt thời gian lướt mạng xã hội vô định, dành nhiều thời gian hơn để đi dạo, uống trà và viết nhật ký cá nhân, mình bắt đầu nhìn thấy những điểm mù của bản thân:
* Nhiều dự án mình muốn làm trước đây thực ra chỉ là để giải tỏa nỗi lo sợ nhất thời, chứ không phải thứ mình thực sự đam mê.
* Việc viết blog HarryShare đều đặn mỗi tuần ban đầu tưởng như tốn thời gian, nhưng lại là thứ mang lại cho mình sự bình yên và rõ ràng trong tư duy nhiều nhất.

Khi bạn đi chậm lại, bạn mới có đủ thời gian để kiểm chứng giả thuyết, thấu cảm vấn đề và tích lũy năng lượng cho những chặng đường dài.

### Chọn thứ đáng để bền bỉ

Mỗi người chúng ta chỉ có một quỹ thời gian và năng lượng giới hạn. Thay vì cố gắng làm 10 thứ trung bình, mình chọn tập trung vào 1-2 thứ thực sự xứng đáng để mình kiên trì trong 3 năm, 5 năm, hay thậm chí 10 năm tiếp theo.

Đối với mình ở thời điểm hiện tại, đó là:
1. **Xây dựng HarryShare tử tế**: Chia sẻ những câu chuyện thật, xây dựng lòng tin bền vững với độc giả mà không mưu cầu thành tích ngắn hạn.
2. **Phát triển sản phẩm sạch của gia đình**: Đi từng bước nhỏ, chắc chắn, giữ gìn đạo đức và sự minh bạch tuyệt đối trong kinh doanh.

Khi bạn đã chọn được "thứ đáng để bền bỉ", bạn sẽ thấy áp lực phải so sánh mình với người khác biến mất. Bạn chỉ tập trung vào việc làm tốt hơn phiên bản của chính mình ngày hôm qua, từng chút một, bền bỉ và kiên định.

Hy vọng những dòng ghi chép nhỏ này có thể giúp bạn dừng lại một nhịp, thở sâu và tự hỏi bản thân: *Đâu là điều bạn thực sự muốn kiên trì lâu dài?*

*Nếu bạn có trong câu chuyện của mình, hãy để lại bình luận chia sẻ với mình nhé!*`,
        coverImage: "/images/song-cham-lai-de-chon-thu-ben-bi.png",
        readTime: 5,
        published: true,
        date: new Date("2026-07-05T07:00:00+07:00"),
        categoryId: "bb2e96e3-5c7c-4b19-a8e8-989f87abbd37" // Hành trình làm nghề
      }
    ];

    for (const post of posts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: post,
        create: post
      });
      console.log(`Upserted post: ${post.title}`);
    }
    console.log('Successfully completed database seeding for weekly posts!');
  } catch (err) {
    console.error('Error inserting weekly posts:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
