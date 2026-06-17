import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

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
    const { title, slug, description, content, coverImage, audioUrl, readTime, published, categoryId, date } = await request.json();

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ tiêu đề, slug, nội dung và danh mục.' },
        { status: 400 }
      );
    }

    // Verify slug unique to others
    const existing = await db.post.findUnique({
      where: { slug }
    });

    // Verify unique to others
    const existingOther = await db.post.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (existingOther) {
      return NextResponse.json(
        { error: 'Slug này đã được sử dụng bởi một bài viết khác.' },
        { status: 400 }
      );
    }

    const updated = await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        description: description || '',
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        audioUrl: audioUrl || null,
        readTime: Number(readTime) || 5,
        published: Boolean(published),
        categoryId,
        date: date ? new Date(date) : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Post PUT error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

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

    await db.post.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Post DELETE error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
