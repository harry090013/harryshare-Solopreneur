'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Mail, Download, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface FreebieModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FreebieModal({ resource, isOpen, onClose }: FreebieModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  if (!isOpen || !resource) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Vui lòng nhập định dạng email hợp lệ.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/freebie-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, resourceId: resource.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      setDownloadUrl(data.downloadUrl);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      setStatus('error');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-cream/95 border border-olive/15 rounded-3xl shadow-2xl flex flex-col animate-slide-up"
      >
        {/* Header/Banner with Cover Image */}
        <div className="relative h-40 w-full overflow-hidden bg-sand">
          <Image 
            src={resource.image} 
            alt={resource.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 512px"
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-850 hover:text-stone-900 transition-all cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="px-6 pb-8 pt-4 flex flex-col gap-5">
          <div>
            <span className="text-[10px] font-extrabold text-olive/80 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sage" /> Nhận tài liệu miễn phí
            </span>
            <h3 className="font-serif font-bold text-stone-850 text-xl leading-snug">
              {resource.title}
            </h3>
            <p className="text-stone-550 text-xs leading-relaxed mt-2 line-clamp-3">
              {resource.description}
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 text-center py-4 bg-sage/10 rounded-2xl border border-olive/10 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center text-olive">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-stone-850">Đăng ký nhận tài liệu thành công!</p>
                <p className="text-xs text-stone-550 px-6 max-w-sm">
                  Cảm ơn bạn đã quan tâm. Link tải đã được kích hoạt trực tiếp bên dưới.
                </p>
                <p className="text-[10px] text-stone-400 italic mt-1 px-6">
                  (Lưu ý: Hệ thống đang chạy ở chế độ tải trực tiếp. Khi cấu hình SMTP được hoàn thiện, link tải sẽ được gửi về hộp thư của bạn).
                </p>
              </div>
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-[80%] py-3 px-5 text-sm font-bold text-cream bg-olive hover:bg-olive-dark rounded-xl shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
              >
                <Download className="w-4.5 h-4.5" />
                Tải Xuống Ngay
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn để nhận link tải..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs bg-sand/40 border border-olive/15 rounded-xl text-stone-850 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive transition-all font-sans"
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-xs animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 text-xs font-bold text-cream bg-olive hover:bg-olive-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Nhận miễn phí →
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-[10px] text-center text-stone-400 leading-normal">
            Bằng việc nhấn nhận tài liệu, bạn cũng đồng ý tham gia bản tin chia sẻ định kỳ từ Harry. Bạn có thể huỷ bất cứ lúc nào.
          </p>
        </div>
      </div>
    </div>
  );
}
