import React from 'react';
import ContactsClient from './ContactsClient';
import { db } from '@/lib/db';
import { Mail } from 'lucide-react';

export const revalidate = 0;

export default async function AdminContactsPage() {
  let contacts: any[] = [];

  try {
    contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error('Failed to query contacts in admin page:', err);
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-1.5 text-left">
        <h1 className="font-serif text-3xl font-extrabold text-stone-850 flex items-center gap-2.5">
          <Mail className="w-8 h-8 text-olive shrink-0" />
          Hộp thư Liên hệ
        </h1>
        <p className="text-stone-500 text-sm">Xem và quản lý tất cả tin nhắn, thắc mắc được gửi từ độc giả.</p>
      </div>

      <ContactsClient initialContacts={contacts} />
    </div>
  );
}
