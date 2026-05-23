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
    if (href === '/quan-tri-harry') {
      return pathname === '/quan-tri-harry';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-2">QUẢN TRỊ</p>
      
      <Link href="/quan-tri-harry" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <LayoutDashboard className="w-4 h-4" />
        <span>Tổng quan</span>
      </Link>
      
      <Link href="/quan-tri-harry/categories" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/categories') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Layers className="w-4 h-4" />
        <span>Danh mục</span>
      </Link>

      <Link href="/quan-tri-harry/posts" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/posts') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <BookOpen className="w-4 h-4" />
        <span>Bài viết</span>
      </Link>

      <Link href="/quan-tri-harry/resources" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/resources') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Briefcase className="w-4 h-4" />
        <span>Dự án & Tài nguyên</span>
      </Link>

      <Link href="/quan-tri-harry/products" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/products') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <ShoppingBag className="w-4 h-4" />
        <span>Sản phẩm</span>
      </Link>

      <Link href="/quan-tri-harry/orders" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/orders') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <ShoppingCart className="w-4 h-4" />
        <span>Đơn hàng</span>
      </Link>

      <Link href="/quan-tri-harry/comments" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/comments') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <MessageSquare className="w-4 h-4" />
        <span>Bình luận</span>
      </Link>

      <Link href="/quan-tri-harry/media" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/media') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <ImageIcon className="w-4 h-4" />
        <span>Thư viện ảnh</span>
      </Link>
      
      <Link href="/quan-tri-harry/contacts" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/contacts') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Mail className="w-4 h-4" />
        <span>Liên hệ</span>
      </Link>
      
      <Link href="/quan-tri-harry/subscribers" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/subscribers') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Send className="w-4 h-4" />
        <span>Newsletter</span>
      </Link>

      <Link href="/quan-tri-harry/settings" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
        isActiveLink('/quan-tri-harry/settings') ? 'bg-olive/10 text-olive font-semibold shadow-xs' : 'text-stone-600 hover:bg-olive/5 hover:text-olive'
      }`}>
        <Settings className="w-4 h-4" />
        <span>Cấu hình website</span>
      </Link>
    </nav>
  );
}
