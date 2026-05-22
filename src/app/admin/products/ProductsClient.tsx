'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Plus, Search, Edit, Trash2, ExternalLink, Check, FileText, Sparkles, 
  X, AlertCircle, RefreshCw, Image as ImageIcon, DollarSign, Tag, Info
} from 'lucide-react';
import MediaDrawer from '@/components/MediaDrawer';

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
  type: string; // "affiliate" or "main"
  affiliateUrl: string | null;
  featured: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('main'); // main, affiliate
  const [affiliateUrl, setAffiliateUrl] = useState('');
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
    if (!editingProduct) {
      setSlug(generateSlug(val));
    }
  };

  // Add new product setup
  const handleAddNew = () => {
    if (categories.length === 0) {
      alert('Vui lòng tạo ít nhất một danh mục cho Sản phẩm (Loại: product) trong mục Quản lý Danh mục trước.');
      return;
    }
    setIsEditing(true);
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setContent('');
    setPrice('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80');
    setType('main');
    setAffiliateUrl('');
    setFeatured(false);
    setCategoryId(categories[0]?.id || '');
    setError(null);
    setSuccess(null);
  };

  // Edit product setup
  const handleEdit = (prod: Product) => {
    setIsEditing(true);
    setEditingProduct(prod);
    setTitle(prod.title);
    setSlug(prod.slug);
    setDescription(prod.description);
    setContent(prod.content);
    setPrice(prod.price !== null ? prod.price.toString() : '');
    setImage(prod.image);
    setType(prod.type);
    setAffiliateUrl(prod.affiliateUrl || '');
    setFeatured(prod.featured);
    setCategoryId(prod.categoryId);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setError(null);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!title.trim() || !slug.trim() || !description.trim() || !content.trim() || !image.trim() || !categoryId) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      setIsSubmitting(false);
      return;
    }

    if (type === 'affiliate' && !affiliateUrl.trim()) {
      setError('Sản phẩm Affiliate bắt buộc phải có Liên kết affiliate (affiliateUrl).');
      setIsSubmitting(false);
      return;
    }

    const parsedPrice = price.trim() !== '' ? parseFloat(price) : null;
    if (parsedPrice !== null && isNaN(parsedPrice)) {
      setError('Giá sản phẩm phải là một số hợp lệ.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title,
      slug,
      description,
      content,
      price: parsedPrice,
      image,
      type,
      affiliateUrl: type === 'affiliate' ? affiliateUrl : null,
      featured,
      categoryId
    };

    try {
      const apiUrl = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi lưu sản phẩm.');
      }

      setSuccess(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm mới thành công!');
      
      // Update local state list
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload, category: categories.find(c => c.id === categoryId)! } as Product : p));
      } else {
        const createdProd: Product = {
          ...data,
          category: categories.find(c => c.id === categoryId)!
        };
        setProducts(prev => [createdProd, ...prev]);
      }

      setTimeout(() => {
        setIsEditing(false);
        setEditingProduct(null);
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (prodId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không? Tất cả thông tin đặt hàng liên quan cũng sẽ bị xóa.')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== prodId));
        setSuccess('Đã xóa sản phẩm thành công!');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Có lỗi xảy ra khi xóa sản phẩm.');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // Memoized filter results
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchesSearch = 
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategoryId === 'all' || prod.categoryId === selectedCategoryId;
      const matchesType = filterType === 'all' || prod.type === filterType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [products, searchQuery, selectedCategoryId, filterType]);

  const formatPrice = (p: number | null) => {
    if (p === null) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-850">
            {isEditing ? (editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới') : 'Quản lý Sản phẩm'}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {isEditing 
              ? 'Tạo trang thông tin chi tiết và đặt mua cho sản phẩm chính chủ hoặc giới thiệu affiliate.' 
              : 'Quản lý các sản phẩm giới thiệu bán hàng (affiliate) hoặc các sản phẩm tự phát triển.'}
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive bg-olive text-cream hover:bg-olive-dark hover:shadow-md transition-all font-semibold text-sm cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm sản phẩm mới
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
                placeholder="Tìm kiếm sản phẩm theo tiêu đề hoặc mô tả..."
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
                <option value="all">Tất cả phân loại</option>
                <option value="main">Sản phẩm chính</option>
                <option value="affiliate">Sản phẩm Affiliate</option>
              </select>
            </div>
          </div>

          {/* LIST DISPLAY */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
              <Tag className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold">Không tìm thấy sản phẩm nào.</p>
              <p className="text-xs text-stone-450">Nhấn nút "Thêm sản phẩm mới" để bắt đầu bày bán.</p>
            </div>
          ) : (
            <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-olive/10 bg-sand/30 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Sản phẩm</th>
                      <th className="py-4 px-4">Giá tiền</th>
                      <th className="py-4 px-4">Danh mục</th>
                      <th className="py-4 px-4">Phân loại</th>
                      <th className="py-4 px-4 text-center">Nổi bật</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/5 text-stone-700 text-xs font-medium">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-cream/40 transition-colors">
                        {/* Cover + Title */}
                        <td className="py-4 px-6 max-w-sm">
                          <div className="flex gap-4 items-center">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-olive/5 bg-sand">
                              <Image 
                                src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'} 
                                alt={prod.title} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-serif font-bold text-stone-850 text-sm line-clamp-1">
                                {prod.title}
                              </span>
                              <span className="text-stone-400 text-[10px] font-normal line-clamp-1">{prod.description || 'Chưa có mô tả ngắn...'}</span>
                              <span className="text-stone-400 text-[9px] font-normal font-mono">slug: {prod.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 text-stone-700 font-bold font-serif">
                          {formatPrice(prod.price)}
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-olive/5 border border-olive/10 text-olive px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {prod.category?.name || 'Không rõ'}
                          </span>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                            prod.type === 'main' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {prod.type === 'main' ? 'Sản phẩm tự làm' : 'Liên kết Affiliate'}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {prod.featured ? (
                            <span className="text-amber-500 text-base" title="Hiện nổi bật">★</span>
                          ) : (
                            <span className="text-stone-300 text-base" title="Bình thường">☆</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1.5">
                            <a
                              href={`/san-pham/${prod.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                              title="Xem chi tiết trên website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleEdit(prod)}
                              className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                              title="Chỉnh sửa sản phẩm"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/20 transition-all cursor-pointer"
                              title="Xóa sản phẩm"
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
              {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề sản phẩm *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Ebook Học NextJS Thực Chiến"
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
                placeholder="ebook-hoc-nextjs"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 font-mono"
              />
            </div>

            {/* Product Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Phân loại sản phẩm *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 cursor-pointer font-bold"
              >
                <option value="main">Sản phẩm tự làm (Đặt hàng qua biểu mẫu)</option>
                <option value="affiliate">Sản phẩm Affiliate (Chuyển link tiếp thị liên kết)</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Danh mục sản phẩm *</label>
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

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                Giá bán (VND) <span className="text-stone-400 font-normal italic">(Bỏ trống nếu là Thỏa thuận/Liên hệ)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ví dụ: 199000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850"
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* Image URL with Media Drawer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Ảnh sản phẩm (URL hoặc chọn từ thư viện) *</label>
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

            {/* Affiliate URL - Only visible if type === affiliate */}
            {type === 'affiliate' && (
              <div className="flex flex-col gap-1.5 md:col-span-2 animate-slide-down">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Liên kết Affiliate (Mua hộ/Giới thiệu link) *</label>
                <input
                  type="text"
                  required={type === 'affiliate'}
                  placeholder="https://shope.ee/... hoặc liên kết đối tác tiếp thị"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 font-mono"
                />
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Mô tả ngắn sản phẩm *</label>
              <textarea
                rows={2}
                required
                placeholder="Giới thiệu nhanh, tóm tắt các tính năng hoặc lợi ích chính của sản phẩm..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Detail Markdown Content */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                Nội dung chi tiết (Markdown) * <span className="text-stone-400 font-normal font-sans italic">(Hỗ trợ định dạng văn bản Markdown)</span>
              </label>
              <textarea
                rows={10}
                required
                placeholder="### Giới thiệu sản phẩm&#10;Viết chi tiết nội dung, thông số kỹ thuật, lợi ích, hướng dẫn sử dụng sản phẩm tại đây..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono resize-y leading-relaxed"
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
                Đánh dấu nổi bật (Featured - Sẽ ghim sản phẩm này lên mục đầu tiên)
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
                'Lưu sản phẩm'
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
      />
    </div>
  );
}
