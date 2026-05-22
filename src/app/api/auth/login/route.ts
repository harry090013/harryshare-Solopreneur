import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên tài khoản và mật khẩu.' },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await db.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Tên tài khoản hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // Verify password
    const match = await comparePassword(password, admin.password);
    if (!match) {
      return NextResponse.json(
        { error: 'Tên tài khoản hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // Sign Token
    const token = signToken({
      userId: admin.id,
      username: admin.username
    });

    // Set cookie (Secure, HttpOnly)
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình đăng nhập.' },
      { status: 500 }
    );
  }
}
