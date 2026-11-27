import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import FileConverterStudio from './FileConverterStudio';
import NewsletterCallout from '@/components/NewsletterCallout';

export const metadata: Metadata = {
  title: 'Trung tâm Chuyển đổi File & Media Miễn phí (PDF, Word, MP3 → SRT)',
  description:
    'Bộ công cụ chuyển đổi file miễn phí của HarryShare: đổi PDF sang Word, Word sang PDF, gộp/tách PDF, Ảnh sang PDF, tách lời bài hát MP3 sang phụ đề SRT bằng AI, tách âm thanh từ video và chuyển đổi CSV/JSON/Markdown.',
  alternates: { canonical: '/du-an-tai-nguyen/chuyen-doi-file' },
  openGraph: {
    title: 'Trung tâm Chuyển đổi File & Media Miễn phí | HarryShare',
    description:
      'PDF ↔ Word, Gộp/Tách PDF, Ảnh ↔ PDF, MP3 → Lyric SRT bằng AI, Tách âm thanh Video & Ảnh bìa HD YouTube miễn phí.',
    url: 'https://harryshare.vn/du-an-tai-nguyen/chuyen-doi-file',
  },
};

export default function FileConverterPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-8 animate-slide-up">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/du-an-tai-nguyen"
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-olive uppercase tracking-widest transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dự án &amp; Tài nguyên
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-olive bg-olive/5 border border-olive/15 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Ưu tiên xử lý cục bộ trên trình duyệt • Bảo mật file
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          Công cụ miễn phí HarryShare
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-850 leading-tight">
          Chuyển đổi File &amp; Media Đa Năng
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Đổi <strong>PDF ↔ Word</strong>, gộp/tách PDF, chuyển <strong>Ảnh ↔ PDF</strong>, tách <strong>MP3 sang phụ đề Lyric (.srt)</strong> bằng AI hoặc đồng bộ thủ công, trích xuất âm thanh từ video và chuyển đổi nhanh <strong>Markdown / HTML / CSV / JSON</strong> — gọn gàng, không quảng cáo rối mắt.
        </p>
      </div>

      {/* Main Interactive Studio */}
      <FileConverterStudio />

      {/* Newsletter Callout */}
      <NewsletterCallout />
    </div>
  );
}
