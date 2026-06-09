"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  UploadCloud, 
  Loader2, 
  Copy, 
  Check, 
  Plus, 
  ImageIcon,
  Image as ImageIconAlt
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  url: string;
}

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsCover?: (url: string) => void;
  onInsertToContent?: (url: string, name: string) => void;
  selectLabel?: string;
}

export default function MediaDrawer({ 
  isOpen, 
  onClose, 
  onSelectAsCover, 
  onInsertToContent,
  selectLabel
}: MediaDrawerProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media items when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error('Không thể tải danh sách ảnh.');
      }
      const data = await response.json();
      setMediaList(data);
    } catch (err: any) {
      console.error('Fetch media failed:', err);
      setErrorMsg(err.message || 'Lỗi tải danh sách ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    setIsUploading(true);
    setErrorMsg(null);
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Chỉ hỗ trợ file ảnh.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Lỗi tải ảnh lên.');
      }

      const newMedia = await response.json();
      setMediaList(prev => [newMedia, ...prev]);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMsg(err.message || 'Lỗi kết nối khi tải ảnh.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyLink = (media: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const absoluteUrl = `${window.location.origin}${media.url}`;
    navigator.clipboard.writeText(absoluteUrl);
    setCopiedId(media.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in bg-stone-900/40 backdrop-blur-xs">
      {/* Overlay click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-lg md:max-w-xl h-full bg-cream border-l border-olive/15 shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-olive/10 flex items-center justify-between bg-sand/20">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-olive" />
            <h3 className="font-serif font-bold text-olive text-lg">Thư viện ảnh bài viết</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-olive/10 text-stone-400 hover:text-olive rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Quick upload + Search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm kiếm hình ảnh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-olive/15 rounded-xl text-xs outline-none focus:border-olive transition-colors text-stone-800"
              />
            </div>

            {/* Quick Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-olive bg-olive hover:bg-olive-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Tải ảnh mới</span>
                </>
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Image grid */}
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="w-8 h-8 text-olive animate-spin" />
              <span className="text-xs text-stone-400 font-medium">Đang tải danh sách ảnh...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-2 border border-dashed border-olive/10 rounded-2xl bg-sand/5">
              <ImageIconAlt className="w-10 h-10 text-stone-300" />
              <span className="text-xs font-semibold text-stone-500">Chưa có ảnh nào</span>
              <p className="text-[10px] text-stone-400 max-w-xs">Hãy nhấn nút "Tải ảnh mới" để bắt đầu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3.5">
              {filteredMedia.map((media) => (
                <div 
                  key={media.id}
                  className="group relative bg-white border border-olive/10 rounded-xl overflow-hidden aspect-square flex flex-col cursor-pointer hover:shadow-sm"
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={media.url} 
                    alt={media.name} 
                    className="w-full h-full object-cover"
                  />

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-stretch justify-end p-1.5 gap-1">
                    {/* Insert content */}
                    {onInsertToContent && (
                      <button
                        onClick={() => onInsertToContent(media.url, media.name)}
                        className="py-1 bg-white hover:bg-olive hover:text-white text-stone-850 rounded-md font-bold text-[9px] uppercase tracking-wider text-center transition-colors cursor-pointer"
                      >
                        Chèn vào bài
                      </button>
                    )}

                    {/* Set Cover image */}
                    {onSelectAsCover && (
                      <button
                        onClick={() => onSelectAsCover(media.url)}
                        className="py-1 bg-white hover:bg-olive hover:text-white text-stone-850 rounded-md font-bold text-[9px] uppercase tracking-wider text-center transition-colors cursor-pointer"
                      >
                        {selectLabel || "Chọn ảnh"}
                      </button>
                    )}

                    {/* Copy URL */}
                    <button
                      onClick={(e) => handleCopyLink(media, e)}
                      className="py-1 bg-white/90 hover:bg-white text-stone-850 rounded-md font-bold text-[9px] uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {copiedId === media.id ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" />
                          <span>Đã chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>Sao chép link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-olive/10 bg-sand/10 text-center">
          <p className="text-[10px] text-stone-400 font-medium">
            Mẹo: Click "Chèn vào bài" để tự động thêm thẻ Markdown hình ảnh vào vị trí cuối bài viết.
          </p>
        </div>
      </div>
    </div>
  );
}
