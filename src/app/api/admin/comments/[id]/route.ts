import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// PUT: Approve/disapprove a comment (admin only)
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
    const { approved } = body;

    if (approved === undefined) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp trạng thái duyệt (approved).' },
        { status: 400 }
      );
    }

    const comment = await db.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json({ error: 'Không tìm thấy bình luận.' }, { status: 404 });
    }

    const updatedComment = await db.comment.update({
      where: { id },
      data: {
        approved: !!approved
      }
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Update comment approval error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật bình luận.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a comment (admin only)
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

    const comment = await db.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json({ error: 'Không tìm thấy bình luận.' }, { status: 404 });
    }

    await db.comment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa bình luận.' },
      { status: 500 }
    );
  }
}
