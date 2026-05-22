import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Retrieve a single product by ID or Slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      },
      include: {
        category: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Fetch single product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải thông tin sản phẩm.' },
      { status: 500 }
    );
  }
}

// PUT: Update product (admin only)
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
    const { title, slug, description, content, price, image, type, affiliateUrl, featured, categoryId } = body;

    if (!title || !slug || !description || !content || !image || !type || !categoryId) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.' },
        { status: 400 }
      );
    }

    if (type !== 'affiliate' && type !== 'main') {
      return NextResponse.json(
        { error: 'Phân loại sản phẩm không hợp lệ (hợp lệ: affiliate, main).' },
        { status: 400 }
      );
    }

    if (type === 'affiliate' && !affiliateUrl) {
      return NextResponse.json(
        { error: 'Sản phẩm affiliate bắt buộc phải có Liên kết affiliate (affiliateUrl).' },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await db.product.findUnique({
      where: { id }
    });
    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });
    }

    // Verify category exists
    const category = await db.category.findFirst({
      where: { id: categoryId, type: 'product' }
    });
    if (!category) {
      return NextResponse.json(
        { error: 'Danh mục sản phẩm không tồn tại hoặc không phù hợp.' },
        { status: 400 }
      );
    }

    // Verify unique slug (excluding current)
    const existingSlug = await db.product.findFirst({
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

    const parsedPrice = price !== undefined && price !== null && price !== '' ? parseFloat(price) : null;

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        price: parsedPrice,
        image,
        type,
        affiliateUrl: type === 'affiliate' ? affiliateUrl : null,
        featured: !!featured,
        categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật thông tin sản phẩm.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete product (admin only)
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

    const product = await db.product.findUnique({
      where: { id }
    });
    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });
    }

    await db.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa sản phẩm.' },
      { status: 500 }
    );
  }
}
