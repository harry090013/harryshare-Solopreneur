import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Check if email already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email này đã đăng ký nhận tin trước đó rồi.' },
        { status: 400 }
      );
    }

    // Save email
    await db.newsletter.create({
      data: { email },
    });

    return NextResponse.json({ 
      success: true, 
      downloadUrl: '/resources/Solopreneur_Automation_Checklist.pdf' 
    }, { status: 201 });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
