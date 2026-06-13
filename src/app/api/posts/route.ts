import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, slug, description, content, coverImage, audioUrl, readTime, published, categoryId } = await request.json();

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ tiêu đề, slug, nội dung và danh mục.' },
        { status: 400 }
      );
    }

    // Verify unique slug
    const existing = await db.post.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug này đã tồn tại trong hệ thống. Hãy chọn slug khác.' },
        { status: 400 }
      );
    }

    // Create post
    const post = await db.post.create({
      data: {
        title,
        slug,
        description: description || '',
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        audioUrl: audioUrl || null,
        readTime: Number(readTime) || 5,
        published: Boolean(published),
        categoryId
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo bài viết.' },
      { status: 500 }
    );
  }
}
