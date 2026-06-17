const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: 'ac1c6c86-1b16-454f-abac-3f374c377dcb' } // Tài liệu & Quà tặng
    });
    const toolCategory = await prisma.category.findUnique({
      where: { id: 'a173798b-6455-42df-b8ad-e7ba679c8d4b' } // Công cụ đắc lực
    });

    if (!category || !toolCategory) {
      console.error('Required categories not found!');
      return;
    }

    const resources = [
      {
        title: "Lovable AI - Trợ lý phát triển Web App thần tốc",
        slug: "lovable-ai-tro-ly-web-app",
        description: "Nền tảng giúp bạn xây dựng và tùy biến giao diện website, ứng dụng web bằng ngôn ngữ tự nhiên cực nhanh và mượt mà.",
        type: "tool",
        url: "https://lovable.dev",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: toolCategory.id
      },
      {
        title: "30 Prompt AI của Harry",
        slug: "bo-30-prompt-ai-cua-harry",
        description: "Không phải prompt copy từ internet. Đây là 30 prompt Harry test thật, dùng hằng ngày cho sản phẩm, code, content và thương hiệu cá nhân.",
        type: "freebie",
        url: "/downloads/harryshare_30_prompt_ai_v1.pdf",
        downloadUrl: "/downloads/harryshare_30_prompt_ai_v1.pdf",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: category.id
      },
      {
        title: "Checklist 20 điểm trước khi Publish",
        slug: "checklist-truoc-khi-publish",
        description: "Checklist thật Harry dùng trước mỗi bài đăng. Từ nội dung đến SEO kỹ thuật — đủ để publish tự tin, không bỏ sót.",
        type: "freebie",
        url: "/downloads/harryshare_checklist_publish_v1.pdf",
        downloadUrl: "/downloads/harryshare_checklist_publish_v1.pdf",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: category.id
      },
      {
        title: "10 câu hỏi trước khi Build",
        slug: "checklist-truoc-khi-build",
        description: "Trước khi viết 1 dòng code hay thiết kế 1 màn hình — Harry tự hỏi 10 câu này. Tiết kiệm hàng tuần build sai hướng.",
        type: "freebie",
        url: "/downloads/harryshare_checklist_build_v1.pdf",
        downloadUrl: "/downloads/harryshare_checklist_build_v1.pdf",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: category.id
      },
      {
        title: "Template AGENTS.md — Vibe Coding",
        slug: "template-agents-md-vibe-coding",
        description: "File Harry dùng để AI agent (Antigravity, Claude) hiểu context dự án từ câu đầu tiên. Không có file này, mỗi lần làm việc phải giải thích lại từ đầu.",
        type: "freebie",
        url: "/downloads/harryshare_agents_md_template_v1.md",
        downloadUrl: "/downloads/harryshare_agents_md_template_v1.md",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: category.id
      },
      {
        title: "Workbook Định vị Thương hiệu",
        slug: "workbook-dinh-vi-thuong-hieu-ca-nhan",
        description: "Workbook 4 trang — tự trả lời 15 câu hỏi để biết mình là ai, viết cho ai, và KHÔNG viết về gì. Nền tảng trước khi build thương hiệu.",
        type: "freebie",
        url: "/downloads/harryshare_workbook_thuong_hieu_v1.pdf",
        downloadUrl: "/downloads/harryshare_workbook_thuong_hieu_v1.pdf",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: category.id
      },
      {
        title: "Template 90 ngày Solopreneur",
        slug: "template-90-ngay-solopreneur",
        description: "Không phải kế hoạch hoàn hảo — là khung thực tế Harry dùng. 3 giai đoạn rõ ràng: nền tảng, thử nghiệm, chuẩn hóa.",
        type: "freebie",
        url: "https://app.notion.com/p/Template-90-Ng-y-u-Solopreneur-382d5acbcf0b80d79a5bc3cc99877686?source=copy_link",
        downloadUrl: "https://app.notion.com/p/Template-90-Ng-y-u-Solopreneur-382d5acbcf0b80d79a5bc3cc99877686?source=copy_link",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
        featured: true,
        categoryId: category.id
      }
    ];

    for (const res of resources) {
      await prisma.projectResource.upsert({
        where: { slug: res.slug },
        update: res,
        create: res
      });
      console.log(`Upserted: ${res.title}`);
    }

    console.log('Successfully seeded project resources!');
  } catch (err) {
    console.error('Error seeding resources:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
