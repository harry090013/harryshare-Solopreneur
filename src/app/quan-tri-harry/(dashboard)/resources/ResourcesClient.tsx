'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Plus, Search, Edit, Trash2, Eye, ExternalLink, Check, FileText, Sparkles, 
  X, AlertCircle, RefreshCw, Image as ImageIcon
} from 'lucide-react';
import MediaDrawer from '@/components/MediaDrawer';

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
  categoryId: string;
  category: Category;
}

interface ResourcesClientProps {
  initialResources: ProjectResource[];
  categories: Category[];
}

export default function ResourcesClient({ initialResources, categories }: ResourcesClientProps) {
  const router = useRouter();
  const [resources, setResources] = useState<ProjectResource[]>(initialResources);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [editingResource, setEditingResource] = useState<ProjectResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('tool'); // tool, freebie
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState('');

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media Drawer state
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);

  // Slug generator helper
  const generateSlug = (val: string) => {
    let str = val.toLowerCase();
    const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";
    const to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '')
             .replace(/\s+/g, '-')
             .replace(/-+/g, '-');
    if (str.startsWith('-')) str = str.substring(1);
    if (str.endsWith('-')) str = str.substring(0, str.length - 1);
    return str;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingResource) {
      setSlug(generateSlug(val));
    }
  };

  // Add new resource setup
  const handleAddNew = () => {
    setIsEditing(true);
    setEditingResource(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setType('tool');
    setUrl('');
    setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80');
    setFeatured(false);
    setCategoryId(categories[0]?.id || '');
    setError(null);
    setSuccess(null);
  };

  // Edit resource setup
  const handleEdit = (res: ProjectResource) => {
    setIsEditing(true);
    setEditingResource(res);
    setTitle(res.title);
    setSlug(res.slug);
    setDescription(res.description);
    setType(res.type);
    setUrl(res.url);
    setImage(res.image);
    setFeatured(res.featured);
    setCategoryId(res.categoryId);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingResource(null);
    setError(null);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!title.trim() || !slug.trim() || !url.trim() || !categoryId) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc: Tiêu đề, Slug, URL, và Danh mục.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title,
      slug,
      description,
      type,
      url,
      image: image.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      featured,
      categoryId
    };

    try {
      const apiUrl = editingResource ? `/api/resources/${editingResource.id}` : '/api/resources';
      const method = editingResource ? 'PUT' : 'POST';

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi lưu tài nguyên.');
      }

      setSuccess(editingResource ? 'Cập nhật tài nguyên thành công!' : 'Tạo tài nguyên mới thành công!');
      
      // Update local state list
      if (editingResource) {
        setResources(prev => prev.map(r => r.id === editingResource.id ? { ...r, ...payload, category: categories.find(c => c.id === categoryId)! } as ProjectResource : r));
      } else {
        const createdRes: ProjectResource = {
          ...data,
          category: categories.find(c => c.id === categoryId)!
        };
        setResources(prev => [createdRes, ...prev]);
      }

      setTimeout(() => {
        setIsEditing(false);
        setEditingResource(null);
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete resource
  const handleDelete = async (resId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án / tài nguyên này không?')) {
      return;
    }

    try {
      const res = await fetch(`/api/resources/${resId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setResources(prev => prev.filter(r => r.id !== resId));
        setSuccess('Đã xóa tài nguyên thành công!');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Có lỗi xảy ra khi xóa tài nguyên.');
      }
    } catch (err) {
      console.error('Delete resource error:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // Memoized filter results
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        res.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategoryId === 'all' || res.categoryId === selectedCategoryId;
      const matchesType = filterType === 'all' || res.type === filterType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, selectedCategoryId, filterType]);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-850">
            {isEditing ? (editingResource ? 'Sửa dự án & tài nguyên' : 'Thêm tài nguyên mới') : 'Quản lý Dự án & Tài nguyên'}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {isEditing 
              ? 'Tạo các cẩm nang, checklist, ebook hoặc giới thiệu công cụ phần mềm.' 
              : 'Quản lý kho tài nguyên, công cụ khuyên dùng để trưng bày tại trang Dự án & Tài nguyên.'}
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive bg-olive text-cream hover:bg-olive-dark hover:shadow-md transition-all font-semibold text-sm cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm tài nguyên mới
          </button>
        )}
      </div>

      {/* ERROR / SUCCESS TOASTS */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 animate-slide-up text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 animate-slide-up text-sm font-medium">
          <Check className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* CORE VIEW */}
      {!isEditing ? (
        <>
          {/* SEARCH AND FILTERS */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài nguyên theo tiêu đề hoặc mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category selector */}
            <div className="w-full md:w-56">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 cursor-pointer"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Type selector */}
            <div className="w-full md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 cursor-pointer"
              >
                <option value="all">Tất cả loại hình</option>
                <option value="tool">Công cụ dùng</option>
                <option value="freebie">Tài nguyên tặng</option>
              </select>
            </div>
          </div>

          {/* LIST DISPLAY */}
          {filteredResources.length === 0 ? (
            <div className="py-20 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold">Không tìm thấy tài nguyên nào.</p>
              <p className="text-xs text-stone-450">Nhấn nút "Thêm tài nguyên mới" để tạo nội dung đầu tiên.</p>
            </div>
          ) : (
            <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-olive/10 bg-sand/30 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Tài nguyên</th>
                      <th className="py-4 px-4">Đường dẫn / Liên kết</th>
                      <th className="py-4 px-4">Danh mục</th>
                      <th className="py-4 px-4">Phân loại</th>
                      <th className="py-4 px-4 text-center">Nổi bật</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/5 text-stone-700 text-xs font-medium">
                    {filteredResources.map((res) => (
                      <tr key={res.id} className="hover:bg-cream/40 transition-colors">
                        {/* Cover + Title */}
                        <td className="py-4 px-6 max-w-sm">
                          <div className="flex gap-4 items-center">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-olive/5 bg-sand">
                              <Image 
                                src={res.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'} 
                                alt={res.title} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-serif font-bold text-stone-850 text-sm line-clamp-1">
                                {res.title}
                              </span>
                              <span className="text-stone-400 text-[10px] font-normal line-clamp-1">{res.description || 'Chưa có mô tả ngắn...'}</span>
                              <span className="text-stone-400 text-[9px] font-normal font-mono">slug: {res.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* URL Destination */}
                        <td className="py-4 px-4 text-stone-500 font-mono text-[11px] max-w-xs truncate" title={res.url}>
                          {res.url}
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-olive/5 border border-olive/10 text-olive px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {res.category?.name || 'Không rõ'}
                          </span>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                            res.type === 'tool' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}>
                            {res.type === 'tool' ? 'Công cụ khuyên dùng' : 'Tài nguyên tặng'}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {res.featured ? (
                            <span className="text-amber-500 text-base" title="Hiện nổi bật">★</span>
                          ) : (
                            <span className="text-stone-300 text-base" title="Bình thường">☆</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1.5">
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                              title="Kiểm tra đường dẫn đích"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleEdit(res)}
                              className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                              title="Chỉnh sửa tài nguyên"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(res.id)}
                              className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/20 transition-all cursor-pointer"
                              title="Xóa tài nguyên"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* EDIT FORM */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-slide-up bg-cream/70 backdrop-blur-md border border-olive/15 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-olive/10 pb-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-olive uppercase tracking-widest cursor-pointer"
            >
              <X className="w-4 h-4" /> Quay lại danh sách
            </button>
            <h3 className="font-serif font-black text-stone-850 text-lg">
              {editingResource ? 'Cập nhật dự án & tài nguyên' : 'Thêm mới dự án / tài nguyên'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề tài nguyên *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lovable AI"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 font-serif font-bold"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Đường dẫn tĩnh (Slug) *</label>
              <input
                type="text"
                required
                placeholder="lovable-ai-viet-nam"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
              />
            </div>

            {/* Destination URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Đường dẫn đích (Destination URL) *</label>
              <input
                type="text"
                required
                placeholder="https://lovable.dev?ref=harry"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 font-mono"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Danh mục tài nguyên *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Image URL with Media Library Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Ảnh minh họa (URL hoặc thư viện) *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaDrawerOpen(true)}
                  className="px-3.5 bg-sand/35 border border-olive/10 text-stone-600 hover:bg-sand/60 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                  title="Chọn ảnh từ Thư viện Media"
                >
                  <ImageIcon className="w-4 h-4 text-olive" />
                </button>
              </div>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Loại hình tài nguyên</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 cursor-pointer"
              >
                <option value="tool">Công cụ khuyên dùng (Tool)</option>
                <option value="freebie">Tài nguyên miễn phí (Freebie)</option>
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Mô tả ngắn tài nguyên</label>
              <textarea
                rows={3}
                placeholder="Giới thiệu nhanh về tính năng, lợi ích của công cụ hoặc ebook này đối với độc giả..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 md:col-span-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4.5 h-4.5 border border-olive/15 text-olive bg-cream focus:ring-olive rounded-md cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer">
                Đánh dấu là Nổi bật (Featured - Sẽ hiển thị ở đầu danh sách khuyên dùng)
              </label>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-olive/10 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-sand/30 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-olive text-cream hover:bg-olive-dark text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang lưu...
                </>
              ) : (
                'Lưu tài nguyên'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Media Drawer Selector */}
      <MediaDrawer 
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelectAsCover={(url) => {
          setImage(url);
          setIsMediaDrawerOpen(false);
          setSuccess('Đã tải ảnh bìa thành công!');
          setTimeout(() => setSuccess(null), 1500);
        }}
        onInsertToContent={() => {}}
        selectLabel="Chọn làm ảnh tài nguyên"
      />
    </div>
  );
}
