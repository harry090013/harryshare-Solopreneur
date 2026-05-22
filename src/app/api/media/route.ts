import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all media items (admin only)
export async function GET() {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mediaList = await db.media.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Exclude the huge dataUrl from the list to keep network lightweight!
    // We can use /api/media/[id] as the image src!
    const sanitizedMedia = mediaList.map(m => ({
      id: m.id,
      name: m.name,
      type: m.type,
      size: m.size,
      createdAt: m.createdAt,
      url: `/api/media/${m.id}`
    }));

    return NextResponse.json(sanitizedMedia);
  } catch (error) {
    console.error('Fetch media list error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra khi tải danh sách ảnh.' }, { status: 500 });
  }
}

// POST upload media
export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const media = await db.media.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: dataUrl
      }
    });

    return NextResponse.json({
      id: media.id,
      name: media.name,
      type: media.type,
      size: media.size,
      createdAt: media.createdAt,
      url: `/api/media/${media.id}`
    }, { status: 201 });
  } catch (error) {
    console.error('Upload media error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra khi tải lên ảnh.' }, { status: 500 });
  }
}
