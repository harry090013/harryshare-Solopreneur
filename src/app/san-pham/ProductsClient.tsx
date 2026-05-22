'use client';

import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter products by active tab and selected category
  const filteredProducts = initialProducts.filter(prod => {
    const matchesTab = prod.type === activeTab;
    const matchesCategory = selectedCategory === 'all' || prod.category?.slug === selectedCategory;
    return matchesTab && matchesCategory;
  });

  // Format price
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs Switcher & Categories Toolbar */}
      <div className="flex flex-col gap-5 bg-cream/70 backdrop-blur-md p-5 rounded-2xl border border-olive/10 shadow-xs">
        {/* Tab switchers */}
        <div className="flex justify-between items-center w-full max-w-md mx-auto p-1 rounded-xl bg-sand/40 border border-olive/5">
          <button
            onClick={() => {
              setActiveTab('main');
              setSelectedCategory('all');
            }}
            className={`flex-1 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'main'
                ? 'bg-olive text-cream shadow-sm font-bold'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Sản phẩm của mình
          </button>
          <button
            onClick={() => {
              setActiveTab('affiliate');
              setSelectedCategory('all');
            }}
            className={`flex-1 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'affiliate'
                ? 'bg-olive text-cream shadow-sm font-bold'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Sản phẩm giới thiệu (Affiliate)
          </button>
        </div>

        {/* Categories Chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center items-center pt-3 border-t border-olive/5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Lọc danh mục:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-olive text-cream shadow-sm'
                  : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/30 hover:text-olive'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-olive text-cream shadow-sm'
                    : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/30 hover:text-olive'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Display */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-olive/10 bg-cream/30 rounded-2xl flex flex-col items-center gap-2">
          <Sparkles className="w-8 h-8 text-stone-400" />
          <p className="text-stone-500 text-sm font-medium">Chưa có sản phẩm nào thuộc bộ lọc này.</p>
          <p className="text-xs text-stone-400">Harry sẽ cập nhật thêm sản phẩm chất lượng sớm nhất!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id}
              className="flex flex-col rounded-2xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 hover:bg-cream hover:shadow-lg transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-56 w-full overflow-hidden bg-sand">
                <Image 
                  src={prod.image || 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80'} 
                  alt={prod.title} 
                  fill 
                  className="object-cover group-hover:scale-102 transition-transform duration-500" 
                />
                
                {/* Labels */}
                {prod.featured && (
                  <div className="absolute top-3 left-3 bg-olive text-cream px-2.5 py-1 rounded-md text-[9px] font-bold border border-olive/10 shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Nổi bật
                  </div>
                )}
                
                {prod.category && (
                  <div className="absolute bottom-3 left-3 bg-stone-850/95 text-cream px-2.5 py-1 rounded-md text-[9px] font-bold border border-stone-800 shadow-xs uppercase tracking-wider">
                    {prod.category.name}
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-cream/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-olive border border-olive/10 shadow-sm font-serif">
                  {formatPrice(prod.price)}
                </div>
              </div>

              {/* Content info */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-serif text-lg font-bold text-stone-850 group-hover:text-olive transition-colors leading-snug line-clamp-1">
                  {prod.title}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed font-sans line-clamp-3">
                  {prod.description}
                </p>

                {/* Actions */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  {prod.type === 'main' ? (
                    <Link 
                      href={`/san-pham/${prod.slug}`}
                      className="text-xs font-bold text-olive tracking-widest uppercase flex items-center gap-1.5 cursor-pointer hover:text-olive-dark transition-colors"
                    >
                      Chi tiết & Đặt mua
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
                          className="text-xs font-bold text-olive tracking-widest uppercase flex items-center gap-1.5 cursor-pointer hover:text-olive-dark transition-colors"
                        >
                          Mua ngay
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
