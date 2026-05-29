'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Edit, Trash2, Check, AlertCircle, RefreshCw, X,
  Sparkles, Code, Briefcase, BookOpen, Laptop, Bookmark, Tag, Layers, Coffee, Heart, Link as LinkIcon, Settings
} from 'lucide-react';

interface CategoryCount {
  posts: number;
  resources: number;
  products: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string; // "post", "resource", "product"
  icon: string;
  _count: CategoryCount;
}

interface IconOption {
  id: string;
  name: string;
  label: string;
}

interface CategoriesClientProps {
  initialCategories: Category[];
  initialIcons: IconOption[];
}

// Icon mapper for dynamic rendering
const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const map: Record<string, React.ComponentType<any>> = {
    Sparkles, Code, Briefcase, BookOpen, Laptop, Bookmark, Tag, Layers, Coffee, Heart,
    Link: LinkIcon, Settings
  };
  const Comp = map[name] || Layers;
  return <Comp className={className} />;
};

export default function CategoriesClient({ initialCategories, initialIcons }: CategoriesClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('post'); // post, resource, product
  const [icon, setIcon] = useState('Layers');

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      setSlug(generateSlug(val));
    }
  };

  // Open Form to Add New Category
  const handleAddNew = () => {
    setIsEditing(true);
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setType('post');
    setIcon('Layers');
    setError(null);
    setSuccess(null);
  };

  // Open Form to Edit Category
  const handleEdit = (cat: Category) => {
    setIsEditing(true);
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setType(cat.type);
    setIcon(cat.icon);
    setError(null);
    setSuccess(null);
  };

  // Submit Form (POST/PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!name.trim() || !slug.trim() || !type) {
      setError('Vui lòng điền các thông tin bắt buộc: Tên, Slug và Loại danh mục.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name,
      slug,
      description,
      type,
      icon
    };

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi lưu danh mục.');
      }

      setSuccess(editingCategory ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục mới thành công!');
      
      // Update local state list
      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...payload, icon } as Category : c));
      } else {
        const createdCat: Category = {
          ...data,
          _count: { posts: 0, resources: 0, products: 0 }
        };
        setCategories(prev => [createdCat, ...prev]);
      }

      setTimeout(() => {
        setIsEditing(false);
        setEditingCategory(null);
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = async (cat: Category) => {
    const totalLinkedItems = cat._count.posts + cat._count.resources + cat._count.products;
    if (totalLinkedItems > 0) {
      alert(`Không thể xóa! Danh mục này hiện đang chứa ${totalLinkedItems} mục (bài viết, tài nguyên hoặc sản phẩm). Vui lòng đổi danh mục cho các mục đó trước.`);
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== cat.id));
        setSuccess('Xóa danh mục thành công!');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Lỗi khi xóa danh mục.');
      }
    } catch (err) {
      console.error('Delete category error:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // Memoized filter results
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || cat.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, filterType]);

  const typeLabels: Record<string, string> = {
    post: 'Bài viết (Chia sẻ)',
    resource: 'Dự án & Tài nguyên',
    product: 'Sản phẩm'
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-850">
            {isEditing ? (editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới') : 'Quản lý danh mục'}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {isEditing 
              ? 'Tạo danh mục dùng chung để phân loại bài viết, sản phẩm hoặc công cụ tài nguyên.' 
              : 'Quản lý danh mục đa năng cho các phần: Góc chia sẻ, Kho công cụ và Cửa hàng.'}
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive bg-olive text-cream hover:bg-olive-dark hover:shadow-md transition-all font-semibold text-sm cursor-pointer shadow-sm animate-slide-up"
          >
            <Plus className="w-4 h-4" /> Thêm danh mục mới
          </button>
        )}
      </div>

      {/* TOAST NOTIFICATIONS */}
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

      {/* RENDER LIST OR FORM */}
      {!isEditing ? (
        <>
          {/* SEARCH & FILTER TYPE */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
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

            <div className="w-full md:w-64">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 cursor-pointer"
              >
                <option value="all">Tất cả mục phân loại</option>
                <option value="post">Bài viết (Chia sẻ)</option>
                <option value="resource">Dự án & Tài nguyên</option>
                <option value="product">Sản phẩm</option>
              </select>
            </div>
          </div>

          {/* TABLE OF CATEGORIES */}
          {filteredCategories.length === 0 ? (
            <div className="py-20 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
              <Layers className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold">Không tìm thấy danh mục nào.</p>
              <p className="text-xs text-stone-400">Hãy nhấn nút "Thêm danh mục mới" ở góc trên để tạo phân loại đầu tiên.</p>
            </div>
          ) : (
            <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-olive/10 bg-sand/30 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Biểu tượng / Tên danh mục</th>
                      <th className="py-4 px-4">Đường dẫn tĩnh (Slug)</th>
                      <th className="py-4 px-4">Loại mục phân loại</th>
                      <th className="py-4 px-4 text-center">Số lượng bài viết / liên kết</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/5 text-stone-700 text-xs font-medium">
                    {filteredCategories.map((cat) => {
                      const totalLinked = cat.type === 'post' ? cat._count.posts 
                                          : cat.type === 'resource' ? cat._count.resources
                                          : cat._count.products;

                      return (
                        <tr key={cat.id} className="hover:bg-cream/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex gap-4 items-center">
                              <div className="p-2.5 rounded-xl bg-olive/5 border border-olive/10 text-olive">
                                <IconComponent name={cat.icon} className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-serif font-bold text-stone-850 text-sm">{cat.name}</span>
                                <span className="text-stone-400 text-[10px] font-normal line-clamp-1">{cat.description || 'Không có mô tả thêm.'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-stone-600 font-mono text-[11px]">{cat.slug}</td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                              cat.type === 'post' ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : cat.type === 'resource' ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {typeLabels[cat.type]}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center text-sm font-semibold font-serif text-stone-850">
                            {totalLinked}
                          </td>

                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(cat)}
                                className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                                title="Chỉnh sửa danh mục"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(cat)}
                                className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/20 transition-all cursor-pointer"
                                title="Xóa danh mục"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* CATEGORY EDIT/ADD FORM */
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-cream/70 backdrop-blur-md border border-olive/15 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto animate-slide-up">
          <div className="flex justify-between items-center border-b border-olive/10 pb-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-olive uppercase tracking-widest cursor-pointer"
            >
              <X className="w-4.5 h-4.5" /> Quay lại danh sách
            </button>
            <h3 className="font-serif font-black text-stone-850 text-lg">
              {editingCategory ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
            </h3>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4 py-2">
            
            {/* Classification Type Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Loại danh mục phân loại *</label>
              <select
                disabled={!!editingCategory}
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 cursor-pointer disabled:opacity-50"
              >
                <option value="post">Bài viết (Góc chia sẻ)</option>
                <option value="resource">Dự án & Tài nguyên</option>
                <option value="product">Sản phẩm (Cửa hàng)</option>
              </select>
              {editingCategory && (
                <span className="text-[10px] text-stone-400 italic font-medium">Không thể đổi loại mục phân loại sau khi đã tạo để tránh lỗi dữ liệu.</span>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tên danh mục *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Công nghệ & AI"
                value={name}
                onChange={handleNameChange}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 font-serif font-bold"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Đường dẫn tĩnh (Slug) *</label>
              <input
                type="text"
                required
                placeholder="cong-nghe-ai"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
              />
            </div>

            {/* Icon Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Chọn biểu tượng gợi ý *</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 p-3 rounded-xl border border-olive/10 bg-sand/20">
                {initialIcons.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setIcon(i.name)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer ${
                      icon === i.name 
                        ? 'bg-olive text-cream shadow-xs font-bold'
                        : 'bg-cream/40 border border-olive/5 text-stone-600 hover:bg-cream'
                    }`}
                  >
                    <IconComponent name={i.name} className="w-4 h-4" />
                    <span className="text-[9px] text-center line-clamp-1 truncate w-full">{i.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Mô tả ngắn</label>
              <textarea
                rows={2}
                placeholder="Đoạn giới thiệu ngắn về các bài viết / nội dung trong danh mục..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 resize-none font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-olive/10 mt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
                'Lưu danh mục'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
