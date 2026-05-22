'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Heart, Share2, Link as LinkIcon, Check } from 'lucide-react';

interface PostInteractionsProps {
  postId: string;
  initialViews: number;
  initialLikes: number;
  initialShares: number;
  postTitle: string;
}

export default function PostInteractions({
  postId,
  initialViews,
  initialLikes,
  initialShares,
  postTitle
}: PostInteractionsProps) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

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
  }, [postId]);

  const handleLike = async () => {
    if (liked) return;
    
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-b border-olive/10 py-5 my-8 gap-4 bg-sand/10 px-4 rounded-xl">
      {/* Metrics Indicators */}
      <div className="flex items-center gap-6 text-stone-500 text-xs font-semibold">
        <span className="flex items-center gap-1.5" title={`${views} lượt xem`}>
          <Eye className="w-4 h-4 text-stone-400" />
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
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 stroke-red-500' : 'text-stone-400'}`} />
          <span>{likes} thích</span>
        </button>
        <span className="flex items-center gap-1.5" title={`${shares} lượt chia sẻ`}>
          <Share2 className="w-4 h-4 text-stone-400" />
          <span>{shares} chia sẻ</span>
        </span>
      </div>

      {/* Share Actions */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Chia sẻ:</span>
        
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
          title="Sao chép liên kết"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 animate-bounce" /> : <LinkIcon className="w-4 h-4" />}
        </button>

        {/* Facebook Share */}
        <a
          href={shareLinks.facebook}
          onClick={trackShare}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          title="Chia sẻ qua Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
          </svg>
        </a>

        {/* Twitter Share */}
        <a
          href={shareLinks.twitter}
          onClick={trackShare}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          title="Chia sẻ qua Twitter"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* LinkedIn Share */}
        <a
          href={shareLinks.linkedin}
          onClick={trackShare}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          title="Chia sẻ qua LinkedIn"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
