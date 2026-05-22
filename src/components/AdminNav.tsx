'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, Layers, Mail, Send, Image as ImageIcon, 
  Briefcase, ShoppingBag, ShoppingCart, MessageSquare, Settings 
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-2">QUẢN TRỊ</p>
      
      <Link href="/admin" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <LayoutDashboard className="w-4 h-4" />
        <span>Tổng quan</span>
      </Link>
      
      <Link href="/admin/categories" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/categories') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Layers className="w-4 h-4" />
        <span>Danh mục</span>
      </Link>

      <Link href="/admin/posts" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/posts') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <BookOpen className="w-4 h-4" />
        <span>Bài viết</span>
      </Link>

      <Link href="/admin/resources" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/resources') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Briefcase className="w-4 h-4" />
        <span>Dự án & Tài nguyên</span>
      </Link>

      <Link href="/admin/products" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/products') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <ShoppingBag className="w-4 h-4" />
        <span>Sản phẩm</span>
      </Link>

      <Link href="/admin/orders" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/orders') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <ShoppingCart className="w-4 h-4" />
        <span>Đơn hàng</span>
      </Link>

      <Link href="/admin/comments" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/comments') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <MessageSquare className="w-4 h-4" />
        <span>Bình luận</span>
      </Link>

      <Link href="/admin/media" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/media') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <ImageIcon className="w-4 h-4" />
        <span>Thư viện ảnh</span>
      </Link>
      
      <Link href="/admin/contacts" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/contacts') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Mail className="w-4 h-4" />
        <span>Liên hệ</span>
      </Link>
      
      <Link href="/admin/subscribers" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/subscribers') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Send className="w-4 h-4" />
        <span>Newsletter</span>
      </Link>

      <Link href="/admin/settings" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/admin/settings') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Settings className="w-4 h-4" />
        <span>Cấu hình website</span>
      </Link>
    </nav>
  );
}
