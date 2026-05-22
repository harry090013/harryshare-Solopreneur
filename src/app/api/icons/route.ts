import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: List all suggested icons with 'inUse' state
export async function GET(request: NextRequest) {
  try {
    const icons = await db.icon.findMany({
      orderBy: {
        label: 'asc'
      }
    });

    const topics = await db.topic.findMany({
      select: {
        icon: true
      }
    });

    const usedIconNames = new Set(topics.map(t => t.icon.toLowerCase().trim()));

    const formattedIcons = icons.map(icon => ({
      ...icon,
      inUse: usedIconNames.has(icon.name.toLowerCase().trim())
    }));

    return NextResponse.json(formattedIcons);
  } catch (error: any) {
    console.error('GET /api/icons error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new suggested icon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, label } = body;

    if (!name || !name.trim() || !label || !label.trim()) {
      return NextResponse.json({ error: 'Tên biểu tượng và Tên hiển thị là bắt buộc.' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedLabel = label.trim();

    // Check if duplicate
    const existing = await db.icon.findUnique({
      where: {
        name: trimmedName
      }
    });

    if (existing) {
      return NextResponse.json({ error: `Biểu tượng "${trimmedName}" đã tồn tại trong danh sách.` }, { status: 400 });
    }

    const created = await db.icon.create({
      data: {
        name: trimmedName,
        label: trimmedLabel
      }
    });

    return NextResponse.json({
      ...created,
      inUse: false
    });
  } catch (error: any) {
    console.error('POST /api/icons error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
