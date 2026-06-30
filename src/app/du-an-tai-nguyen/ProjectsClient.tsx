'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Download, Sparkles, Folder, ArrowRight } from 'lucide-react';
import FreebieModal from '@/components/FreebieModal';

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
  const defaultCategory = categories[0]?.slug || '';
  const [filterType, setFilterType] = useState<'tool' | 'freebie'>('tool');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState<ProjectResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, selectedCategory]);

  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      const matchesType = item.type === filterType;
      const matchesCategory = item.category?.slug === selectedCategory;
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

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-10">
      {/* Premium Filter Toolbar */}
      <div className="flex flex-col gap-6 bg-cream/70 backdrop-blur-xl p-6 rounded-3xl border border-olive/15 shadow-sm">
        {/* Row 1: Segmented Control */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex p-1 rounded-xl bg-sand/30 border border-olive/10 w-full md:w-auto max-w-lg">
            <button
              onClick={() => setFilterType('tool')}
              className={`flex-1 md:flex-initial text-xs font-bold px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                filterType === 'tool'
                  ? 'bg-olive text-cream shadow-xs'
                  : 'bg-transparent text-stone-600 hover:text-olive'
              }`}
            >
              Công cụ khuyên dùng
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${filterType === 'tool' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550 border border-stone-200'}`}>
                {counts.tools}
              </span>
            </button>
            <button
              onClick={() => setFilterType('freebie')}
              className={`flex-1 md:flex-initial text-xs font-bold px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                filterType === 'freebie'
                  ? 'bg-olive text-cream shadow-xs'
                  : 'bg-transparent text-stone-600 hover:text-olive'
              }`}
            >
              Tài nguyên miễn phí
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${filterType === 'freebie' ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-550 border border-stone-200'}`}>
                {counts.freebies}
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-450 font-medium">
            <Sparkles className="w-4 h-4 text-olive animate-pulse" />
            <span>Sắp xếp theo thứ tự mới nhất</span>
          </div>
        </div>

        {/* Row 2: Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-olive/10">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold mr-2 flex items-center gap-1.5 shrink-0">
              <Folder className="w-3.5 h-3.5 text-olive" /> Bộ lọc danh mục:
            </span>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-olive text-cream shadow-xs'
                    : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/30 hover:text-olive'
                }`}
              >
                {cat.name}
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  selectedCategory === cat.slug ? 'bg-cream/20 text-cream' : 'bg-sand text-stone-400 border border-stone-200'
                }`}>
                  {counts.catCounts[cat.slug] || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Resources */}
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
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((item) => (
              <div 
                key={item.id}
                className="flex flex-col rounded-3xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/25 hover:bg-cream hover:shadow-[0_15px_35px_rgba(94,100,74,0.07)] hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Cover image (Clean representation) */}
                <div className="relative h-48 w-full overflow-hidden bg-sand">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                    className="object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                </div>

                {/* Info & Content Area */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Meta Labels */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                      item.type === 'tool' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.type === 'tool' ? '🔧 Công cụ' : '🎁 Quà tặng'}
                    </span>
                    
                    {item.category && (
                      <span className="text-[9px] font-extrabold text-stone-500 bg-sand/60 px-2.5 py-1 rounded-md uppercase tracking-wider border border-stone-250">
                        {item.category.name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-stone-850 text-base leading-snug group-hover:text-olive transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-stone-550 text-xs leading-relaxed font-sans line-clamp-3 text-justify">
                    {item.description}
                  </p>
                  
                  {/* Clean styled buttons */}
                  <div className="mt-auto pt-4 border-t border-olive/5">
                    {item.type === 'tool' ? (
                      <a 
                        href={item.url} 
                        target={item.url.startsWith('http') ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full py-2.5 px-4 text-xs font-bold text-olive hover:text-cream border border-olive/20 hover:bg-olive rounded-xl shadow-xs transition-all duration-300 cursor-pointer"
                      >
                        <span>Khám Phá Công Cụ</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          setSelectedResource(item);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-between w-full py-2.5 px-4 text-xs font-bold text-cream bg-olive hover:bg-olive-dark rounded-xl shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <span>Tải Miễn Phí 🎁</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
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
      {/* Freebie Modal */}
      <FreebieModal 
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResource(null);
        }}
      />
    </div>
  );
}
