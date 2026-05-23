'use client';

import React, { useState } from 'react';
import { Mail, MailOpen, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
}

export default function ContactsClient({ initialContacts }: { initialContacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const router = useRouter();

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead })
      });

      if (res.ok) {
        setContacts(prev =>
          prev.map(c => (c.id === id ? { ...c, read: !currentRead } : c))
        );
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to toggle read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thư liên hệ này không?')) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setContacts(prev => prev.filter(c => c.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {contacts.length === 0 ? (
        <div className="py-20 border border-dashed border-olive/10 rounded-2xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
          <Mail className="w-8 h-8 text-stone-400" />
          <p className="text-sm font-semibold">Hòm thư trống.</p>
          <p className="text-xs text-stone-400">Hiện tại chưa nhận được tin nhắn liên hệ nào từ độc giả.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col gap-3 relative ${
                contact.read
                  ? 'bg-cream/40 border-olive/5 text-stone-500'
                  : 'bg-cream border-olive/10 border-l-4 border-l-olive shadow-sm text-stone-850 font-medium'
              }`}
            >
              {/* Header card info */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{contact.name}</span>
                  <span className="text-xs font-medium text-stone-400">{contact.email} {contact.phone && `• ${contact.phone}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mark read button */}
                  <button
                    onClick={() => handleToggleRead(contact.id, contact.read)}
                    className="p-1.5 rounded-lg border border-olive/5 bg-sand/30 text-stone-500 hover:text-olive hover:border-olive/20 transition-all cursor-pointer"
                    title={contact.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                  >
                    {contact.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"
                    title="Xóa tin nhắn này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="text-xs font-serif italic text-stone-600 border-t border-olive/5 pt-2 flex items-center gap-1.5">
                <span>Chủ đề:</span>
                <span className="font-bold text-stone-800">{contact.subject}</span>
              </div>

              {/* Message */}
              <p className="text-xs font-sans text-stone-600 leading-relaxed bg-sand/40 p-4 rounded-xl whitespace-pre-line border border-olive/5">
                {contact.message}
              </p>

              {/* Timestamp */}
              <div className="text-[10px] text-stone-400 font-sans mt-1 text-right">
                Đã gửi vào: {new Date(contact.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
