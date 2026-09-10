'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  ArrowLeft, QrCode, Download, Sparkles, CreditCard, 
  Globe, Wifi, Image as ImageIcon, Copy, Check, RefreshCw,
  Type, Sliders, Palette, Layout, Shield
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

type QrType = 'url' | 'vietqr' | 'wifi';
type CardStyle = 'standee' | 'minimal_card' | 'qr_only';

interface BankInfo {
  code: string;
  name: string;
  shortName: string;
}

const POPULAR_BANKS: BankInfo[] = [
  { code: 'MB', name: 'Ngân hàng Quân đội', shortName: 'MBBank' },
  { code: 'VCB', name: 'Ngân hàng Ngoại thương Việt Nam', shortName: 'Vietcombank' },
  { code: 'TCB', name: 'Ngân hàng Kỹ thương Việt Nam', shortName: 'Techcombank' },
  { code: 'ACB', name: 'Ngân hàng Á Châu', shortName: 'ACB' },
  { code: 'BIDV', name: 'Ngân hàng Đầu tư và Phát triển', shortName: 'BIDV' },
  { code: 'CTG', name: 'Ngân hàng Công thương Việt Nam', shortName: 'VietinBank' },
  { code: 'VPB', name: 'Ngân hàng Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'TPB', name: 'Ngân hàng Tiên Phong', shortName: 'TPBank' },
  { code: 'STB', name: 'Ngân hàng Sài Gòn Thương Tín', shortName: 'Sacombank' },
  { code: 'VIB', name: 'Ngân hàng Quốc tế', shortName: 'VIB' },
  { code: 'OCB', name: 'Ngân hàng Phương Đông', shortName: 'OCB' },
  { code: 'SHB', name: 'Ngân hàng Sài Gòn - Hà Nội', shortName: 'SHB' }
];

export default function QrGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Type & input fields
  const [qrType, setQrType] = useState<QrType>('vietqr');
  const [cardStyle, setCardStyle] = useState<CardStyle>('standee');

  // URL / Text Mode
  const [urlInput, setUrlInput] = useState<string>('https://harryshare.vn');

  // VietQR Mode
  const [selectedBank, setSelectedBank] = useState<string>('MB');
  const [accountNo, setAccountNo] = useState<string>('0900138888');
  const [accountName, setAccountName] = useState<string>('NGUYEN QUANG HIEU');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('Ung ho HarryShare');

  // Wi-Fi Mode
  const [wifiSsid, setWifiSsid] = useState<string>('HarryShare Coffee');
  const [wifiPassword, setWifiPassword] = useState<string>('harryshare2026');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Text Customization
  const [showTopText, setShowTopText] = useState<boolean>(true);
  const [topTitle, setTopTitle] = useState<string>('QUÉT MÃ ĐỂ THANH TOÁN');
  const [showBottomText, setShowBottomText] = useState<boolean>(true);
  const [bottomNote, setBottomNote] = useState<string>('Cảm ơn bạn đã đồng hành & ủng hộ!');
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif'>('sans');

  // Color & Logo Customization
  const [fgColor, setFgColor] = useState<string>('#2C3527'); // Olive Harry
  const [cardBgColor, setCardBgColor] = useState<string>('#FFFFFF');
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>('');

  // Interactive Toast
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync Default Top Title when qrType changes
  useEffect(() => {
    if (qrType === 'vietqr') {
      setTopTitle('QUÉT MÃ ĐỂ THANH TOÁN');
      setBottomNote('Cảm ơn bạn đã đồng hành & ủng hộ!');
    } else if (qrType === 'wifi') {
      setTopTitle('KẾT NỐI WI-FI MIỄN PHÍ');
      setBottomNote('Quét camera để kết nối mạng tự động');
    } else {
      setTopTitle('QUÉT MÃ TRUY CẬP WEBSITE');
      setBottomNote('Khám phá các bài viết & tài nguyên mới nhất');
    }
  }, [qrType]);

  // Build the raw QR string based on mode
  const getQrRawContent = useCallback((): string => {
    if (qrType === 'url') {
      return urlInput.trim() || 'https://harryshare.vn';
    }

    if (qrType === 'vietqr') {
      const cleanAcc = accountNo.trim() || '0900138888';
      const cleanAmt = amount.trim() ? `?amount=${amount.trim()}` : '';
      const cleanMsg = message.trim() ? (cleanAmt ? `&memo=${encodeURIComponent(message.trim())}` : `?memo=${encodeURIComponent(message.trim())}`) : '';
      return `https://img.vietqr.io/image/${selectedBank}-${cleanAcc}-qr_only.png${cleanAmt}${cleanMsg}`;
    }

    if (qrType === 'wifi') {
      return `WIFI:S:${wifiSsid};T:${wifiAuth};P:${wifiPassword};;`;
    }

    return urlInput;
  }, [qrType, urlInput, selectedBank, accountNo, amount, message, wifiSsid, wifiPassword, wifiAuth]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFileName(file.name);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        setLogoImage(img);
        showToast('Đã chèn logo vào giữa mã QR!');
      };
    }
  };

  // Draw Full Canvas (Card + QR + Text)
  const drawQrCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine dimensions based on card style
    let width = 1200;
    let height = cardStyle === 'qr_only' ? 1200 : 1540;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Card Background
    if (cardStyle === 'qr_only') {
      ctx.fillStyle = cardBgColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Elegant Standee Card with subtle borders
      ctx.fillStyle = cardBgColor;
      ctx.fillRect(0, 0, width, height);

      // Outer Decorative Border
      const pad = 36;
      ctx.strokeStyle = cardBgColor === '#18181B' ? 'rgba(255,255,255,0.12)' : 'rgba(44, 53, 39, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

      // Corner accent marks
      const markSize = 24;
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 4;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(pad, pad + markSize);
      ctx.lineTo(pad, pad);
      ctx.lineTo(pad + markSize, pad);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - pad - markSize, pad);
      ctx.lineTo(width - pad, pad);
      ctx.lineTo(width - pad, pad + markSize);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(pad, height - pad - markSize);
      ctx.lineTo(pad, height - pad);
      ctx.lineTo(pad + markSize, height - pad);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - pad - markSize, height - pad);
      ctx.lineTo(width - pad, height - pad);
      ctx.lineTo(width - pad, height - pad - markSize);
      ctx.stroke();
    }

    // 2. Draw Header Text (if Standee mode)
    let qrTopY = 240;
    let qrSize = 720;

    if (cardStyle === 'qr_only') {
      qrTopY = (height - qrSize) / 2;
    } else {
      let currentHeaderY = 95;

      // Header Pill Badge
      const badgeW = qrType === 'vietqr' ? 240 : 200;
      const badgeH = 46;
      const badgeX = (width - badgeW) / 2;

      ctx.beginPath();
      ctx.roundRect(badgeX, currentHeaderY, badgeW, badgeH, 23);
      ctx.fillStyle = fgColor === '#2C3527' ? 'rgba(44, 53, 39, 0.08)' : 'rgba(0,0,0,0.06)';
      ctx.fill();

      // Badge Icon & Label
      ctx.fillStyle = fgColor;
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const badgeLabel = qrType === 'vietqr' ? '⚡ VIETQR • NAPAS 24/7' : (qrType === 'wifi' ? '📶 WI-FI QUICK CONNECT' : '🌐 LINK WEBSITE');
      ctx.fillText(badgeLabel, width / 2, currentHeaderY + badgeH / 2);

      currentHeaderY += badgeH + 40;

      // Top Title Text
      if (showTopText && topTitle.trim()) {
        ctx.fillStyle = cardBgColor === '#18181B' ? '#FFFFFF' : '#1C1917';
        ctx.font = fontStyle === 'serif' ? 'bold 44px Georgia, serif' : '900 42px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(topTitle.toUpperCase(), width / 2, currentHeaderY);
        currentHeaderY += 45;
      }

      qrTopY = currentHeaderY + 20;
    }

    // 3. Generate and Render QR Matrix
    const qrCanvas = document.createElement('canvas');
    const qrContent = getQrRawContent();

    try {
      if (qrType === 'vietqr' && qrContent.startsWith('https://img.vietqr.io')) {
        // Fetch official VietQR EMVCo compliant image directly
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = qrContent;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
        });

        // Draw onto main canvas
        const qrX = (width - qrSize) / 2;
        ctx.drawImage(img, qrX, qrTopY, qrSize, qrSize);
      } else {
        // High Error Correction Level ('H') ensures fast scanning with center logo
        await QRCode.toCanvas(qrCanvas, qrContent, {
          width: qrSize,
          margin: 1,
          errorCorrectionLevel: 'H',
          color: {
            dark: fgColor,
            light: '#FFFFFF'
          }
        });

        // Draw White backing capsule behind QR code for high contrast
        const qrX = (width - qrSize) / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX - 16, qrTopY - 16, qrSize + 32, qrSize + 32);

        ctx.drawImage(qrCanvas, qrX, qrTopY, qrSize, qrSize);
      }

      // 4. Center Logo Overlay
      if (logoImage) {
        const logoBoxSize = Math.round(qrSize * 0.22);
        const logoX = width / 2 - logoBoxSize / 2;
        const logoY = qrTopY + qrSize / 2 - logoBoxSize / 2;

        ctx.save();
        // White rounded background with drop shadow
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        const pad = 12;
        ctx.roundRect(logoX - pad, logoY - pad, logoBoxSize + pad * 2, logoBoxSize + pad * 2, 22);
        ctx.fill();

        // Clip and draw logo
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoBoxSize, logoBoxSize, 18);
        ctx.clip();
        ctx.drawImage(logoImage, logoX, logoY, logoBoxSize, logoBoxSize);
        ctx.restore();
      }

      // 5. Footer Information & Custom Notes (if Standee mode)
      if (cardStyle !== 'qr_only') {
        let footerY = qrTopY + qrSize + 55;

        if (qrType === 'vietqr') {
          // VietQR Info Capsule: Bank • Account • Name
          const infoW = 860;
          const infoH = 110;
          const infoX = (width - infoW) / 2;

          ctx.beginPath();
          ctx.roundRect(infoX, footerY, infoW, infoH, 20);
          ctx.fillStyle = cardBgColor === '#18181B' ? 'rgba(255,255,255,0.08)' : 'rgba(44, 53, 39, 0.05)';
          ctx.fill();
          ctx.strokeStyle = cardBgColor === '#18181B' ? 'rgba(255,255,255,0.1)' : 'rgba(44, 53, 39, 0.1)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Account Number & Bank
          ctx.fillStyle = cardBgColor === '#18181B' ? '#FFFFFF' : '#1C1917';
          ctx.font = 'bold 36px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${selectedBank} • ${accountNo || '0900138888'}`, width / 2, footerY + 38);

          // Account Name
          ctx.fillStyle = fgColor;
          ctx.font = '800 24px -apple-system, sans-serif';
          ctx.fillText((accountName || 'CHỦ TÀI KHOẢN').toUpperCase(), width / 2, footerY + 76);

          footerY += infoH + 35;
        } else if (qrType === 'wifi') {
          // Wi-Fi Info Capsule
          const infoW = 860;
          const infoH = 95;
          const infoX = (width - infoW) / 2;

          ctx.beginPath();
          ctx.roundRect(infoX, footerY, infoW, infoH, 20);
          ctx.fillStyle = cardBgColor === '#18181B' ? 'rgba(255,255,255,0.08)' : 'rgba(44, 53, 39, 0.05)';
          ctx.fill();

          ctx.fillStyle = cardBgColor === '#18181B' ? '#FFFFFF' : '#1C1917';
          ctx.font = 'bold 28px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`Mạng: ${wifiSsid || 'HarryShare'}   |   Mật khẩu: ${wifiPassword || '12345678'}`, width / 2, footerY + 48);

          footerY += infoH + 35;
        }

        // Bottom Custom Note
        if (showBottomText && bottomNote.trim()) {
          ctx.fillStyle = cardBgColor === '#18181B' ? 'rgba(255,255,255,0.7)' : '#78716C';
          ctx.font = fontStyle === 'serif' ? 'italic 24px Georgia, serif' : '500 22px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bottomNote, width / 2, footerY);
        }
      }

    } catch (err) {
      console.error('Error drawing QR Canvas:', err);
    }
  }, [
    cardStyle, qrType, urlInput, selectedBank, accountNo, accountName, amount, message,
    wifiSsid, wifiPassword, wifiAuth, showTopText, topTitle, showBottomText, bottomNote,
    fontStyle, fgColor, cardBgColor, logoImage, getQrRawContent
  ]);

  useEffect(() => {
    drawQrCanvas();
  }, [drawQrCanvas]);

  // Copy Image to Clipboard
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
        showToast('📋 Đã sao chép ảnh mã QR vào Clipboard! Bạn có thể dán (Ctrl+V) vào Zalo, Facebook, Canva...');
        setTimeout(() => setIsCopied(false), 2500);
      }, 'image/png');
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      showToast('⚠️ Không thể tự động copy, vui lòng tải ảnh PNG về máy.');
    }
  };

  // Download Handler
  const handleDownload = (format: 'png' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = format === 'png' ? 'image/png' : 'image/webp';
    const ext = format === 'png' ? '.png' : '.webp';
    const a = document.createElement('a');
    a.href = canvas.toDataURL(mime, 0.95);
    a.download = `qrcode-${qrType}-${Date.now()}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Đã tải ảnh mã QR ${format.toUpperCase()} độ nét cao!`);
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
          <QrCode className="w-3.5 h-3.5 text-olive" />
          Studio Tạo Mã QR & Thẻ Thanh Toán
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-850">
          Tạo Mã QR, VietQR Để Bàn & Bảng Thông Tin
        </h1>
        <p className="text-stone-550 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tạo mã QR thanh toán Napas 24/7, Wi-Fi và liên kết website. Tự do chèn logo, tùy biến tiêu đề, chú thích và xuất file bảng để bàn (Standee) sang trọng để in ấn hoặc gửi khách hàng.
        </p>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Input & Customization Form */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md shadow-sm">
          
          {/* Section 1: Template Style & QR Type */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-olive" />
              1. Chọn Định Dạng Bảng Mã QR:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standee', label: 'Bảng Để Bàn (Standee)', desc: 'Kèm chữ & thông tin thanh toán' },
                { id: 'minimal_card', label: 'Thẻ Vuông Tối Giản', desc: 'Bo góc viền mềm mại' },
                { id: 'qr_only', label: 'Mã QR Thuần Túy', desc: 'Chỉ lấy mã vuông để tự thiết kế' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCardStyle(s.id as CardStyle)}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    cardStyle === s.id
                      ? 'border-olive bg-olive text-cream shadow-xs'
                      : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                  }`}
                >
                  <span className="text-xs font-bold">{s.label}</span>
                  <span className={`text-[10px] truncate ${cardStyle === s.id ? 'text-cream/80' : 'text-stone-400'}`}>
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: QR Type Selector */}
          <div className="flex flex-col gap-2 border-t border-olive/10 pt-4">
            <span className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-olive" />
              2. Nội Dung Mã QR:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'vietqr', label: 'VietQR Ngân hàng', icon: CreditCard },
                { id: 'url', label: 'Link Website', icon: Globe },
                { id: 'wifi', label: 'Mạng Wi-Fi', icon: Wifi }
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setQrType(t.id as QrType)}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      qrType === t.id
                        ? 'border-olive bg-olive/10 text-olive shadow-xs ring-1 ring-olive'
                        : 'border-olive/10 bg-sand/15 text-stone-700 hover:border-olive/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Input Fields */}
          <div className="flex flex-col gap-4">
            {qrType === 'vietqr' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-sand/20 p-4 rounded-2xl border border-olive/10">
                {/* Bank Select */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="font-bold text-stone-850">Ngân hàng thụ hưởng:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850 font-medium"
                  >
                    {POPULAR_BANKS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.shortName} ({b.code}) — {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Number */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Số tài khoản:</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    placeholder="0123456789"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-mono font-bold"
                  />
                </div>

                {/* Account Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Tên chủ tài khoản (in hoa):</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                    placeholder="NGUYEN QUANG HIEU"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-bold uppercase"
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Số tiền (VNĐ - Không bắt buộc):</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Để trống nếu người chuyển tự nhập"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-mono"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Nội dung chuyển khoản (Không bắt buộc):</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ung ho HarryShare"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                  />
                </div>
              </div>
            )}

            {qrType === 'url' && (
              <div className="flex flex-col gap-2 text-xs bg-sand/20 p-4 rounded-2xl border border-olive/10">
                <label className="font-bold text-stone-850">Địa chỉ liên kết (URL) hoặc nội dung văn bản:</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://harryshare.vn"
                  className="w-full px-3.5 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-sand/20 p-4 rounded-2xl border border-olive/10">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Tên mạng Wi-Fi (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="HarryShare Coffee"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Mật khẩu Wi-Fi:</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Mật khẩu..."
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Custom Text & Brand Messaging */}
          {cardStyle !== 'qr_only' && (
            <div className="flex flex-col gap-3.5 border-t border-olive/10 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-850 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-olive" />
                  3. Tiêu Đề & Lời Chúc / Chú Thích:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-medium">Font chữ:</span>
                  <button
                    onClick={() => setFontStyle('sans')}
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                      fontStyle === 'sans' ? 'bg-olive text-cream' : 'bg-sand/30 text-stone-600'
                    }`}
                  >
                    Hiện đại
                  </button>
                  <button
                    onClick={() => setFontStyle('serif')}
                    className={`px-2 py-0.5 rounded font-bold font-serif transition-all cursor-pointer ${
                      fontStyle === 'serif' ? 'bg-olive text-cream' : 'bg-sand/30 text-stone-600'
                    }`}
                  >
                    Cổ điển
                  </button>
                </div>
              </div>

              {/* Top Title */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 font-semibold">Dòng tiêu đề trên cùng:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-500">
                    <input
                      type="checkbox"
                      checked={showTopText}
                      onChange={(e) => setShowTopText(e.target.checked)}
                      className="cursor-pointer accent-olive w-3.5 h-3.5 rounded"
                    />
                    <span>Hiển thị</span>
                  </label>
                </div>
                {showTopText && (
                  <input
                    type="text"
                    value={topTitle}
                    onChange={(e) => setTopTitle(e.target.value)}
                    placeholder="Ví dụ: QUÉT MÃ ĐỂ THANH TOÁN"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850 font-bold"
                  />
                )}
              </div>

              {/* Bottom Note */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 font-semibold">Dòng chú thích / Lời cảm ơn dưới đáy:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-500">
                    <input
                      type="checkbox"
                      checked={showBottomText}
                      onChange={(e) => setShowBottomText(e.target.checked)}
                      className="cursor-pointer accent-olive w-3.5 h-3.5 rounded"
                    />
                    <span>Hiển thị</span>
                  </label>
                </div>
                {showBottomText && (
                  <input
                    type="text"
                    value={bottomNote}
                    onChange={(e) => setBottomNote(e.target.value)}
                    placeholder="Ví dụ: Cảm ơn quý khách đã mua sắm!"
                    className="w-full px-3 py-2 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850 italic"
                  />
                )}
              </div>
            </div>
          )}

          {/* Section 4: Color & Logo Customization */}
          <div className="flex flex-col gap-3.5 border-t border-olive/10 pt-4 text-xs">
            <span className="font-bold text-stone-850 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-olive" />
              4. Tùy Chỉnh Màu Sắc & Chèn Logo:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* QR Code Color */}
              <div className="flex flex-col gap-1.5">
                <span className="text-stone-600 font-semibold">Màu mã QR:</span>
                <div className="flex gap-2">
                  {[
                    { color: '#2C3527', label: 'Olive Harry' },
                    { color: '#111827', label: 'Đen than' },
                    { color: '#1E3A8A', label: 'Xanh Navy' },
                    { color: '#881337', label: 'Đỏ mận' },
                    { color: '#78350F', label: 'Nâu đất' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setFgColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        fgColor === c.color ? 'border-olive scale-110 shadow-xs ring-2 ring-olive/30' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="flex flex-col gap-1.5">
                <span className="text-stone-600 font-semibold">Màu phông thẻ:</span>
                <div className="flex gap-2">
                  {[
                    { color: '#FFFFFF', label: 'Trắng tinh' },
                    { color: '#FDFBF7', label: 'Kem mộc' },
                    { color: '#F5F0EA', label: 'Cát ấm' },
                    { color: '#18181B', label: 'Đêm đen' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setCardBgColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        cardBgColor === c.color ? 'border-olive scale-110 shadow-xs ring-2 ring-olive/30' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Center Upload */}
            <div className="flex items-center justify-between bg-sand/20 p-3 rounded-2xl border border-olive/10 mt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-olive/10 border border-olive/20 flex items-center justify-center text-olive shrink-0 overflow-hidden shadow-2xs">
                  {logoImage ? (
                    <img src={logoImage.src} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-stone-850">Chèn Logo / Avatar vào tâm mã</span>
                  <span className="text-[10px] text-stone-400">
                    {logoFileName ? logoFileName : 'Hỗ trợ PNG trong suốt, logo vuông thương hiệu'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {logoImage && (
                  <button
                    onClick={() => { setLogoImage(null); setLogoFileName(''); }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 cursor-pointer"
                  >
                    Gỡ
                  </button>
                )}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-cream border border-olive/20 hover:border-olive text-stone-750 font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer shadow-2xs"
                >
                  {logoImage ? 'Đổi logo' : 'Tải lên'}
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Preview & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-cream/60 border border-olive/15 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-sm flex flex-col items-center justify-center min-h-[500px] relative">
            
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center mb-3 pb-3 border-b border-olive/10 text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-olive" />
                Bản xem trước thời gian thực
              </span>
              <span className="text-[10px] text-stone-400 font-mono bg-sand/40 px-2 py-0.5 rounded">
                {cardStyle === 'qr_only' ? '1200 x 1200' : '1200 x 1540'} px
              </span>
            </div>

            {/* Strictly Constrained Canvas Container (Fixes vertical stretching bug) */}
            <div className="relative w-full flex items-center justify-center p-3 bg-stone-900/5 rounded-2xl border border-olive/10 min-h-[380px] max-h-[520px] overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-auto h-auto max-w-full max-h-[480px] object-contain block mx-auto rounded-xl shadow-md select-none"
              />
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-3 leading-relaxed">
              Mã QR sử dụng tiêu chuẩn sửa lỗi <b>High (30%)</b> giúp máy quét ngân hàng nhận diện tức thì ngay cả khi in ấn thực tế.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap gap-2.5 justify-end items-center">
            {/* Quick Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              className={`flex-1 sm:flex-initial border text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isCopied 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-cream border-olive/20 text-stone-750 hover:border-olive hover:text-olive'
              }`}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Đã chép vào bộ nhớ!' : 'Sao chép ảnh (Ctrl+C)'}</span>
            </button>

            {/* Download WebP */}
            <button
              onClick={() => handleDownload('webp')}
              className="flex-1 sm:flex-initial bg-sand/30 border border-olive/20 hover:border-olive text-stone-800 font-bold text-xs px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-cream"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Tải WebP</span>
            </button>

            {/* Download PNG High-Res */}
            <button
              onClick={() => handleDownload('png')}
              className="flex-1 sm:flex-initial bg-olive hover:bg-olive-dark text-cream font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-98"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Tải PNG Sắc Nét In Ấn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Guide & Practical Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            🏷️
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Chuẩn Bảng Để Bàn (Standee)</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Thiết kế theo tỷ lệ thẻ đứng tiêu chuẩn, sẵn sàng in mica hoặc dán lên bàn thanh toán cửa hàng, bao bì sản phẩm hay menu quán.
          </p>
        </div>

        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            ✍️
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Chèn Tiêu Đề & Lời Chúc</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Dễ dàng gõ tên thương hiệu, thông điệp cảm ơn hoặc hướng dẫn thanh toán trực tiếp lên bảng mà không cần biết dùng Photoshop.
          </p>
        </div>

        <div className="bg-cream/60 border border-olive/15 p-5 rounded-2xl flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive font-bold">
            ⚡
          </div>
          <h4 className="font-serif font-bold text-stone-850 text-sm">Chuẩn VietQR Napas 24/7</h4>
          <p className="text-stone-500 text-xs leading-relaxed">
            Tương thích 100% với tất cả ứng dụng ngân hàng và ví điện tử tại Việt Nam, máy ảnh điện thoại nhận diện và thanh toán tức thì.
          </p>
        </div>
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
