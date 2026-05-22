import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// PUT: Cập nhật thông tin slide (imageUrl, order) - admin only
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
    const { imageUrl, order } = body;

    const slide = await db.heroSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      return NextResponse.json({ error: 'Không tìm thấy slide.' }, { status: 404 });
    }

    const updatedSlide = await db.heroSlide.update({
      where: { id },
      data: {
        imageUrl: imageUrl !== undefined ? imageUrl : slide.imageUrl,
        order: order !== undefined ? Number(order) : slide.order
      }
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error('Update slide error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật slide.' },
      { status: 500 }
    );
  }
}

// DELETE: Xóa slide - admin only
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

    const slide = await db.heroSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      return NextResponse.json({ error: 'Không tìm thấy slide.' }, { status: 404 });
    }

    await db.heroSlide.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete slide error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa slide.' },
      { status: 500 }
    );
  }
}
