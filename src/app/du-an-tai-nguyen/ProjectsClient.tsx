'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Download, Sparkles } from 'lucide-react';

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

  const filteredItems = initialItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = selectedCategory === 'all' || item.category?.slug === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 bg-cream/70 backdrop-blur-md p-4 rounded-2xl border border-olive/10 shadow-xs">
        {/* Row 1: Type Selection */}
        <div className="flex justify-between items-center w-full max-w-md mx-auto p-1 rounded-xl bg-sand/40 border border-olive/5">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-olive text-cream shadow-sm'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Tất cả loại
          </button>
          <button
            onClick={() => setFilterType('tool')}
            className={`flex-1 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
              filterType === 'tool'
                ? 'bg-olive text-cream shadow-sm'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Công cụ khuyên dùng
          </button>
          <button
            onClick={() => setFilterType('freebie')}
            className={`flex-1 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
              filterType === 'freebie'
                ? 'bg-olive text-cream shadow-sm'
                : 'bg-transparent text-stone-600 hover:text-olive'
            }`}
          >
            Tài nguyên miễn phí
          </button>
        </div>

        {/* Row 2: Category Chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center items-center pt-2 border-t border-olive/5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mr-1">
              Danh mục:
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

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-olive/10 bg-cream/30 rounded-2xl flex flex-col items-center gap-2">
          <Sparkles className="w-8 h-8 text-stone-400" />
          <p className="text-stone-500 text-sm font-medium">Hiện tại chưa có tài nguyên nào khớp bộ lọc này.</p>
          <p className="text-xs text-stone-400">Harry đang chuẩn bị thêm nhiều nội dung tuyệt vời mới. Hãy đón xem nhé!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col rounded-2xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 hover:bg-cream hover:shadow-lg transition-all group"
            >
              {/* Cover image */}
              <div className="relative h-44 w-full overflow-hidden bg-sand">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                  className="object-cover" 
                />
                <div className="absolute top-3 left-3 bg-cream/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-olive border border-olive/10 shadow-xs uppercase tracking-wider">
                  {item.type === 'tool' ? 'Công cụ khuyên dùng' : 'Tài nguyên miễn phí'}
                </div>
                {item.category && (
                  <div className="absolute bottom-3 left-3 bg-stone-850/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-bold text-cream border border-cream/10 shadow-xs uppercase tracking-wider">
                    {item.category.name}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-serif font-bold text-stone-850 leading-snug group-hover:text-olive transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-sans line-clamp-2">
                  {item.description}
                </p>
                
                <a 
                  href={item.url} 
                  target={item.url.startsWith('http') ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-olive uppercase tracking-widest mt-auto pt-4 group-hover:text-olive-dark transition-colors"
                >
                  {item.type === 'tool' ? (
                    <>
                      Khám phá công cụ
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Tải tài liệu ngay
                      <Download className="w-3.5 h-3.5" />
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
