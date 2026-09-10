'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, Download, Sparkles, Image as ImageIcon, 
  RotateCw, Move, Layers, RefreshCw, Eye, Sliders, Type,
  Smartphone, Laptop, Globe, Film, Camera, Copy, Check,
  Palette, Maximize2, Shield, AlertCircle
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

// --- Types ---
type FrameCategory = 'device' | 'vintage' | 'gallery' | 'minimal';
type FrameStyle = 
  // Devices
  | 'iphone' | 'macbook' | 'safari'
  // Vintage & Polaroid
  | 'polaroid' | 'film35mm'
  // Gallery
  | 'oak_wood' | 'dark_walnut' | 'gold_luxury' | 'gallery_black' | 'gallery_white'
  // Minimal
  | 'floating_card' | 'glass_card';

type AspectRatio = 'auto' | '1:1' | '4:5' | '16:9' | '9:16';
type BgPreset = 'blur' | 'sand' | 'olive' | 'sunset' | 'midnight' | 'aurora' | 'white' | 'cream' | 'transparent' | 'custom';
type ShadowLevel = 'none' | 'soft' | 'floating' | 'deep';

export default function MockupCollageStudioPage() {
  // Canvas & Media
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fgImage, setFgImage] = useState<HTMLImageElement | null>(null);
  const [fgFileName, setFgFileName] = useState<string>('');
  
  // Custom Background Image
  const [bgCustomImage, setBgCustomImage] = useState<HTMLImageElement | null>(null);

  // Selected Options
  const [frameCategory, setFrameCategory] = useState<FrameCategory>('device');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('iphone');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('auto');
  const [bgPreset, setBgPreset] = useState<BgPreset>('blur');

  // Controls & Sliders
  const [scale, setScale] = useState<number>(80); // % of canvas
  const [rotation, setRotation] = useState<number>(0); // -30 to 30 deg
  const [shadow, setShadow] = useState<ShadowLevel>('floating');
  const [matWidth, setMatWidth] = useState<number>(32); // For gallery frames (passe-partout)
  const [borderRadius, setBorderRadius] = useState<number>(24); // For cards

  // Text / Caption
  const [showCaption, setShowCaption] = useState<boolean>(true);
  const [captionText, setCaptionText] = useState<string>('HarryShare • Studio');
  const [captionFont, setCaptionFont] = useState<'handwriting' | 'serif' | 'sans'>('handwriting');
  const [captionColor, setCaptionColor] = useState<string>('#2C3527');
  const [browserUrl, setBrowserUrl] = useState<string>('harryshare.vn');

  // Interactive State
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Initial Demo Image
  useEffect(() => {
    const demoImg = new Image();
    demoImg.crossOrigin = 'anonymous';
    demoImg.src = '/images/phong-cach-hoc-tap-va-lam-viec-cua-harry.webp';
    demoImg.onload = () => {
      setFgImage(demoImg);
      setFgFileName('phong-cach-harry.webp');
    };
  }, []);

  // Handle Preset Sample Images
  const handleLoadSample = (url: string, name: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      setFgImage(img);
      setFgFileName(name);
      showToast(`Đã nạp ảnh mẫu: ${name}`);
    };
  };

  // Clipboard Paste (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            img.onload = () => {
              setFgImage(img);
              setFgFileName(`clipboard-${Date.now()}.png`);
              showToast('✨ Đã dán ảnh từ Clipboard thành công!');
            };
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Foreground Image Upload
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
        showToast('Tải ảnh lên thành công!');
      };
    }
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFgFileName(file.name);
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = () => {
          setFgImage(img);
          showToast('Tải ảnh thả vào thành công!');
        };
      }
    }
  };

  // Custom Background Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        setBgCustomImage(img);
        setBgPreset('custom');
        showToast('Đã tải hình nền tùy chỉnh!');
      };
    }
  };

  // Calculate Base Canvas Dimensions
  const getCanvasDimensions = useCallback((): { width: number; height: number } => {
    if (aspectRatio === '1:1') return { width: 1400, height: 1400 };
    if (aspectRatio === '4:5') return { width: 1200, height: 1500 };
    if (aspectRatio === '16:9') return { width: 1920, height: 1080 };
    if (aspectRatio === '9:16') return { width: 1080, height: 1920 };

    // 'auto' mode adapts to frame style
    if (frameStyle === 'iphone') return { width: 1300, height: 1600 };
    if (frameStyle === 'macbook') return { width: 1700, height: 1150 };
    if (frameStyle === 'safari') return { width: 1600, height: 1200 };
    if (frameStyle === 'polaroid') return { width: 1200, height: 1500 };
    if (frameStyle === 'film35mm') return { width: 1600, height: 1100 };

    // For artwork/cards, adapt to image aspect ratio if available
    if (fgImage && fgImage.naturalWidth > 0 && fgImage.naturalHeight > 0) {
      const imgAspect = fgImage.naturalWidth / fgImage.naturalHeight;
      if (imgAspect > 1.3) return { width: 1600, height: Math.round(1600 / imgAspect) + 300 };
      if (imgAspect < 0.8) return { width: Math.round(1400 * imgAspect) + 300, height: 1500 };
      return { width: 1400, height: 1400 };
    }

    return { width: 1400, height: 1200 };
  }, [aspectRatio, frameStyle, fgImage]);

  // --- DRAW CANVAS ENGINE ---
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    // 1. DRAW BACKGROUND
    if (bgPreset === 'transparent') {
      ctx.clearRect(0, 0, width, height);
    } else if (bgPreset === 'blur' && fgImage) {
      // Magic Blur of Original Image
      ctx.save();
      // Draw zoomed blurred image
      const bgScale = Math.max(width / fgImage.naturalWidth, height / fgImage.naturalHeight) * 1.25;
      const bW = fgImage.naturalWidth * bgScale;
      const bH = fgImage.naturalHeight * bgScale;
      const bX = (width - bW) / 2;
      const bY = (height - bH) / 2;

      ctx.filter = 'blur(55px) brightness(0.85) saturate(1.25)';
      ctx.drawImage(fgImage, bX, bY, bW, bH);
      ctx.restore();

      // Soft ambient dark overlay for readability
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0,0,0,0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (bgPreset === 'custom' && bgCustomImage) {
      const bgScale = Math.max(width / bgCustomImage.naturalWidth, height / bgCustomImage.naturalHeight);
      const bW = bgCustomImage.naturalWidth * bgScale;
      const bH = bgCustomImage.naturalHeight * bgScale;
      ctx.drawImage(bgCustomImage, (width - bW) / 2, (height - bH) / 2, bW, bH);
    } else {
      // Color Presets
      if (bgPreset === 'sand') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#FAF6F0');
        grad.addColorStop(1, '#EFE6D8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'olive') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#2C3527');
        grad.addColorStop(1, '#1A2117');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'sunset') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#FF8A65');
        grad.addColorStop(0.5, '#FF7043');
        grad.addColorStop(1, '#E64A19');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'midnight') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1E232A');
        grad.addColorStop(1, '#0F1216');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'aurora') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#C2E9FB');
        grad.addColorStop(1, '#A1BAFE');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      } else if (bgPreset === 'cream') {
        ctx.fillStyle = '#FDFBF7';
        ctx.fillRect(0, 0, width, height);
      }
    }

    if (!fgImage) return;

    // 2. CONFIGURE FRAME SHADOW
    const applyShadow = (blur: number, offsetY: number, alpha: number) => {
      if (shadow === 'none') {
        ctx.shadowColor = 'transparent';
      } else if (shadow === 'soft') {
        ctx.shadowColor = `rgba(15, 23, 42, ${alpha * 0.4})`;
        ctx.shadowBlur = blur * 0.6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = offsetY * 0.4;
      } else if (shadow === 'floating') {
        ctx.shadowColor = `rgba(15, 23, 42, ${alpha * 0.75})`;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = offsetY;
      } else if (shadow === 'deep') {
        ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 1.1})`;
        ctx.shadowBlur = blur * 1.5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = offsetY * 1.5;
      }
    };

    // Helper: Draw Cover/Contain Image Inside Rect
    const drawImageProp = (
      img: HTMLImageElement,
      dx: number, dy: number, dWidth: number, dHeight: number
    ) => {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = dWidth / dHeight;
      let sX = 0, sY = 0, sW = img.naturalWidth, sH = img.naturalHeight;

      if (imgRatio > targetRatio) {
        sW = img.naturalHeight * targetRatio;
        sX = (img.naturalWidth - sW) / 2;
      } else {
        sH = img.naturalWidth / targetRatio;
        sY = (img.naturalHeight - sH) / 2;
      }

      ctx.drawImage(img, sX, sY, sW, sH, dx, dy, dWidth, dHeight);
    };

    // 3. FRAME RENDERING LOGIC
    ctx.save();
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const maxW = width * (scale / 100);
    const maxH = height * (scale / 100);

    // ==========================================
    // FRAME 1: iPHONE 16 PRO (Dynamic Island)
    // ==========================================
    if (frameStyle === 'iphone') {
      const phoneH = Math.min(maxH, maxW * 2.1);
      const phoneW = phoneH / 2.12;
      const x = -phoneW / 2;
      const y = -phoneH / 2;
      const outerRadius = phoneW * 0.125;
      const bezel = phoneW * 0.038;

      // Outer Shadow
      applyShadow(45, 28, 0.45);

      // Outer Titanium Body
      ctx.beginPath();
      ctx.roundRect(x, y, phoneW, phoneH, outerRadius);
      const titaniumGrad = ctx.createLinearGradient(x, y, x + phoneW, y + phoneH);
      titaniumGrad.addColorStop(0, '#2D2E30');
      titaniumGrad.addColorStop(0.5, '#1E1F21');
      titaniumGrad.addColorStop(1, '#151618');
      ctx.fillStyle = titaniumGrad;
      ctx.fill();

      // Reset Shadow for Inner Elements
      ctx.shadowColor = 'transparent';

      // Titanium Metallic Edge Highlight
      ctx.strokeStyle = '#4A4B4F';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Screen
      const screenX = x + bezel;
      const screenY = y + bezel;
      const screenW = phoneW - bezel * 2;
      const screenH = phoneH - bezel * 2;
      const innerRadius = outerRadius - bezel * 0.8;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenW, screenH, innerRadius);
      ctx.clip();

      // Draw Screen Content
      drawImageProp(fgImage, screenX, screenY, screenW, screenH);

      // Subtle Glass Corner Reflection
      const glintGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW * 0.7, screenY + screenH * 0.3);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      glintGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.02)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glintGrad;
      ctx.fill();

      // Dynamic Island Pill
      const pillW = screenW * 0.29;
      const pillH = pillW * 0.32;
      const pillX = -pillW / 2;
      const pillY = screenY + phoneW * 0.032;

      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Camera lens dot inside pill
      ctx.beginPath();
      ctx.arc(pillX + pillW * 0.76, pillY + pillH / 2, pillH * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#080E1C';
      ctx.fill();

      // Specular camera gleam
      ctx.beginPath();
      ctx.arc(pillX + pillW * 0.76 - 1, pillY + pillH / 2 - 1, pillH * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#38558A';
      ctx.fill();

      ctx.restore();
    }

    // ==========================================
    // FRAME 2: MacBOOK M3 PRO
    // ==========================================
    else if (frameStyle === 'macbook') {
      const lidW = Math.min(maxW, maxH * 1.55);
      const lidH = lidW * 0.65;
      const baseH = lidH * 0.07;
      const totalH = lidH + baseH;
      const x = -lidW / 2;
      const y = -totalH / 2;

      // Outer Shadow
      applyShadow(50, 30, 0.4);

      // Base Aluminum Lip (Drawn first to sit behind lid)
      const baseExtraW = lidW * 0.07;
      const baseX = x - baseExtraW / 2;
      const baseY = y + lidH - 4;
      const baseW = lidW + baseExtraW;

      ctx.beginPath();
      ctx.roundRect(baseX, baseY, baseW, baseH, [0, 0, 10, 10]);
      const baseGrad = ctx.createLinearGradient(baseX, baseY, baseX, baseY + baseH);
      baseGrad.addColorStop(0, '#B8BAC0');
      baseGrad.addColorStop(0.3, '#9FA2A9');
      baseGrad.addColorStop(1, '#7C7F85');
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // Base thumb notch (cutout to open lid)
      const notchW = baseW * 0.14;
      const notchH = baseH * 0.45;
      ctx.beginPath();
      ctx.roundRect(-notchW / 2, baseY, notchW, notchH, [0, 0, 6, 6]);
      ctx.fillStyle = '#5A5D63';
      ctx.fill();

      // Lid Screen Outer Shell
      ctx.beginPath();
      ctx.roundRect(x, y, lidW, lidH, [14, 14, 2, 2]);
      ctx.fillStyle = '#1A1C1E';
      ctx.fill();
      ctx.strokeStyle = '#44474D';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Screen Bezel & Clip
      const bezel = lidW * 0.022;
      const screenX = x + bezel;
      const screenY = y + bezel;
      const screenW = lidW - bezel * 2;
      const screenH = lidH - bezel * 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenW, screenH, [6, 6, 0, 0]);
      ctx.clip();

      // Draw Display Content
      drawImageProp(fgImage, screenX, screenY, screenW, screenH);

      // Display Notch (Webcam)
      const camNotchW = lidW * 0.11;
      const camNotchH = lidH * 0.052;
      ctx.beginPath();
      ctx.roundRect(-camNotchW / 2, screenY - 1, camNotchW, camNotchH, [0, 0, 5, 5]);
      ctx.fillStyle = '#1A1C1E';
      ctx.fill();

      // Tiny camera dot
      ctx.beginPath();
      ctx.arc(0, screenY + camNotchH * 0.45, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#081729';
      ctx.fill();

      ctx.restore();
    }

    // ==========================================
    // FRAME 3: macOS SAFARI BROWSER
    // ==========================================
    else if (frameStyle === 'safari') {
      const winW = Math.min(maxW, maxH * 1.4);
      const winH = winW * 0.68;
      const x = -winW / 2;
      const y = -winH / 2;
      const headerH = 46;
      const radius = 14;

      // Window Drop Shadow
      applyShadow(40, 24, 0.35);

      // Window Body Shell
      ctx.beginPath();
      ctx.roundRect(x, y, winW, winH, radius);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Window Header Background
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, winW, headerH, [radius, radius, 0, 0]);
      ctx.fillStyle = '#EDEAE4';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Three macOS Traffic Light Dots
      const dotRadius = 5.5;
      const dotY = y + headerH / 2;
      const dotStartX = x + 20;

      // Close Dot
      ctx.beginPath();
      ctx.arc(dotStartX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF5F56';
      ctx.fill();
      ctx.strokeStyle = '#E0443E';
      ctx.stroke();

      // Minimize Dot
      ctx.beginPath();
      ctx.arc(dotStartX + 18, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFBD2E';
      ctx.fill();
      ctx.strokeStyle = '#DEA123';
      ctx.stroke();

      // Zoom Dot
      ctx.beginPath();
      ctx.arc(dotStartX + 36, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#27C93F';
      ctx.fill();
      ctx.strokeStyle = '#1AAB29';
      ctx.stroke();

      // URL Address Capsule
      const urlW = Math.min(winW * 0.45, 340);
      const urlH = 26;
      const urlX = -urlW / 2;
      const urlY = y + (headerH - urlH) / 2;

      ctx.beginPath();
      ctx.roundRect(urlX, urlY, urlW, urlH, 6);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Lock Icon + URL Text
      ctx.fillStyle = '#5A606A';
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🔒  ${browserUrl || 'harryshare.vn'}`, 0, urlY + urlH / 2 + 1);
      ctx.restore();

      // Web Page Viewport
      const viewX = x;
      const viewY = y + headerH;
      const viewW = winW;
      const viewH = winH - headerH;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(viewX, viewY, viewW, viewH, [0, 0, radius, radius]);
      ctx.clip();
      drawImageProp(fgImage, viewX, viewY, viewW, viewH);
      ctx.restore();
    }

    // ==========================================
    // FRAME 4: CLASSIC POLAROID VINTAGE
    // ==========================================
    else if (frameStyle === 'polaroid') {
      const polW = Math.min(maxW, maxH * 0.82);
      const polH = polW * 1.22;
      const x = -polW / 2;
      const y = -polH / 2;

      applyShadow(45, 26, 0.35);

      // Card Paper Stock (Warm textured cardstock)
      ctx.beginPath();
      ctx.roundRect(x, y, polW, polH, 6);
      ctx.fillStyle = '#FAF8F4';
      ctx.fill();

      // Subtle paper border line
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Photo Aperture (Square 1:1)
      const margin = polW * 0.085;
      const photoW = polW - margin * 2;
      const photoH = photoW;
      const photoX = x + margin;
      const photoY = y + margin;

      // Inset photo aperture shadow
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      drawImageProp(fgImage, photoX, photoY, photoW, photoH);

      // Soft vignette on the photo itself
      const vignette = ctx.createRadialGradient(
        photoX + photoW / 2, photoY + photoH / 2, photoW * 0.3,
        photoX + photoW / 2, photoY + photoH / 2, photoW * 0.75
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(40,25,10,0.18)');
      ctx.fillStyle = vignette;
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.restore();

      // Subtle inner frame rim
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(photoX, photoY, photoW, photoH);

      // Handwritten Polaroid Caption at Bottom Chin
      if (showCaption && captionText.trim()) {
        ctx.save();
        ctx.fillStyle = captionColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const chinCenterY = photoY + photoH + (y + polH - (photoY + photoH)) / 2;

        if (captionFont === 'handwriting') {
          ctx.font = 'italic 28px "Caveat", "Brush Script MT", "Segoe Script", cursive';
        } else if (captionFont === 'serif') {
          ctx.font = '600 22px Georgia, "Playfair Display", serif';
        } else {
          ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        }

        ctx.fillText(captionText, 0, chinCenterY);
        ctx.restore();
      }
    }

    // ==========================================
    // FRAME 5: 35mm VINTAGE FILM STRIP
    // ==========================================
    else if (frameStyle === 'film35mm') {
      const filmW = Math.min(maxW, maxH * 1.5);
      const filmH = filmW * 0.68;
      const x = -filmW / 2;
      const y = -filmH / 2;

      applyShadow(45, 25, 0.45);

      // Deep Black Film Plastic Base
      ctx.beginPath();
      ctx.roundRect(x, y, filmW, filmH, 6);
      ctx.fillStyle = '#141414';
      ctx.fill();

      const trackH = filmH * 0.16;
      const photoW = filmW * 0.78;
      const photoH = filmH - trackH * 2;
      const photoX = -photoW / 2;
      const photoY = -photoH / 2;

      // Draw Film Sprockets (Perforations) Along Top and Bottom
      const sprocW = 12;
      const sprocH = 18;
      const sprocGap = 28;
      const sprocCount = Math.floor((filmW - 40) / sprocGap);
      const sprocStartX = x + 20;

      ctx.fillStyle = bgPreset === 'transparent' ? '#000000' : 'rgba(255,255,255,0.85)';

      // Top & Bottom Holes
      for (let i = 0; i < sprocCount; i++) {
        const sx = sprocStartX + i * sprocGap;
        // Top hole
        ctx.beginPath();
        ctx.roundRect(sx, y + (trackH - sprocH) / 2, sprocW, sprocH, 3);
        ctx.fill();
        // Bottom hole
        ctx.beginPath();
        ctx.roundRect(sx, y + filmH - trackH + (trackH - sprocH) / 2, sprocW, sprocH, 3);
        ctx.fill();
      }

      // Golden Edge Markings (Kodak 400, Frame numbers)
      ctx.fillStyle = '#E5A93C';
      ctx.font = 'bold 12px monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText('KODAK SAFETY FILM 400', x + 35, y + trackH / 2);
      ctx.fillText('▶ 24', -photoW / 2, y + filmH - trackH / 2);
      ctx.fillText('24A', photoW / 2 - 35, y + filmH - trackH / 2);

      // Film Photo Exposure Area
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      drawImageProp(fgImage, photoX, photoY, photoW, photoH);

      // Vintage Warm Film Tint Overlay
      const tint = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
      tint.addColorStop(0, 'rgba(230, 160, 80, 0.08)');
      tint.addColorStop(1, 'rgba(50, 20, 80, 0.06)');
      ctx.fillStyle = tint;
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.restore();

      // Film Frame Border
      ctx.strokeStyle = '#2A2A2A';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX, photoY, photoW, photoH);
    }

    // ==========================================
    // FRAME 6-10: GALLERY & FINE ART FRAMES
    // ==========================================
    else if (['oak_wood', 'dark_walnut', 'gold_luxury', 'gallery_black', 'gallery_white'].includes(frameStyle)) {
      const artAspect = fgImage.naturalWidth / fgImage.naturalHeight;
      let artW = Math.min(maxW * 0.7, maxH * 0.7 * artAspect);
      let artH = artW / artAspect;

      const borderThick = 28; // Outer frame molding
      const mat = Math.max(0, matWidth); // Passe-partout width
      const totalPad = borderThick + mat;

      const frameW = artW + totalPad * 2;
      const frameH = artH + totalPad * 2;
      const x = -frameW / 2;
      const y = -frameH / 2;

      // Physical Frame Shadow
      applyShadow(55, 32, 0.45);

      // 1. Outer Frame Molding
      ctx.beginPath();
      ctx.roundRect(x, y, frameW, frameH, 4);

      if (frameStyle === 'oak_wood') {
        const oakGrad = ctx.createLinearGradient(x, y, x + frameW, y + frameH);
        oakGrad.addColorStop(0, '#D9BA8B');
        oakGrad.addColorStop(0.5, '#C6A473');
        oakGrad.addColorStop(1, '#B29161');
        ctx.fillStyle = oakGrad;
      } else if (frameStyle === 'dark_walnut') {
        const walnutGrad = ctx.createLinearGradient(x, y, x + frameW, y + frameH);
        walnutGrad.addColorStop(0, '#4A3528');
        walnutGrad.addColorStop(0.5, '#352419');
        walnutGrad.addColorStop(1, '#23160E');
        ctx.fillStyle = walnutGrad;
      } else if (frameStyle === 'gold_luxury') {
        const goldGrad = ctx.createLinearGradient(x, y, x + frameW, y + frameH);
        goldGrad.addColorStop(0, '#D4AF37');
        goldGrad.addColorStop(0.25, '#FFF2A8');
        goldGrad.addColorStop(0.5, '#AA7C11');
        goldGrad.addColorStop(0.75, '#F9E589');
        goldGrad.addColorStop(1, '#8C6710');
        ctx.fillStyle = goldGrad;
      } else if (frameStyle === 'gallery_black') {
        ctx.fillStyle = '#1A1A1A';
      } else {
        ctx.fillStyle = '#F5F5F5';
      }
      ctx.fill();

      // Molding Bevel Highlight & Shadow (3D effect)
      ctx.strokeStyle = frameStyle === 'gallery_white' ? '#E0E0E0' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Passe-Partout (Mat Board)
      if (mat > 0) {
        const matX = x + borderThick;
        const matY = y + borderThick;
        const matW = frameW - borderThick * 2;
        const matH = frameH - borderThick * 2;

        ctx.fillStyle = '#FBF9F5'; // Fine archival museum card
        ctx.fillRect(matX, matY, matW, matH);

        // Mat Inset Bevel Shadow (45 deg angle bevel)
        const innerMatX = matX + mat;
        const innerMatY = matY + mat;
        const innerMatW = artW;
        const innerMatH = artH;

        // Shadow at top & left of bevel
        ctx.fillStyle = 'rgba(0,0,0,0.14)';
        ctx.fillRect(innerMatX - 2, innerMatY - 2, innerMatW + 4, 3);
        ctx.fillRect(innerMatX - 2, innerMatY - 2, 3, innerMatH + 4);
      }

      // 3. Artwork Inside Opening
      const artX = -artW / 2;
      const artY = -artH / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(artX, artY, artW, artH);
      ctx.clip();
      drawImageProp(fgImage, artX, artY, artW, artH);
      ctx.restore();

      // Subtle Glass Specular Reflection across Artwork
      const glassGlint = ctx.createLinearGradient(x, y, x + frameW, y + frameH);
      glassGlint.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      glassGlint.addColorStop(0.35, 'rgba(255, 255, 255, 0.02)');
      glassGlint.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glassGlint;
      ctx.fillRect(x, y, frameW, frameH);
    }

    // ==========================================
    // FRAME 11-12: MINIMAL & FLOATING CARDS
    // ==========================================
    else {
      const artAspect = fgImage.naturalWidth / fgImage.naturalHeight;
      const cardW = Math.min(maxW, maxH * artAspect);
      const cardH = cardW / artAspect;
      const x = -cardW / 2;
      const y = -cardH / 2;
      const r = Math.min(borderRadius, Math.min(cardW, cardH) / 2);

      // Multi-layer Diffusion Shadow
      applyShadow(48, 26, 0.4);

      if (frameStyle === 'glass_card') {
        // Frosted Glass Border
        const borderPad = 16;
        const glassW = cardW + borderPad * 2;
        const glassH = cardH + borderPad * 2;
        const gx = x - borderPad;
        const gy = y - borderPad;

        ctx.beginPath();
        ctx.roundRect(gx, gy, glassW, glassH, r + 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, r);
        ctx.clip();
        drawImageProp(fgImage, x, y, cardW, cardH);
        ctx.restore();
      } else {
        // Floating Card
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, r);
        ctx.fillStyle = '#000000';
        ctx.fill(); // For shadow casting
        ctx.clip();
        drawImageProp(fgImage, x, y, cardW, cardH);
        ctx.restore();

        // Crisp White/Subtle Outer Stroke
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, r);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [
    getCanvasDimensions, bgPreset, bgCustomImage, fgImage, frameStyle,
    scale, rotation, shadow, matWidth, borderRadius, showCaption,
    captionText, captionFont, captionColor, browserUrl
  ]);

  // Re-draw on any parameter change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Copy Canvas Image to Clipboard
  const handleCopyClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setIsCopied(true);
        showToast('📋 Đã sao chép ảnh vào Clipboard! Bạn có thể dán (Ctrl+V) vào Zalo, Canva, Notion...');
        setTimeout(() => setIsCopied(false), 2500);
      }, 'image/png');
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      showToast('⚠️ Không thể tự động copy, vui lòng tải ảnh PNG về máy.');
    }
  };

  // Download Handlers
  const handleDownload = (format: 'png' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = format === 'png' ? 'image/png' : 'image/webp';
    const ext = format === 'png' ? '.png' : '.webp';
    const dataUrl = canvas.toDataURL(mime, 0.95);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `mockup-harryshare-${frameStyle}-${Date.now()}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Đã lưu ảnh ${format.toUpperCase()} chất lượng cao!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-8 animate-slide-up">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900/95 text-cream border border-olive/30 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
        <span className="text-[10px] font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1 rounded-full w-fit flex items-center gap-1.5 border border-olive/10">
          <Sparkles className="w-3.5 h-3.5 text-olive animate-pulse" />
          Studio Thiết Kế Trực Tuyến Miễn Phí
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-850">
          Lồng Khung Ảnh & Mockup Thiết Bị
        </h1>
        <p className="text-stone-550 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Đóng khung ảnh nghệ thuật, tạo mockup iPhone 16, MacBook M3, dải phim 35mm hoài cổ và ảnh Polaroid tức thì. Hỗ trợ phím tắt <code className="bg-sand/60 px-1.5 py-0.5 rounded font-mono font-bold text-stone-700">Ctrl + V</code> dán ảnh siêu tốc, xuất ảnh chuẩn Retina 100% bảo mật trong trình duyệt.
        </p>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`bg-cream/60 border rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-sm flex flex-col items-center justify-center min-h-[500px] relative transition-all ${
              isDragOver ? 'border-olive bg-olive/5 ring-4 ring-olive/10' : 'border-olive/15'
            }`}
          >
            {/* Top Canvas Bar */}
            <div className="w-full flex justify-between items-center mb-3 pb-3 border-b border-olive/10">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-olive" />
                <span className="text-xs font-bold text-stone-800">
                  Xem trước thời gian thực
                </span>
              </div>

              {/* Sample Presets Buttons */}
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-stone-400 mr-1 hidden sm:inline">Thử ảnh mẫu:</span>
                <button
                  onClick={() => handleLoadSample('/images/phong-cach-hoc-tap-va-lam-viec-cua-harry.webp', 'Harry-Selfie')}
                  className="px-2 py-0.5 rounded-lg bg-sand/30 hover:bg-olive/10 hover:text-olive text-stone-600 font-semibold transition-all cursor-pointer"
                >
                  Chân dung
                </button>
                <button
                  onClick={() => handleLoadSample('/images/summer_2026/summer-2026-1.webp', 'Thien-nhien')}
                  className="px-2 py-0.5 rounded-lg bg-sand/30 hover:bg-olive/10 hover:text-olive text-stone-600 font-semibold transition-all cursor-pointer"
                >
                  Ngoại cảnh
                </button>
                <button
                  onClick={() => handleLoadSample('/images/checklist-truoc-khi-build.webp', 'Giao-dien-app')}
                  className="px-2 py-0.5 rounded-lg bg-sand/30 hover:bg-olive/10 hover:text-olive text-stone-600 font-semibold transition-all cursor-pointer"
                >
                  Giao diện
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative max-w-full max-h-[560px] flex items-center justify-center rounded-2xl overflow-hidden border border-olive/15 shadow-inner bg-stone-900/5">
              <canvas
                ref={canvasRef}
                className="max-h-[520px] max-w-full w-auto h-auto object-contain block select-none"
              />

              {/* Empty State / Upload Guide */}
              {!fgImage && (
                <div 
                  onClick={() => fgInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream/70 backdrop-blur-xs cursor-pointer hover:bg-cream/40 transition-all p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-olive/10 border border-olive/20 flex items-center justify-center text-olive shadow-sm">
                    <Upload className="w-7 h-7 animate-bounce" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-850 font-bold text-sm">Bấm để tải ảnh lên hoặc nhấn Ctrl + V để dán ảnh</p>
                    <p className="text-stone-400 text-xs">Hỗ trợ ảnh chụp màn hình, ảnh chân dung, ảnh sản phẩm (PNG, JPG, WebP)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Bottom Sub-bar */}
            <div className="w-full flex flex-wrap justify-between items-center mt-3 pt-3 border-t border-olive/10 text-xs">
              <span className="text-stone-500 truncate max-w-[240px]">
                Đang mở: <b className="text-stone-800">{fgFileName || 'Chưa chọn ảnh'}</b>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fgInputRef.current?.click()}
                  className="text-olive hover:underline font-bold cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Đổi ảnh khác</span>
                </button>
                <input
                  ref={fgInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFgUpload}
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap gap-2.5 justify-end items-center">
            {/* Quick Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              disabled={!fgImage}
              className={`flex-1 sm:flex-initial border text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isCopied 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-cream border-olive/20 text-stone-750 hover:border-olive hover:text-olive'
              } disabled:opacity-40 disabled:pointer-events-none`}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Đã chép vào bộ nhớ!' : 'Sao chép ảnh (Ctrl+C)'}</span>
            </button>

            {/* Download WebP */}
            <button
              onClick={() => handleDownload('webp')}
              disabled={!fgImage}
              className="flex-1 sm:flex-initial bg-sand/30 border border-olive/20 hover:border-olive text-stone-800 font-bold text-xs px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-cream disabled:opacity-40 disabled:pointer-events-none"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Tải WebP (Nhẹ)</span>
            </button>

            {/* Download PNG */}
            <button
              onClick={() => handleDownload('png')}
              disabled={!fgImage}
              className="flex-1 sm:flex-initial bg-olive hover:bg-olive-dark text-cream font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-98 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Tải PNG Sắc Nét</span>
            </button>
          </div>
        </div>

        {/* Right Column: Customization Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md shadow-sm">
          
          {/* Section 1: Frame Category & Style */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-olive" />
              1. Chọn Kiểu Khung & Mockup
            </label>

            {/* Category Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-sand/30 rounded-xl border border-olive/10 text-[11px] font-bold">
              {[
                { id: 'device', label: 'Thiết bị', icon: Smartphone },
                { id: 'vintage', label: 'Vintage', icon: Film },
                { id: 'gallery', label: 'Phòng tranh', icon: ImageIcon },
                { id: 'minimal', label: 'Thẻ nổi', icon: Layers }
              ].map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFrameCategory(cat.id as FrameCategory);
                      if (cat.id === 'device') setFrameStyle('iphone');
                      if (cat.id === 'vintage') setFrameStyle('polaroid');
                      if (cat.id === 'gallery') setFrameStyle('oak_wood');
                      if (cat.id === 'minimal') setFrameStyle('floating_card');
                    }}
                    className={`py-1.5 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                      frameCategory === cat.id
                        ? 'bg-olive text-cream shadow-xs'
                        : 'text-stone-600 hover:text-olive'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Frame Style Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {frameCategory === 'device' && [
                { id: 'iphone', label: 'iPhone 16 Pro', desc: 'Titanium & Dynamic Island' },
                { id: 'macbook', label: 'MacBook M3', desc: 'Notch & gáy nhôm' },
                { id: 'safari', label: 'macOS Safari', desc: 'Chấm giao diện Apple' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFrameStyle(item.id as FrameStyle)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    frameStyle === item.id
                      ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                      : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-stone-400 truncate">{item.desc}</span>
                </button>
              ))}

              {frameCategory === 'vintage' && [
                { id: 'polaroid', label: 'Polaroid Cổ Điển', desc: 'Giấy mộc & Chữ ký tay' },
                { id: 'film35mm', label: 'Cuộn Phim 35mm', desc: 'Lỗ gai & Mã số Kodak' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFrameStyle(item.id as FrameStyle)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    frameStyle === item.id
                      ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                      : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-stone-400 truncate">{item.desc}</span>
                </button>
              ))}

              {frameCategory === 'gallery' && [
                { id: 'oak_wood', label: 'Gỗ Sồi Tự Nhiên', desc: 'Tone ấm thanh lịch' },
                { id: 'dark_walnut', label: 'Gỗ Óc Chó', desc: 'Trầm sang trọng' },
                { id: 'gold_luxury', label: 'Mạ Vàng Hoàng Gia', desc: 'Ánh kim cổ điển' },
                { id: 'gallery_black', label: 'Triển Lãm Đen', desc: 'Phòng tranh hiện đại' },
                { id: 'gallery_white', label: 'Triển Lãm Trắng', desc: 'Tối giản thuần khiết' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFrameStyle(item.id as FrameStyle)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    frameStyle === item.id
                      ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                      : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-stone-400 truncate">{item.desc}</span>
                </button>
              ))}

              {frameCategory === 'minimal' && [
                { id: 'floating_card', label: 'Thẻ Nổi 3D', desc: 'Bóng đổ khuếch tán' },
                { id: 'glass_card', label: 'Kính Mờ', desc: 'Hiệu ứng Glassmorphism' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFrameStyle(item.id as FrameStyle)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    frameStyle === item.id
                      ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                      : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-stone-400 truncate">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Background (Fotor-inspired Magic Blur) */}
          <div className="flex flex-col gap-2.5 border-t border-olive/10 pt-4">
            <label className="text-xs font-bold text-stone-850 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-olive" />
                2. Phông Nền (Background)
              </span>
              {bgPreset === 'blur' && (
                <span className="text-[10px] font-mono text-olive bg-olive/10 px-2 py-0.5 rounded-full font-bold">
                  ✨ Magic Blur tự động
                </span>
              )}
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-[11px] font-bold">
              {[
                { id: 'blur', label: 'Phông mờ', color: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
                { id: 'sand', label: 'Cát ấm', color: '#FAF6F0' },
                { id: 'olive', label: 'Olive Harry', color: '#2C3527' },
                { id: 'sunset', label: 'Hoàng hôn', color: '#FF7043' },
                { id: 'midnight', label: 'Đêm than', color: '#1E232A' },
                { id: 'aurora', label: 'Pastel', color: '#C2E9FB' },
                { id: 'white', label: 'Trắng tinh', color: '#FFFFFF' },
                { id: 'cream', label: 'Kem mộc', color: '#FDFBF7' },
                { id: 'transparent', label: 'Trong suốt', color: 'transparent' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setBgPreset(p.id as BgPreset)}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    bgPreset === p.id
                      ? 'border-olive bg-olive/10 text-olive ring-1 ring-olive'
                      : 'border-olive/10 bg-sand/15 text-stone-600 hover:border-olive/30'
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0" 
                    style={{ background: p.color }}
                  />
                  <span className="truncate text-[10px]">{p.label}</span>
                </button>
              ))}

              {/* Upload Custom BG */}
              <button
                onClick={() => bgInputRef.current?.click()}
                className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  bgPreset === 'custom'
                    ? 'border-olive bg-olive/10 text-olive ring-1 ring-olive'
                    : 'border-dashed border-olive/30 bg-cream text-stone-600 hover:border-olive'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-[10px] truncate">Tự chọn</span>
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

          {/* Section 3: Aspect Ratio & Canvas Format */}
          <div className="flex flex-col gap-2.5 border-t border-olive/10 pt-4">
            <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-olive" />
              3. Tỉ Lệ Khung Hình Canvas
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              {[
                { id: 'auto', label: 'Tự động' },
                { id: '1:1', label: '1:1 Vuông' },
                { id: '4:5', label: '4:5 Feed' },
                { id: '16:9', label: '16:9 Blog' },
                { id: '9:16', label: '9:16 Story' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id as AspectRatio)}
                  className={`py-2 px-1 text-[11px] rounded-xl border transition-all text-center cursor-pointer ${
                    aspectRatio === r.id
                      ? 'bg-olive text-cream border-olive shadow-xs'
                      : 'bg-sand/20 text-stone-600 border-olive/10 hover:border-olive/30'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Sliders & Adjustments */}
          <div className="flex flex-col gap-3.5 border-t border-olive/10 pt-4 text-xs">
            <label className="font-bold text-stone-850 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-olive" />
              4. Cân Chỉnh Chi Tiết
            </label>

            {/* Scale / Padding */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-stone-600">
                <span>Kích thước khung (Zoom):</span>
                <span className="font-mono font-bold text-olive">{scale}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
              />
            </div>

            {/* Rotation */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-stone-600">
                <span>Góc xoay nghiêng:</span>
                <span className="font-mono font-bold text-olive">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
              />
            </div>

            {/* Gallery Mat Width (Passe-partout) */}
            {['oak_wood', 'dark_walnut', 'gold_luxury', 'gallery_black', 'gallery_white'].includes(frameStyle) && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Viền bo đệm tranh (Passe-Partout):</span>
                  <span className="font-mono font-bold text-olive">{matWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={matWidth}
                  onChange={(e) => setMatWidth(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>
            )}

            {/* Corner Radius for Cards */}
            {['floating_card', 'glass_card'].includes(frameStyle) && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-stone-600">
                  <span>Bo tròn góc thẻ:</span>
                  <span className="font-mono font-bold text-olive">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="60"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                />
              </div>
            )}

            {/* Shadow Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-stone-600 font-semibold">Độ đổ bóng 3D:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'Tắt' },
                  { id: 'soft', label: 'Nhẹ' },
                  { id: 'floating', label: 'Nổi 3D' },
                  { id: 'deep', label: 'Sâu studio' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setShadow(s.id as ShadowLevel)}
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

          {/* Section 5: Specific Frame Customization (Safari URL or Polaroid Caption) */}
          {frameStyle === 'safari' && (
            <div className="flex flex-col gap-2 border-t border-olive/10 pt-4 text-xs">
              <label className="font-bold text-stone-850 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-olive" />
                Địa chỉ Web (URL trên Safari)
              </label>
              <input
                type="text"
                value={browserUrl}
                onChange={(e) => setBrowserUrl(e.target.value)}
                placeholder="harryshare.vn"
                className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850 font-mono text-xs"
              />
            </div>
          )}

          {frameStyle === 'polaroid' && (
            <div className="flex flex-col gap-3 border-t border-olive/10 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-stone-850 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-olive" />
                  Chữ ký tay dưới đáy ảnh Polaroid
                </label>
                <input
                  type="checkbox"
                  checked={showCaption}
                  onChange={(e) => setShowCaption(e.target.checked)}
                  className="cursor-pointer accent-olive w-4 h-4 rounded"
                />
              </div>

              {showCaption && (
                <div className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    placeholder="Nhập ghi chú hoặc chữ ký..."
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850"
                  />
                  <div className="flex gap-2">
                    {[
                      { id: 'handwriting', label: 'Viết tay' },
                      { id: 'serif', label: 'Cổ điển' },
                      { id: 'sans', label: 'Hiện đại' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setCaptionFont(f.id as any)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-all ${
                          captionFont === f.id
                            ? 'bg-olive text-cream border-olive'
                            : 'bg-sand/15 text-stone-600 border-olive/10'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Feature Guide & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            ⚡
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Dán Ảnh Nhanh (Ctrl + V)</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Chụp màn hình ở bất cứ đâu, quay lại trang này và nhấn phím tắt <code className="bg-sand/50 px-1 py-0.5 rounded font-mono font-bold">Ctrl + V</code> để ảnh lập tức được đưa vào khung hình.
          </p>
        </div>

        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            ✨
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Magic Blur Hậu Cảnh</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Thuật toán tự động lấy màu sắc từ chính bức ảnh của bạn và làm mờ sâu 55px, giúp khung ảnh trông như chụp trong studio chuyên nghiệp.
          </p>
        </div>

        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            🔒
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Bảo Mật Cục Bộ 100%</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Hình ảnh được xử lý hoàn toàn bằng vi xử lý đồ họa trên máy tính của bạn thông qua Canvas HTML5, tuyệt đối không tải lên máy chủ ngoài.
          </p>
        </div>
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
