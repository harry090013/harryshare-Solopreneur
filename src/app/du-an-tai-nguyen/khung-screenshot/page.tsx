'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, Download, Sparkles, Monitor, 
  Layers, Sliders, Palette, Clipboard, Check, RefreshCw
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

type FrameStyle = 'macos' | 'browser' | 'minimal' | 'none';

interface BgPreset {
  id: string;
  name: string;
  gradient: string[];
}

const BG_PRESETS: BgPreset[] = [
  { id: 'sand-olive', name: 'Sand & Olive', gradient: ['#F5F0EA', '#C9B08F', '#2C3527'] },
  { id: 'sunset', name: 'Hoàng hôn', gradient: ['#FF9A8B', '#FF6A88', '#FF99AC'] },
  { id: 'midnight', name: 'Midnight Code', gradient: ['#0F2027', '#203A43', '#2C5364'] },
  { id: 'emerald', name: 'Ngọc lục bảo', gradient: ['#134E5E', '#71B280'] },
  { id: 'lavender', name: 'Lavender', gradient: ['#E0C3FC', '#8EC5FC'] },
  { id: 'transparent', name: 'Trong suốt', gradient: ['transparent', 'transparent'] }
];

export default function ScreenshotFramePage() {
  const [screenshotImg, setScreenshotImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>('screenshot.png');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Settings
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('macos');
  const [selectedBg, setSelectedBg] = useState<string>('sand-olive');
  const [padding, setPadding] = useState<number>(48); // 16 - 96
  const [borderRadius, setBorderRadius] = useState<number>(14); // 4 - 24
  const [shadowDepth, setShadowDepth] = useState<number>(32); // 0 - 50
  const [windowTitle, setWindowTitle] = useState<string>('harryshare.vn');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Load image from File
  const handleImageFile = (file: File) => {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      setScreenshotImg(img);
    };
  };

  // Listen to Global Paste Event (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleImageFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Render to Canvas
  const drawScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !screenshotImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgW = screenshotImg.naturalWidth;
    const imgH = screenshotImg.naturalHeight;

    // Header bar height based on frame style
    const headerH = frameStyle === 'macos' || frameStyle === 'browser' ? 42 : 0;

    // Frame outer dimensions
    const contentW = imgW;
    const contentH = imgH + headerH;

    // Total Canvas Dimensions (including padding)
    const totalW = contentW + padding * 2;
    const totalH = contentH + padding * 2;

    canvas.width = totalW;
    canvas.height = totalH;

    // 1. Draw Background
    const preset = BG_PRESETS.find(p => p.id === selectedBg) || BG_PRESETS[0];
    if (preset.id === 'transparent') {
      ctx.clearRect(0, 0, totalW, totalH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, totalW, totalH);
      if (preset.gradient.length === 2) {
        grad.addColorStop(0, preset.gradient[0]);
        grad.addColorStop(1, preset.gradient[1]);
      } else if (preset.gradient.length === 3) {
        grad.addColorStop(0, preset.gradient[0]);
        grad.addColorStop(0.5, preset.gradient[1]);
        grad.addColorStop(1, preset.gradient[2]);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    // 2. Draw Window Container (Shadow + Rounded border)
    ctx.save();
    const frameX = padding;
    const frameY = padding;

    // Shadow
    if (shadowDepth > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = shadowDepth * 1.5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadowDepth * 0.8;
    }

    // Window Path
    ctx.beginPath();
    ctx.roundRect(frameX, frameY, contentW, contentH, borderRadius);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Clip inner content
    ctx.clip();
    ctx.shadowColor = 'transparent'; // clear shadow for inner content

    // 3. Draw Window Header Bar
    if (frameStyle === 'macos' || frameStyle === 'browser') {
      ctx.fillStyle = '#FAFAF8';
      ctx.fillRect(frameX, frameY, contentW, headerH);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(frameX, frameY + headerH);
      ctx.lineTo(frameX + contentW, frameY + headerH);
      ctx.stroke();

      // Mac Buttons
      const btnRadius = 6;
      const btnY = frameY + headerH / 2;
      const btnStart = frameX + 18;
      const spacing = 20;

      // Red (close)
      ctx.beginPath();
      ctx.arc(btnStart, btnY, btnRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF5F56';
      ctx.fill();

      // Yellow (minimize)
      ctx.beginPath();
      ctx.arc(btnStart + spacing, btnY, btnRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFBD2E';
      ctx.fill();

      // Green (maximize)
      ctx.beginPath();
      ctx.arc(btnStart + spacing * 2, btnY, btnRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#27C93F';
      ctx.fill();

      // Browser URL bar or Title
      if (frameStyle === 'browser') {
        const barW = Math.min(contentW * 0.45, 360);
        const barX = frameX + (contentW - barW) / 2;
        const barH = 24;
        const barY = frameY + (headerH - barH) / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(windowTitle || 'https://harryshare.vn', frameX + contentW / 2, barY + barH / 2);
      }
    }

    // 4. Draw Screenshot Image
    ctx.drawImage(screenshotImg, frameX, frameY + headerH, imgW, imgH);
    ctx.restore();
  }, [screenshotImg, frameStyle, selectedBg, padding, borderRadius, shadowDepth, windowTitle]);

  useEffect(() => {
    if (screenshotImg) {
      drawScreenshot();
    }
  }, [screenshotImg, frameStyle, selectedBg, padding, borderRadius, shadowDepth, windowTitle, drawScreenshot]);

  // Download Output
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `mockup-${fileName.replace(/\.[^/.]+$/, '')}-harryshare.png`;
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
          <Monitor className="w-3 h-3 text-olive" />
          Tiện ích Mockup
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-850">
          Đóng Khung Ảnh Chụp Màn Hình Đẹp
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-2xl">
          Biến ảnh chụp màn hình máy tính, điện thoại thành khung macOS sang xịn kèm nền gradient ấm áp để đăng bài viết Facebook, Threads, LinkedIn hoặc tài liệu hướng dẫn.
        </p>
      </div>

      {/* Workspace */}
      {!screenshotImg ? (
        /* Dropzone / Paste zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-olive/20 hover:border-olive/50 bg-cream/40 hover:bg-sand/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all shadow-xs"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
          />
          <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center border border-olive/20 text-olive">
            <Clipboard className="w-8 h-8 animate-bounce" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-stone-850 font-bold text-base">Nhấn phím Ctrl + V để Dán ảnh chụp màn hình ngay</p>
            <p className="text-stone-400 text-xs">hoặc nhấp chuột để chọn ảnh từ máy tính (PNG, JPG, WebP)</p>
          </div>
          <span className="text-[10px] font-mono text-olive bg-olive/5 border border-olive/10 px-3 py-1 rounded-full mt-2">
            Mẹo: Chỉ cần bấm phím PrtSc / Snipping Tool rồi sang đây bấm Ctrl + V
          </span>
        </div>
      ) : (
        /* Editor Controls & Canvas */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Canvas Viewport */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-cream/50 border border-olive/15 rounded-3xl p-6 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
              <div className="w-full flex justify-between items-center mb-3 pb-3 border-b border-olive/10 text-xs">
                <span className="font-bold text-stone-700 truncate max-w-xs">{fileName}</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-olive hover:underline font-semibold cursor-pointer"
                >
                  Đổi ảnh khác
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                />
              </div>

              {/* Canvas element */}
              <div className="relative max-w-full max-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-olive/15 bg-sand/10">
                <canvas
                  ref={canvasRef}
                  className="max-h-[460px] max-w-full w-auto h-auto object-contain block"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto bg-olive hover:bg-olive-dark text-cream font-bold text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh Mockup PNG về máy</span>
              </button>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md">
            
            {/* 1. Frame Style */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-olive" />
                1. Kiểu khung hiển thị
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { id: 'macos', label: 'Cửa sổ macOS' },
                  { id: 'browser', label: 'Trình duyệt Web' },
                  { id: 'minimal', label: 'Thẻ phẳng tối giản' },
                  { id: 'none', label: 'Không khung viền' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFrameStyle(s.id as FrameStyle)}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer text-left ${
                      frameStyle === s.id
                        ? 'border-olive bg-olive text-cream'
                        : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title / URL Bar if Browser */}
            {frameStyle === 'browser' && (
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-stone-600 font-semibold">Tên miền URL:</span>
                <input
                  type="text"
                  value={windowTitle}
                  onChange={(e) => setWindowTitle(e.target.value)}
                  placeholder="https://harryshare.vn"
                  className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                />
              </div>
            )}

            {/* 2. Background Preset */}
            <div className="flex flex-col gap-2 border-t border-olive/10 pt-4">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-olive" />
                2. Phối màu nền Gradient
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BG_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedBg(p.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedBg === p.id 
                        ? 'border-olive bg-olive/10 text-olive' 
                        : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-stone-300 shrink-0 shadow-xs"
                      style={{ 
                        background: p.id === 'transparent' ? '#fff' : `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[p.gradient.length - 1]})` 
                      }}
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sliders */}
            <div className="flex flex-col gap-4 border-t border-olive/10 pt-4 text-xs">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-olive" />
                3. Căn chỉnh kích thước
              </label>

              {/* Padding */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Khoảng đệm nền (Padding):</span>
                  <span className="font-mono font-bold text-olive">{padding}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="96"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>

              {/* Corner Radius */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Bo góc khung hình:</span>
                  <span className="font-mono font-bold text-olive">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>

              {/* Shadow Depth */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Độ sâu bóng đổ (Shadow):</span>
                  <span className="font-mono font-bold text-olive">{shadowDepth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={shadowDepth}
                  onChange={(e) => setShadowDepth(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
