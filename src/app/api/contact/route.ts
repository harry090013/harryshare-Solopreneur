import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validations
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Địa chỉ email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Save in PostgreSQL
    await db.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
