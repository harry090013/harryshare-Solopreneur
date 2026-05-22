import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Lấy toàn bộ slideshow slides (public/admin đều cần)
export async function GET() {
  try {
    const slides = await db.heroSlide.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Fetch slides error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách slide.' },
      { status: 500 }
    );
  }
}

// POST: Tạo slide mới (admin only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, order } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Thiếu đường dẫn hình ảnh.' }, { status: 400 });
    }

    const slide = await db.heroSlide.create({
      data: {
        imageUrl,
        order: order !== undefined ? Number(order) : 0
      }
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error('Create slide error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi thêm slide mới.' },
      { status: 500 }
    );
  }
}
