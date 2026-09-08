'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  ArrowLeft, QrCode, Download, Sparkles, CreditCard, 
  Globe, Wifi, Image as ImageIcon, Copy, Check, RefreshCw
} from 'lucide-react';
import NewsletterCallout from '@/components/NewsletterCallout';

type QrType = 'url' | 'vietqr' | 'wifi';

interface BankInfo {
  code: string;
  name: string;
  shortName: string;
}

const POPULAR_BANKS: BankInfo[] = [
  { code: 'VCB', name: 'Ngân hàng Ngoại thương Việt Nam', shortName: 'Vietcombank' },
  { code: 'MB', name: 'Ngân hàng Quân đội', shortName: 'MBBank' },
  { code: 'TCB', name: 'Ngân hàng Kỹ thương Việt Nam', shortName: 'Techcombank' },
  { code: 'ACB', name: 'Ngân hàng Á Châu', shortName: 'ACB' },
  { code: 'BIDV', name: 'Ngân hàng Đầu tư và Phát triển', shortName: 'BIDV' },
  { code: 'CTG', name: 'Ngân hàng Công thương Việt Nam', shortName: 'VietinBank' },
  { code: 'VPB', name: 'Ngân hàng Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'TPB', name: 'Ngân hàng Tiên Phong', shortName: 'TPBank' },
  { code: 'STB', name: 'Ngân hàng Sài Gòn Thương Tín', shortName: 'Sacombank' },
  { code: 'VIB', name: 'Ngân hàng Quốc tế', shortName: 'VIB' },
  { code: 'OCB', name: 'Ngân hàng Phương Đông', shortName: 'OCB' }
];

export default function QrGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Type & input fields
  const [qrType, setQrType] = useState<QrType>('url');

  // URL / Text
  const [urlInput, setUrlInput] = useState<string>('https://harryshare.vn');

  // VietQR
  const [selectedBank, setSelectedBank] = useState<string>('VCB');
  const [accountNo, setAccountNo] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('Ung ho HarryShare');

  // Wi-Fi
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Aesthetic Customization
  const [fgColor, setFgColor] = useState<string>('#2C3527'); // Olive
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>('');

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Build the raw QR string based on mode
  const getQrRawContent = useCallback((): string => {
    if (qrType === 'url') {
      return urlInput.trim() || 'https://harryshare.vn';
    }

    if (qrType === 'vietqr') {
      if (!accountNo.trim()) return 'https://harryshare.vn';
      // Format VietQR Quick Link URL
      const cleanAcc = accountNo.trim();
      const cleanAmt = amount.trim() ? `?amount=${amount.trim()}` : '';
      const cleanMsg = message.trim() ? (cleanAmt ? `&memo=${encodeURIComponent(message.trim())}` : `?memo=${encodeURIComponent(message.trim())}`) : '';
      return `https://api.vietqr.io/${selectedBank}/${cleanAcc}/compact.png${cleanAmt}${cleanMsg}`;
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
      };
    }
  };

  // Generate and draw QR code to canvas
  const generateQr = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const qrContent = getQrRawContent();

    try {
      // 1. Generate base QR code on canvas with High Error Correction ('H') to allow logo center
      await QRCode.toCanvas(canvas, qrContent, {
        width: 1000,
        margin: 3,
        errorCorrectionLevel: 'H',
        color: {
          dark: fgColor,
          light: bgColor
        }
      });

      // 2. Draw Center Logo if provided
      if (logoImage) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const canvasDim = canvas.width; // 1000px
        const logoSize = Math.round(canvasDim * 0.22); // 22% of canvas width
        const logoX = (canvasDim - logoSize) / 2;
        const logoY = (canvasDim - logoSize) / 2;

        // Draw protective white circular/rounded background behind logo
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        const pad = 12;
        ctx.roundRect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2, 20);
        ctx.fill();

        // Clip logo inside rounded rectangle
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, 16);
        ctx.clip();
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      }
    } catch (err) {
      console.error('QR code generation error:', err);
    }
  }, [getQrRawContent, fgColor, bgColor, logoImage]);

  useEffect(() => {
    generateQr();
  }, [generateQr]);

  // Download Handler
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `qrcode-harryshare-${Date.now()}.png`;
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
          <QrCode className="w-3 h-3 text-olive" />
          Tiện ích đa năng
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-850">
          Tạo Mã QR Tùy Biến & VietQR Chèn Logo
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-2xl">
          Tạo mã QR link website, kết nối Wi-Fi hoặc mã chuyển khoản ngân hàng VietQR. Tùy biến màu sắc thương hiệu, chèn logo/ảnh đại diện cá nhân vào giữa để in ấn bao bì sản phẩm, danh thiếp và menu.
        </p>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Input Form */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-cream/70 border border-olive/15 p-6 rounded-3xl backdrop-blur-md">
          
          {/* Mode Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-stone-850">1. Chọn loại mã QR:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'url', label: 'Link Website', icon: Globe },
                { id: 'vietqr', label: 'VietQR Ngân hàng', icon: CreditCard },
                { id: 'wifi', label: 'Mạng Wi-Fi', icon: Wifi }
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setQrType(t.id as QrType)}
                    className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      qrType === t.id
                        ? 'border-olive bg-olive text-cream shadow-xs'
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

          {/* Form Content Based on Mode */}
          <div className="flex flex-col gap-4 border-t border-olive/10 pt-4">
            {qrType === 'url' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-stone-850">Địa chỉ liên kết (URL) hoặc nội dung văn bản:</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://facebook.com/trang-cua-ban"
                  className="w-full text-xs px-3.5 py-3 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                />
              </div>
            )}

            {qrType === 'vietqr' && (
              <div className="flex flex-col gap-3 text-xs">
                {/* Bank Select */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Chọn ngân hàng thụ hưởng:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive text-stone-850"
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
                  <label className="font-bold text-stone-850">Số tài khoản ngân hàng:</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    placeholder="Ví dụ: 0123456789"
                    className="w-full px-3.5 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-mono"
                  />
                </div>

                {/* Amount (Optional) */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Số tiền (Tùy chọn, để trống nếu người chuyển tự nhập):</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ví dụ: 50000"
                    className="w-full px-3.5 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-mono"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Nội dung chuyển khoản (Tùy chọn):</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ví dụ: Mua nhang que thao moc"
                    className="w-full px-3.5 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                  />
                </div>
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Tên mạng Wi-Fi (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Ví dụ: Thao Moc Huong Coffee"
                    className="w-full px-3.5 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-stone-850">Mật khẩu Wi-Fi:</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full px-3.5 py-2.5 bg-cream border border-olive/20 rounded-xl focus:outline-none focus:border-olive font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Color & Logo Customization */}
          <div className="flex flex-col gap-4 border-t border-olive/10 pt-4">
            <span className="text-xs font-bold text-stone-850">2. Tùy chỉnh màu sắc & Logo cá nhân:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* QR Color */}
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-stone-600 font-semibold">Màu mã QR:</span>
                <div className="flex gap-2">
                  {[
                    { color: '#2C3527', label: 'Olive' },
                    { color: '#000000', label: 'Đen' },
                    { color: '#1E3A8A', label: 'Xanh Navy' },
                    { color: '#831843', label: 'Đỏ mận' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setFgColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        fgColor === c.color ? 'border-olive scale-110 shadow-xs' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-stone-600 font-semibold">Màu nền:</span>
                <div className="flex gap-2">
                  {[
                    { color: '#FFFFFF', label: 'Trắng' },
                    { color: '#F9F6F0', label: 'Kem nhạt' },
                    { color: '#EFE9DF', label: 'Cát ấm' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setBgColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        bgColor === c.color ? 'border-olive scale-110 shadow-xs' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="flex items-center justify-between bg-sand/20 p-3 rounded-2xl border border-olive/10 mt-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-olive/10 border border-olive/20 flex items-center justify-center text-olive shrink-0 overflow-hidden">
                  {logoImage ? (
                    <img src={logoImage.src} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-stone-850">Chèn Logo / Avatar vào giữa</span>
                  <span className="text-[10px] text-stone-400">
                    {logoFileName ? logoFileName : 'Hỗ trợ PNG trong suốt, ảnh đại diện vuông'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {logoImage && (
                  <button
                    onClick={() => { setLogoImage(null); setLogoFileName(''); }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1"
                  >
                    Gỡ
                  </button>
                )}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-cream border border-olive/20 hover:border-olive text-stone-700 font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
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

        {/* Right: Live Preview & Download */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-cream/50 border border-olive/15 rounded-3xl p-6 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center min-h-[460px] relative">
            
            <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-olive/10 text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-olive" />
                Mã QR sẵn sàng quét
              </span>
              <span className="text-[10px] text-stone-400 font-mono">1000 x 1000 px</span>
            </div>

            {/* QR Canvas */}
            <div className="p-4 rounded-2xl bg-white shadow-md border border-olive/10 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-[280px] sm:max-w-[320px] w-full h-auto aspect-square block"
              />
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-4">
              Mã QR sử dụng mức độ sửa lỗi chuẩn <b>High (30%)</b> giúp máy ảnh quét nhanh ngay cả khi chèn logo ở trung tâm.
            </p>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-olive hover:bg-olive-dark text-cream font-bold text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Tải Mã QR Độ Nét Cao (PNG)</span>
          </button>
        </div>
      </div>

      {/* Newsletter Block */}
      <NewsletterCallout />
    </div>
  );
}
