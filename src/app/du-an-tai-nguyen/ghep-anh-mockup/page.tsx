'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, Download, Sparkles, Image as ImageIcon, 
  RotateCw, Move, Layers, RefreshCw, Eye, Sliders, Type
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

type AspectRatio = '1:1' | '16:9' | '4:5' | '9:16';
type ShadowType = 'none' | 'soft' | 'floating' | 'deep';

export default function MockupCollagePage() {
  // Canvas & images
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [bgPreset, setBgPreset] = useState<string>('wood');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);

  const [fgImage, setFgImage] = useState<HTMLImageElement | null>(null);
  const [fgFileName, setFgFileName] = useState<string>('');

  // Canvas settings
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [scale, setScale] = useState<number>(75); // %
  const [posX, setPosX] = useState<number>(50); // % from left
  const [posY, setPosY] = useState<number>(50); // % from top
  const [rotation, setRotation] = useState<number>(0); // degrees
  const [borderRadius, setBorderRadius] = useState<number>(16); // px
  const [shadow, setShadow] = useState<ShadowType>('floating');
  const [opacity, setOpacity] = useState<number>(100);

  // Text overlay
  const [showText, setShowText] = useState<boolean>(false);
  const [titleText, setTitleText] = useState<string>('Thảo Mộc Hương • Duy Xuyên');
  const [textColor, setTextColor] = useState<'#2C3527' | '#FFFFFF' | '#C98A42'>('#2C3527');

  const bgInputRef = useRef<HTMLInputElement>(null);
  const fgInputRef = useRef<HTMLInputElement>(null);

  // Determine canvas base dimensions based on ratio
  const getCanvasDimensions = useCallback((): { width: number; height: number } => {
    switch (aspectRatio) {
      case '16:9':
        return { width: 1200, height: 675 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '9:16':
        return { width: 1080, height: 1920 };
      case '1:1':
      default:
        return { width: 1080, height: 1080 };
    }
  }, [aspectRatio]);

  // Handle Foreground Image Upload
  const handleFgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFgFileName(file.name);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        setFgImage(img);
      };
    }
  };

  // Handle Custom Background Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
      setBgPreset('custom');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        setBgImage(img);
      };
    }
  };

  // Render Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (bgPreset === 'custom' && bgImage) {
      // Cover fit custom background image
      const bgAspect = bgImage.naturalWidth / bgImage.naturalHeight;
      const canvasAspect = width / height;
      let renderW = width;
      let renderH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (bgAspect > canvasAspect) {
        renderW = height * bgAspect;
        offsetX = (width - renderW) / 2;
      } else {
        renderH = width / bgAspect;
        offsetY = (height - renderH) / 2;
      }
      ctx.drawImage(bgImage, offsetX, offsetY, renderW, renderH);
    } else {
      // Draw Presets
      if (bgPreset === 'wood') {
        // Warm rustic wood tone with subtle grain gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#E8DFD0');
        grad.addColorStop(0.5, '#DECBB1');
        grad.addColorStop(1, '#C9B08F');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Subtle warm vignette
        const rad = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.8);
        rad.addColorStop(0, 'rgba(255,255,255,0.2)');
        rad.addColorStop(1, 'rgba(100,70,40,0.15)');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'sand') {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#F5F0EA');
        grad.addColorStop(1, '#E5DACB');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'olive') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#3A4433');
        grad.addColorStop(1, '#232A1F');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'studio') {
        const rad = ctx.createRadialGradient(width / 2, height * 0.4, 50, width / 2, height / 2, width * 0.7);
        rad.addColorStop(0, '#FFFFFF');
        rad.addColorStop(1, '#D5D7DC');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'transparent') {
        ctx.clearRect(0, 0, width, height);
      }
    }

    // 2. Draw Foreground Image (Product / Mockup)
    if (fgImage) {
      ctx.save();

      const centerX = (width * posX) / 100;
      const centerY = (height * posY) / 100;

      // Base target sizing
      const maxTargetDim = Math.min(width, height) * 0.8;
      const baseScale = maxTargetDim / Math.max(fgImage.naturalWidth, fgImage.naturalHeight);
      const finalScale = baseScale * (scale / 100);

      const drawW = fgImage.naturalWidth * finalScale;
      const drawH = fgImage.naturalHeight * finalScale;

      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity / 100;

      // Configure Shadows
      if (shadow === 'soft') {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;
      } else if (shadow === 'floating') {
        ctx.shadowColor = 'rgba(25, 20, 15, 0.28)';
        ctx.shadowBlur = 38;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 24;
      } else if (shadow === 'deep') {
        ctx.shadowColor = 'rgba(10, 10, 10, 0.45)';
        ctx.shadowBlur = 60;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 35;
      } else {
        ctx.shadowColor = 'transparent';
      }

      // Draw rounded rectangle clip if border radius > 0
      if (borderRadius > 0) {
        ctx.beginPath();
        const rx = -drawW / 2;
        const ry = -drawH / 2;
        const r = Math.min(borderRadius * finalScale * 1.5, Math.min(drawW, drawH) / 2);
        ctx.roundRect(rx, ry, drawW, drawH, r);
        ctx.fillStyle = 'rgba(0,0,0,0.01)'; // Fill to cast shadow
        ctx.fill();
        ctx.clip();
      }

      ctx.drawImage(fgImage, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // 3. Draw Optional Text Watermark/Caption
    if (showText && titleText.trim()) {
      ctx.save();
      ctx.font = 'bold 36px serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = textColor === '#FFFFFF' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
      ctx.shadowBlur = 8;
      ctx.fillText(titleText, width / 2, height - 48);
      ctx.restore();
    }
  }, [getCanvasDimensions, bgPreset, bgImage, fgImage, posX, posY, scale, rotation, borderRadius, shadow, opacity, showText, titleText, textColor]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Export handlers
  const handleDownload = (format: 'png' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = format === 'png' ? 'image/png' : 'image/webp';
    const ext = format === 'png' ? '.png' : '.webp';
    const dataUrl = canvas.toDataURL(mime, 0.95);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `mockup-harryshare-${Date.now()}${ext}`;
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
          <Sparkles className="w-3 h-3 text-olive animate-pulse" />
          Công cụ thiết kế nhanh
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-850">
          Ghép Ảnh & Tạo Mockup Sản Phẩm Tối Giản
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-2xl">
          Dành riêng cho người làm sản phẩm sạch, bán hàng online và viết blog. Tải background và ảnh sản phẩm lên, tinh chỉnh bóng đổ, góc xoay và tải ảnh hoàn thiện về máy trong 10 giây.
        </p>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-cream/50 border border-olive/15 rounded-3xl p-6 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-olive/10">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-olive" />
                Xem trước thời gian thực
              </span>
              <span className="text-[10px] font-mono text-stone-400 bg-sand/40 px-2 py-0.5 rounded">
                Tỷ lệ {aspectRatio}
              </span>
            </div>

            {/* Canvas Container */}
            <div className="relative max-w-full max-h-[500px] flex items-center justify-center shadow-lg rounded-2xl overflow-hidden border border-olive/15 bg-sand/10">
              <canvas
                ref={canvasRef}
                className="max-h-[460px] max-w-full w-auto h-auto object-contain block"
              />
              {!fgImage && (
                <div 
                  onClick={() => fgInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream/40 backdrop-blur-[2px] cursor-pointer hover:bg-cream/20 transition-all p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-olive/10 border border-olive/20 flex items-center justify-center text-olive">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-stone-850 font-bold text-sm">Bấm để tải ảnh sản phẩm / đối tượng vào</p>
                    <p className="text-stone-400 text-xs">Nên dùng ảnh PNG tách nền hoặc ảnh chụp sản phẩm</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick action below canvas */}
            {fgImage && (
              <div className="w-full flex justify-between items-center mt-4 pt-3 border-t border-olive/10 text-xs">
                <span className="text-stone-500 truncate max-w-[200px]">Đang ghép: <b>{fgFileName}</b></span>
                <button
                  onClick={() => { setFgImage(null); setFgFileName(''); }}
                  className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Gỡ ảnh sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => handleDownload('webp')}
              disabled={!fgImage}
              className="flex-1 sm:flex-initial bg-cream border border-olive/20 hover:border-olive text-olive font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <Download className="w-4 h-4" />
              <span>Tải WebP (Nhẹ cho web)</span>
            </button>
            <button
              onClick={() => handleDownload('png')}
              disabled={!fgImage}
              className="flex-1 sm:flex-initial bg-olive hover:bg-olive-dark text-cream font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Download className="w-4 h-4" />
              <span>Tải PNG Chất Lượng Cao</span>
            </button>
          </div>
        </div>

        {/* Right: Controls & Customization Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md">
          
          {/* Section 1: Aspect Ratio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-olive" />
              1. Tỉ lệ khung hình
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['1:1', '16:9', '4:5', '9:16'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-olive text-cream border-olive shadow-xs'
                      : 'bg-sand/20 text-stone-600 border-olive/10 hover:border-olive/30'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Background Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-olive" />
              2. Chọn phông nền (Background)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'wood', label: 'Gỗ mộc', color: '#DECBB1' },
                { id: 'sand', label: 'Cát ấm', color: '#E5DACB' },
                { id: 'olive', label: 'Xanh Olive', color: '#3A4433' },
                { id: 'studio', label: 'Studio Xám', color: '#E2E4E8' },
                { id: 'transparent', label: 'Trong suốt', color: 'transparent' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setBgPreset(p.id)}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    bgPreset === p.id
                      ? 'border-olive bg-olive/10 text-olive'
                      : 'border-olive/10 bg-sand/15 text-stone-600 hover:border-olive/30'
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full border border-stone-300 shrink-0" 
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
              
              {/* Custom Upload Background */}
              <button
                onClick={() => bgInputRef.current?.click()}
                className={`py-2 px-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  bgPreset === 'custom'
                    ? 'border-olive bg-olive/10 text-olive'
                    : 'border-dashed border-olive/30 bg-cream text-stone-600 hover:border-olive'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Ảnh của bạn</span>
              </button>
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBgUpload}
              />
            </div>
          </div>

          {/* Section 3: Foreground Controls */}
          <div className="flex flex-col gap-4 border-t border-olive/10 pt-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-olive" />
                3. Tùy chỉnh Sản phẩm / Đối tượng
              </label>
              <button
                onClick={() => fgInputRef.current?.click()}
                className="text-[11px] font-bold text-olive hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{fgImage ? 'Đổi ảnh' : 'Tải ảnh lên'}</span>
              </button>
              <input
                ref={fgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFgUpload}
              />
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-3 text-xs">
              {/* Scale */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Kích thước:</span>
                  <span className="font-mono font-bold text-olive">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>

              {/* Position X */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Vị trí ngang (X):</span>
                  <span className="font-mono font-bold text-olive">{posX}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>

              {/* Position Y */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Vị trí dọc (Y):</span>
                  <span className="font-mono font-bold text-olive">{posY}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>

              {/* Rotation */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Xoay góc:</span>
                  <span className="font-mono font-bold text-olive">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>

              {/* Border Radius */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Bo góc ảnh:</span>
                  <span className="font-mono font-bold text-olive">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>
            </div>

            {/* Shadow selection */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-stone-600 font-semibold">Hiệu ứng bóng đổ:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'Tắt' },
                  { id: 'soft', label: 'Nhẹ' },
                  { id: 'floating', label: 'Nổi 3D' },
                  { id: 'deep', label: 'Studio Sâu' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShadow(s.id as ShadowType)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      shadow === s.id
                        ? 'bg-olive text-cream border-olive'
                        : 'bg-sand/15 text-stone-600 border-olive/10 hover:border-olive/30'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Optional Caption */}
          <div className="flex flex-col gap-3 border-t border-olive/10 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-olive" />
                4. Dòng chữ chú thích / Thương hiệu
              </label>
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="cursor-pointer accent-olive w-4 h-4 rounded"
              />
            </div>
            {showText && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  placeholder="Nhập tên sản phẩm hoặc ghi chú..."
                  className="w-full text-xs px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850"
                />
                <div className="flex gap-2 text-xs items-center">
                  <span className="text-stone-500">Màu chữ:</span>
                  {[
                    { color: '#2C3527', label: 'Olive Đậm' },
                    { color: '#FFFFFF', label: 'Trắng' },
                    { color: '#C98A42', label: 'Đất Nung' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setTextColor(c.color as any)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        textColor === c.color ? 'border-olive bg-olive/10 text-olive' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
