import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// PUT: Cập nhật mốc lịch sử (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { period, title, role, iconName, description, lesson, order } = body;

    const milestone = await db.aboutTimeline.findUnique({
      where: { id }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Không tìm thấy chặng đường này.' }, { status: 404 });
    }

    const updated = await db.aboutTimeline.update({
      where: { id },
      data: {
        period: period !== undefined ? period : milestone.period,
        title: title !== undefined ? title : milestone.title,
        role: role !== undefined ? role : milestone.role,
        iconName: iconName !== undefined ? iconName : milestone.iconName,
        description: description !== undefined ? description : milestone.description,
        lesson: lesson !== undefined ? lesson : milestone.lesson,
        order: order !== undefined ? Number(order) : milestone.order
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update milestone error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật chặng đường.' },
      { status: 500 }
    );
  }
}

// DELETE: Xóa mốc lịch sử (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const milestone = await db.aboutTimeline.findUnique({
      where: { id }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Không tìm thấy chặng đường này.' }, { status: 404 });
    }

    await db.aboutTimeline.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete milestone error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa chặng đường.' },
      { status: 500 }
    );
  }
}
