import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// PUT: Update an existing category (admin only)
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
    const { name, slug, description, type, icon } = await request.json();

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: 'Tên danh mục, Đường dẫn tĩnh (Slug) và Phân loại (Type) là bắt buộc.' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục này.' }, { status: 404 });
    }

    // Verify unique slug for this type (excluding current category)
    const existingSlug = await db.category.findFirst({
      where: {
        slug,
        type,
        id: { not: id }
      }
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `Đường dẫn tĩnh (Slug) này đã tồn tại ở danh mục khác trong nhóm "${type}".` },
        { status: 400 }
      );
    }

    // Update category
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || '',
        type,
        icon: icon || 'Layers'
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật danh mục.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a category (admin only)
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

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
            resources: true,
            products: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục này.' }, { status: 404 });
    }

    // Prevent deletion if category contains items
    const count = category._count.posts + category._count.resources + category._count.products;
    if (count > 0) {
      return NextResponse.json(
        { 
          error: `Không thể xóa danh mục này vì đang chứa ${count} mục (bài viết, tài nguyên hoặc sản phẩm). Vui lòng chuyển các mục này sang danh mục khác trước khi xóa.` 
        },
        { status: 400 }
      );
    }

    // Delete category
    await db.category.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa danh mục.' },
      { status: 500 }
    );
  }
}
