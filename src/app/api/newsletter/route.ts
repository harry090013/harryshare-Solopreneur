import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendWelcomeEmail } from '@/lib/email';

const WELCOME_DOWNLOAD_URL = '/downloads/harryshare_checklist_build_v1.pdf';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSec } = checkRateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Vui lòng thử lại sau ${retryAfterSec} giây.` },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 160) {
      return NextResponse.json(
        { error: 'Email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Check if email already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email này đã đăng ký nhận tin trước đó rồi.' },
        { status: 400 }
      );
    }

    // Save email
    await db.newsletter.create({
      data: { email: cleanEmail },
    });

    // Send Welcome Email (gracefully skipped if RESEND_API_KEY is not set)
    sendWelcomeEmail(cleanEmail, WELCOME_DOWNLOAD_URL).catch(() => {});

    return NextResponse.json({
      success: true,
      downloadUrl: WELCOME_DOWNLOAD_URL,
    }, { status: 201 });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
