import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// DELETE: Delete a suggested icon (admin only)
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

    // Check if icon exists
    const icon = await db.icon.findUnique({
      where: { id }
    });

    if (!icon) {
      return NextResponse.json({ error: 'Không tìm thấy biểu tượng gợi ý.' }, { status: 404 });
    }

    // Check if icon is in use by any topic (case-insensitive check on dynamic names)
    const topicsUsingIcon = await db.topic.findFirst({
      where: {
        icon: {
          equals: icon.name,
          mode: 'insensitive'
        }
      }
    });

    if (topicsUsingIcon) {
      return NextResponse.json(
        { 
          error: `Không thể xóa biểu tượng "${icon.label}" vì nó đang được sử dụng ở chủ đề "${topicsUsingIcon.name}".` 
        },
        { status: 400 }
      );
    }

    // Delete icon
    await db.icon.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/icons/[id] error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa biểu tượng gợi ý.' },
      { status: 500 }
    );
  }
}
