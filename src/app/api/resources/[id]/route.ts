import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// PUT: Update resource (admin only)
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
    const { title, slug, description, type, url, image, featured, categoryId } = body;

    if (!title || !slug || !description || !type || !url || !image || !categoryId) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ các trường thông tin bắt buộc.' },
        { status: 400 }
      );
    }

    if (type !== 'tool' && type !== 'freebie') {
      return NextResponse.json(
        { error: 'Phân loại tài nguyên không hợp lệ (hợp lệ: tool, freebie).' },
        { status: 400 }
      );
    }

    // Check resource exists
    const resource = await db.projectResource.findUnique({
      where: { id }
    });
    if (!resource) {
      return NextResponse.json({ error: 'Không tìm thấy tài nguyên.' }, { status: 404 });
    }

    // Verify category exists
    const category = await db.category.findFirst({
      where: { id: categoryId, type: 'resource' }
    });
    if (!category) {
      return NextResponse.json(
        { error: 'Danh mục tài nguyên không tồn tại hoặc không phù hợp.' },
        { status: 400 }
      );
    }

    // Verify unique slug (excluding current)
    const existingSlug = await db.projectResource.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Đường dẫn tĩnh (Slug) này đã được sử dụng.' },
        { status: 400 }
      );
    }

    const updatedResource = await db.projectResource.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        type,
        url,
        image,
        featured: !!featured,
        categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Update resource error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật dự án & tài nguyên.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete resource (admin only)
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

    const resource = await db.projectResource.findUnique({
      where: { id }
    });
    if (!resource) {
      return NextResponse.json({ error: 'Không tìm thấy tài nguyên.' }, { status: 404 });
    }

    await db.projectResource.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete resource error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa dự án & tài nguyên.' },
      { status: 500 }
    );
  }
}
