'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, Download, Sparkles, Image as ImageIcon, 
  RotateCw, Move, Layers, RefreshCw, Eye, Sliders, Type,
  Smartphone, Laptop, Globe, Film, Camera, Copy, Check,
  Palette, Maximize2, Award, FlipHorizontal, ZoomIn
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

// --- Types ---
type FrameCategory = 'campaign' | 'device' | 'vintage' | 'gallery' | 'minimal';
type FrameStyle = 
  // Devices
  | 'iphone' | 'macbook' | 'safari'
  // Vintage & Polaroid
  | 'polaroid' | 'film35mm'
  // Gallery
  | 'oak_wood' | 'dark_walnut' | 'gold_luxury' | 'gallery_black' | 'gallery_white'
  // Minimal
  | 'floating_card' | 'glass_card';

type CampaignPreset = 'solopreneur' | 'school' | 'anniversary' | 'teamwork' | 'custom';
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

  // Selected Category & Style
  const [frameCategory, setFrameCategory] = useState<FrameCategory>('campaign');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('iphone');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [bgPreset, setBgPreset] = useState<BgPreset>('blur');

  // Campaign Avatar (Twibbon) Specific State
  const [campaignPreset, setCampaignPreset] = useState<CampaignPreset>('solopreneur');
  const [customFrameImage, setCustomFrameImage] = useState<HTMLImageElement | null>(null);
  const [customFrameFileName, setCustomFrameFileName] = useState<string>('');
  const [avatarOffsetX, setAvatarOffsetX] = useState<number>(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState<number>(0);
  const [avatarZoom, setAvatarZoom] = useState<number>(100); // 30% - 250%
  const [avatarRotation, setAvatarRotation] = useState<number>(0); // -45 to 45 deg
  const [avatarFlipX, setAvatarFlipX] = useState<boolean>(false);
  const [showCircleGuide, setShowCircleGuide] = useState<boolean>(true);

  // General Controls & Sliders
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

  // Interactive Dragging on Canvas State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Toast & UX State
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const customFrameInputRef = useRef<HTMLInputElement>(null);

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
      setAvatarOffsetX(0);
      setAvatarOffsetY(0);
      setAvatarZoom(100);
      setAvatarRotation(0);
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
              setAvatarOffsetX(0);
              setAvatarOffsetY(0);
              setAvatarZoom(100);
              setAvatarRotation(0);
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
        setAvatarOffsetX(0);
        setAvatarOffsetY(0);
        setAvatarZoom(100);
        setAvatarRotation(0);
        showToast('Tải ảnh đại diện thành công!');
      };
    }
  };

  // Custom Campaign Frame Upload
  const handleCustomFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFrameFileName(file.name);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        setCustomFrameImage(img);
        setCampaignPreset('custom');
        showToast(`Đã nạp khung viền: ${file.name}`);
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
          setAvatarOffsetX(0);
          setAvatarOffsetY(0);
          setAvatarZoom(100);
          setAvatarRotation(0);
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

  // Canvas Mouse & Touch Drag Event Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!fgImage) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: avatarOffsetX,
      origY: avatarOffsetY
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStartRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.width / rect.width;

    const deltaX = (e.clientX - dragStartRef.current.startX) * scaleFactor;
    const deltaY = (e.clientY - dragStartRef.current.startY) * scaleFactor;

    setAvatarOffsetX(dragStartRef.current.origX + deltaX);
    setAvatarOffsetY(dragStartRef.current.origY + deltaY);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!fgImage || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      origX: avatarOffsetX,
      origY: avatarOffsetY
    };
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStartRef.current || !canvasRef.current || e.touches.length !== 1) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.width / rect.width;

    const deltaX = (e.touches[0].clientX - dragStartRef.current.startX) * scaleFactor;
    const deltaY = (e.touches[0].clientY - dragStartRef.current.startY) * scaleFactor;

    setAvatarOffsetX(dragStartRef.current.origX + deltaX);
    setAvatarOffsetY(dragStartRef.current.origY + deltaY);
  };

  const handleCanvasTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Canvas Mouse Wheel to Zoom
  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (frameCategory !== 'campaign') return;
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -5 : 5;
    setAvatarZoom(prev => Math.min(250, Math.max(30, prev + zoomDelta)));
  };

  // Calculate Base Canvas Dimensions
  const getCanvasDimensions = useCallback((): { width: number; height: number } => {
    if (frameCategory === 'campaign') {
      return { width: 1200, height: 1200 }; // Standard 1:1 square for Campaign Avatars
    }

    if (aspectRatio === '1:1') return { width: 1400, height: 1400 };
    if (aspectRatio === '4:5') return { width: 1200, height: 1500 };
    if (aspectRatio === '16:9') return { width: 1920, height: 1080 };
    if (aspectRatio === '9:16') return { width: 1080, height: 1920 };

    if (frameStyle === 'iphone') return { width: 1300, height: 1600 };
    if (frameStyle === 'macbook') return { width: 1700, height: 1150 };
    if (frameStyle === 'safari') return { width: 1600, height: 1200 };
    if (frameStyle === 'polaroid') return { width: 1200, height: 1500 };
    if (frameStyle === 'film35mm') return { width: 1600, height: 1100 };

    if (fgImage && fgImage.naturalWidth > 0 && fgImage.naturalHeight > 0) {
      const imgAspect = fgImage.naturalWidth / fgImage.naturalHeight;
      if (imgAspect > 1.3) return { width: 1600, height: Math.round(1600 / imgAspect) + 300 };
      if (imgAspect < 0.8) return { width: Math.round(1400 * imgAspect) + 300, height: 1500 };
      return { width: 1400, height: 1400 };
    }

    return { width: 1400, height: 1200 };
  }, [frameCategory, aspectRatio, frameStyle, fgImage]);

  // --- DRAW CANVAS ENGINE ---
  const drawCanvas = useCallback((isExport: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    // =========================================================
    // MODE A: CAMPAIGN AVATAR (TWIBBON) STUDIO MODE
    // =========================================================
    if (frameCategory === 'campaign') {
      // 1. Clear background
      ctx.clearRect(0, 0, width, height);

      // Default clean background behind transparent frame
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Avatar Photo Underneath (with pan, zoom, rotate, flip)
      if (fgImage) {
        ctx.save();
        const cx = width / 2 + avatarOffsetX;
        const cy = height / 2 + avatarOffsetY;
        ctx.translate(cx, cy);
        ctx.rotate((avatarRotation * Math.PI) / 180);
        ctx.scale(avatarFlipX ? -1 : 1, 1);

        // Base cover fit
        const baseScale = Math.max(width / fgImage.naturalWidth, height / fgImage.naturalHeight);
        const finalScale = baseScale * (avatarZoom / 100);
        const drawW = fgImage.naturalWidth * finalScale;
        const drawH = fgImage.naturalHeight * finalScale;

        ctx.drawImage(fgImage, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // 3. Draw Campaign Frame Overlay (On Top)
      if (campaignPreset === 'custom' && customFrameImage) {
        // Draw user's uploaded PNG frame covering the canvas
        ctx.drawImage(customFrameImage, 0, 0, width, height);
      } else {
        // Draw Beautiful High-Resolution Vector Preset Frames
        const radius = 450;
        const cx = width / 2;
        const cy = height / 2;

        // Preset 1: HarryShare Solopreneur
        if (campaignPreset === 'solopreneur') {
          // Circular Donut Cutout Mask
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
          const bgGrad = ctx.createLinearGradient(0, 0, width, height);
          bgGrad.addColorStop(0, '#2C3527');
          bgGrad.addColorStop(0.5, '#3B4834');
          bgGrad.addColorStop(1, '#1A2117');
          ctx.fillStyle = bgGrad;
          ctx.fill();

          // Gold Accent Rings
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 14;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, radius + 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Top Header Emblem
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(cx, cy - radius + 15, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#2C3527';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨', cx, cy - radius + 15);

          // Top Curved Text / Banner
          ctx.fillStyle = '#FDFBF7';
          ctx.font = 'bold 32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('HARRYSHARE • 2026', cx, 42);

          // Bottom Elegant Ribbon Banner
          const ribbonW = 760;
          const ribbonH = 100;
          const ribbonX = (width - ribbonW) / 2;
          const ribbonY = height - 145;

          ctx.beginPath();
          ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 20);
          const ribGrad = ctx.createLinearGradient(ribbonX, ribbonY, ribbonX + ribbonW, ribbonY);
          ribGrad.addColorStop(0, '#C98A42');
          ribGrad.addColorStop(0.5, '#E5B869');
          ribGrad.addColorStop(1, '#C98A42');
          ctx.fillStyle = ribGrad;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Ribbon Text
          ctx.fillStyle = '#2C3527';
          ctx.font = '900 36px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('SOLOPRENEUR • TỰ CHỦ & LÀM BỀN', cx, ribbonY + 48);
          ctx.restore();
        }

        // Preset 2: Chào Năm Học Mới & Tốt Nghiệp (Academic / School)
        else if (campaignPreset === 'school') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
          const blueGrad = ctx.createLinearGradient(0, 0, width, height);
          blueGrad.addColorStop(0, '#1E3A8A');
          blueGrad.addColorStop(0.5, '#2563EB');
          blueGrad.addColorStop(1, '#1D4ED8');
          ctx.fillStyle = blueGrad;
          ctx.fill();

          // Outer Ring
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 14;
          ctx.stroke();

          // Top Header Banner
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('🎓 NIỀM TỰ HÀO TRI THỨC', cx, 45);

          // Bottom Banner
          const ribbonW = 820;
          const ribbonH = 105;
          const ribbonX = (width - ribbonW) / 2;
          const ribbonY = height - 150;

          ctx.beginPath();
          ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 22);
          ctx.fillStyle = '#FDE047';
          ctx.fill();
          ctx.strokeStyle = '#1E3A8A';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = '#1E3A8A';
          ctx.font = '900 38px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('CHÀO MỪNG NĂM HỌC MỚI', cx, ribbonY + 52);
          ctx.restore();
        }

        // Preset 3: Kỷ Niệm Thành Lập & Sự Kiện (Anniversary)
        else if (campaignPreset === 'anniversary') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
          const redGrad = ctx.createLinearGradient(0, 0, width, height);
          redGrad.addColorStop(0, '#991B1B');
          redGrad.addColorStop(0.5, '#DC2626');
          redGrad.addColorStop(1, '#7F1D1D');
          ctx.fillStyle = redGrad;
          ctx.fill();

          // Gold Accent Ring
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 14;
          ctx.stroke();

          // Top Banner
          ctx.fillStyle = '#FDE68A';
          ctx.font = 'bold 34px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('⭐ KỶ NIỆM SỰ KIỆN TRỌNG ĐẠI ⭐', cx, 45);

          // Bottom Banner
          const ribbonW = 840;
          const ribbonH = 105;
          const ribbonX = (width - ribbonW) / 2;
          const ribbonY = height - 150;

          ctx.beginPath();
          ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 22);
          ctx.fillStyle = '#F59E0B';
          ctx.fill();
          ctx.strokeStyle = '#991B1B';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = '#7F1D1D';
          ctx.font = '900 38px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('TỰ HÀO GẮN KẾT • VƯƠN TẦM CAO', cx, ribbonY + 52);
          ctx.restore();
        }

        // Preset 4: Đồng Đội & Sáng Tạo (Teamwork)
        else if (campaignPreset === 'teamwork') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
          const teamGrad = ctx.createLinearGradient(0, 0, width, height);
          teamGrad.addColorStop(0, '#EA580C');
          teamGrad.addColorStop(0.5, '#C026D3');
          teamGrad.addColorStop(1, '#4F46E5');
          ctx.fillStyle = teamGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 12;
          ctx.stroke();

          // Top Banner
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 34px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('🚀 WE ARE ONE TEAM', cx, 45);

          // Bottom Banner
          const ribbonW = 780;
          const ribbonH = 100;
          const ribbonX = (width - ribbonW) / 2;
          const ribbonY = height - 145;

          ctx.beginPath();
          ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 20);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          ctx.fillStyle = '#EA580C';
          ctx.font = '900 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('CÙNG NHAU BỨC PHÁ THÀNH CÔNG', cx, ribbonY + 50);
          ctx.restore();
        }
      }

      // 4. Circular Social Crop Guide (Only visible in Preview, hidden on Export)
      if (showCircleGuide && !isExport) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.arc(width / 2, height / 2, 570, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 570, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Vùng tròn hiển thị trên Facebook/Zalo', width / 2, 85);
        ctx.restore();
      }

      return;
    }

    // =========================================================
    // MODE B: DEVICE MOCKUPS, FRAMES & GALLERY STUDIO MODE
    // =========================================================
    if (bgPreset === 'transparent') {
      ctx.clearRect(0, 0, width, height);
    } else if (bgPreset === 'blur' && fgImage) {
      // Magic Blur of Original Image
      ctx.save();
      const bgScale = Math.max(width / fgImage.naturalWidth, height / fgImage.naturalHeight) * 1.25;
      const bW = fgImage.naturalWidth * bgScale;
      const bH = fgImage.naturalHeight * bgScale;
      const bX = (width - bW) / 2;
      const bY = (height - bH) / 2;

      ctx.filter = 'blur(55px) brightness(0.85) saturate(1.25)';
      ctx.drawImage(fgImage, bX, bY, bW, bH);
      ctx.restore();

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

    // Shadow Configurator
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

    // Helper: Draw Cover Image
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

    ctx.save();
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const maxW = width * (scale / 100);
    const maxH = height * (scale / 100);

    // Frame 1: iPhone 16 Pro
    if (frameStyle === 'iphone') {
      const phoneH = Math.min(maxH, maxW * 2.1);
      const phoneW = phoneH / 2.12;
      const x = -phoneW / 2;
      const y = -phoneH / 2;
      const outerRadius = phoneW * 0.125;
      const bezel = phoneW * 0.038;

      applyShadow(45, 28, 0.45);

      ctx.beginPath();
      ctx.roundRect(x, y, phoneW, phoneH, outerRadius);
      const titaniumGrad = ctx.createLinearGradient(x, y, x + phoneW, y + phoneH);
      titaniumGrad.addColorStop(0, '#2D2E30');
      titaniumGrad.addColorStop(0.5, '#1E1F21');
      titaniumGrad.addColorStop(1, '#151618');
      ctx.fillStyle = titaniumGrad;
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#4A4B4F';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const screenX = x + bezel;
      const screenY = y + bezel;
      const screenW = phoneW - bezel * 2;
      const screenH = phoneH - bezel * 2;
      const innerRadius = outerRadius - bezel * 0.8;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenW, screenH, innerRadius);
      ctx.clip();
      drawImageProp(fgImage, screenX, screenY, screenW, screenH);

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

      ctx.beginPath();
      ctx.arc(pillX + pillW * 0.76, pillY + pillH / 2, pillH * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#080E1C';
      ctx.fill();
      ctx.restore();
    }

    // Frame 2: MacBook M3 Pro
    else if (frameStyle === 'macbook') {
      const lidW = Math.min(maxW, maxH * 1.55);
      const lidH = lidW * 0.65;
      const baseH = lidH * 0.07;
      const totalH = lidH + baseH;
      const x = -lidW / 2;
      const y = -totalH / 2;

      applyShadow(50, 30, 0.4);

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

      ctx.beginPath();
      ctx.roundRect(x, y, lidW, lidH, [14, 14, 2, 2]);
      ctx.fillStyle = '#1A1C1E';
      ctx.fill();
      ctx.strokeStyle = '#44474D';
      ctx.lineWidth = 1;
      ctx.stroke();

      const bezel = lidW * 0.022;
      const screenX = x + bezel;
      const screenY = y + bezel;
      const screenW = lidW - bezel * 2;
      const screenH = lidH - bezel * 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenW, screenH, [6, 6, 0, 0]);
      ctx.clip();
      drawImageProp(fgImage, screenX, screenY, screenW, screenH);

      const camNotchW = lidW * 0.11;
      const camNotchH = lidH * 0.052;
      ctx.beginPath();
      ctx.roundRect(-camNotchW / 2, screenY - 1, camNotchW, camNotchH, [0, 0, 5, 5]);
      ctx.fillStyle = '#1A1C1E';
      ctx.fill();
      ctx.restore();
    }

    // Frame 3: macOS Safari Browser
    else if (frameStyle === 'safari') {
      const winW = Math.min(maxW, maxH * 1.4);
      const winH = winW * 0.68;
      const x = -winW / 2;
      const y = -winH / 2;
      const headerH = 46;
      const radius = 14;

      applyShadow(40, 24, 0.35);

      ctx.beginPath();
      ctx.roundRect(x, y, winW, winH, radius);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, winW, headerH, [radius, radius, 0, 0]);
      ctx.fillStyle = '#EDEAE4';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const dotRadius = 5.5;
      const dotY = y + headerH / 2;
      const dotStartX = x + 20;

      // Traffic light dots
      ctx.beginPath();
      ctx.arc(dotStartX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF5F56';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dotStartX + 18, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFBD2E';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dotStartX + 36, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#27C93F';
      ctx.fill();

      // URL capsule
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

      ctx.fillStyle = '#5A606A';
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🔒  ${browserUrl || 'harryshare.vn'}`, 0, urlY + urlH / 2 + 1);
      ctx.restore();

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

    // Frame 4: Classic Polaroid
    else if (frameStyle === 'polaroid') {
      const polW = Math.min(maxW, maxH * 0.82);
      const polH = polW * 1.22;
      const x = -polW / 2;
      const y = -polH / 2;

      applyShadow(45, 26, 0.35);

      ctx.beginPath();
      ctx.roundRect(x, y, polW, polH, 6);
      ctx.fillStyle = '#FAF8F4';
      ctx.fill();

      const margin = polW * 0.085;
      const photoW = polW - margin * 2;
      const photoH = photoW;
      const photoX = x + margin;
      const photoY = y + margin;

      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      drawImageProp(fgImage, photoX, photoY, photoW, photoH);

      const vignette = ctx.createRadialGradient(
        photoX + photoW / 2, photoY + photoH / 2, photoW * 0.3,
        photoX + photoW / 2, photoY + photoH / 2, photoW * 0.75
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(40,25,10,0.18)');
      ctx.fillStyle = vignette;
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.restore();

      if (showCaption && captionText.trim()) {
        ctx.save();
        ctx.fillStyle = captionColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const chinCenterY = photoY + photoH + (y + polH - (photoY + photoH)) / 2;

        if (captionFont === 'handwriting') {
          ctx.font = 'italic 28px "Caveat", "Brush Script MT", cursive';
        } else if (captionFont === 'serif') {
          ctx.font = '600 22px Georgia, serif';
        } else {
          ctx.font = '500 18px sans-serif';
        }
        ctx.fillText(captionText, 0, chinCenterY);
        ctx.restore();
      }
    }

    // Frame 5: 35mm Film Strip
    else if (frameStyle === 'film35mm') {
      const filmW = Math.min(maxW, maxH * 1.5);
      const filmH = filmW * 0.68;
      const x = -filmW / 2;
      const y = -filmH / 2;

      applyShadow(45, 25, 0.45);

      ctx.beginPath();
      ctx.roundRect(x, y, filmW, filmH, 6);
      ctx.fillStyle = '#141414';
      ctx.fill();

      const trackH = filmH * 0.16;
      const photoW = filmW * 0.78;
      const photoH = filmH - trackH * 2;
      const photoX = -photoW / 2;
      const photoY = -photoH / 2;

      const sprocW = 12;
      const sprocH = 18;
      const sprocGap = 28;
      const sprocCount = Math.floor((filmW - 40) / sprocGap);
      const sprocStartX = x + 20;

      ctx.fillStyle = bgPreset === 'transparent' ? '#000000' : 'rgba(255,255,255,0.85)';

      for (let i = 0; i < sprocCount; i++) {
        const sx = sprocStartX + i * sprocGap;
        ctx.beginPath();
        ctx.roundRect(sx, y + (trackH - sprocH) / 2, sprocW, sprocH, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(sx, y + filmH - trackH + (trackH - sprocH) / 2, sprocW, sprocH, 3);
        ctx.fill();
      }

      ctx.fillStyle = '#E5A93C';
      ctx.font = 'bold 12px monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText('KODAK SAFETY FILM 400', x + 35, y + trackH / 2);
      ctx.fillText('▶ 24', -photoW / 2, y + filmH - trackH / 2);
      ctx.fillText('24A', photoW / 2 - 35, y + filmH - trackH / 2);

      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      drawImageProp(fgImage, photoX, photoY, photoW, photoH);
      ctx.restore();
    }

    // Gallery Frames
    else if (['oak_wood', 'dark_walnut', 'gold_luxury', 'gallery_black', 'gallery_white'].includes(frameStyle)) {
      const artAspect = fgImage.naturalWidth / fgImage.naturalHeight;
      let artW = Math.min(maxW * 0.7, maxH * 0.7 * artAspect);
      let artH = artW / artAspect;

      const borderThick = 28;
      const mat = Math.max(0, matWidth);
      const totalPad = borderThick + mat;

      const frameW = artW + totalPad * 2;
      const frameH = artH + totalPad * 2;
      const x = -frameW / 2;
      const y = -frameH / 2;

      applyShadow(55, 32, 0.45);

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

      if (mat > 0) {
        const matX = x + borderThick;
        const matY = y + borderThick;
        const matW = frameW - borderThick * 2;
        const matH = frameH - borderThick * 2;

        ctx.fillStyle = '#FBF9F5';
        ctx.fillRect(matX, matY, matW, matH);
      }

      const artX = -artW / 2;
      const artY = -artH / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(artX, artY, artW, artH);
      ctx.clip();
      drawImageProp(fgImage, artX, artY, artW, artH);
      ctx.restore();
    }

    // Minimal Cards
    else {
      const artAspect = fgImage.naturalWidth / fgImage.naturalHeight;
      const cardW = Math.min(maxW, maxH * artAspect);
      const cardH = cardW / artAspect;
      const x = -cardW / 2;
      const y = -cardH / 2;
      const r = Math.min(borderRadius, Math.min(cardW, cardH) / 2);

      applyShadow(48, 26, 0.4);

      if (frameStyle === 'glass_card') {
        const borderPad = 16;
        const glassW = cardW + borderPad * 2;
        const glassH = cardH + borderPad * 2;
        const gx = x - borderPad;
        const gy = y - borderPad;

        ctx.beginPath();
        ctx.roundRect(gx, gy, glassW, glassH, r + 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, r);
        ctx.clip();
        drawImageProp(fgImage, x, y, cardW, cardH);
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, r);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.clip();
        drawImageProp(fgImage, x, y, cardW, cardH);
        ctx.restore();
      }
    }

    ctx.restore();
  }, [
    getCanvasDimensions, frameCategory, campaignPreset, customFrameImage,
    avatarOffsetX, avatarOffsetY, avatarZoom, avatarRotation, avatarFlipX, showCircleGuide,
    bgPreset, bgCustomImage, fgImage, frameStyle, scale, rotation, shadow,
    matWidth, borderRadius, showCaption, captionText, captionFont, captionColor, browserUrl
  ]);

  // Re-draw on any parameter change
  useEffect(() => {
    drawCanvas(false);
  }, [drawCanvas]);

  // Copy Canvas Image to Clipboard
  const handleCopyClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw clean copy without guide circle
    drawCanvas(true);

    try {
      canvas.toBlob(async (blob) => {
        // Re-draw with guide circle
        drawCanvas(false);

        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setIsCopied(true);
        showToast('📋 Đã sao chép ảnh vào Clipboard! Bạn có thể dán (Ctrl+V) vào Zalo, Facebook, Canva...');
        setTimeout(() => setIsCopied(false), 2500);
      }, 'image/png');
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      drawCanvas(false);
      showToast('⚠️ Không thể tự động copy, vui lòng tải ảnh PNG về máy.');
    }
  };

  // Download Handlers
  const handleDownload = (format: 'png' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render clean image without guide circle for export
    drawCanvas(true);

    const mime = format === 'png' ? 'image/png' : 'image/webp';
    const ext = format === 'png' ? '.png' : '.webp';
    const dataUrl = canvas.toDataURL(mime, 0.95);

    // Restore guide circle on screen
    drawCanvas(false);

    const a = document.createElement('a');
    a.href = dataUrl;
    const prefix = frameCategory === 'campaign' ? 'avatar-twibbon' : `mockup-${frameStyle}`;
    a.download = `${prefix}-harryshare-${Date.now()}${ext}`;
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
          Lồng Khung Ảnh, Avatar Chiến Dịch & Mockup Thiết Bị
        </h1>
        <p className="text-stone-550 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tạo Avatar chiến dịch sự kiện (Twibbon) kéo zoom chỉnh mặt tiện lợi, lồng khung tranh nghệ thuật và tạo mockup iPhone 16 Pro, MacBook M3 tức thì. 100% xử lý cục bộ trên trình duyệt, miễn phí, không quảng cáo và không dính logo rác.
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
                  {frameCategory === 'campaign' ? 'Xem trước Avatar Chiến Dịch' : 'Xem trước thời gian thực'}
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

            {/* Canvas Container with Interactive Mouse / Touch Drag */}
            <div 
              className={`relative max-w-full max-h-[560px] flex items-center justify-center rounded-2xl overflow-hidden border border-olive/15 shadow-inner bg-stone-900/5 ${
                frameCategory === 'campaign' ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
              }`}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
                onWheel={handleCanvasWheel}
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
                    <p className="text-stone-400 text-xs">Hỗ trợ ảnh chụp chân dung, ảnh sản phẩm, ảnh chụp màn hình (PNG, JPG, WebP)</p>
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
                  <span>Đổi ảnh đại diện</span>
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
              <span>{frameCategory === 'campaign' ? 'Tải Avatar PNG Sắc Nét' : 'Tải PNG Sắc Nét'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Customization Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md shadow-sm">
          
          {/* Section 1: Main Categories Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-olive" />
              1. Danh Mục Khung Hình
            </label>

            {/* Category Tabs */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-sand/30 rounded-xl border border-olive/10 text-[10px] sm:text-[11px] font-bold">
              {[
                { id: 'campaign', label: 'Avatar', icon: Award },
                { id: 'device', label: 'Thiết bị', icon: Smartphone },
                { id: 'vintage', label: 'Vintage', icon: Film },
                { id: 'gallery', label: 'Tranh', icon: ImageIcon },
                { id: 'minimal', label: 'Thẻ nổi', icon: Layers }
              ].map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFrameCategory(cat.id as FrameCategory);
                      if (cat.id === 'campaign') setAspectRatio('1:1');
                      if (cat.id === 'device') setFrameStyle('iphone');
                      if (cat.id === 'vintage') setFrameStyle('polaroid');
                      if (cat.id === 'gallery') setFrameStyle('oak_wood');
                      if (cat.id === 'minimal') setFrameStyle('floating_card');
                    }}
                    className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      frameCategory === cat.id
                        ? 'bg-olive text-cream shadow-xs'
                        : 'text-stone-600 hover:text-olive'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB CONTENT A: CAMPAIGN AVATAR (TWIBBON) CONTROLS */}
          {/* ========================================================= */}
          {frameCategory === 'campaign' && (
            <div className="flex flex-col gap-5 border-t border-olive/10 pt-4">
              
              {/* Frame Selection */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-850">Khung chiến dịch sự kiện:</span>
                  <button
                    onClick={() => customFrameInputRef.current?.click()}
                    className="text-[11px] font-bold text-olive hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Tải khung PNG của team</span>
                  </button>
                  <input
                    ref={customFrameInputRef}
                    type="file"
                    accept="image/png,image/webp"
                    className="hidden"
                    onChange={handleCustomFrameUpload}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'solopreneur', label: 'Solopreneur Harry', desc: 'Olive & Gold sang trọng' },
                    { id: 'school', label: 'Chào Năm Học Mới', desc: 'Sắc xanh tri thức & tốt nghiệp' },
                    { id: 'anniversary', label: 'Kỷ Niệm Sự Kiện', desc: 'Đỏ & Vàng ngày thành lập' },
                    { id: 'teamwork', label: 'Đồng Đội Teamwork', desc: 'Cam & Tím năng động' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCampaignPreset(item.id as CampaignPreset)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                        campaignPreset === item.id
                          ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                          : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                      }`}
                    >
                      <span className="font-bold text-[11px]">{item.label}</span>
                      <span className="text-[10px] text-stone-400 truncate">{item.desc}</span>
                    </button>
                  ))}
                </div>

                {customFrameImage && (
                  <button
                    onClick={() => setCampaignPreset('custom')}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      campaignPreset === 'custom'
                        ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                        : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Award className="w-4 h-4 text-olive shrink-0" />
                      <span className="text-xs font-bold truncate">Khung riêng: {customFrameFileName}</span>
                    </div>
                    <span className="text-[10px] font-bold text-olive">Đang chọn</span>
                  </button>
                )}
              </div>

              {/* Avatar Drag & Alignment Controls */}
              <div className="flex flex-col gap-3.5 border-t border-olive/10 pt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-850 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-olive" />
                    Căn Chỉnh Khuôn Mặt (Ảnh)
                  </span>
                  <button
                    onClick={() => {
                      setAvatarOffsetX(0);
                      setAvatarOffsetY(0);
                      setAvatarZoom(100);
                      setAvatarRotation(0);
                    }}
                    className="text-[11px] font-bold text-stone-500 hover:text-olive flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Đặt lại giữa</span>
                  </button>
                </div>

                {/* Helpful Drag Guide Box */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  💡 <b>Mẹo kéo ảnh:</b> Bấm giữ chuột (hoặc chạm ngón tay trên điện thoại) trực tiếp lên ảnh xem trước để rê khuôn mặt vào đúng tâm khung tròn!
                </div>

                {/* Zoom Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-stone-600">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-olive" /> Phóng to / Thu nhỏ:
                    </span>
                    <span className="font-mono font-bold text-olive">{avatarZoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="220"
                    value={avatarZoom}
                    onChange={(e) => setAvatarZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                  />
                </div>

                {/* Rotation Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-stone-600">
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5 text-olive" /> Xoay góc ảnh:
                    </span>
                    <span className="font-mono font-bold text-olive">{avatarRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={avatarRotation}
                    onChange={(e) => setAvatarRotation(Number(e.target.value))}
                    className="w-full h-1.5 bg-olive/10 rounded-lg appearance-none cursor-pointer accent-olive"
                  />
                </div>

                {/* Quick Action Toggles */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setAvatarFlipX(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      avatarFlipX ? 'bg-olive text-cream border-olive' : 'bg-sand/20 text-stone-700 border-olive/10 hover:border-olive/30'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Lật gương ảnh</span>
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={showCircleGuide}
                      onChange={(e) => setShowCircleGuide(e.target.checked)}
                      className="cursor-pointer accent-olive w-3.5 h-3.5 rounded"
                    />
                    <span>Viền cắt tròn Facebook</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB CONTENT B: DEVICE, VINTAGE, GALLERY & MINIMAL CONTROLS */}
          {/* ========================================================= */}
          {frameCategory !== 'campaign' && (
            <>
              {/* Frame Style Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

              {/* Background Options */}
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

              {/* Aspect Ratio */}
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

              {/* Adjustments */}
              <div className="flex flex-col gap-3.5 border-t border-olive/10 pt-4 text-xs">
                <label className="font-bold text-stone-850 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-olive" />
                  4. Cân Chỉnh Chi Tiết
                </label>

                {/* Scale */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-stone-600">
                    <span>Kích thước khung:</span>
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

                {/* Passe-partout */}
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

                {/* Border Radius */}
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

                {/* Shadow */}
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

              {/* Custom Safari / Polaroid */}
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
            </>
          )}

        </div>
      </div>

      {/* Feature Guide & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            ⚡
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Kéo & Zoom Trực Tiếp</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Dễ dàng căn chỉnh khuôn mặt vào tâm khung avatar tròn bằng thao tác rê chuột trực tiếp, thanh trượt phóng to thu nhỏ và lật gương ảnh.
          </p>
        </div>

        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            🎗️
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Tải Khung PNG Riêng Biệt</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Hỗ trợ ban tổ chức, đội ngũ, trường học tải file PNG khung viền đục lỗ trong suốt để toàn thể thành viên tự lồng ảnh thay avatar đồng loạt.
          </p>
        </div>

        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            🔒
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Bảo Mật Cục Bộ 100%</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Ảnh cá nhân xử lý hoàn toàn trên trình duyệt người dùng qua HTML5 Canvas, không tải lên server, xuất ảnh vuông 1200x1200 chuẩn nét.
          </p>
        </div>
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
