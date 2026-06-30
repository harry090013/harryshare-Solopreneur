'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, FileImage, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

interface ConvertedFile {
  id: string;
  name: string;
  originalSize: number;
  webpSize: number;
  webpUrl: string;
  status: 'processing' | 'done' | 'error';
}

export default function WebpConverterPage() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (selectedFiles: File[]) => {
    setIsProcessingAll(true);
    
    // Filter only images
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    const newFiles: ConvertedFile[] = imageFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      originalSize: file.size,
      webpSize: 0,
      webpUrl: '',
      status: 'processing'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each image file
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const targetId = newFiles[i].id;

      try {
        const webpData = await convertToWebP(file);
        setFiles(prev => prev.map(item => {
          if (item.id === targetId) {
            return {
              ...item,
              webpSize: webpData.size,
              webpUrl: webpData.url,
              status: 'done'
            };
          }
          return item;
        }));
      } catch (err) {
        setFiles(prev => prev.map(item => {
          if (item.id === targetId) {
            return { ...item, status: 'error' };
          }
          return item;
        }));
      }
    }

    setIsProcessingAll(false);
  };

  const convertToWebP = (file: File): Promise<{ size: number; url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  size: blob.size,
                  url: URL.createObjectURL(blob)
                });
              } else {
                reject(new Error('Conversion failed'));
              }
            },
            'image/webp',
            0.82 // Default quality for optimal web use
          );
        };
        img.onerror = () => reject(new Error('Image load failed'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  };

  const handleDownloadOne = (file: ConvertedFile) => {
    if (file.status !== 'done') return;
    const link = document.createElement('a');
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    link.href = file.webpUrl;
    link.download = `${nameWithoutExt}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const completedFiles = files.filter(f => f.status === 'done');
    completedFiles.forEach((file, index) => {
      setTimeout(() => {
        handleDownloadOne(file);
      }, index * 250); // Small stagger delay to prevent browser blockages
    });
  };

  const handleClear = () => {
    // Revoke object URLs to prevent memory leak
    files.forEach(file => {
      if (file.webpUrl) URL.revokeObjectURL(file.webpUrl);
    });
    setFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-8 animate-slide-up">
      {/* Back button */}
      <Link 
        href="/du-an-tai-nguyen" 
        className="flex items-center gap-2 text-stone-500 hover:text-olive transition-colors text-xs font-semibold w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Dự án & Tài nguyên</span>
      </Link>

      {/* Header */}
      <div className="text-left flex flex-col gap-2">
        <span className="text-[10px] font-bold text-olive uppercase tracking-widest bg-olive/5 px-2.5 py-1 rounded-full w-fit flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-olive animate-pulse" />
          Tiện ích miễn phí
        </span>
        <h1 className="font-serif text-3xl font-black text-stone-850">
          Convert ảnh sang WebP hàng loạt
        </h1>
        <p className="text-stone-500 text-xs">
          Chuyển đổi các định dạng ảnh phổ biến (PNG, JPG, JPEG) sang định dạng thế hệ mới WebP hoàn toàn miễn phí. WebP giúp giảm 40% dung lượng so với PNG/JPG mà không giảm chất lượng, tăng tốc độ load website vượt trội.
        </p>
      </div>

      {/* Dropzone / List */}
      <div className="bg-cream/40 border border-olive/10 rounded-2xl p-6 backdrop-blur-sm shadow-sm flex flex-col gap-6">
        
        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center flex flex-col items-center gap-3 cursor-pointer transition-all ${
            isDragActive 
              ? 'border-olive bg-olive/5' 
              : 'border-olive/20 hover:border-olive/40 hover:bg-sand/10'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFileInputChange}
          />
          <div className="w-12 h-12 bg-olive/5 rounded-full flex items-center justify-center border border-olive/10">
            <Upload className="w-5 h-5 text-olive" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-stone-700 text-xs font-semibold">Kéo và thả nhiều ảnh vào đây</p>
            <p className="text-stone-400 text-[10px]">hoặc nhấp để chọn nhiều file từ máy</p>
          </div>
        </div>

        {/* Files Process list */}
        {files.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-olive/10 pb-3">
              <span className="text-stone-850 text-xs font-bold uppercase tracking-wider">Danh sách hình ảnh ({files.length})</span>
              <button 
                onClick={handleClear} 
                disabled={isProcessingAll}
                className="text-xs text-red-650 hover:text-red-750 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Xóa sạch danh sách
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3.5 bg-cream/60 border border-olive/5 rounded-xl text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileImage className="w-4 h-4 text-stone-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-stone-800 truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">Gốc: {formatSize(file.originalSize)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {file.status === 'processing' && (
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[10px]">Đang convert...</span>
                      </div>
                    )}
                    {file.status === 'error' && (
                      <span className="text-red-500 font-semibold text-[10px]">Lỗi convert</span>
                    )}
                    {file.status === 'done' && (
                      <>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-olive font-mono">{formatSize(file.webpSize)}</span>
                          <span className="text-[9px] text-olive font-bold font-mono">
                            -{Math.round(((file.originalSize - file.webpSize) / file.originalSize) * 100)}%
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownloadOne(file)}
                          className="bg-olive/10 text-olive hover:bg-olive hover:text-cream px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-[0.97]"
                        >
                          <Download className="w-3 h-3" />
                          <span>Tải WebP</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Batch Control */}
            {files.some(f => f.status === 'done') && (
              <div className="flex justify-between items-center bg-sand/20 border border-olive/5 p-4 rounded-xl mt-2">
                <div className="flex items-center gap-2 text-olive font-semibold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Đã convert xong {files.filter(f => f.status === 'done').length} hình ảnh!</span>
                </div>
                <button
                  onClick={handleDownloadAll}
                  className="bg-olive hover:bg-olive-dark text-cream text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải xuống tất cả (.webp)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
