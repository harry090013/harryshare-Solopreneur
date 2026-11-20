// Lightweight Resend email integration using native fetch (zero external dependency)
// Gracefully skips sending if RESEND_API_KEY is not configured.

const RESEND_API_URL = 'https://api.resend.com/emails';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Gracefully skip if Resend is not yet configured
    return false;
  }

  const from = process.env.RESEND_FROM_EMAIL || 'HarryShare <noreply@harryshare.vn>';

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Email] Resend API error:', res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Email] Failed to send email:', err);
    return false;
  }
}

export async function sendWelcomeEmail(toEmail: string, downloadUrl: string): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';
  const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `${baseUrl}${downloadUrl}`;

  return sendEmail({
    to: toEmail,
    subject: 'Chào mừng bạn đến với bản tin HarryShare 🌿',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #292524; background-color: #faf8f5; border-radius: 16px;">
        <h2 style="font-family: Georgia, serif; color: #3f4e37; margin-top: 0;">Chào bạn, cảm ơn bạn đã ghé góc nhỏ của Harry!</h2>
        <p style="line-height: 1.7; font-size: 15px;">
          Mình là Harry (Quang Hiếu). Rất vui vì bạn đã tin tưởng để lại email tại <strong>harryshare.vn</strong>.
        </p>
        <p style="line-height: 1.7; font-size: 15px;">
          Mình không gửi email quảng cáo hay spam mỗi ngày. Mình chỉ gửi thư khi có những bài viết thực tế về tư duy sản phẩm, công nghệ &amp; AI, hành trình làm nghề và những tài nguyên thực sự hữu ích.
        </p>
        <div style="margin: 24px 0; padding: 16px; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3f4e37;">🎁 Quà chào mừng dành cho bạn:</p>
          <a href="${escapeHtml(fullDownloadUrl)}" style="display: inline-block; background-color: #3f4e37; color: #faf8f5; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Tải bộ Checklist tài liệu ngay
          </a>
        </div>
        <p style="line-height: 1.7; font-size: 14px; color: #57534e;">
          Nếu bạn có câu chuyện hay câu hỏi nào muốn trao đổi, cứ phản hồi trực tiếp email này hoặc ghé trang <a href="${escapeHtml(baseUrl)}/chia-se" style="color: #3f4e37;">Góc chia sẻ</a> nhé.
        </p>
        <p style="font-size: 14px; color: #57534e; margin-bottom: 0;">Trân trọng,<br/><strong>Harry (Quang Hiếu)</strong></p>
      </div>
    `,
  });
}

export async function sendAdminContactNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return false;

  return sendEmail({
    to: adminEmail,
    replyTo: data.email,
    subject: `[HarryShare Liên hệ] ${data.subject}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; padding: 20px; color: #292524;">
        <h3 style="color: #3f4e37; margin-top: 0;">Tin nhắn liên hệ mới từ HarryShare.vn</h3>
        <p><strong>Người gửi:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.phone ? `<p><strong>Số điện thoại:</strong> ${escapeHtml(data.phone)}</p>` : ''}
        <p><strong>Chủ đề:</strong> ${escapeHtml(data.subject)}</p>
        <div style="margin-top: 16px; padding: 14px; background: #f5f5f4; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
      </div>
    `,
  });
}

export async function sendAdminCommentNotification(data: {
  authorName: string;
  authorEmail?: string | null;
  content: string;
  postTitle: string;
  postSlug: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return false;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';

  return sendEmail({
    to: adminEmail,
    replyTo: data.authorEmail || undefined,
    subject: `[HarryShare Bình luận mới] ${data.postTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; padding: 20px; color: #292524;">
        <h3 style="color: #3f4e37; margin-top: 0;">Có bình luận mới đang chờ duyệt</h3>
        <p><strong>Bài viết:</strong> <a href="${escapeHtml(baseUrl)}/chia-se/${escapeHtml(data.postSlug)}">${escapeHtml(data.postTitle)}</a></p>
        <p><strong>Người bình luận:</strong> ${escapeHtml(data.authorName)} ${data.authorEmail ? `(${escapeHtml(data.authorEmail)})` : ''}</p>
        <div style="margin-top: 12px; padding: 14px; background: #f5f5f4; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(data.content)}</div>
        <p style="margin-top: 16px;">
          <a href="${escapeHtml(baseUrl)}/quan-tri-harry/comments" style="color: #3f4e37; font-weight: 600;">Mở trang quản trị để duyệt &amp; trả lời →</a>
        </p>
      </div>
    `,
  });
}

export async function sendAdminOrderNotification(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note?: string;
  productTitle: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return false;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harryshare.vn';

  return sendEmail({
    to: adminEmail,
    replyTo: data.customerEmail,
    subject: `[HarryShare Đơn hàng mới] ${data.productTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; padding: 20px; color: #292524;">
        <h3 style="color: #3f4e37; margin-top: 0;">Đơn đăng ký / đặt hàng mới</h3>
        <p><strong>Sản phẩm:</strong> ${escapeHtml(data.productTitle)}</p>
        <p><strong>Khách hàng:</strong> ${escapeHtml(data.customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.customerEmail)}</p>
        <p><strong>Số điện thoại:</strong> ${escapeHtml(data.customerPhone)}</p>
        ${data.note ? `<p><strong>Ghi chú:</strong> ${escapeHtml(data.note)}</p>` : ''}
        <p style="margin-top: 16px;">
          <a href="${escapeHtml(baseUrl)}/quan-tri-harry/orders" style="color: #3f4e37; font-weight: 600;">Xem đơn hàng trong quản trị →</a>
        </p>
      </div>
    `,
  });
}
