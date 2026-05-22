import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Retrieve all comments with associated post info (admin only)
export async function GET() {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await db.comment.findMany({
      include: {
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fetch admin comments error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách bình luận.' },
      { status: 500 }
    );
  }
}
