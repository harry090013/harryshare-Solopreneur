import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. Rule-based intelligence engine in Harry's tone (local fallback)
const getLocalResponse = (message: string): string => {
  const msg = message.toLowerCase().trim();

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

  return 'Câu hỏi của bạn rất thú vị! Dưới góc nhìn của một Solopreneur, mình nghĩ việc liên tục thử nghiệm, đúc kết bài học chân thực và chia sẻ nó là vô cùng quan trọng. Bạn có muốn đi sâu thảo luận về Tư duy làm sản phẩm (SaaS), xây dựng Thương hiệu cá nhân hay cách ứng dụng Công nghệ & AI để tăng năng suất làm việc không?';
};

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Fetch context from Database (RAG)
    let contextText = '';
    try {
      const cleanMessage = message.toLowerCase()
        .replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/g, '')
        .trim();
      
      const words = cleanMessage.split(/\s+/).filter((w: string) => w.length > 2);

      if (words.length > 0) {
        const posts = await db.post.findMany({
          where: {
            published: true,
            OR: [
              ...words.map((word: string) => ({ title: { contains: word, mode: 'insensitive' as const } })),
              ...words.map((word: string) => ({ description: { contains: word, mode: 'insensitive' as const } })),
              ...words.map((word: string) => ({ content: { contains: word, mode: 'insensitive' as const } }))
            ]
          },
          take: 3,
          select: {
            title: true,
            slug: true,
            description: true
          }
        });

        if (posts.length > 0) {
          contextText = "\nDưới đây là danh sách bài viết liên quan của bạn (Quang Hiếu) khớp với nội dung hỏi:\n" +
            posts.map(p => `- Tiêu đề: "${p.title}"\n  Đường dẫn: "/chia-se/${p.slug}"\n  Mô tả ngắn: "${p.description}"`).join('\n');
        }
      }
    } catch (dbErr) {
      console.error('Error fetching context for chat RAG:', dbErr);
    }

    // 2. If API Key is present, call Google Gemini API
    if (apiKey && apiKey.trim() !== '') {
      try {
        const systemPrompt = `Bạn là Harry (Quang Hiếu), chủ sở hữu và tác giả của blog HarryShare.vn. Bạn đang trò chuyện trực tiếp với độc giả ghé thăm website thông qua khung chat.

Hãy trò chuyện bằng phong cách tự sự sâu lắng, chân thành, nhiệt huyết, ấm áp và khiêm tốn của một công nghệ Solopreneur (28 tuổi, từng đi qua nhiều công việc vất vả như phục vụ tiệc cưới Rex Hotel, quản lý quán chay Ưu Đàm, làm tư vấn GoSell, trưởng phòng Marketing Tâm An Spa, team leader AI Marketing tại CloudFly).
Hãy xưng hô "mình" (hoặc "Harry") và gọi độc giả là "bạn". Tránh dùng từ ngữ sáo rỗng, tránh giọng chuyên gia dạy đời. Hãy trả lời ngắn gọn, tập trung, đi vào cốt lõi và truyền tải năng lượng tích cực.

Bản đồ cấu trúc website HarryShare.vn để bạn giới thiệu chính xác cho độc giả khi họ hỏi web có gì hoặc cần tìm kiếm:
- Trang chủ (/): Giới thiệu chung và 3 trụ cột định hướng (Ghi lại hành trình, Chia sẻ & Tặng quà, Kinh doanh & Đồng hành).
- Góc chia sẻ (/chia-se): Blog chứa toàn bộ bài viết chia sẻ thuộc 4 danh mục chính:
  1. Tư duy sản phẩm (slug: tu-duy-san-pham) - nói về cách xây MVP, sản phẩm tinh gọn, Product-Led Growth.
  2. Thương hiệu cá nhân (slug: thuong-hieu-ca-nhan) - cách xây dựng uy tín từ giá trị thật.
  3. Công nghệ & AI (slug: cong-nghe-ai) - cách ứng dụng AI tool, automation để tối ưu cuộc sống và nhẹ việc.
  4. Hành trình làm nghề (slug: hanh-trinh-lam-nghe) - nhật ký sự nghiệp, bài học cuộc sống, đối mặt overthinking.
- Dự án & Tài nguyên (/du-an-tai-nguyen): Nơi chia sẻ các công cụ và tài nguyên miễn phí như "Notion Workspace: Trọn Bộ Template Quản Lý Vận Hành Và Đời Sống".
- Sản phẩm (/san-pham): Nơi cung cấp các sản phẩm hữu ích như gói Cố vấn 1-1 Xây dựng Sản phẩm, Cẩm nang Solopreneur khởi nghiệp tinh gọn.
- Về Harry (/ve-harry): Trang giới thiệu chi tiết tiểu sử và 9 cột mốc chặng đường tự học của Harry.
- Liên hệ (/lien-he): Biểu mẫu gửi tin nhắn kết nối trực tiếp đến Harry.

${contextText ? `\nNgữ cảnh bài viết tìm kiếm được từ cơ sở dữ liệu liên quan đến câu hỏi:${contextText}\n\nHƯỚNG DẪN: Hãy giới thiệu khéo léo bài viết này và cung cấp liên kết Markdown tương ứng (ví dụ: "[Tiêu đề bài viết](/chia-se/slug-bai-viet)") để độc giả có thể nhấp vào đọc chi tiết.` : ''}

LƯU Ý QUAN TRỌNG:
- Trả lời đúng trọng tâm câu hỏi. Nếu độc giả hỏi ngắn hoặc tiếp nối câu chuyện trước, hãy dựa vào lịch sử chat để trả lời tự nhiên.
- Không lặp lại lời chào của hệ thống nếu cuộc hội thoại đã bắt đầu.`;

        // Format chat contents with history
        let formattedContents = [];
        if (history && Array.isArray(history) && history.length > 0) {
          formattedContents = history.map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.text }]
          }));
        } else {
          formattedContents = [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ];
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: systemPrompt
                  }
                ]
              },
              contents: formattedContents,
              generationConfig: {
                maxOutputTokens: 400,
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

    // 3. Fallback to local rule engine
    const reply = getLocalResponse(message);
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ reply: 'Có lỗi nhỏ xảy ra trong suy nghĩ của mình. Bạn nhắn lại nhé!' });
  }
}
