import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Fetch all approved comments for a specific post (by ID or Slug)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the post first
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

    const comments = await db.comment.findMany({
      where: {
        postId: post.id,
        approved: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách bình luận.' },
      { status: 500 }
    );
  }
}

// POST: Submit a comment for a post (public, pending approval)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorName, authorEmail, content } = body;

    if (!authorName || !content) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên của bạn và nội dung bình luận.' },
        { status: 400 }
      );
    }

    // Find the post
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

    const newComment = await db.comment.create({
      data: {
        postId: post.id,
        authorName,
        authorEmail: authorEmail || null,
        content,
        approved: false // Requires admin moderation
      }
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Submit comment error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi bình luận.' },
      { status: 500 }
    );
  }
}
