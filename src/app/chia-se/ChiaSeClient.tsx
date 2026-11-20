'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Calendar, Clock, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  readTime: number;
  date: string | Date;
  category: Category;
}

export default function ChiaSeClient({ 
  initialPosts, 
  categories,
  urlCategory = 'all',
  urlSearch = '',
  urlPage = 1
}: { 
  initialPosts: Post[]; 
  categories: Category[];
  urlCategory?: string;
  urlSearch?: string;
  urlPage?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [currentPage, setCurrentPage] = useState(urlPage);

  // Sync category if URL category changes
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  // Sync URL query params for shareable pagination & search
  const updateUrl = (page: number, search: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateUrl(1, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(page, searchTerm);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const filteredPosts = initialPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-8">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-5 bg-cream/70 backdrop-blur-md p-5 rounded-2xl border border-olive/10 shadow-xs">
        {/* Row 1: Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm chia sẻ..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          </div>
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider hidden md:block">
            Sắp xếp theo mới nhất
          </span>
        </div>

        {/* Row 2: Categories Grid (6 columns on desktop, from left to right) */}
        <div className="flex flex-col gap-2.5 border-t border-olive/10 pt-4">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
            Lọc theo chủ đề:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            <Link
              href="/chia-se"
              scroll={false}
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-semibold py-2.5 px-3 sm:px-4 rounded-xl transition-all cursor-pointer text-center truncate ${
                selectedCategory === 'all'
                  ? 'bg-olive text-cream shadow-sm font-bold'
                  : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/30 hover:text-olive'
              }`}
            >
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/chia-se/chu-de/${cat.slug}`}
                scroll={false}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-semibold py-2.5 px-3 sm:px-4 rounded-xl transition-all cursor-pointer text-center truncate ${
                  selectedCategory === cat.slug
                    ? 'bg-olive text-cream shadow-sm font-bold'
                    : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/30 hover:text-olive'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-olive/10 bg-cream/30 rounded-2xl flex flex-col items-center gap-2">
          <BookOpen className="w-8 h-8 text-stone-400" />
          <p className="text-stone-500 text-sm font-medium">Không tìm thấy bài viết nào khớp với bộ lọc.</p>
          <p className="text-xs text-stone-400">Bạn hãy thử thay đổi từ khóa tìm kiếm hoặc lọc danh mục khác xem sao nhé!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {paginatedPosts.map((post) => (
              <article 
                key={post.id}
                className="flex flex-col gap-4 rounded-2xl overflow-hidden border border-olive/10 bg-cream/70 backdrop-blur-md hover:border-olive/30 hover:bg-cream hover:shadow-lg transition-all duration-300 group"
              >
                {/* Cover image */}
                <Link href={`/chia-se/${post.slug}`} className="relative h-48 w-full overflow-hidden block cursor-pointer">
                  <Image 
                    src={post.coverImage} 
                    alt={post.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                    className="object-cover" 
                  />
                  {post.category && (
                    <div className="absolute top-3 left-3 bg-cream/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-olive border border-olive/10 shadow-xs uppercase tracking-wider">
                      {post.category.name}
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex flex-col gap-3 p-5 pt-1 flex-1">
                  <div className="flex items-center gap-3.5 text-stone-400 text-[11px] font-medium font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime} phút đọc
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-850 group-hover:text-olive transition-colors leading-snug line-clamp-2">
                    <Link href={`/chia-se/${post.slug}`} className="cursor-pointer">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-stone-600 text-xs leading-relaxed font-sans line-clamp-3 text-justify">
                    {post.description}
                  </p>

                  <Link 
                    href={`/chia-se/${post.slug}`}
                    className="text-xs font-bold text-olive tracking-widest uppercase flex items-center gap-1.5 mt-auto pt-2 cursor-pointer group-hover:text-olive-dark"
                  >
                    Đọc bài viết
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(Math.max(safePage - 1, 1))}
                disabled={safePage === 1}
                className="p-2.5 rounded-xl border border-olive/10 bg-cream text-stone-600 hover:border-olive/35 hover:text-olive disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    safePage === page
                      ? 'bg-olive text-cream shadow-sm'
                      : 'bg-cream border border-olive/10 text-stone-600 hover:border-olive/35 hover:text-olive'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(safePage + 1, totalPages))}
                disabled={safePage === totalPages}
                className="p-2.5 rounded-xl border border-olive/10 bg-cream text-stone-600 hover:border-olive/35 hover:text-olive disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
