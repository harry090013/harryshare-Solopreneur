'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, Download, Sparkles, Wand2, 
  Pipette, RefreshCw, Eraser, Check, Eye, Sliders, AlertCircle
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

export default function BackgroundRemoverPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  
  // Canvases
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Settings
  const [tolerance, setTolerance] = useState<number>(28); // 5 - 80
  const [smoothness, setSmoothness] = useState<number>(6); // 1 - 20
  const [bgPreviewColor, setBgPreviewColor] = useState<'transparent' | '#FFFFFF' | '#F4EFEB' | '#D80027' | '#0052CC'>('transparent');
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      setOriginalImage(img);
      // Auto detect corner color as default background
      detectDefaultBgColor(img);
    };
  };

  // Auto-sample top-left corner color as the initial background candidate
  const detectDefaultBgColor = (img: HTMLImageElement) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    // Sample top-left corner (5x5 average)
    const imgData = ctx.getImageData(0, 0, Math.min(10, img.naturalWidth), Math.min(10, img.naturalHeight));
    let r = 0, g = 0, b = 0;
    const count = imgData.data.length / 4;
    for (let i = 0; i < imgData.data.length; i += 4) {
      r += imgData.data[i];
      g += imgData.data[i + 1];
      b += imgData.data[i + 2];
    }
    setTargetColor({
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count)
    });
  };

  // Process Background Removal Algorithm
  const processImage = useCallback(() => {
    if (!originalImage || !targetColor) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = originalImage.naturalWidth;
    const h = originalImage.naturalHeight;

    canvas.width = w;
    canvas.height = h;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    const tr = targetColor.r;
    const tg = targetColor.g;
    const tb = targetColor.b;

    // Convert tolerance to distance squared
    const tolDist = (tolerance / 100) * 441.67; // max Euclidean distance is sqrt(255^2*3) = 441.67
    const feather = (smoothness / 100) * 100;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Euclidean color distance
      const dist = Math.sqrt(
        (r - tr) * (r - tr) +
        (g - tg) * (g - tg) +
        (b - tb) * (b - tb)
      );

      if (dist < tolDist) {
        // Full transparency for matching background
        data[i + 3] = 0;
      } else if (dist < tolDist + feather) {
        // Smooth transition edge
        const alphaRatio = (dist - tolDist) / feather;
        data[i + 3] = Math.min(data[i + 3], Math.round(alphaRatio * 255));
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsProcessing(false);
  }, [originalImage, targetColor, tolerance, smoothness]);

  useEffect(() => {
    if (originalImage && targetColor) {
      processImage();
    }
  }, [originalImage, targetColor, tolerance, smoothness, processImage]);

  // Handle Eyedropper click on Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive || !originalImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Scale click coords to original dimensions
    const scaleX = originalImage.naturalWidth / rect.width;
    const scaleY = originalImage.naturalHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Get color from original image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalImage.naturalWidth;
    tempCanvas.height = originalImage.naturalHeight;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(originalImage, 0, 0);
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    setIsEyedropperActive(false);
  };

  // Download transparent PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create export canvas to apply custom preview background if selected
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    if (bgPreviewColor !== 'transparent') {
      ctx.fillStyle = bgPreviewColor;
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    ctx.drawImage(canvas, 0, 0);

    const a = document.createElement('a');
    a.href = exportCanvas.toDataURL('image/png');
    const baseName = selectedFile?.name.replace(/\.[^/.]+$/, '') || 'anh-tach-nen';
    a.download = `${baseName}-tach-nen-harryshare.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-8 animate-slide-up">
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
          <Wand2 className="w-3 h-3 text-olive" />
          Tiện ích xử lý ảnh
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-850">
          Tách Nền Ảnh Tự Động Online
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-2xl">
          Tách nền sản phẩm, vật thể và chân dung trực tiếp trên trình duyệt. 100% miễn phí trọn đời, không giới hạn độ phân giải, an toàn tuyệt đối vì hình ảnh không bị tải lên bất kỳ máy chủ nào.
        </p>
      </div>

      {/* Main Workspace */}
      {!selectedFile ? (
        /* Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-olive/20 hover:border-olive/50 bg-cream/40 hover:bg-sand/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all shadow-xs"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center border border-olive/20 text-olive">
            <Upload className="w-8 h-8 animate-bounce" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-stone-850 font-bold text-base">Nhấp hoặc kéo thả ảnh cần tách nền vào đây</p>
            <p className="text-stone-400 text-xs">Hỗ trợ ảnh sản phẩm, ảnh chân dung, cây cối, chữ ký... (JPG, PNG, WebP)</p>
          </div>
          <span className="text-[10px] font-mono text-olive bg-olive/5 border border-olive/10 px-3 py-1 rounded-full mt-2">
            Không nén mờ • Tải ảnh gốc 100%
          </span>
        </div>
      ) : (
        /* Editor UI */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Canvas Display Viewport */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-cream/50 border border-olive/15 rounded-3xl p-6 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center relative min-h-[460px]">
              
              {/* Header inside viewport */}
              <div className="w-full flex justify-between items-center mb-3 pb-3 border-b border-olive/10 text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-olive" />
                  Kết quả tách nền
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-olive hover:underline font-semibold cursor-pointer"
                >
                  Chọn ảnh khác
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>

              {/* Checkerboard / Preview Background Container */}
              <div 
                className={`relative max-w-full max-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden border border-olive/20 shadow-md ${
                  isEyedropperActive ? 'cursor-crosshair' : 'cursor-default'
                }`}
                style={{
                  backgroundColor: bgPreviewColor === 'transparent' ? undefined : bgPreviewColor,
                  backgroundImage: bgPreviewColor === 'transparent' 
                    ? 'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)'
                    : undefined,
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                }}
              >
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="max-h-[460px] max-w-full w-auto h-auto object-contain block"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-cream/60 backdrop-blur-[1px] flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-olive animate-spin" />
                  </div>
                )}
              </div>

              {/* Eyedropper notification */}
              {isEyedropperActive && (
                <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5">
                  <Pipette className="w-4 h-4" />
                  <span>Bấm vào vùng màu nền trên bức ảnh để chọn màu cần loại bỏ</span>
                </div>
              )}
            </div>

            {/* Download CTA */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto bg-olive hover:bg-olive-dark text-cream font-bold text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh PNG về máy</span>
              </button>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md">
            
            {/* Tool 1: Eyedropper & Color Target */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5 text-olive" />
                1. Màu nền mục tiêu
              </label>
              
              <div className="flex items-center gap-3 bg-sand/20 p-3 rounded-2xl border border-olive/10">
                <div 
                  className="w-8 h-8 rounded-xl border border-stone-300 shadow-xs shrink-0"
                  style={{ backgroundColor: targetColor ? `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` : '#fff' }}
                  title="Màu đang được tách"
                />
                <div className="flex flex-col flex-1 text-xs">
                  <span className="font-semibold text-stone-800">
                    RGB: {targetColor ? `${targetColor.r}, ${targetColor.g}, ${targetColor.b}` : 'Chưa chọn'}
                  </span>
                  <span className="text-[10px] text-stone-400">Vùng màu bị tách thành trong suốt</span>
                </div>
                <button
                  onClick={() => setIsEyedropperActive(!isEyedropperActive)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isEyedropperActive 
                      ? 'bg-olive text-cream border-olive' 
                      : 'bg-cream text-stone-700 border-olive/20 hover:border-olive'
                  }`}
                  title="Chấm màu trên ảnh"
                >
                  <Pipette className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tool 2: Sliders */}
            <div className="flex flex-col gap-4 border-t border-olive/10 pt-4">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-olive" />
                2. Độ nhạy & Làm mịn cạnh
              </label>

              {/* Tolerance */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Độ nhạy xóa nền:</span>
                  <span className="font-mono font-bold text-olive">{tolerance}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>Giữ lại nhiều chi tiết</span>
                  <span>Xóa triệt để nền</span>
                </div>
              </div>

              {/* Smoothness */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Làm mềm đường viền (Feather):</span>
                  <span className="font-mono font-bold text-olive">{smoothness}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={smoothness}
                  onChange={(e) => setSmoothness(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>
            </div>

            {/* Tool 3: Background Preview Switcher */}
            <div className="flex flex-col gap-2.5 border-t border-olive/10 pt-4">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-olive" />
                3. Thay thế màu nền mới
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'transparent', label: 'Trong', color: 'transparent' },
                  { id: '#FFFFFF', label: 'Trắng', color: '#FFFFFF' },
                  { id: '#F4EFEB', label: 'Kem', color: '#F4EFEB' },
                  { id: '#0052CC', label: 'Xanh', color: '#0052CC' },
                  { id: '#D80027', label: 'Đỏ', color: '#D80027' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setBgPreviewColor(c.id as any)}
                    className={`py-2 flex flex-col items-center gap-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      bgPreviewColor === c.id 
                        ? 'border-olive bg-olive/10 text-olive' 
                        : 'border-olive/10 bg-sand/15 text-stone-600 hover:border-olive/30'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: c.color }}
                    />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Helpful tip */}
            <div className="bg-sand/30 border border-olive/10 rounded-2xl p-3.5 text-[11px] text-stone-600 flex gap-2 items-start mt-2">
              <AlertCircle className="w-4 h-4 text-olive shrink-0 mt-0.5" />
              <span>Mẹo: Nếu ảnh có nền phức tạp, hãy nhấp vào biểu tượng <b>Cây bút chấm màu</b> rồi bấm vào góc nền thừa để máy xóa chính xác nhất!</span>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
