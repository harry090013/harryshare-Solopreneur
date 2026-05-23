import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { BookOpen, Mail, Send, Calendar, Clock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export const revalidate = 0; // Disable cache for admin dashboard

export default async function AdminDashboardPage() {
  let stats = {
    posts: 0,
    publishedPosts: 0,
    contacts: 0,
    unreadContacts: 0,
    subscribers: 0
  };

  let recentContacts: any[] = [];
  let recentSubscribers: any[] = [];

  try {
    const [
      postsCount,
      pubPostsCount,
      contactsCount,
      unreadContactsCount,
      subsCount,
      contactsList,
      subsList
    ] = await Promise.all([
      db.post.count(),
      db.post.count({ where: { published: true } }),
      db.contact.count(),
      db.contact.count({ where: { read: false } }),
      db.newsletter.count(),
      db.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
      db.newsletter.findMany({ orderBy: { createdAt: 'desc' }, take: 4 })
    ]);

    stats = {
      posts: postsCount,
      publishedPosts: pubPostsCount,
      contacts: contactsCount,
      unreadContacts: unreadContactsCount,
      subscribers: subsCount
    };

    recentContacts = contactsList;
    recentSubscribers = subsList;
  } catch (error) {
    console.error('Prisma query failed on admin dashboard, using dummy statistics:', error);
  }

  const metrics = [
    { name: 'Bài viết', count: stats.posts, sub: `${stats.publishedPosts} đã xuất bản`, icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-600', link: '/admin/posts' },
    { name: 'Liên hệ', count: stats.contacts, sub: `${stats.unreadContacts} tin chưa đọc`, icon: Mail, color: 'bg-amber-500/10 text-amber-600', link: '/admin/contacts' },
    { name: 'Newsletter', count: stats.subscribers, sub: 'Lượt nhận tin tức', icon: Send, color: 'bg-blue-500/10 text-blue-600', link: '/admin/subscribers' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-1.5 text-left">
        <h1 className="font-serif text-3xl font-extrabold text-stone-850">
          Tổng quan Dashboard
        </h1>
        <p className="text-stone-500 text-sm">Chào mừng quay trở lại! Dưới đây là hiện trạng website của bạn.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              href={m.link}
              className="p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">{m.name}</span>
                <span className="font-serif text-3xl font-extrabold text-stone-850 group-hover:text-olive transition-colors">{m.count}</span>
                <span className="text-xs text-stone-500 font-sans">{m.sub}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color} shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Recent Inbox Contacts */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-olive/5 pb-2">
            <h2 className="font-serif text-lg font-bold text-stone-850 flex items-center gap-2">
              <Mail className="w-5 h-5 text-olive" /> Thư liên hệ mới nhất
            </h2>
            <Link href="/admin/contacts" className="text-xs font-bold text-olive flex items-center gap-1 hover:underline">
              Hộp thư <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <div className="py-12 border border-dashed border-olive/10 rounded-2xl text-center bg-cream/30 text-stone-500 text-xs font-medium">
              Không có tin nhắn liên hệ nào.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    contact.read 
                      ? 'bg-cream/40 border-olive/5 text-stone-500' 
                      : 'bg-cream border-olive/10 border-l-4 border-l-olive shadow-2xs text-stone-850 font-medium'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm font-bold">{contact.name} ({contact.email})</span>
                    <span className="text-[10px] text-stone-400 font-sans font-medium">
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <span className="text-xs font-serif italic text-stone-600">Chủ đề: {contact.subject}</span>
                  <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed bg-sand/30 p-2 rounded-lg mt-1">
                    {contact.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Subscribers */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-olive/5 pb-2">
            <h2 className="font-serif text-lg font-bold text-stone-850 flex items-center gap-2">
              <Send className="w-5 h-5 text-olive" /> Nhận tin mới
            </h2>
            <Link href="/admin/subscribers" className="text-xs font-bold text-olive flex items-center gap-1 hover:underline">
              Newsletter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSubscribers.length === 0 ? (
            <div className="py-12 border border-dashed border-olive/10 rounded-2xl text-center bg-cream/30 text-stone-500 text-xs font-medium">
              Chưa có lượt đăng ký nhận tin.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentSubscribers.map((sub) => (
                <div 
                  key={sub.id} 
                  className="p-3.5 rounded-xl border border-olive/5 bg-cream/50 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-stone-700">{sub.email}</span>
                  <span className="text-[10px] text-stone-400 font-sans">
                    {new Date(sub.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
