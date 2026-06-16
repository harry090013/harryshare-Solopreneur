'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LienHeClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '' // Honeypot field to block spam bots
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          website: ''
        });
        setStatusMsg('Tin nhắn của bạn đã được gửi đi thành công! Harry sẽ sớm phản hồi bạn nhé.');
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-12 animate-slide-up">
      {/* Header */}
      <div className="text-left max-w-2xl flex flex-col gap-3">
        <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit">
          📬 Gửi thư cho Harry
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-850 leading-tight">
          Liên hệ & Kết nối
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Bạn có ý tưởng hợp tác xây dựng sản phẩm, muốn mời mình tư vấn thương hiệu cá nhân, hay đơn giản chỉ muốn gửi một lời chào làm quen? Hãy điền form bên dưới nhé!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side info */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-6 p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md">
            <h3 className="font-serif text-lg font-bold text-stone-855 border-b border-olive/5 pb-2">
              Thông tin liên hệ
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-stone-600">
                <Mail className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email</span>
                  <a href="mailto:stshieu09@gmail.com" className="text-sm font-medium hover:text-olive transition-colors">
                    stshieu09@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-stone-600">
                <MapPin className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Vị trí</span>
                  <span className="text-sm font-medium">Hồ Chí Minh, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-olive/10 bg-sand/30 text-xs text-stone-500 leading-relaxed font-sans">
            📌 **Lưu ý nhỏ**: Mình thường đọc email và phản hồi các liên hệ vào mỗi buổi sáng thứ Ba và thứ Sáu hàng tuần. Rất cảm ơn sự kiên nhẫn của bạn!
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:col-span-8">
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-8 rounded-3xl border border-olive/10 bg-cream/70 backdrop-blur-md shadow-sm"
          >
            {/* Honeypot field (hidden from humans, visible to bots) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website" className="text-xs font-bold text-stone-500 uppercase tracking-wider">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Số điện thoại <span className="text-stone-400">(Không bắt buộc)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="Hợp tác, Hỏi đáp..."
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Nội dung tin nhắn <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Viết lời nhắn của bạn gửi đến Harry tại đây..."
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="px-4 py-3 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400 resize-y"
              />
            </div>

            {/* Status Feedback */}
            {status === 'success' && (
              <div className="flex items-start gap-2 text-sm text-olive bg-olive/5 border border-olive/15 p-4 rounded-xl animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{statusMsg}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{statusMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 w-full sm:w-fit px-8 py-3 rounded-full bg-olive text-cream font-semibold hover:bg-olive-dark shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 group mt-2"
            >
              {status === 'loading' ? (
                <>Đang gửi...</>
              ) : (
                <>
                  Gửi tin nhắn ngay
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
