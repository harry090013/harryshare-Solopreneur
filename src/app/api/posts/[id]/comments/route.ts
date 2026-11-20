import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendAdminCommentNotification } from '@/lib/email';

// GET: Fetch all approved comments for a specific post (by ID or Slug)
// Security: Explicitly omit authorEmail from public response
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
      },
      select: { id: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
    }

    const comments = await db.comment.findMany({
      where: {
        postId: post.id,
        approved: true
      },
      select: {
        id: true,
        postId: true,
        authorName: true,
        content: true,
        approved: true,
        adminReply: true,
        createdAt: true,
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
    const ip = getClientIp(request);
    const { allowed, retryAfterSec } = checkRateLimit(`comment:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Bạn gửi bình luận hơi nhanh, vui lòng thử lại sau ${retryAfterSec} giây nhé.` },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { authorName, authorEmail, content, website } = body;

    // Honeypot silent drop
    if (website && String(website).trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const cleanName = String(authorName || '').trim();
    const cleanContent = String(content || '').trim();
    const cleanEmail = authorEmail ? String(authorEmail).trim() : null;

    if (!cleanName || !cleanContent) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên của bạn và nội dung bình luận.' },
        { status: 400 }
      );
    }

    if (cleanName.length > 80 || cleanContent.length > 2000) {
      return NextResponse.json(
        { error: 'Tên (tối đa 80 ký tự) hoặc nội dung bình luận (tối đa 2000 ký tự) quá dài.' },
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
      },
      select: { id: true, title: true, slug: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
    }

    const newComment = await db.comment.create({
      data: {
        postId: post.id,
        authorName: cleanName,
        authorEmail: cleanEmail,
        content: cleanContent,
        approved: false // Requires admin moderation
      },
      select: {
        id: true,
        postId: true,
        authorName: true,
        content: true,
        approved: true,
        createdAt: true,
      }
    });

    // Notify admin via email (non-blocking)
    sendAdminCommentNotification({
      authorName: cleanName,
      authorEmail: cleanEmail,
      content: cleanContent,
      postTitle: post.title,
      postSlug: post.slug,
    }).catch(() => {});

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Submit comment error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi bình luận.' },
      { status: 500 }
    );
  }
}
