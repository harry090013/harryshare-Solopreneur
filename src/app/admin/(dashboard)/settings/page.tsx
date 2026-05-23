import React from 'react';
import { db } from '@/lib/db';
import SettingsClient from './SettingsClient';

export const revalidate = 0;

export default async function SettingsPage() {
  let homepageSetting = null;
  let aboutSetting = null;
  let slides = [];
  let timeline = [];

  try {
    const [homeResult, aboutResult, slidesResult, timelineResult] = await Promise.all([
      db.homepageSetting.findUnique({ where: { id: 'hero-setting' } }),
      db.aboutSetting.findUnique({ where: { id: 'about-setting' } }),
      db.heroSlide.findMany({ orderBy: { order: 'asc' } }),
      db.aboutTimeline.findMany({ orderBy: { order: 'asc' } })
    ]);

    homepageSetting = homeResult;
    aboutSetting = aboutResult;
    slides = slidesResult;
    timeline = timelineResult;

    if (!homepageSetting) {
      homepageSetting = await db.homepageSetting.create({
        data: { id: 'hero-setting' }
      });
    }

    if (!aboutSetting) {
      aboutSetting = await db.aboutSetting.create({
        data: { id: 'about-setting' }
      });
    }
  } catch (error) {
    console.error('Error fetching settings for admin:', error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-left">
        <h1 className="font-serif text-3xl font-black text-stone-850">
          Cấu hình website
        </h1>
        <p className="text-stone-500 text-sm">
          Thay đổi nội dung giới thiệu trang chủ, slideshow ảnh, định hình thương hiệu và chặng đường sự nghiệp của Harry.
        </p>
      </div>

      <SettingsClient 
        initialHomepageSetting={homepageSetting}
        initialAboutSetting={aboutSetting}
        initialSlides={slides}
        initialTimeline={timeline}
      />
    </div>
  );
}
