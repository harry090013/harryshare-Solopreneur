'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, FileImage, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

export default function ImageCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      }
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalSize(file.size);
    setPreviewUrl(URL.createObjectURL(file));
    setCompressedBlob(null);
    setCompressedUrl(null);
    // Auto-detect format format
    if (file.type === 'image/png') {
      setFormat('image/jpeg'); // Default to JPEG for best compression
    } else {
      setFormat('image/jpeg');
    }
  };

  const compressImage = () => {
    if (!selectedFile || !previewUrl) return;

    setIsCompressing(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsCompressing(false);
        return;
      }

      // Keep original dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw original image on canvas
      ctx.drawImage(img, 0, 0);

      // Compress
      const outputType = format;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
            if (compressedUrl) {
              URL.revokeObjectURL(compressedUrl);
            }
            setCompressedUrl(URL.createObjectURL(blob));
          }
          setIsCompressing(false);
        },
        outputType,
        quality
      );
    };
    img.onerror = () => {
      setIsCompressing(false);
    };
  };

  // Re-compress when quality or format changes
  useEffect(() => {
    if (selectedFile) {
      const delayDebounce = setTimeout(() => {
        compressImage();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [quality, format, selectedFile]);

  const handleDownload = () => {
    if (!compressedUrl || !selectedFile) return;
    const link = document.createElement('a');
    const extension = format === 'image/jpeg' ? '.jpg' : '.png';
    const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    link.href = compressedUrl;
    link.download = `${nameWithoutExt}-compressed${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const savingsPercentage = originalSize > 0 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100) 
    : 0;

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
          Nén hình ảnh Online
        </h1>
        <p className="text-stone-500 text-xs">
          Giảm dung lượng hình ảnh PNG, JPG trực tiếp trong trình duyệt của bạn. Tốc độ siêu tốc, bảo mật tuyệt đối (hình ảnh không được tải lên bất kỳ máy chủ nào).
        </p>
      </div>

      {/* Workspace */}
      <div className="bg-cream/40 border border-olive/10 rounded-2xl p-6 backdrop-blur-sm shadow-sm flex flex-col gap-6">
        {!selectedFile ? (
          /* Dropzone */
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center gap-4 cursor-pointer transition-all ${
              isDragActive 
                ? 'border-olive bg-olive/5' 
                : 'border-olive/20 hover:border-olive/40 hover:bg-sand/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />
            <div className="w-14 h-14 bg-olive/5 rounded-full flex items-center justify-center border border-olive/10">
              <Upload className="w-6 h-6 text-olive" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-700 text-sm font-semibold">Kéo và thả ảnh của bạn vào đây</p>
              <p className="text-stone-400 text-xs">hoặc nhấp để chọn file từ thiết bị</p>
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-2 bg-cream px-3 py-1 rounded-lg border border-olive/5">
              Hỗ trợ: JPG, PNG, WEBP, GIF (Tối đa 15MB)
            </div>
          </div>
        ) : (
          /* Editor UI */
          <div className="flex flex-col gap-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center border-b border-olive/10 pb-4">
              <div className="flex items-center gap-3">
                <FileImage className="w-5 h-5 text-olive" />
                <div className="flex flex-col">
                  <span className="text-stone-850 font-semibold text-xs truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{formatSize(originalSize)}</span>
                </div>
              </div>
              <button 
                onClick={handleReset} 
                className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
              >
                Chọn ảnh khác
              </button>
            </div>

            {/* Grid Preview and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Settings Panel */}
              <div className="flex flex-col gap-5 bg-sand/20 border border-olive/5 p-5 rounded-xl justify-center">
                <h3 className="text-stone-850 text-xs font-bold uppercase tracking-wider">Cấu hình nén</h3>
                
                {/* Quality Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600 font-semibold">Chất lượng nén:</span>
                    <span className="text-olive font-mono font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                  />
                  <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                    <span>Nén nhiều nhất (Dung lượng nhỏ)</span>
                    <span>Tốt nhất (Khuyên dùng)</span>
                  </div>
                </div>

                {/* Output Format */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-stone-600 font-semibold">Định dạng đầu ra:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormat('image/jpeg')}
                      className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg border transition-all cursor-pointer ${
                        format === 'image/jpeg'
                          ? 'bg-olive border-olive text-cream'
                          : 'bg-cream border-olive/10 text-stone-650 hover:border-olive/30'
                      }`}
                    >
                      JPG / JPEG (Nén tối ưu)
                    </button>
                    <button
                      onClick={() => setFormat('image/png')}
                      className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg border transition-all cursor-pointer ${
                        format === 'image/png'
                          ? 'bg-olive border-olive text-cream'
                          : 'bg-cream border-olive/10 text-stone-650 hover:border-olive/30'
                      }`}
                    >
                      PNG (Giữ chất lượng gốc)
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {compressedSize > 0 && (
                  <div className="border-t border-olive/10 pt-4 mt-2 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500">Dung lượng ban đầu:</span>
                      <span className="font-mono text-stone-700">{formatSize(originalSize)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500">Dung lượng sau nén:</span>
                      <span className="font-mono text-stone-700 font-bold">{formatSize(compressedSize)}</span>
                    </div>
                    {savingsPercentage > 0 ? (
                      <div className="bg-olive/5 border border-olive/10 rounded-lg p-2.5 flex justify-between items-center mt-1">
                        <span className="text-xs font-bold text-olive">Tiết kiệm được:</span>
                        <span className="text-sm font-black text-olive font-mono">-{savingsPercentage}%</span>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 flex items-center gap-1.5 text-amber-800 text-[10px] font-semibold mt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>File nén lớn hơn file gốc. Hãy thử giảm thanh chất lượng nén xuống.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Preview Panel */}
              <div className="flex flex-col gap-3 justify-center items-center bg-cream/30 border border-olive/5 p-4 rounded-xl min-h-[220px]">
                <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Xem trước kết quả</span>
                <div className="relative max-h-[180px] max-w-full overflow-hidden rounded-lg border border-olive/10 flex items-center justify-center bg-sand/10">
                  {previewUrl && (
                    <img
                      src={compressedUrl || previewUrl}
                      alt="Compressed preview"
                      className="max-h-[160px] object-contain"
                    />
                  )}
                  {isCompressing && (
                    <div className="absolute inset-0 bg-cream/70 flex items-center justify-center backdrop-blur-[1px]">
                      <RefreshCw className="w-8 h-8 text-olive animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 justify-end border-t border-olive/10 pt-4 mt-2">
              <button
                disabled={isCompressing || !compressedUrl}
                onClick={handleDownload}
                className="bg-olive hover:bg-olive-dark text-cream text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh đã nén về máy</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
