import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Fetch all orders (admin only)
export async function GET() {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await db.productOrder.findMany({
      include: {
        product: {
          select: {
            title: true,
            slug: true,
            price: true,
            image: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải danh sách đơn hàng.' },
      { status: 500 }
    );
  }
}

// POST: Create a new order (public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerName, customerEmail, customerPhone, note } = body;

    if (!productId || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Họ tên, Email và Số điện thoại liên hệ.' },
        { status: 400 }
      );
    }

    // Verify product exists and is of type "main"
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại.' }, { status: 404 });
    }

    if (product.type !== 'main') {
      return NextResponse.json(
        { error: 'Sản phẩm này là liên kết affiliate và không thể đặt mua trực tiếp.' },
        { status: 400 }
      );
    }

    // Create order
    const order = await db.productOrder.create({
      data: {
        productId,
        customerName,
        customerEmail,
        customerPhone,
        note: note || '',
        status: 'pending' // pending, completed, cancelled
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi đơn đặt hàng. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
