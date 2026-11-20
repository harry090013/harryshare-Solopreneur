'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error boundary caught:', error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-olive">
          Có trục trặc kỹ thuật tạm thời
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-850 leading-tight">
          Rất tiếc, trang này chưa thể hiển thị lúc này
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mt-1">
          Hệ thống vừa gặp một sự cố nhỏ trong quá trình tải dữ liệu. Bạn hãy thử tải lại trang hoặc quay về trang chủ nhé.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-dark transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Thử tải lại
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive/15 bg-cream text-stone-700 text-sm font-semibold hover:border-olive/35 hover:text-olive transition-all"
        >
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
