import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Stream raw media file as binary content (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await db.media.findUnique({
      where: { id }
    });

    if (!media) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // dataUrl format: data:image/png;base64,iVBORw0...
    const match = media.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return new NextResponse('Invalid Media Format', { status: 500 });
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Fetch raw media error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE: Delete a media item (admin only)
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
    const media = await db.media.findUnique({
      where: { id }
    });

    if (!media) {
      return NextResponse.json({ error: 'Không tìm thấy ảnh này.' }, { status: 404 });
    }

    await db.media.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra khi xóa ảnh.' }, { status: 500 });
  }
}
