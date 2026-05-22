'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  };

  return (
    <div className="flex items-center gap-3.5 border-t border-b border-olive/5 py-4 my-6">
      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
        <Share2 className="w-3.5 h-3.5" /> Chia sẻ bài viết:
      </span>
      <div className="flex items-center gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all cursor-pointer shadow-xs active:scale-95"
          title="Sao chép liên kết"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <LinkIcon className="w-4 h-4" />}
        </button>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          title="Chia sẻ Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
          </svg>
        </a>

        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          title="Chia sẻ Twitter"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* Linkedin */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-olive/10 hover:border-olive/30 text-stone-600 hover:text-olive bg-cream/70 hover:bg-cream transition-all shadow-xs active:scale-95 flex items-center justify-center"
          title="Chia sẻ LinkedIn"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>

      {copied && (
        <span className="text-[10px] font-bold text-emerald-600 animate-fade-in uppercase tracking-wider">
          Đã copy liên kết!
        </span>
      )}
    </div>
  );
}
