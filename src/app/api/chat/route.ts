import { NextResponse } from 'next/server';

// 1. Rule-based intelligence engine in Harry's tone
const getLocalResponse = (message: string): string => {
  const msg = message.toLowerCase().trim();

  // Normalize Vietnamese accent marks slightly for broader matches
  const contains = (...keywords: string[]) => {
    return keywords.some(keyword => msg.includes(keyword));
  };

  if (contains('chào', 'hello', 'hi', 'hey', 'alo')) {
    return 'Xin chào! Rất vui được gặp bạn ghé thăm nhà của mình. Mình là Harry. Hôm nay bạn thế nào? Mình có thể chia sẻ với bạn về Tư duy sản phẩm, Thương hiệu cá nhân, Công nghệ & AI hoặc kể bạn nghe về chặng đường làm nghề của mình đấy! 😊';
  }

  if (contains('tư duy sản phẩm', 'tu duy san pham', 'làm sản phẩm', 'lam san pham', 'product thinking', 'phát triển sản phẩm')) {
    return 'Về tư duy sản phẩm (Product Thinking), mình tin rằng điều cốt lõi nhất không phải là tính năng bóng bẩy, mà là việc hiểu sâu sắc NỖI ĐAU (Pain point) của người dùng để giải quyết nó một cách đơn giản nhất. \n\nĐối với một Solopreneur, hãy áp dụng mô hình Product-Led Growth (PLG) - thiết kế sao cho sản phẩm tự lan truyền và tự bán chính nó. Hãy cố gắng tạo ra khoảnh khắc "Aha! Moment" cực nhanh, loại bỏ các thủ tục rườm rà để người dùng cảm nhận giá trị ngay lập tức. Bạn đang định xây dựng một sản phẩm gì à, chia sẻ với mình nhé?';
  }

  if (contains('thương hiệu cá nhân', 'thuong hieu ca nhan', 'personal brand', 'personal branding', 'định vị')) {
    return 'Xây dựng thương hiệu cá nhân bền vững từ con số 0 là một hành trình trao đi giá trị một cách kiên trì. Nó KHÔNG phải là sự phô trương bóng bẩy. \n\n3 trụ cột mình luôn đúc kết là:\n1. Định vị bản thân (nhắm vào một ngách thật hẹp mà bạn xuất sắc).\n2. Nhất quán & Kiên trì (sáng tạo nội dung đều đặn).\n3. Chia sẻ câu chuyện "Behind the scenes" (cả những sai lầm và thăng trầm chân thực của bạn).\n\nHãy bắt đầu bằng một blog cá nhân độc lập thay vì chỉ phụ thuộc mạng xã hội. Đó chính là ngôi nhà số đích thực của bạn!';
  }

  if (contains('công nghệ', 'cong nghe', 'ai', 'trí tuệ nhân tạo', 'chát', 'chat', 'tool', 'công cụ')) {
    return 'Mình rất mê công nghệ và AI vì chúng giúp giải quyết các vấn đề trong công việc và cuộc sống nhanh hơn, nhẹ nhàng hơn. Mình thường dùng AI (như ChatGPT, Claude, Gemini) như một người bạn đồng hành cùng tư duy, bóc tách vấn đề để bớt overthinking. \n\nVới mình, một công cụ tốt không phải để làm mình lười đi, mà giúp suy nghĩ của mình rõ ràng hơn, tối ưu hóa hiệu suất làm việc. Bạn có muốn trao đổi về cách ứng dụng AI hay các công cụ hữu ích nào không?';
  }

  if (contains('hành trình', 'hanh trinh', 'làm nghề', 'lam nghe', 'phục vụ bàn', 'trước đây', 'freelancer', 'solopreneur', 'tiểu sử', 'sự nghiệp')) {
    return 'Hành trình làm nghề của mình đi qua rất nhiều thăng trầm. Xuất phát điểm là một lập trình viên phần mềm, sau đó rẽ hướng làm bán hàng đa kênh, phục vụ buffet tại khách sạn Rex, làm tư vấn giải pháp phần mềm, rồi lấn sân làm Marketing & SEO. \n\nCuối cùng, mình chọn con đường trở thành Solopreneur - tự do xây dựng các dự án của riêng mình và tự chịu trách nhiệm 100% cuộc đời mình. Mình đúc kết rằng: Không có trải nghiệm nào là lãng phí cả, tất cả đều là những mảnh ghép tuyệt vời cho tương lai!';
  }

  if (contains('liên hệ', 'lien he', 'email', 'số điện thoại', 'sđt', 'gặp', 'trao đổi')) {
    return 'Bạn có thể gửi liên hệ trực tiếp cho mình qua trang "/lien-he" trên thanh menu nha. Điền thông tin vào form đó, tin nhắn sẽ bay thẳng vào Admin Dashboard của mình. Hoặc bạn có thể gửi email trực tiếp cho mình tại địa chỉ: stshieu09@gmail.com. Rất vui được kết nối cùng bạn!';
  }

  if (contains('cảm ơn', 'cam on', 'thank', 'thanks')) {
    return 'Không có gì nè! Rất vui được trò chuyện với bạn. Chúc bạn một ngày thật nhiều cảm hứng và năng lượng tích cực nha! Có câu hỏi gì cứ thoải mái nhắn mình nha. ✨';
  }

  // Fallback smart response
  return 'Câu hỏi của bạn rất thú vị! Dưới góc nhìn của một Solopreneur, mình nghĩ việc liên tục thử nghiệm, đúc kết bài học chân thực và chia sẻ nó là vô cùng quan trọng. Bạn có muốn đi sâu thảo luận về Tư duy làm sản phẩm (SaaS), xây dựng Thương hiệu cá nhân hay cách ứng dụng Công nghệ & AI để tăng năng suất làm việc không?';
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API Key is present, attempt to use Google Gemini API
    if (apiKey && apiKey.trim() !== '') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Bạn là Harry (Quang Hiếu), tác giả của blog HarryShare.vn. Hãy trò chuyện với độc giả bằng giọng văn tiếng Việt thân thiện, khiêm tốn, nhiệt huyết, ấm áp và giàu kinh nghiệm của một công nghệ Solopreneur (28 tuổi, từng làm phục vụ bàn, POD, freelance developer, content marketer). Hãy nói xưng "mình" hoặc "Harry" và gọi đối phương là "bạn". Hãy trả lời ngắn gọn, tập trung và truyền cảm hứng.
                      
Thông tin cốt lõi về Harry để trả lời:
- Tư duy sản phẩm (Product Thinking): giải quyết nỗi đau người dùng đơn giản nhất, tối ưu Aha! Moment, Product-Led Growth.
- Thương hiệu cá nhân: kiên trì chia sẻ giá trị thực, nhất quán, không phô trương sáo rỗng.
- Công nghệ & AI: ứng dụng công cụ hữu ích, AI tool (ChatGPT, Claude, Gemini), tự động hóa giúp giải quyết vấn đề thực tế, nhẹ việc.
- Hành trình làm nghề: Phục vụ bàn -> Tư vấn GoSell -> Content & SEO -> Solopreneur tự do.

Độc giả hỏi: "${message}"`
                    }
                  ]
                }
              ],
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
              }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to local engine:', geminiError);
      }
    }

    // Fallback to local rule engine
    const reply = getLocalResponse(message);
    // Simulate a slight network latency for realistic chat feeling
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ reply: 'Có lỗi nhỏ xảy ra trong suy nghĩ của mình. Bạn nhắn lại nhé!' });
  }
}
