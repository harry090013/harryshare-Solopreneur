'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileText, BarChart2, Eye, Volume2 } from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

export default function WordCounterPage() {
  const [text, setText] = useState<string>('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readTime: 0,
        speakTime: 0
      };
    }

    // Word count (split by spaces and filter empty strings)
    const wordsArray = trimmed.split(/\s+/);
    const wordsCount = wordsArray.length;

    // Characters counts
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;

    // Sentences count (split by punctuation: . ! ?)
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Paragraphs count (split by double newlines or single newlines containing spaces)
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Read time (average 200 words per minute for Vietnamese)
    const readTime = Math.ceil(wordsCount / 200);

    // Speak time (average 130 words per minute)
    const speakTime = Math.ceil(wordsCount / 130);

    return {
      words: wordsCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readTime,
      speakTime
    };
  }, [text]);

  const keywordDensity = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return [];

    // Simple stop words to filter out for cleaner SEO results
    const vietnameseStopWords = new Set([
      'và', 'là', 'của', 'để', 'có', 'trong', 'một', 'được', 'cho', 'này', 'với',
      'đang', 'khi', 'các', 'những', 'ra', 'lại', 'về', 'nhưng', 'cũng', 'đã',
      'sẽ', 'từ', 'lên', 'đi', 'đến', 'làm', 'như', 'bản', 'mình', 'bạn', 'họ',
      'thì', 'mà', 'nếu', 'chỉ', 'nơi', 'cái', 'sự', 'việc', 'đó'
    ]);

    // Split words, clean punctuation, convert to lowercase
    const words = trimmed
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !vietnameseStopWords.has(w));

    const counts: Record<string, number> = {};
    words.forEach(w => {
      counts[w] = (counts[w] || 0) + 1;
    });

    const totalFilteredWords = words.length || 1;

    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / totalFilteredWords) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [text]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-8 animate-slide-up">
      {/* Back button */}
      <Link 
        href="/du-an-tai-nguyen" 
        className="flex items-center gap-2 text-stone-500 hover:text-olive transition-colors text-xs font-semibold w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Dự án & Tài nguyên</span>
      </Link>

      {/* Header */}
      <div className="text-left flex flex-col gap-2">
        <span className="text-[10px] font-bold text-olive uppercase tracking-widest bg-olive/5 px-2.5 py-1 rounded-full w-fit flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-olive animate-pulse" />
          Tiện ích miễn phí
        </span>
        <h1 className="font-serif text-3xl font-black text-stone-850">
          Đếm từ & Phân tích từ khóa SEO
        </h1>
        <p className="text-stone-500 text-xs">
          Công cụ phân tích thời gian thực: số lượng từ, ký tự, câu, đoạn văn, tính toán thời gian đọc/thuyết trình và thống kê mật độ từ khóa SEO hữu ích cho người làm sáng tạo nội dung.
        </p>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-cream/40 border border-olive/10 rounded-2xl p-5 backdrop-blur-sm shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-olive" />
                Văn bản cần phân tích
              </span>
              {text.length > 0 && (
                <button
                  onClick={() => setText('')}
                  className="text-red-650 hover:text-red-750 cursor-pointer text-[10px]"
                >
                  Xóa toàn bộ
                </button>
              )}
            </div>
            <textarea
              placeholder="Dán hoặc nhập văn bản của bạn tại đây để bắt đầu phân tích thời gian thực..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[300px] border border-olive/10 rounded-xl p-4 bg-cream text-stone-700 text-xs leading-relaxed focus:outline-none focus:border-olive/35 focus:ring-1 focus:ring-olive/30 transition-all resize-y placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Sidebar Stats Area */}
        <div className="flex flex-col gap-6">
          {/* Quick Stats Card */}
          <div className="bg-sand/30 border border-olive/10 rounded-2xl p-5 backdrop-blur-sm shadow-sm flex flex-col gap-4">
            <h3 className="text-stone-850 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-olive" />
              Thống kê nhanh
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream/55 border border-olive/5 rounded-xl p-3.5 flex flex-col items-center">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Số Từ</span>
                <span className="text-xl font-black text-olive font-mono mt-1">{stats.words}</span>
              </div>
              <div className="bg-cream/55 border border-olive/5 rounded-xl p-3.5 flex flex-col items-center">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Ký Tự</span>
                <span className="text-xl font-black text-olive font-mono mt-1">{stats.charsWithSpaces}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-2 text-xs border-t border-olive/10 pt-3">
              <div className="flex justify-between">
                <span className="text-stone-500">Ký tự (không khoảng trắng):</span>
                <span className="font-mono text-stone-800 font-bold">{stats.charsNoSpaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Số câu:</span>
                <span className="font-mono text-stone-800 font-bold">{stats.sentences}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Số đoạn văn:</span>
                <span className="font-mono text-stone-800 font-bold">{stats.paragraphs}</span>
              </div>
            </div>

            {/* Reading and speaking time estimators */}
            <div className="border-t border-olive/10 pt-3.5 flex flex-col gap-2.5">
              <div className="flex items-center gap-3 text-stone-600">
                <Eye className="w-4 h-4 text-olive shrink-0" />
                <span className="text-[10px] leading-snug">Thời gian đọc ước tính: <strong className="text-xs text-stone-800 font-mono font-bold">{stats.readTime} phút</strong></span>
              </div>
              <div className="flex items-center gap-3 text-stone-600">
                <Volume2 className="w-4 h-4 text-olive shrink-0" />
                <span className="text-[10px] leading-snug">Thời gian thuyết trình: <strong className="text-xs text-stone-800 font-mono font-bold">{stats.speakTime} phút</strong></span>
              </div>
            </div>
          </div>

          {/* Keyword Density Card */}
          <div className="bg-sand/30 border border-olive/10 rounded-2xl p-5 backdrop-blur-sm shadow-sm flex flex-col gap-4 flex-1">
            <h3 className="text-stone-850 text-xs font-bold uppercase tracking-wider">
              Mật độ từ khóa SEO (Top 10)
            </h3>
            
            {keywordDensity.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-[10px] flex-1 flex items-center justify-center border border-dashed border-olive/10 rounded-xl bg-cream/10">
                Nhập văn bản để xem mật độ từ khóa.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {keywordDensity.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center text-stone-700">
                      <span className="font-mono font-bold bg-olive/5 px-2 py-0.5 rounded border border-olive/10 text-[10px]">{item.word}</span>
                      <span className="font-mono text-[10px] text-stone-400">{item.count} lần ({item.percentage}%)</span>
                    </div>
                    {/* Bar visual indicator */}
                    <div className="w-full h-1 bg-olive/5 rounded-full overflow-hidden">
                      <div className="bg-olive h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
