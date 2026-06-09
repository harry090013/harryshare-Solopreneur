import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Lấy toàn bộ chặng đường lịch sử (sắp xếp theo order)
export async function GET() {
  try {
    const milestones = await db.aboutTimeline.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(milestones);
  } catch (error) {
    console.error('Fetch timeline error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách chặng đường.' },
      { status: 500 }
    );
  }
}

// POST: Tạo mốc lịch sử mới (admin only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { period, title, role, iconName, description, lesson, imageUrl, order } = body;

    if (!period || !title || !role || !description || !lesson) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' }, { status: 400 });
    }

    const milestone = await db.aboutTimeline.create({
      data: {
        period,
        title,
        role,
        iconName: iconName || 'Coffee',
        description,
        lesson,
        imageUrl: imageUrl || null,
        order: order !== undefined ? Number(order) : 0
      }
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error('Create timeline milestone error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi thêm chặng đường mới.' },
      { status: 500 }
    );
  }
}
