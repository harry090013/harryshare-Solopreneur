'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink, Download, Sparkles, Folder } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProjectResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string; // "tool" or "freebie"
  url: string;
  image: string;
  featured: boolean;
  category?: Category;
}

export default function ProjectsClient({ 
  initialItems,
  categories = []
}: { 
  initialItems: ProjectResource[];
  categories?: Category[];
}) {
  const [filterType, setFilterType] = useState<'all' | 'tool' | 'freebie'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesCategory = selectedCategory === 'all' || item.category?.slug === selectedCategory;
      return matchesType && matchesCategory;
    });
  }, [initialItems, filterType, selectedCategory]);

  // Count helper
  const counts = useMemo(() => {
    const total = initialItems.length;
    const tools = initialItems.filter(i => i.type === 'tool').length;
    const freebies = initialItems.filter(i => i.type === 'freebie').length;

    const catCounts: Record<string, number> = {};
    categories.forEach(cat => {
      catCounts[cat.slug] = initialItems.filter(i => i.category?.slug === cat.slug).length;
    });

    return { total, tools, freebies, catCounts };
  }, [initialItems, categories]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-5 bg-cream/80 backdrop-blur-md p-5 rounded-2xl border border-olive/10 shadow-xs">
        {/* Row 1: Type Selection */}
        <div className="flex justify-between items-center w-full max-w-lg mx-auto p-1 rounded-xl bg-sand/45 border border-olive/5">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterType === 'all'
                ? 'bg-olive text-cream shadow-sm'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Tất cả
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterType === 'all' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550'}`}>
              {counts.total}
            </span>
          </button>
          <button
            onClick={() => setFilterType('tool')}
            className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterType === 'tool'
                ? 'bg-olive text-cream shadow-sm'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Công cụ khuyên dùng
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterType === 'tool' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550'}`}>
              {counts.tools}
            </span>
          </button>
          <button
            onClick={() => setFilterType('freebie')}
            className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterType === 'freebie'
                ? 'bg-olive text-cream shadow-sm'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Tài nguyên miễn phí
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterType === 'freebie' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550'}`}>
              {counts.freebies}
            </span>
          </button>
        </div>

        {/* Row 2: Category Chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center items-center pt-3 border-t border-olive/5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mr-1 flex items-center gap-1">
              <Folder className="w-3 h-3 text-olive" /> Danh mục:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-olive text-cream shadow-sm'
                  : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/35 hover:text-olive'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
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

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-olive/20 bg-cream/40 rounded-3xl flex flex-col items-center gap-3 animate-slide-up shadow-xs">
          <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-olive border border-olive/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-stone-750 text-sm font-bold mt-1">Hiện tại chưa có tài nguyên nào khớp bộ lọc này.</p>
          <p className="text-xs text-stone-450 max-w-sm mx-auto leading-relaxed">
            Harry đang chuẩn bị thêm nhiều nội dung, cẩm nang và công cụ tuyệt vời mới. Hãy quay lại xem sớm nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col rounded-3xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/25 hover:bg-cream hover:shadow-[0_15px_35px_rgba(94,100,74,0.07)] hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Cover image */}
              <div className="relative h-48 w-full overflow-hidden bg-sand">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-3.5 left-3.5 bg-cream/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-extrabold text-olive border border-olive/15 shadow-sm uppercase tracking-wider">
                  {item.type === 'tool' ? '🔧 Công cụ' : '🎁 Tài nguyên'}
                </div>
                {item.category && (
                  <div className="absolute bottom-3.5 left-3.5 bg-stone-850/95 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-extrabold text-cream border border-cream/10 shadow-xs uppercase tracking-wider">
                    {item.category.name}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="font-serif font-bold text-stone-850 text-base leading-snug group-hover:text-olive transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-stone-550 text-xs leading-relaxed font-sans line-clamp-3 text-justify">
                  {item.description}
                </p>
                
                <a 
                  href={item.url} 
                  target={item.url.startsWith('http') ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-olive uppercase tracking-widest mt-auto pt-5 group-hover:text-olive-dark transition-all duration-300 w-fit"
                >
                  {item.type === 'tool' ? (
                    <>
                      Khám phá công cụ
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      Tải tài liệu ngay
                      <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
