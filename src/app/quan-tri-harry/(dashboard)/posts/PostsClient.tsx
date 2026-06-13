'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { 
  Plus, Search, Edit, Trash2, Eye, Calendar, Clock, 
  ArrowLeft, Check, FileText, Sparkles, Globe, Lock, 
  X, AlertCircle, RefreshCw, Image as ImageIcon, Download, Upload, Loader2
} from 'lucide-react';
import MediaDrawer from '@/components/MediaDrawer';

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
  content: string;
  coverImage: string;
  readTime: number;
  published: boolean;
  date: Date | string;
  categoryId: string;
  category: Category;
  views: number;
  likes: number;
  shares: number;
}

interface PostsClientProps {
  initialPosts: Post[];
  categories: Category[];
}

export default function PostsClient({ initialPosts, categories }: PostsClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editor view tab for mobile: 'edit' or 'preview'
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');

  // Media Drawer state
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);

  // File input ref for CSV import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slug generator helper
  const generateSlug = (val: string) => {
    let str = val.toLowerCase();
    
    // Remove Vietnamese accents
    const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";
    const to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
             .replace(/\s+/g, '-')        // collapse whitespace and replace by -
             .replace(/-+/g, '-');        // collapse dashes
              
    // trim leading/trailing dashes
    if (str.startsWith('-')) str = str.substring(1);
    if (str.endsWith('-')) str = str.substring(0, str.length - 1);
    
    return str;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingPost) {
      setSlug(generateSlug(val));
    }
  };

  // Open form for Create
  const handleAddNew = () => {
    setIsEditing(true);
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80');
    setAudioUrl('');
    setReadTime(5);
    setPublished(false);
    setCategoryId(categories[0]?.id || '');
    setError(null);
    setSuccess(null);
    setEditorTab('edit');
  };

  // Open form for Edit
  const handleEdit = (post: Post) => {
    setIsEditing(true);
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setDescription(post.description);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setAudioUrl(post.audioUrl || '');
    setReadTime(post.readTime);
    setPublished(post.published);
    setCategoryId(post.categoryId);
    setError(null);
    setSuccess(null);
    setEditorTab('edit');
  };

  // Close form and discard edits
  const handleCancel = () => {
    setIsEditing(false);
    setEditingPost(null);
    setError(null);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!title.trim() || !slug.trim() || !content.trim() || !categoryId) {
      setError('Vui lòng nhập đầy đủ các thông tin bắt buộc: Tiêu đề, Slug, Danh mục, và Nội dung.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title,
      slug,
      description,
      content,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      audioUrl: audioUrl.trim() || null,
      readTime: Number(readTime) || 5,
      published,
      categoryId
    };

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi lưu bài viết.');
      }

      setSuccess(editingPost ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết mới thành công!');
      
      // Update local state list
      if (editingPost) {
        setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...payload, category: categories.find(c => c.id === categoryId)! } as Post : p));
      } else {
        const createdPost: Post = {
          ...data,
          category: categories.find(c => c.id === categoryId)!,
          views: 0,
          likes: 0,
          shares: 0
        };
        setPosts(prev => [createdPost, ...prev]);
      }

      // Briefly show success toast, then return to list
      setTimeout(() => {
        setIsEditing(false);
        setEditingPost(null);
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle publish status directly
  const handleTogglePublish = async (post: Post) => {
    try {
      const updatedPublished = !post.published;
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          content: post.content,
          categoryId: post.categoryId,
          coverImage: post.coverImage,
          audioUrl: post.audioUrl,
          readTime: post.readTime,
          description: post.description,
          published: updatedPublished
        })
      });

      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: updatedPublished } : p));
        setSuccess(`Đã ${updatedPublished ? 'xuất bản' : 'hạ bài'} bài viết thành công!`);
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Lỗi cập nhật trạng thái xuất bản.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ khi đổi trạng thái.');
    }
  };

  // Delete a post
  const handleDelete = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setSuccess('Đã xóa bài viết thành công!');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Có lỗi xảy ra khi xóa bài viết.');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Lỗi kết nối máy chủ khi xóa bài viết.');
    }
  };

  // Handle CSV Import
  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/posts/import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setError(`Lỗi nhập liệu CSV:\n• ${data.errors.join('\n• ')}`);
        } else {
          setError(data.error || 'Đã xảy ra lỗi khi tải dữ liệu CSV.');
        }
        return;
      }

      setSuccess(data.message || 'Nhập bài viết từ CSV thành công!');
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh page data
      setTimeout(() => {
        router.refresh();
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      console.error('Import CSV error:', err);
      setError('Lỗi kết nối máy chủ khi tải lên tệp tin CSV.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized search & filter results
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategoryId === 'all' || post.categoryId === selectedCategoryId;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategoryId]);

  // Paginated search & filter results
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter(p => p.published).length,
      drafts: posts.filter(p => !p.published).length
    };
  }, [posts]);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-850">
            {isEditing ? (editingPost ? 'Chỉnh sửa bài viết' : 'Viết bài mới') : 'Quản lý bài viết'}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {isEditing 
              ? 'Tạo nội dung định dạng Markdown với bảng xem trước trực quan sinh động.' 
              : 'Quản lý, chỉnh sửa, nhập hàng loạt bằng CSV và xuất bản bài viết chia sẻ.'}
          </p>
        </div>

        {!isEditing && (
          <div className="flex flex-wrap gap-2">
            {/* Hidden Input for CSV upload */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportCSV} 
              accept=".csv" 
              className="hidden" 
            />

            {/* Template Download Button */}
            <a
              href="/api/admin/posts/import/template"
              download="posts_template.csv"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-olive/20 bg-cream text-stone-600 hover:bg-sand/30 transition-all font-semibold text-xs cursor-pointer shadow-sm"
              title="Tải file dữ liệu mẫu CSV để nhập liệu bài viết"
            >
              <Download className="w-3.5 h-3.5 text-olive" /> Tải file mẫu CSV
            </a>

            {/* Bulk CSV Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-olive/20 bg-cream text-stone-600 hover:bg-sand/30 transition-all font-semibold text-xs cursor-pointer shadow-sm"
              title="Tải lên file CSV chứa danh sách các bài viết để nhập hàng loạt"
            >
              <Upload className="w-3.5 h-3.5 text-olive" /> Nhập bài từ CSV
            </button>

            {/* Create New Post Button */}
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-olive bg-olive text-cream hover:bg-olive-dark hover:shadow-md transition-all font-semibold text-sm cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Viết bài mới
            </button>
          </div>
        )}
      </div>

      {/* ERROR / SUCCESS TOASTS */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 animate-slide-up text-sm font-medium whitespace-pre-line">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 animate-slide-up text-sm font-medium">
          <Check className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* CORE VIEW TOGGLE */}
      {!isEditing ? (
        <>
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-olive/10 bg-cream/70 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Tổng bài viết</span>
              <span className="text-3xl font-serif font-bold text-stone-850">{stats.total}</span>
              <div className="absolute right-4 bottom-4 text-stone-200 group-hover:scale-110 transition-transform">
                <FileText className="w-12 h-12" />
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Đã xuất bản</span>
              <span className="text-3xl font-serif font-bold text-emerald-700">{stats.published}</span>
              <div className="absolute right-4 bottom-4 text-emerald-100 group-hover:scale-110 transition-transform">
                <Globe className="w-12 h-12" />
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Bản nháp</span>
              <span className="text-3xl font-serif font-bold text-amber-700">{stats.drafts}</span>
              <div className="absolute right-4 bottom-4 text-amber-100 group-hover:scale-110 transition-transform">
                <Lock className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề hoặc mô tả..."
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

            {/* Category dropdown filter */}
            <div className="w-full md:w-64">
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
          </div>

          {/* POSTS GRID */}
          {filteredPosts.length === 0 ? (
            <div className="py-20 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold">Không tìm thấy bài viết nào.</p>
              <p className="text-xs text-stone-450">Nhấn nút "Viết bài mới" hoặc tải lên file CSV để bắt đầu nội dung.</p>
            </div>
          ) : (
            <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-olive/10 bg-sand/30 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Bài viết</th>
                      <th className="py-4 px-4">Danh mục</th>
                      <th className="py-4 px-4 text-center">Tương tác</th>
                      <th className="py-4 px-4">Trạng thái</th>
                      <th className="py-4 px-4">Ngày tạo</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/5 text-stone-700 text-xs font-medium">
                    {displayedPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-cream/40 transition-colors">
                        {/* Cover + Title + Desc */}
                        <td className="py-4 px-6 max-w-sm">
                          <div className="flex gap-4 items-center">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-olive/5 bg-sand">
                              <Image 
                                src={post.coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=100&q=80'} 
                                alt={post.title} 
                                fill 
                                sizes="48px"
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-serif font-bold text-stone-850 text-sm line-clamp-1 hover:text-olive transition-colors">
                                {post.title}
                              </span>
                              <span className="text-stone-400 text-[10px] font-normal line-clamp-1">{post.description || 'Chưa có mô tả ngắn...'}</span>
                              <span className="text-stone-400 text-[9px] font-normal mt-0.5 font-mono">slug: {post.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-olive/5 border border-olive/10 text-olive px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {post.category?.name || 'Không rõ'}
                          </span>
                        </td>

                        {/* Interactions Info */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex gap-3 text-stone-500 font-mono text-[10px] bg-sand/30 px-2 py-1 rounded-md border border-olive/5">
                            <span title="Lượt xem">👁️ {post.views || 0}</span>
                            <span title="Lượt thích">❤️ {post.likes || 0}</span>
                            <span title="Lượt chia sẻ">🔗 {post.shares || 0}</span>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                              post.published 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {post.published ? (
                              <>
                                <Globe className="w-3 h-3" /> Công khai
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" /> Bản nháp
                              </>
                            )}
                          </button>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-stone-550 text-[10px] font-mono whitespace-nowrap">
                          {new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1.5">
                            <Link
                              href={`/chia-se/${post.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                              title="Xem bài viết ngoài trang chủ"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/20 transition-all cursor-pointer"
                              title="Xóa bài viết"
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

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-olive/10 bg-sand/10">
                  <span className="text-xs text-stone-500">
                    Hiển thị <span className="font-semibold text-stone-700">{Math.min((currentPage - 1) * postsPerPage + 1, filteredPosts.length)}</span> đến{" "}
                    <span className="font-semibold text-stone-700">{Math.min(currentPage * postsPerPage, filteredPosts.length)}</span> trong{" "}
                    <span className="font-semibold text-stone-700">{filteredPosts.length}</span> bài viết
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-olive/10 bg-cream text-stone-600 hover:bg-sand/30 disabled:opacity-50 disabled:hover:bg-cream disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Trước
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                              currentPage === page
                                ? 'border-olive bg-olive text-cream'
                                : 'border-olive/10 bg-cream text-stone-600 hover:bg-sand/30'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === 2 ||
                        page === totalPages - 1
                      ) {
                        return <span key={page} className="px-1 text-stone-400 text-xs">...</span>;
                      }
                      return null;
                    }).filter((el, index, arr) => {
                      if (el?.type === 'span' && arr[index - 1]?.type === 'span') {
                        return false;
                      }
                      return true;
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-olive/10 bg-cream text-stone-600 hover:bg-sand/30 disabled:opacity-50 disabled:hover:bg-cream disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* EDIT FORM MODE */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-slide-up bg-cream/70 backdrop-blur-md border border-olive/15 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Form Actions Top Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-olive/10 pb-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-olive uppercase tracking-widest cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            <div className="flex gap-2">
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
                className="bg-olive text-cream hover:bg-olive-dark text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  'Lưu bài viết'
                )}
              </button>
            </div>
          </div>

          {/* Form Content Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Inputs */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề hấp dẫn..."
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
                  placeholder="vi-du-duong-dan-tinh"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Mô tả ngắn *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Một đoạn mô tả ngắn thu hút độc giả..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 resize-none font-sans leading-relaxed"
                />
              </div>
            </div>

            {/* Right Inputs */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Danh mục bài viết *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Cover Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Ảnh bìa (URL hoặc Thư viện) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
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

              {/* Audio URL (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tệp ghi âm giọng đọc (URL MP3 - Không bắt buộc)</label>
                <input
                  type="text"
                  placeholder="https://example.com/audio.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
                />
              </div>

              {/* Flex row for ReadTime and Published status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Thời gian đọc (phút)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Trạng thái xuất bản</label>
                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`w-full py-3 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
                      published 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {published ? 'Công khai' : 'Bản nháp'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Markdown Content Editor split tabs */}
          <div className="flex flex-col gap-4 mt-4 border-t border-olive/10 pt-6">
            <div className="flex justify-between items-center border-b border-olive/5 pb-2">
              <span className="text-[10px] font-bold text-stone-550 uppercase tracking-widest flex items-center gap-1.5">
                Nội dung chi tiết (Markdown) *
                <button
                  type="button"
                  onClick={() => setIsMediaDrawerOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-olive/5 border border-olive/10 hover:bg-olive/10 transition-colors text-[9px] font-bold text-olive uppercase tracking-wider cursor-pointer"
                >
                  <ImageIcon className="w-3 h-3" /> Chèn ảnh từ Media
                </button>
              </span>

              {/* Small toggle for mobile layout */}
              <div className="flex md:hidden gap-1 p-0.5 rounded-lg bg-sand/30 border border-olive/5">
                <button
                  type="button"
                  onClick={() => setEditorTab('edit')}
                  className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                    editorTab === 'edit' ? 'bg-olive text-cream' : 'text-stone-500'
                  }`}
                >
                  Viết bài
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                    editorTab === 'preview' ? 'bg-olive text-cream' : 'text-stone-500'
                  }`}
                >
                  Xem trước
                </button>
              </div>

              <span className="hidden md:inline text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                Xem trực tiếp (Live Preview) hiển thị bên tay phải
              </span>
            </div>

            {/* Split container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
              {/* Write Side */}
              <div className={`flex flex-col gap-2 ${editorTab === 'edit' ? 'flex' : 'hidden md:flex'}`}>
                <textarea
                  placeholder="Nhập nội dung bài viết bằng định dạng Markdown tại đây...&#10;&#10;Sử dụng # Tiêu đề lớn, ## Tiêu đề nhỏ, **chữ đậm**, *in nghiêng*, > Khối trích dẫn, - Danh sách gạch đầu dòng, [Liên kết](url), v.v."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 p-5 rounded-2xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 font-mono leading-relaxed resize-y min-h-[450px]"
                />
              </div>

              {/* Live Preview Side */}
              <div className={`flex flex-col gap-2 ${editorTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
                <div className="w-full flex-1 p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md overflow-y-auto max-h-[700px] shadow-inner select-none">
                  {content.trim() ? (
                    <article className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-850 prose-p:text-stone-700 prose-p:leading-relaxed prose-a:text-olive prose-blockquote:border-l-4 prose-blockquote:border-olive prose-blockquote:bg-sand/30 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg font-sans text-stone-700 text-sm flex flex-col gap-4">
                      {/* Title & Cover preview banner inside markdown frame */}
                      <div className="border-b border-olive/10 pb-4 mb-4">
                        <span className="text-[10px] font-bold text-olive uppercase tracking-wider bg-olive/5 px-2 py-0.5 rounded">
                          {categories.find(c => c.id === categoryId)?.name || 'Danh mục'}
                        </span>
                        <h1 className="font-serif text-xl sm:text-2xl font-black text-stone-850 leading-tight mt-2">
                          {title || 'Tiêu đề bài viết hiển thị ở đây'}
                        </h1>
                        <div className="flex items-center gap-3 text-[10px] text-stone-400 font-sans mt-2 font-medium">
                          <span>{readTime} phút đọc</span>
                          <span>•</span>
                          <span>Bản xem trước trực tiếp</span>
                        </div>
                      </div>

                      <ReactMarkdown
                        components={{
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold font-serif text-stone-850 mt-6 mb-3 leading-snug border-b border-olive/5 pb-1" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-bold font-serif text-stone-850 mt-4 mb-2 leading-snug" {...props} />,
                          p: ({node, ...props}) => <p className="leading-relaxed mb-3 text-stone-700 text-xs md:text-sm text-justify" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-olive bg-sand/30 pl-3 py-1 my-3 rounded-r-lg font-serif italic text-stone-600 text-xs" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 flex flex-col gap-1 text-stone-700 text-xs" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 flex flex-col gap-1 text-stone-700 text-xs" {...props} />,
                          li: ({node, ...props}) => <li className="leading-relaxed text-justify" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-stone-850" {...props} />,
                          a: ({node, ...props}) => <a className="text-olive hover:text-olive-dark font-medium underline underline-offset-4 cursor-pointer" {...props} />,
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </article>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 gap-2 py-20">
                      <FileText className="w-8 h-8 text-stone-300" />
                      <p className="text-xs font-semibold">Chưa có nội dung xem trước.</p>
                      <p className="text-[10px] text-stone-400 max-w-xs leading-relaxed">Hãy nhập nội dung Markdown bên trái để xem kết xuất giao diện thực tế trực quan tại đây.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      <MediaDrawer 
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelectAsCover={(url) => {
          setCoverImage(url);
          setIsMediaDrawerOpen(false);
          setSuccess('Đã chèn ảnh làm ảnh bìa!');
          setTimeout(() => setSuccess(null), 1500);
        }}
        onInsertToContent={(url, name) => {
          setContent(prev => prev + `\n\n![${name}](${url})\n`);
          setIsMediaDrawerOpen(false);
          setSuccess('Đã chèn ảnh vào nội dung!');
          setTimeout(() => setSuccess(null), 1500);
        }}
        selectLabel="Làm ảnh bìa"
      />
    </div>
  );
}
