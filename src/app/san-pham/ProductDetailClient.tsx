'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ExternalLink, Sparkles, X, ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: number | null;
  image: string;
  type: string; // "main" or "affiliate"
  affiliateUrl: string | null;
  featured: boolean;
  category?: Category;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi gửi đơn hàng.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setNote('');
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-8 animate-slide-up">
      {/* Back and Category crumbs */}
      <div className="flex justify-between items-center">
        <Link href="/san-pham" className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-olive uppercase tracking-widest transition-colors cursor-pointer w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> Cửa hàng
        </Link>
        {product.category && (
          <span className="text-xs font-bold text-olive bg-olive/5 border border-olive/10 rounded-lg px-3 py-1 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column: Image & Call To Action */}
        <div className="md:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="relative h-64 sm:h-80 md:h-72 w-full rounded-2xl overflow-hidden border border-olive/10 shadow-md bg-sand">
            <Image 
              src={product.image || 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80'} 
              alt={product.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 480px"
              className="object-cover" 
            />
            {product.featured && (
              <div className="absolute top-3 left-3 bg-olive text-cream px-2.5 py-1 rounded-md text-[9px] font-bold border border-olive/10 shadow-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Nổi bật
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-olive/5 pb-3">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Giá bán</span>
              <span className="font-serif text-xl font-black text-olive">{formatPrice(product.price)}</span>
            </div>

            {product.type === 'main' ? (
              <button
                onClick={() => {
                  setSuccess(false);
                  setError('');
                  setIsModalOpen(true);
                }}
                className="w-full bg-olive text-cream hover:bg-olive-dark py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Đặt mua sản phẩm
              </button>
            ) : (
              product.affiliateUrl && (
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-olive text-cream hover:bg-olive-dark py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Mua tại đối tác <ExternalLink className="w-4 h-4" />
                </a>
              )
            )}
          </div>
        </div>

        {/* Right Column: Descriptions & Detailed Review */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-850 leading-tight">
              {product.title}
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed italic border-l-2 border-olive/20 pl-3">
              {product.description}
            </p>
          </div>

          <div className="h-px bg-olive/10 w-full" />

          {/* Markdown detail rendering */}
          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-850 prose-p:text-stone-700 prose-p:leading-relaxed prose-a:text-olive hover:prose-a:text-olive-dark prose-a:font-semibold font-sans text-stone-700 text-sm sm:text-base flex flex-col gap-4">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-xl font-bold font-serif text-stone-850 mt-6 mb-3 leading-snug border-b border-olive/5 pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold font-serif text-stone-850 mt-4 mb-2 leading-snug" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-3 text-stone-700 text-justify" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-olive bg-sand/30 pl-4 py-1.5 my-3 rounded-r-lg font-serif italic text-stone-600" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 flex flex-col gap-1 text-stone-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 flex flex-col gap-1 text-stone-700" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed text-justify" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-stone-850" {...props} />,
                a: ({node, ...props}) => <a className="text-olive hover:text-olive-dark font-medium underline underline-offset-4 cursor-pointer" {...props} />,
              }}
            >
              {product.content || '_Hiện tại sản phẩm chưa có bài đánh giá hoặc thông tin chi tiết thêm._'}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-cream rounded-2xl border border-olive/15 shadow-2xl p-6 flex flex-col gap-4 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-olive/10 pb-3">
              <div className="flex flex-col">
                <h3 className="font-serif font-bold text-stone-850">Phiếu đặt mua hàng</h3>
                <span className="text-[10px] text-stone-400 font-semibold line-clamp-1">{product.title}</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-sand/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {success ? (
              <div className="flex flex-col items-center text-center gap-3 py-6 animate-slide-up">
                <CheckCircle className="w-16 h-16 text-olive" />
                <h4 className="font-serif font-bold text-lg text-stone-850">Đặt hàng thành công!</h4>
                <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                  Cảm ơn bạn đã tin tưởng ủng hộ. Harry đã nhận được yêu cầu đặt mua của bạn và sẽ chủ động liên hệ lại qua Số điện thoại / Email sớm nhất.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 bg-olive text-cream hover:bg-olive-dark px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
                <p className="text-stone-500 text-xs leading-relaxed">
                  Vui lòng điền thông tin liên hệ của bạn bên dưới. Harry sẽ trực tiếp xử lý đơn hàng và liên hệ với bạn trong vòng 24h.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg font-medium">
                    {error}
                  </div>
                )}

                {/* Form fields */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Họ & tên *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-olive/10 bg-sand/20 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@cua-ban.com"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-olive/10 bg-sand/20 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-olive/10 bg-sand/20 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Ghi chú thêm</label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Yêu cầu riêng, lời nhắn, thời gian có thể nghe điện thoại..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-olive/10 bg-sand/20 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all resize-none"
                  />
                </div>

                {/* Form actions */}
                <div className="flex gap-3 justify-end pt-3 border-t border-olive/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-transparent hover:bg-sand/30 text-stone-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-olive text-cream hover:bg-olive-dark text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xử lý...
                      </>
                    ) : (
                      'Gửi yêu cầu'
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
