import React from 'react';
import SubscribersClient from './SubscribersClient';
import { db } from '@/lib/db';
import { Send } from 'lucide-react';

export const revalidate = 0;

export default async function AdminSubscribersPage() {
  let subscribers: any[] = [];

  try {
    subscribers = await db.newsletter.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error('Failed to query subscribers in admin page:', err);
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-1.5 text-left">
        <h1 className="font-serif text-3xl font-extrabold text-stone-850 flex items-center gap-2.5">
          <Send className="w-8 h-8 text-olive shrink-0" />
          Newsletter Subscribers
        </h1>
        <p className="text-stone-500 text-sm">Danh sách các email của độc giả đăng ký nhận tin tức và tài nguyên.</p>
      </div>

      <SubscribersClient initialSubscribers={subscribers} />
    </div>
  );
}
