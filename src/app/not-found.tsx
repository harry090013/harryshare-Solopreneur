import React from 'react';
import Link from 'next/link';
import { Compass, Home, BookOpen, FolderGit2, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center gap-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-olive/10 border border-olive/15 flex items-center justify-center text-olive">
        <Compass className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-olive">
          Lỗi 404 • Không tìm thấy trang
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-850 leading-tight">
          Đường dẫn này chưa có mặt ở HarryShare
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mt-1">
          Có thể bài viết đã được đổi địa chỉ, tạm ẩn hoặc đường dẫn bạn nhập chưa chính xác. Bạn có thể chọn một góc nhỏ bên dưới để tiếp tục khám phá nhé.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-dark transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
        <Link
          href="/chia-se"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive/15 bg-cream text-stone-700 text-sm font-semibold hover:border-olive/35 hover:text-olive transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Góc chia sẻ
        </Link>
        <Link
          href="/du-an-tai-nguyen"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive/15 bg-cream text-stone-700 text-sm font-semibold hover:border-olive/35 hover:text-olive transition-all"
        >
          <FolderGit2 className="w-4 h-4" />
          Dự án &amp; Tài nguyên
        </Link>
        <Link
          href="/san-pham"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive/15 bg-cream text-stone-700 text-sm font-semibold hover:border-olive/35 hover:text-olive transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          Sản phẩm
        </Link>
      </div>
    </div>
  );
}
