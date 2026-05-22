import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET: Retrieve all settings (admin & public can access, but settings are mostly public anyway)
export async function GET() {
  try {
    let homepageSetting = await db.homepageSetting.findUnique({
      where: { id: 'hero-setting' }
    });
    if (!homepageSetting) {
      homepageSetting = await db.homepageSetting.create({
        data: { id: 'hero-setting' }
      });
    }

    let aboutSetting = await db.aboutSetting.findUnique({
      where: { id: 'about-setting' }
    });
    if (!aboutSetting) {
      aboutSetting = await db.aboutSetting.create({
        data: { id: 'about-setting' }
      });
    }

    return NextResponse.json({
      homepageSetting,
      aboutSetting
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải cài đặt.' },
      { status: 500 }
    );
  }
}

// PUT: Update settings (admin only)
export async function PUT(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body; // type is 'homepage' or 'about'

    if (type === 'homepage') {
      const updated = await db.homepageSetting.upsert({
        where: { id: 'hero-setting' },
        update: {
          welcomeText: data.welcomeText,
          title: data.title,
          description: data.description,
          pillar1Title: data.pillar1Title,
          pillar1Desc: data.pillar1Desc,
          pillar2Title: data.pillar2Title,
          pillar2Desc: data.pillar2Desc,
          pillar3Title: data.pillar3Title,
          pillar3Desc: data.pillar3Desc
        },
        create: {
          id: 'hero-setting',
          welcomeText: data.welcomeText,
          title: data.title,
          description: data.description,
          pillar1Title: data.pillar1Title,
          pillar1Desc: data.pillar1Desc,
          pillar2Title: data.pillar2Title,
          pillar2Desc: data.pillar2Desc,
          pillar3Title: data.pillar3Title,
          pillar3Desc: data.pillar3Desc
        }
      });
      return NextResponse.json(updated);
    } else if (type === 'about') {
      const updated = await db.aboutSetting.upsert({
        where: { id: 'about-setting' },
        update: {
          title: data.title,
          subtitle: data.subtitle,
          avatarUrl: data.avatarUrl,
          description: data.description
        },
        create: {
          id: 'about-setting',
          title: data.title,
          subtitle: data.subtitle,
          avatarUrl: data.avatarUrl,
          description: data.description
        }
      });
      return NextResponse.json(updated);
    } else {
      return NextResponse.json({ error: 'Loại cài đặt không hợp lệ' }, { status: 400 });
    }
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật cài đặt.' },
      { status: 500 }
    );
  }
}
