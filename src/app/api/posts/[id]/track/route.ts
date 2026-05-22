import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // "view", "like", "share"

    if (!action || !['view', 'like', 'share'].includes(action)) {
      return NextResponse.json({ error: 'Hành động không hợp lệ.' }, { status: 400 });
    }

    // Lookup post by ID or Slug
    const post = await db.post.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
    }

    const fieldMap: Record<string, string> = {
      view: 'views',
      like: 'likes',
      share: 'shares'
    };

    const field = fieldMap[action];

    const updatedPost = await db.post.update({
      where: { id: post.id },
      data: {
        [field]: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true,
        likes: true,
        shares: true
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Track post interaction error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi ghi nhận tương tác.' },
      { status: 500 }
    );
  }
}
