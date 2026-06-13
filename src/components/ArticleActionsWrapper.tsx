'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Headphones, ThumbsUp, ThumbsDown, Share2, Link as LinkIcon, Check, X } from 'lucide-react';
import AudioReader from './AudioReader';

interface ArticleActionsWrapperProps {
  postId: string;
  postTitle: string;
  initialLikes: number;
  initialShares: number;
  initialViews: number;
  content: string;
  children: React.ReactNode;
}

export default function ArticleActionsWrapper({
  postId,
  postTitle,
  initialLikes,
  initialShares,
  initialViews,
  content,
  children
}: ArticleActionsWrapperProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [views, setViews] = useState(initialViews);
  
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const shareDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // Track View exactly once per tab session
    const sessionStorageKey = `viewed_post_${postId}`;
    const hasViewed = sessionStorage.getItem(sessionStorageKey);
    if (!hasViewed) {
      fetch(`/api/posts/${postId}/track?action=view`, { method: 'POST' })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to track view');
        })
        .then((data) => {
          if (data && typeof data.views === 'number') {
            setViews(data.views);
          }
          sessionStorage.setItem(sessionStorageKey, 'true');
        })
        .catch((err) => console.error('Error tracking view:', err));
    }

    // Check if liked in localStorage
    const localStorageKey = `liked_post_${postId}`;
    const hasLiked = localStorage.getItem(localStorageKey) === 'true';
    setLiked(hasLiked);

    // Check if disliked in localStorage
    const localStorageDislikeKey = `disliked_post_${postId}`;
    const hasDisliked = localStorage.getItem(localStorageDislikeKey) === 'true';
    setDisliked(hasDisliked);

    // Close share dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [postId]);

  const handleLike = async () => {
    if (liked) return;
    
    // Reset dislike if liked
    if (disliked) {
      setDisliked(false);
      localStorage.removeItem(`disliked_post_${postId}`);
    }

    try {
      const res = await fetch(`/api/posts/${postId}/track?action=like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.likes === 'number') {
          setLikes(data.likes);
        }
        setLiked(true);
        localStorage.setItem(`liked_post_${postId}`, 'true');
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      localStorage.removeItem(`disliked_post_${postId}`);
    } else {
      setDisliked(true);
      localStorage.setItem(`disliked_post_${postId}`, 'true');
      
      // Reset like if disliked
      if (liked) {
        setLiked(false);
        localStorage.removeItem(`liked_post_${postId}`);
        setLikes(prev => Math.max(0, prev - 1));
      }
    }
  };

  const trackShare = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/track?action=share`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.shares === 'number') {
          setShares(data.shares);
        }
      }
    } catch (err) {
      console.error('Error tracking share:', err);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      trackShare();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  };

  return (
    <div className="relative w-full">
      {/* 1. Desktop Left Sticky Action Bar (Hidden on mobile) */}
      <div className="hidden lg:block absolute -left-20 top-24 h-full">
        <div className="sticky top-32 flex flex-col items-center gap-5 p-2.5 bg-cream/80 backdrop-blur-md rounded-full border border-olive/15 shadow-sm z-30">
          {/* Audio toggle button */}
          <button
            onClick={() => setShowAudio(!showAudio)}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
              showAudio
                ? 'bg-olive text-cream border-olive shadow-sm'
                : 'border-olive/10 hover:border-olive/30 text-stone-600 hover:bg-olive/5'
            }`}
            title={showAudio ? 'Tắt đọc bài viết' : 'Nghe bài viết này'}
          >
            <Headphones className={`w-5 h-5 ${showAudio && !liked ? 'animate-pulse' : ''}`} />
          </button>

          <hr className="w-6 border-olive/10 my-0.5" />

          {/* Like button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                liked
                  ? 'bg-red-500 text-cream border-red-500 shadow-sm'
                  : 'border-olive/10 hover:border-olive/30 text-stone-600 hover:text-red-500 hover:bg-red-50/5'
              }`}
              title={liked ? 'Bạn đã thích bài viết này' : 'Thích bài viết'}
            >
              <ThumbsUp className={`w-4.5 h-4.5 ${liked ? 'fill-cream' : ''}`} />
            </button>
            <span className="text-[10px] font-bold text-stone-400 font-sans">{likes}</span>
          </div>

          {/* Dislike button */}
          <button
            onClick={handleDislike}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
              disliked
                ? 'bg-stone-600 text-cream border-stone-600 shadow-sm'
                : 'border-olive/10 hover:border-olive/30 text-stone-600 hover:text-stone-850 hover:bg-stone-100'
            }`}
            title={disliked ? 'Bỏ không thích' : 'Không thích bài viết'}
          >
            <ThumbsDown className="w-4.5 h-4.5" />
          </button>

          <hr className="w-6 border-olive/10 my-0.5" />

          {/* Share button with popover */}
          <div className="relative" ref={shareDropdownRef}>
            <button
              onClick={() => setShowShareDropdown(!showShareDropdown)}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                showShareDropdown
                  ? 'bg-olive text-cream border-olive shadow-sm'
                  : 'border-olive/10 hover:border-olive/30 text-stone-600 hover:bg-olive/5'
              }`}
              title="Chia sẻ bài viết"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>

            {/* Share dropdown popover (desktop - to the right) */}
            {showShareDropdown && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-cream border border-olive/15 rounded-2xl p-3.5 shadow-xl flex gap-2.5 z-50 animate-fade-in whitespace-nowrap">
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all cursor-pointer active:scale-90"
                  title="Sao chép liên kết"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
                </button>
                <a
                  href={shareLinks.facebook}
                  onClick={trackShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all active:scale-90 flex items-center justify-center"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a
                  href={shareLinks.twitter}
                  onClick={trackShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all active:scale-90 flex items-center justify-center"
                  title="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Mobile Fixed Bottom Bar (Hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-45 bg-cream/80 backdrop-blur-lg border-t border-olive/10 shadow-lg px-6 py-3 flex justify-around items-center">
        {/* Mobile Audio toggle */}
        <button
          onClick={() => setShowAudio(!showAudio)}
          className={`p-2 rounded-xl border transition-all active:scale-95 ${
            showAudio
              ? 'bg-olive text-cream border-olive shadow-xs'
              : 'border-olive/10 text-stone-600 bg-cream/50'
          }`}
          title="Nghe bài viết"
        >
          <Headphones className="w-5 h-5" />
        </button>

        {/* Mobile Like */}
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all active:scale-95 ${
            liked
              ? 'bg-red-500 text-cream border-red-500 shadow-xs font-bold'
              : 'border-olive/10 text-stone-600 bg-cream/50 hover:text-red-500'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-xs font-bold">{likes}</span>
        </button>

        {/* Mobile Dislike */}
        <button
          onClick={handleDislike}
          className={`p-2 rounded-xl border transition-all active:scale-95 ${
            disliked
              ? 'bg-stone-600 text-cream border-stone-600 shadow-xs'
              : 'border-olive/10 text-stone-600 bg-cream/50'
          }`}
          title="Không thích"
        >
          <ThumbsDown className="w-4.5 h-4.5" />
        </button>

        {/* Mobile Share wrapper */}
        <div className="relative" ref={shareDropdownRef}>
          <button
            onClick={() => setShowShareDropdown(!showShareDropdown)}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              showShareDropdown
                ? 'bg-olive text-cream border-olive shadow-xs'
                : 'border-olive/10 text-stone-600 bg-cream/50'
            }`}
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Share dropdown popover (mobile - above the bar) */}
          {showShareDropdown && (
            <div className="absolute bottom-16 right-0 bg-cream border border-olive/15 rounded-2xl p-3 shadow-xl flex gap-2.5 z-50 animate-slide-up">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all cursor-pointer active:scale-90"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
              </button>
              <a
                href={shareLinks.facebook}
                onClick={trackShare}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all active:scale-90 flex items-center justify-center"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a
                href={shareLinks.twitter}
                onClick={trackShare}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all active:scale-90 flex items-center justify-center"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 3. Audio Reader Widget (Conditional render at the top of the article) */}
      {showAudio && (
        <div className="max-w-3xl mx-auto mb-8 animate-slide-down">
          <AudioReader content={content} title={postTitle} />
        </div>
      )}

      {/* 4. Article content itself */}
      <div className="w-full">
        {children}
      </div>

      {/* 5. Synchronized Bottom Interactions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-b border-olive/10 py-5 my-8 gap-4 bg-sand/10 px-4 rounded-xl max-w-3xl mx-auto font-sans">
        <div className="flex items-center gap-6 text-stone-500 text-xs font-semibold">
          <span className="flex items-center gap-1.5" title={`${views} lượt xem`}>
            <span className="text-stone-400">👁</span>
            <span>{views} lượt xem</span>
          </span>
          <button 
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-1.5 transition-all outline-none ${
              liked 
                ? 'text-red-500 font-bold' 
                : 'hover:text-red-500 text-stone-500 cursor-pointer active:scale-90'
            }`}
            title={liked ? 'Bạn đã thích bài viết này' : 'Thích bài viết này'}
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : 'text-stone-400'}`} />
            <span>{likes} thích</span>
          </button>
          <span className="flex items-center gap-1.5" title={`${shares} lượt chia sẻ`}>
            <Share2 className="w-4 h-4 text-stone-400" />
            <span>{shares} chia sẻ</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Chia sẻ:</span>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
            title="Sao chép liên kết"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 animate-bounce" /> : <LinkIcon className="w-4 h-4" />}
          </button>
          <a
            href={shareLinks.facebook}
            onClick={trackShare}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
