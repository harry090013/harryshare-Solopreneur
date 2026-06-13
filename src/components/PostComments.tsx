'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Clock } from 'lucide-react';

interface Comment {
  id: string;
  authorName: string;
  content: string;
  adminReply?: string | null;
  createdAt: string;
}

export default function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError('Vui lòng điền đầy đủ Tên và Nội dung bình luận.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: name,
          authorEmail: email,
          content
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setContent('');
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || 'Có lỗi xảy ra khi gửi bình luận.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-8 mt-12 pt-8 border-t border-olive/10 font-sans">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-olive" />
        <h3 className="font-serif text-xl font-bold text-stone-850">
          Bình luận ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      {loading ? (
        <p className="text-sm text-stone-400">Đang tải bình luận...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-stone-500 italic bg-sand/10 p-4 rounded-xl border border-olive/5">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ nhé!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div 
              key={comment.id}
              className="flex flex-col gap-4 p-5 rounded-2xl border border-olive/5 bg-cream/30 hover:bg-cream/50 transition-all"
            >
              <div className="flex gap-4">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-olive/10 flex items-center justify-center text-olive font-bold text-sm shrink-0 border border-olive/10">
                  {getInitials(comment.authorName)}
                </div>
                
                {/* Comment content */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-stone-850">{comment.authorName}</span>
                    <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>

              {/* Admin reply (nested block) */}
              {comment.adminReply && (
                <div className="mt-1 ml-14 p-4 rounded-xl bg-olive/5 border-l-2 border-olive flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-full bg-olive flex items-center justify-center text-cream font-bold text-xs shrink-0">
                    H
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="font-bold text-xs text-olive">Harry (Quang Hiếu) phản hồi</span>
                    <p className="text-stone-600 text-xs leading-relaxed whitespace-pre-wrap">{comment.adminReply}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comment Input Form */}
      <div className="p-6 rounded-2xl border border-olive/10 bg-cream/70 backdrop-blur-md flex flex-col gap-4 shadow-xs">
        <h4 className="font-serif font-bold text-stone-800 text-base">Viết bình luận của bạn</h4>
        
        {submitSuccess ? (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl animate-fade-in text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Gửi bình luận thành công! Bình luận sẽ hiển thị sau khi được quản trị viên duyệt.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Họ và tên *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                  />
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                </div>
              </div>
              
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Email (Không hiển thị công khai)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Nội dung bình luận *</label>
              <textarea
                required
                rows={4}
                placeholder="Chia sẻ suy nghĩ của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400 resize-y min-h-[80px]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-olive text-cream text-xs font-bold uppercase tracking-wider hover:bg-olive-dark transition-all disabled:opacity-50 cursor-pointer active:scale-95 self-start shadow-sm"
            >
              Gửi bình luận
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
