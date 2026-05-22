"use client";

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Search, 
  Grid, 
  List, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  X, 
  Image as ImageIcon,
  FileText,
  Loader2,
  HardDrive
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  url: string;
}

interface MediaClientProps {
  initialMedia: MediaItem[];
}

export default function MediaClient({ initialMedia }: MediaClientProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalFiles = mediaList.length;
  const totalSizeBytes = mediaList.reduce((acc, curr) => acc + curr.size, 0);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUploadFiles(e.target.files);
    }
  };

  const handleUploadFiles = async (files: FileList) => {
    setIsUploading(true);
    setErrorMsg(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validation: Accept images only
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Chỉ hỗ trợ tải lên các tệp tin hình ảnh (PNG, JPG, WEBP, GIF, SVG...).');
        setIsUploading(false);
        return;
      }

      // Max size: 8MB
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Dung lượng tệp tin không được vượt quá 8MB.');
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Lỗi tải lên.');
        }

        const newMedia = await response.json();
        setMediaList((prev) => [newMedia, ...prev]);
      } catch (err: any) {
        console.error('Upload failed:', err);
        setErrorMsg(err.message || 'Có lỗi xảy ra khi tải ảnh lên server.');
      }
    }
    
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = (media: MediaItem) => {
    // Generate absolute URL for copying
    const absoluteUrl = `${window.location.origin}${media.url}`;
    navigator.clipboard.writeText(absoluteUrl);
    setCopiedId(media.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async (mediaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này khỏi thư viện?')) {
      return;
    }

    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Lỗi xóa ảnh.');
      }

      setMediaList((prev) => prev.filter((item) => item.id !== mediaId));
      if (selectedMedia?.id === mediaId) {
        setSelectedMedia(null);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi xảy ra khi xóa hình ảnh.');
    }
  };

  // Filter media items by search query
  const filteredMedia = mediaList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive">Thư viện ảnh</h1>
          <p className="text-stone-500 text-sm mt-1">
            Quản lý, tải lên hình ảnh cho các bài viết, chủ đề hoặc thông tin cá nhân.
          </p>
        </div>

        {/* Total Storage Stats */}
        <div className="flex items-center gap-4 bg-sand/40 border border-olive/10 px-5 py-3 rounded-2xl shrink-0 shadow-xs">
          <HardDrive className="w-8 h-8 text-olive/60" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">DUNG LƯỢNG ĐÃ DÙNG</span>
            <span className="text-lg font-bold text-olive mt-1 leading-none">
              {formatBytes(totalSizeBytes)}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">{totalFiles} hình ảnh</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <p className="text-sm font-medium">{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          dragActive 
            ? 'border-olive bg-olive/5 scale-[0.99] shadow-inner' 
            : 'border-olive/20 hover:border-olive/40 hover:bg-olive/5'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple 
          accept="image/*" 
          className="hidden" 
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-olive animate-spin" />
            <h3 className="font-semibold text-olive text-lg">Đang tải lên thư viện...</h3>
            <p className="text-stone-400 text-sm">Vui lòng chờ trong giây lát.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-olive/5 rounded-full border border-olive/10 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-olive" />
            </div>
            <h3 className="font-serif font-bold text-olive text-lg">Tải lên hình ảnh mới</h3>
            <p className="text-stone-500 text-sm max-w-md">
              Kéo thả hình ảnh vào đây hoặc <span className="text-olive underline font-medium">chọn từ thiết bị</span>
            </p>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Hỗ trợ PNG, JPG, WEBP, GIF (Tối đa 8MB)</p>
          </div>
        )}
      </div>

      {/* Media Management Grid / Toolbar */}
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm kiếm hình ảnh theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-olive/15 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors text-sm"
            />
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-olive text-white border-olive' 
                  : 'bg-white text-stone-600 border-olive/15 hover:bg-olive/5'
              }`}
              title="Dạng lưới"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-olive text-white border-olive' 
                  : 'bg-white text-stone-600 border-olive/15 hover:bg-olive/5'
              }`}
              title="Dạng danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredMedia.length === 0 ? (
          <div className="bg-sand/20 border border-dashed border-olive/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3">
            <ImageIcon className="w-12 h-12 text-olive/30" />
            <h3 className="font-serif font-bold text-olive text-lg">Không tìm thấy ảnh nào</h3>
            <p className="text-stone-500 text-sm max-w-sm">
              {searchQuery 
                ? 'Không có hình ảnh nào trùng khớp với từ khóa tìm kiếm của bạn.' 
                : 'Thư viện ảnh của bạn đang trống. Hãy tải lên hình ảnh đầu tiên!'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((media) => (
              <div 
                key={media.id} 
                className="group relative bg-white border border-olive/10 rounded-2xl overflow-hidden hover:shadow-md hover:border-olive/30 transition-all duration-200 flex flex-col cursor-pointer"
                onClick={() => setSelectedMedia(media)}
              >
                {/* Thumbnail container */}
                <div className="relative aspect-square bg-cream overflow-hidden border-b border-olive/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={media.url} 
                    alt={media.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedia(media);
                      }}
                      className="p-2 bg-white/95 rounded-full hover:bg-white text-stone-800 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(media);
                      }}
                      className="p-2 bg-white/95 rounded-full hover:bg-white text-stone-800 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                      title="Sao chép liên kết"
                    >
                      {copiedId === media.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDeleteMedia(media.id, e)}
                      className="p-2 bg-white/95 rounded-full hover:bg-red-550 hover:text-white text-red-500 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Copy status toast overlay if copied from here */}
                  {copiedId === media.id && (
                    <div className="absolute top-2 left-2 right-2 bg-green-600 text-white text-[10px] font-bold py-1 px-2 rounded text-center shadow-md animate-fade-in">
                      Đã sao chép liên kết!
                    </div>
                  )}
                </div>

                {/* Info area */}
                <div className="p-3 flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-stone-700 truncate" title={media.name}>
                    {media.name}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">
                    {formatBytes(media.size)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white border border-olive/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-stone-600">
                <thead className="bg-sand/30 border-b border-olive/10 text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                  <tr>
                    <th className="p-4 w-16">Xem trước</th>
                    <th className="p-4">Tên file</th>
                    <th className="p-4 w-28">Định dạng</th>
                    <th className="p-4 w-28">Dung lượng</th>
                    <th className="p-4 w-36">Ngày tải lên</th>
                    <th className="p-4 w-32 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olive/5">
                  {filteredMedia.map((media) => (
                    <tr 
                      key={media.id} 
                      className="hover:bg-olive/2 transition-colors cursor-pointer"
                      onClick={() => setSelectedMedia(media)}
                    >
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-olive/10 bg-cream">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-stone-800 truncate max-w-xs" title={media.name}>
                        {media.name}
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-sand border border-olive/10 rounded-md font-mono text-stone-600 text-xs">
                          {media.type.split('/')[1] || media.type}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-stone-600">
                        {formatBytes(media.size)}
                      </td>
                      <td className="p-4 text-xs text-stone-400">
                        {new Date(media.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedMedia(media)}
                            className="p-1.5 hover:bg-olive/10 text-stone-500 hover:text-olive rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleCopyLink(media)}
                            className="p-1.5 hover:bg-olive/10 text-stone-500 hover:text-olive rounded-lg transition-colors relative cursor-pointer"
                            title="Sao chép liên kết"
                          >
                            {copiedId === media.id ? (
                              <Check className="w-4.5 h-4.5 text-green-600" />
                            ) : (
                              <Copy className="w-4.5 h-4.5" />
                            )}
                            
                            {copiedId === media.id && (
                              <span className="absolute -top-8 right-0 bg-green-600 text-white text-[9px] py-1 px-1.5 rounded shadow-md whitespace-nowrap z-10 animate-bounce">
                                Đã chép!
                              </span>
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDeleteMedia(media.id, e)}
                            className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                            title="Xóa hình ảnh"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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

      {/* Modal - Preview & Info */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-olive/15 flex flex-col md:flex-row animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side - Full-size Image preview */}
            <div className="flex-1 bg-cream flex items-center justify-center p-6 min-h-[300px] border-b md:border-b-0 md:border-r border-olive/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.name} 
                className="max-h-[400px] max-w-full object-contain rounded-lg drop-shadow-md"
              />
            </div>

            {/* Right side - Image details & operations */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between gap-6 bg-sand/15">
              {/* Details Header */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Chi tiết ảnh</span>
                  <button 
                    onClick={() => setSelectedMedia(null)} 
                    className="p-1 hover:bg-olive/10 text-stone-400 hover:text-olive rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-serif font-bold text-olive text-lg break-words" title={selectedMedia.name}>
                    {selectedMedia.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 mt-2">
                    <div className="bg-white border border-olive/5 p-2 rounded-xl flex flex-col">
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Định dạng</span>
                      <span className="text-xs font-semibold text-stone-700 truncate mt-0.5">{selectedMedia.type}</span>
                    </div>
                    <div className="bg-white border border-olive/5 p-2 rounded-xl flex flex-col">
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Dung lượng</span>
                      <span className="text-xs font-semibold text-stone-700 mt-0.5">{formatBytes(selectedMedia.size)}</span>
                    </div>
                  </div>
                  <div className="bg-white border border-olive/5 p-2.5 rounded-xl flex flex-col mt-1">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Ngày đăng</span>
                    <span className="text-xs font-semibold text-stone-600 mt-0.5">
                      {new Date(selectedMedia.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => handleCopyLink(selectedMedia)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-olive hover:bg-olive-dark text-white rounded-xl font-medium shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  {copiedId === selectedMedia.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã sao chép link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép link ảnh</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-olive/15 hover:bg-olive/5 text-stone-700 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span>Mở trong tab mới</span>
                </a>

                <button
                  onClick={(e) => handleDeleteMedia(selectedMedia.id, e)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium border border-red-100 transition-colors mt-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa ảnh vĩnh viễn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
