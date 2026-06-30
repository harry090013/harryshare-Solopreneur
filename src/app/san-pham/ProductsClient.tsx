'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ExternalLink, Tag } from 'lucide-react';

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
  price: number | null;
  image: string;
  type: string; // "main" or "affiliate"
  affiliateUrl: string | null;
  featured: boolean;
  category?: Category;
}

export default function ProductsClient({ 
  initialProducts,
  categories = []
}: { 
  initialProducts: Product[];
  categories?: Category[];
}) {
  const [activeTab, setActiveTab] = useState<'main' | 'affiliate'>('main');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subsStatus, setSubsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subsMessage, setSubsMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Filter categories that have items of the current activeTab
  const visibleCategories = useMemo(() => {
    return categories.filter(cat => {
      return initialProducts.some(p => p.type === activeTab && p.category?.slug === cat.slug);
    });
  }, [categories, initialProducts, activeTab]);

  // Sync selectedCategory when visibleCategories change
  useEffect(() => {
    if (visibleCategories.length > 0) {
      const isStillVisible = visibleCategories.some(cat => cat.slug === selectedCategory);
      if (!isStillVisible) {
        setSelectedCategory(visibleCategories[0].slug);
      }
    } else {
      setSelectedCategory('');
    }
  }, [visibleCategories, selectedCategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubsStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubsStatus('success');
        setNewsletterEmail('');
        setSubsMessage('Đăng ký nhận tin thành công! Cảm ơn bạn.');
        if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }
      } else {
        setSubsStatus('error');
        setSubsMessage(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      setSubsStatus('error');
      setSubsMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    }
  };

  // Filter products by active tab and selected category
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(prod => {
      const matchesTab = prod.type === activeTab;
      const matchesCategory = prod.category?.slug === selectedCategory;
      return matchesTab && matchesCategory;
    });
  }, [initialProducts, activeTab, selectedCategory]);

  // Format price
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Count helper
  const counts = useMemo(() => {
    const main = initialProducts.filter(p => p.type === 'main').length;
    const affiliate = initialProducts.filter(p => p.type === 'affiliate').length;

    const catCounts: Record<string, number> = {};
    categories.forEach(cat => {
      catCounts[cat.slug] = initialProducts.filter(p => p.type === activeTab && p.category?.slug === cat.slug).length;
    });

    return { main, affiliate, catCounts };
  }, [initialProducts, categories, activeTab]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs Switcher & Categories Toolbar */}
      <div className="flex flex-col gap-5 bg-cream/80 backdrop-blur-md p-5 rounded-2xl border border-olive/10 shadow-xs">
        {/* Tab switchers */}
        <div className="flex justify-between items-center w-full max-w-lg mx-auto p-1 rounded-xl bg-sand/45 border border-olive/5">
          <button
            onClick={() => {
              setActiveTab('main');
            }}
            className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'main'
                ? 'bg-olive text-cream shadow-sm font-bold'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Sản phẩm của mình
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'main' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550'}`}>
              {counts.main}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('affiliate');
            }}
            className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'affiliate'
                ? 'bg-olive text-cream shadow-sm font-bold'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Sản phẩm giới thiệu
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'affiliate' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550'}`}>
              {counts.affiliate}
            </span>
          </button>
        </div>

        {/* Categories Chips */}
        {visibleCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center items-center pt-3 border-t border-olive/5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-olive" /> Lọc danh mục:
            </span>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? 'bg-olive text-cream shadow-sm'
                    : 'bg-cream border border-olive/10 text-stone-650 hover:border-olive/30 hover:text-olive'
                }`}
              >
                {cat.name}
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                  selectedCategory === cat.slug ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-400'
                }`}>
                  {counts.catCounts[cat.slug] || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Display */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 px-6 text-center border border-olive/10 bg-cream/70 backdrop-blur-md rounded-3xl flex flex-col items-center gap-6 animate-slide-up max-w-2xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-olive/5 flex items-center justify-center text-olive border border-olive/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          
          <div className="flex flex-col gap-2 max-w-md">
            <h3 className="font-serif text-lg font-bold text-stone-850">
              Chưa có sản phẩm nào thuộc bộ lọc này
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed text-justify">
              Các sản phẩm xịn sò đang được Harry hoàn thiện để sớm ra mắt. Trong lúc chờ đợi, bạn có thể đăng ký Bản tin HarryShare để nhận ngay các tài liệu/checklist độc quyền và được thông báo sớm nhất khi sản phẩm ra mắt nhé!
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md flex flex-col gap-2 mt-2">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                disabled={subsStatus === 'loading'}
                placeholder="Email của bạn..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={subsStatus === 'loading'}
                className="px-5 py-2.5 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap animate-pulse hover:animate-none"
              >
                {subsStatus === 'loading' ? 'Đang gửi...' : 'Nhận tài liệu ngay'}
              </button>
            </div>
            {subsStatus === 'success' && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-[11px] text-olive font-semibold text-center">{subsMessage}</p>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark shadow-sm hover:shadow-md transition-all cursor-pointer w-full text-center"
                  >
                    📥 Tải xuống tài liệu quà tặng
                  </a>
                )}
              </div>
            )}
            {subsStatus === 'error' && (
              <p className="text-[11px] text-red-500 font-semibold text-left">{subsMessage}</p>
            )}
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((prod) => (
              <div 
                key={prod.id}
                className="flex flex-col rounded-3xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/25 hover:bg-cream hover:shadow-[0_15px_35px_rgba(94,100,74,0.07)] hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-56 w-full overflow-hidden bg-sand">
                  <Image 
                    src={prod.image || 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80'} 
                    alt={prod.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Labels */}
                  {prod.featured && (
                    <div className="absolute top-3.5 left-3.5 bg-olive text-cream px-2.5 py-1 rounded-md text-[9px] font-extrabold border border-olive/15 shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Nổi bật
                    </div>
                  )}
                  
                  {prod.category && (
                    <div className="absolute bottom-3.5 left-3.5 bg-stone-850/95 text-cream px-3 py-1 rounded-md text-[9px] font-extrabold border border-stone-800 shadow-xs uppercase tracking-wider">
                      {prod.category.name}
                    </div>
                  )}

                  <div className="absolute bottom-3.5 right-3.5 bg-cream/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-bold text-olive border border-olive/10 shadow-sm font-serif">
                    {formatPrice(prod.price)}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="font-serif text-base font-bold text-stone-850 group-hover:text-olive transition-colors leading-snug line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans line-clamp-3 text-justify">
                    {prod.description}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-olive/5">
                    {prod.type === 'main' ? (
                      <Link 
                        href={`/san-pham/${prod.slug}`}
                        className="text-xs font-bold text-olive tracking-widest uppercase flex items-center gap-1.5 cursor-pointer hover:text-olive-dark transition-all duration-300"
                      >
                        Chi tiết & Đặt mua
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ) : (
                      <>
                        <Link 
                          href={`/san-pham/${prod.slug}`}
                          className="text-xs font-semibold text-stone-500 hover:text-olive cursor-pointer transition-colors"
                        >
                          Xem đánh giá
                        </Link>
                        {prod.affiliateUrl && (
                          <a 
                            href={prod.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-olive tracking-widest uppercase flex items-center gap-1.5 cursor-pointer hover:text-olive-dark transition-all duration-300 w-fit"
                          >
                            Mua ngay
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-olive/10 bg-cream text-xs font-bold text-stone-600 hover:border-olive/30 hover:text-olive disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Trước
              </button>
              
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-olive text-cream shadow-sm'
                        : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/30 hover:text-olive'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl border border-olive/10 bg-cream text-xs font-bold text-stone-600 hover:border-olive/30 hover:text-olive disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
