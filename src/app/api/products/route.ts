import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Fetch all products
// Query params: type=affiliate|main, categoryId=xxx, categorySlug=xxx, featured=true
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('categorySlug');
    const featured = searchParams.get('featured');

    const filter: any = {};
    if (type) filter.type = type;
    if (categoryId) filter.categoryId = categoryId;
    if (categorySlug) {
      filter.category = {
        slug: categorySlug
      };
    }
    if (featured === 'true') filter.featured = true;

    const products = await db.product.findMany({
      where: filter,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách sản phẩm.' },
      { status: 500 }
    );
  }
}

// POST: Create a new product (admin only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Verify unique slug
    const existingSlug = await db.product.findUnique({
      where: { slug }
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Đường dẫn tĩnh (Slug) này đã được sử dụng.' },
        { status: 400 }
      );
    }

    const parsedPrice = price !== undefined && price !== null && price !== '' ? parseFloat(price) : null;

    const newProduct = await db.product.create({
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

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo sản phẩm mới.' },
      { status: 500 }
    );
  }
}
