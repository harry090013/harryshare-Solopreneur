import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Retrieve all categories (public, sorted by name)
// Supports optional query parameter: ?type=post|resource|product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const filter: any = {};
    if (type) {
      filter.type = type;
    }

    const categories = await db.category.findMany({
      where: filter,
      include: {
        _count: {
          select: {
            posts: true,
            resources: true,
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách danh mục.' },
      { status: 500 }
    );
  }
}

// POST: Create a new category (admin only)
export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug, description, type, icon } = await request.json();

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Tên danh mục, Đường dẫn tĩnh (Slug) và Phân loại (Type).' },
        { status: 400 }
      );
    }

    const validTypes = ['post', 'resource', 'product'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Phân loại danh mục không hợp lệ (hợp lệ: post, resource, product).' },
        { status: 400 }
      );
    }

    // Verify unique slug for this type
    const existingSlug = await db.category.findFirst({
      where: {
        slug,
        type
      }
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `Đường dẫn tĩnh (Slug) này đã tồn tại trong nhóm "${type}".` },
        { status: 400 }
      );
    }

    // Create category
    const category = await db.category.create({
      data: {
        name,
        slug,
        description: description || '',
        type,
        icon: icon || 'Layers'
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo danh mục mới.' },
      { status: 500 }
    );
  }
}
