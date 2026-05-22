import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Fetch all resources
// Supports query params: type=tool|freebie, categoryId=xxx, featured=true
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

    const resources = await db.projectResource.findMany({
      where: filter,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Fetch resources error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách dự án & tài nguyên.' },
      { status: 500 }
    );
  }
}

// POST: Create a new resource (admin only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Verify unique slug
    const existingSlug = await db.projectResource.findUnique({
      where: { slug }
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Đường dẫn tĩnh (Slug) này đã được sử dụng.' },
        { status: 400 }
      );
    }

    const newResource = await db.projectResource.create({
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

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('Create resource error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo dự án & tài nguyên mới.' },
      { status: 500 }
    );
  }
}
