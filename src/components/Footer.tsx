'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');

  if (pathname?.startsWith('/admin')) {
    return null;
  }
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
        setMessage('Đăng ký nhận tin thành công! Cảm ơn bạn.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    }
  };

  const quickLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Chia sẻ', path: '/chia-se' },
    { name: 'Dự án & Tài nguyên', path: '/du-an-tai-nguyen' },
    { name: 'Sản phẩm', path: '/san-pham' },
    { name: 'Về Harry', path: '/ve-harry' },
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  const topics = [
    { name: 'Tư duy sản phẩm', path: '/chia-se?category=tu-duy-san-pham' },
    { name: 'Thương hiệu cá nhân', path: '/chia-se?category=thuong-hieu-ca-nhan' },
    { name: 'AI & Vibe Coding', path: '/chia-se?category=ai-vibe-coding' },
    { name: 'Hành trình làm nghề', path: '/chia-se?category=hanh-trinh-lam-nghe' },
  ];

  return (
    <footer className="w-full bg-sand/40 border-t border-olive/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-olive/10">
                <Image src="/logo.png" alt="HarryShare Logo" fill className="object-cover" />
              </div>
              <span className="font-serif text-lg font-bold text-olive tracking-wide">HarryShare</span>
            </Link>
            <p className="text-sm text-stone-600 leading-relaxed font-sans max-w-sm">
              HarryShare là góc nhỏ chia sẻ về tư duy sản phẩm, thương hiệu cá nhân, làn sóng AI, vibe coding và câu chuyện chân thực về hành trình làm nghề của Harry.
            </p>
            <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-2">
              © {new Date().getFullYear()} HarryShare. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-none">Liên kết</p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-sm text-stone-600 hover:text-olive transition-colors cursor-pointer">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-none">Chủ đề</p>
            <ul className="flex flex-col gap-2">
              {topics.map((topic) => (
                <li key={topic.path}>
                  <Link href={topic.path} className="text-sm text-stone-600 hover:text-olive transition-colors cursor-pointer">
                    {topic.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-none">Newsletter</p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nhận thông báo bài viết mới nhất và tài nguyên độc quyền trực tiếp vào hòm thư của bạn.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="w-full pl-3 pr-10 py-2 text-sm rounded-xl border border-olive/10 bg-cream/80 focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1 p-1.5 rounded-lg bg-olive text-cream hover:bg-olive-dark transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                  title="Đăng ký"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Message */}
              {status === 'success' && (
                <div className="flex items-center gap-1.5 text-xs text-olive font-medium mt-1 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
