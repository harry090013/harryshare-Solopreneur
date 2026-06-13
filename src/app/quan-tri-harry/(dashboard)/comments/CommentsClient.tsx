'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Trash2, Check, FileText, X, AlertCircle, RefreshCw, 
  MessageSquare, User, Mail, Calendar, CheckSquare, ShieldCheck, Eye, EyeOff
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  title: string;
  slug: string;
  categoryId: string;
}

interface Comment {
  id: string;
  postId: string;
  post: Post;
  authorName: string;
  authorEmail: string | null;
  content: string;
  approved: boolean;
  adminReply: string | null;
  createdAt: string;
}

interface CommentsClientProps {
  initialComments: Comment[];
  categories: Category[];
}

export default function CommentsClient({ initialComments, categories }: CommentsClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApproved, setFilterApproved] = useState('all'); // all, pending, approved
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Metrics
  const metrics = useMemo(() => {
    const total = comments.length;
    const pending = comments.filter(c => !c.approved).length;
    const approved = comments.filter(c => c.approved).length;
    return { total, pending, approved };
  }, [comments]);

  // Update comment approval status
  const handleToggleApproval = async (commentId: string, currentApproved: boolean) => {
    setUpdatingId(commentId);
    setError(null);
    setSuccess(null);

    const targetApproved = !currentApproved;

    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: targetApproved })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể cập nhật trạng thái bình luận.');
      }

      setComments(prev => prev.map(c => c.id === commentId ? { ...c, approved: targetApproved } : c));
      setSuccess(targetApproved ? 'Đã duyệt bình luận thành công!' : 'Đã ẩn bình luận thành công!');
      
      if (selectedComment?.id === commentId) {
        setSelectedComment(prev => prev ? { ...prev, approved: targetApproved } : null);
      }
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Sync reply text when comment selection changes
  React.useEffect(() => {
    if (selectedComment) {
      setReplyText(selectedComment.adminReply || '');
    } else {
      setReplyText('');
    }
  }, [selectedComment]);

  // Reply to comment handler
  const handleSaveReply = async () => {
    if (!selectedComment) return;

    setSavingReply(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/comments/${selectedComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể lưu phản hồi.');
      }

      setComments(prev => prev.map(c => 
        c.id === selectedComment.id 
          ? { ...c, adminReply: replyText, approved: true } 
          : c
      ));

      setSuccess('Đã lưu phản hồi và duyệt hiển thị bình luận thành công!');
      setSelectedComment(prev => prev ? { ...prev, adminReply: replyText, approved: true } : null);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setSavingReply(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        if (selectedComment?.id === commentId) {
          setSelectedComment(null);
        }
        setSuccess('Đã xóa bình luận thành công!');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Có lỗi xảy ra khi xóa bình luận.');
      }
    } catch (err) {
      console.error('Delete comment error:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // Filtered comments
  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        c.authorName.toLowerCase().includes(query) || 
        (c.authorEmail && c.authorEmail.toLowerCase().includes(query)) || 
        c.content.toLowerCase().includes(query) || 
        (c.post && c.post.title.toLowerCase().includes(query));
      
      let matchesStatus = true;
      if (filterApproved === 'pending') matchesStatus = !c.approved;
      if (filterApproved === 'approved') matchesStatus = c.approved;

      let matchesCategory = true;
      if (selectedCategoryFilter !== 'all') {
        matchesCategory = c.post?.categoryId === selectedCategoryFilter;
      }
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [comments, searchQuery, filterApproved, selectedCategoryFilter]);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-850">
          Quản lý Bình luận
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Kiểm duyệt và phản hồi các bình luận của bạn đọc trên các bài viết chia sẻ.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-olive/10 bg-cream/70 backdrop-blur-md flex flex-col gap-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tổng số bình luận</span>
          <span className="font-serif text-2xl font-bold text-stone-850 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-500" /> {metrics.total}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Chờ duyệt</span>
          <span className="font-serif text-2xl font-bold text-amber-800 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-600 animate-pulse" /> {metrics.pending}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Đã hiển thị</span>
          <span className="font-serif text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> {metrics.approved}
          </span>
        </div>
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

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo tên người bình luận, email, nội dung hoặc tiêu đề bài viết..."
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

        {/* Filter Approval Selection */}
        <div className="w-full md:w-52">
          <select
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 cursor-pointer animate-fade-in"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt hiển thị</option>
          </select>
        </div>

        {/* Filter Category Selection */}
        <div className="w-full md:w-52">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 cursor-pointer animate-fade-in"
          >
            <option value="all">Tất cả chuyên mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN VIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Comments Table */}
        <div className={`${selectedComment ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-4 transition-all duration-300`}>
          {filteredComments.length === 0 ? (
            <div className="py-20 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
              <MessageSquare className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold">Không tìm thấy bình luận nào.</p>
              <p className="text-xs text-stone-450">Khi người đọc bình luận trên các bài viết, các bình luận sẽ xuất hiện tại đây để kiểm duyệt.</p>
            </div>
          ) : (
            <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-olive/10 bg-sand/30 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">Người gửi</th>
                      <th className="py-4 px-4">Tại bài viết</th>
                      <th className="py-4 px-4">Nội dung</th>
                      <th className="py-4 px-4">Trạng thái</th>
                      <th className="py-4 px-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/5 text-stone-700 text-xs font-medium">
                    {filteredComments.map((comment) => (
                      <tr 
                        key={comment.id} 
                        className={`hover:bg-cream/40 transition-colors cursor-pointer ${
                          selectedComment?.id === comment.id ? 'bg-olive/5' : ''
                        }`}
                        onClick={() => setSelectedComment(comment)}
                      >
                        {/* Author info */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-stone-850 text-sm">{comment.authorName}</span>
                            {comment.authorEmail && (
                              <span className="text-stone-450 text-[10px] font-mono break-all max-w-[150px] truncate" title={comment.authorEmail}>
                                {comment.authorEmail}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Post name */}
                        <td className="py-4 px-4 max-w-[180px] truncate">
                          <span className="text-stone-850 font-serif font-bold" title={comment.post?.title}>
                            {comment.post?.title || 'Bài viết đã bị xóa'}
                          </span>
                        </td>

                        {/* Snippet Content */}
                        <td className="py-4 px-4 max-w-xs truncate text-stone-600 italic font-serif">
                          "{comment.content}"
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                            comment.approved 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {comment.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                          </span>
                        </td>

                        {/* Quick actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleToggleApproval(comment.id, comment.approved)}
                              disabled={updatingId === comment.id}
                              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                comment.approved
                                  ? 'border-amber-100 hover:border-amber-200 text-amber-700 hover:bg-amber-50/20'
                                  : 'border-emerald-100 hover:border-emerald-200 text-emerald-700 hover:bg-emerald-50/20'
                              }`}
                              title={comment.approved ? 'Ẩn bình luận' : 'Duyệt bình luận'}
                            >
                              {comment.approved ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/20 transition-all cursor-pointer"
                              title="Xóa bình luận"
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
        </div>

        {/* Selected Comment Detail Panel */}
        {selectedComment && (
          <div className="lg:col-span-5 border border-olive/15 rounded-2xl bg-cream/80 backdrop-blur-md p-5 flex flex-col gap-5 animate-slide-up sticky top-6">
            <div className="flex justify-between items-center border-b border-olive/15 pb-3">
              <h3 className="font-serif font-black text-stone-850 text-base flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-olive" /> Chi tiết bình luận
              </h3>
              <button 
                onClick={() => setSelectedComment(null)}
                className="text-stone-400 hover:text-stone-700 p-1 bg-sand/30 hover:bg-sand/65 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Post Information */}
            <div className="bg-sand/30 border border-olive/5 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Bài viết</span>
              <a 
                href={`/chia-se/${selectedComment.post?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold text-stone-850 text-sm hover:text-olive transition-colors leading-snug hover:underline block"
              >
                {selectedComment.post?.title || 'Bài viết đã bị xóa'}
              </a>
            </div>

            {/* Author Details */}
            <div className="flex flex-col gap-2.5 text-xs text-stone-750">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Người bình luận</span>
              
              <div className="flex gap-2 items-center">
                <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="font-bold text-stone-850">{selectedComment.authorName}</span>
              </div>

              {selectedComment.authorEmail && (
                <div className="flex gap-2 items-center">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-mono text-stone-650 break-all">{selectedComment.authorEmail}</span>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-600">
                  {new Date(selectedComment.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Comment Content */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nội dung bình luận</span>
              <div className="bg-sand/20 border border-olive/5 p-4 rounded-xl text-stone-850 font-serif leading-relaxed whitespace-pre-wrap">
                {selectedComment.content}
              </div>
            </div>

            {/* Harry's Reply Section */}
            <div className="flex flex-col gap-2.5 text-xs pt-2 border-t border-olive/15 mt-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Trả lời của Harry</span>
              <textarea
                rows={3}
                placeholder="Nhập nội dung phản hồi bình luận..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={savingReply}
                className="w-full px-3 py-2 text-xs rounded-xl border border-olive/10 bg-cream/50 focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400 font-sans resize-y outline-none"
              />
              <button
                onClick={handleSaveReply}
                disabled={savingReply}
                className="py-2 px-4 rounded-xl bg-olive hover:bg-olive-dark text-cream text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 self-end cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
              >
                {savingReply ? 'Đang lưu...' : 'Lưu phản hồi & Duyệt'}
              </button>
            </div>

            {/* Moderation Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-olive/15 mt-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Kiểm duyệt bình luận này</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleToggleApproval(selectedComment.id, selectedComment.approved)}
                  disabled={updatingId === selectedComment.id}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedComment.approved
                      ? 'border-amber-250 bg-amber-50 text-amber-800 hover:bg-amber-100/70'
                      : 'border-emerald-250 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70'
                  }`}
                >
                  {selectedComment.approved ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Ẩn khỏi bài viết
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Phê duyệt hiển thị
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(selectedComment.id)}
                  className="py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 text-red-800 hover:bg-red-100/70 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa bình luận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
