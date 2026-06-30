'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterCallout() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setMessage('Cảm ơn bạn! Đã đăng ký nhận bản tin thành công.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Lỗi kết nối, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="w-full bg-sand/30 border border-olive/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center mt-12 backdrop-blur-sm">
      <div className="text-left flex flex-col gap-1 max-w-lg">
        <h3 className="font-serif text-lg font-bold text-stone-850">
          Nhận thêm tài nguyên & cẩm nang hữu ích từ Harry
        </h3>
        <p className="text-stone-500 text-xs leading-relaxed">
          Đăng ký để không bỏ lỡ các công cụ Web mới, cẩm nang SEO thực chiến, kinh nghiệm Solopreneur chia sẻ mỗi tuần.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col gap-2 shrink-0 min-w-[280px] md:min-w-[340px]">
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-olive text-xs font-semibold bg-olive/5 border border-olive/10 rounded-xl p-3">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all text-stone-700 placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-olive hover:bg-olive-dark text-cream text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <span>Đăng ký</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
