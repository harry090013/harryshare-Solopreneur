'use client';

import React, { useState } from 'react';
import {
  FileText, Layers, Music, PlayCircle, FileCode2,
  Upload, Download, Loader2, CheckCircle, AlertCircle,
  Image as ImageIcon, Scissors, Merge, Printer,
  ArrowUp, ArrowDown, Trash2, Sparkles, FileSpreadsheet
} from 'lucide-react';
import {
  AudioToSrtPanel,
  YoutubeAndVideoAudioPanel,
  DataConvertPanel,
} from './AudioMediaTabs';
import { convertPdfDocumentToDocx, type PdfToWordMode } from '@/lib/pdfToDocx';

type StudioTab = 'pdf-word' | 'pdf-tools' | 'audio-srt' | 'youtube-audio' | 'data-convert';
type PdfWordMode = 'pdf-to-word' | 'word-to-pdf';
type PdfToolMode = 'img-to-pdf' | 'pdf-to-img' | 'merge-pdf' | 'split-pdf';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function stripExt(name: string): string {
  return name.replace(/\.[^/.]+$/, '');
}

async function loadPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  return pdfjsLib;
}

function parsePageRanges(input: string, totalPages: number): number[] {
  const result = new Set<number>();
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) result.add(i);
      }
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= totalPages) {
        result.add(n);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

/* ============================================================================
   TAB 1: PDF <-> WORD (.DOCX)
   ============================================================================ */
function PdfWordPanel() {
  const [mode, setMode] = useState<PdfWordMode>('pdf-to-word');
  const [pdfToWordMode, setPdfToWordMode] = useState<PdfToWordMode>('editable');
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [renderedHtml, setRenderedHtml] = useState('');

  const handleFileSelect = (f: File | null) => {
    setFile(f);
    setError('');
    setSuccessMsg('');
    setPreviewText('');
    setRenderedHtml('');
  };

  const convertPdfToWord = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setSuccessMsg('');
    setProgress('Đang tải bộ đọc PDF...');

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

      const renderPageToPng = async (pageNumber: number, scale: number) => {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL('image/png');
        const imgRes = await fetch(dataUrl);
        const ab = await imgRes.arrayBuffer();
        const bytes = new Uint8Array(ab);
        return { bytes, widthPx: canvas.width, heightPx: canvas.height };
      };

      const result = await convertPdfDocumentToDocx(pdf, {
        mode: pdfToWordMode,
        onProgress: (msg) => setProgress(msg),
        renderPageToPng,
      });

      const outName = `${stripExt(file.name)}.docx`;
      downloadBlob(result.blob, outName);

      setPreviewText(result.previewText);
      const summaryParts: string[] = [];
      if (result.stats.headings > 0) summaryParts.push(`${result.stats.headings} tiêu đề`);
      if (result.stats.paragraphs > 0) summaryParts.push(`${result.stats.paragraphs} đoạn văn`);
      if (result.stats.tables > 0) summaryParts.push(`${result.stats.tables} bảng biểu`);
      if (result.stats.scannedPages > 0) summaryParts.push(`${result.stats.scannedPages} trang ảnh/bố cục`);
      const detail = summaryParts.length > 0 ? ` (${summaryParts.join(', ')})` : '';
      setSuccessMsg(`Đã chuyển đổi thành công ${result.totalPages} trang PDF sang "${outName}"${detail}!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đọc file PDF này.');
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  const convertWordToPdf = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setSuccessMsg('');
    setProgress('Đang phân tích file Word (.docx)...');

    try {
      const mammoth = await import('mammoth');
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { PDFDocument } = await import('pdf-lib');

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value || '<p>(Tài liệu trống)</p>';
      setRenderedHtml(htmlContent);

      setProgress('Đang dàn trang A4 & dựng font tiếng Việt...');

      // Render inside an isolated iframe with pure hex CSS so Tailwind v4 oklch()/lab() never crashes html2canvas
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-10000px';
      iframe.style.top = '0';
      iframe.style.width = '794px';
      iframe.style.height = '1200px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) throw new Error('Không khởi tạo được khung dựng trang A4.');
        iframeDoc.open();
        iframeDoc.write(`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; color: #1c1917; font-family: "Segoe UI", Arial, sans-serif; font-size: 14px; line-height: 1.65; }
    .hs-docx-root { width: 794px; padding: 56px 60px; background: #ffffff; color: #1c1917; }
    .hs-docx-root h1 { font-size: 24px; font-weight: 700; margin: 0 0 14px; color: #1c1917; }
    .hs-docx-root h2 { font-size: 19px; font-weight: 700; margin: 18px 0 10px; color: #1c1917; }
    .hs-docx-root h3 { font-size: 16px; font-weight: 700; margin: 14px 0 8px; color: #1c1917; }
    .hs-docx-root p { margin: 0 0 10px; }
    .hs-docx-root ul, .hs-docx-root ol { margin: 0 0 12px; padding-left: 24px; }
    .hs-docx-root table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    .hs-docx-root td, .hs-docx-root th { border: 1px solid #d6d3d1; padding: 6px 8px; text-align: left; }
    .hs-docx-root img { max-width: 100%; height: auto; }
  </style>
</head>
<body><div class="hs-docx-root">${htmlContent}</div></body>
</html>`);
        iframeDoc.close();

        // Wait a tick for layout & images inside iframe
        await new Promise((r) => setTimeout(r, 120));
        const rootEl = iframeDoc.querySelector('.hs-docx-root') as HTMLElement | null;
        if (!rootEl) throw new Error('Không dựng được nội dung tài liệu Word.');
        iframe.style.height = `${Math.max(1200, rootEl.scrollHeight + 80)}px`;

        const canvas = await html2canvas(rootEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 794,
        });

        setProgress('Đang xuất các trang PDF chuẩn A4...');
        const pdfDoc = await PDFDocument.create();
        const a4WidthPt = 595.28;
        const a4HeightPt = 841.89;

        // Smart A4 slicing: find clean whitespace row near page boundary so lines aren't cut in half
        const pageSliceHeightPx = Math.floor(canvas.width * (a4HeightPt / a4WidthPt));
        const fullCtx = canvas.getContext('2d', { willReadFrequently: true });
        const slices: { sy: number; sh: number }[] = [];
        let cursorY = 0;

        while (cursorY < canvas.height) {
          let nextY = Math.min(canvas.height, cursorY + pageSliceHeightPx);
          if (nextY < canvas.height && fullCtx) {
            const searchWindow = Math.min(140, Math.floor(pageSliceHeightPx * 0.12));
            for (let scanY = nextY; scanY > nextY - searchWindow && scanY > cursorY + 200; scanY -= 2) {
              const rowData = fullCtx.getImageData(0, scanY, canvas.width, 1).data;
              let isBlank = true;
              for (let px = 0; px < rowData.length; px += 16) {
                if (rowData[px] < 245 || rowData[px + 1] < 245 || rowData[px + 2] < 245) {
                  isBlank = false;
                  break;
                }
              }
              if (isBlank) {
                nextY = scanY;
                break;
              }
            }
          }
          slices.push({ sy: cursorY, sh: nextY - cursorY });
          cursorY = nextY;
        }

        const totalPages = slices.length;

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          const { sy, sh } = slices[pageIndex];

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageSliceHeightPx;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
          }

          const pngDataUrl = pageCanvas.toDataURL('image/png');
          const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer());
          const pngImage = await pdfDoc.embedPng(pngBytes);

          const page = pdfDoc.addPage([a4WidthPt, a4HeightPt]);
          page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: a4WidthPt,
            height: a4HeightPt,
          });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const outName = `${stripExt(file.name)}.pdf`;
        downloadBlob(blob, outName);
        setSuccessMsg(`Đã chuyển đổi thành công file Word sang "${outName}" (${totalPages} trang A4)!`);
      } finally {
        document.body.removeChild(iframe);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể chuyển đổi file Word này (chỉ hỗ trợ .docx).');
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  const openPrintVectorPdf = () => {
    if (!renderedHtml) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) {
      setError('Trình duyệt đã chặn cửa sổ bật lên. Vui lòng cho phép popup để in PDF vector.');
      return;
    }
    win.document.write(`
      <!doctype html>
      <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>${file ? stripExt(file.name) : 'Tai-lieu'} - HarryShare PDF</title>
        <style>
          @page { size: A4; margin: 18mm; }
          body { font-family: "Segoe UI", Inter, Arial, sans-serif; color: #1c1917; font-size: 13.5px; line-height: 1.65; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          td, th { border: 1px solid #d6d3d1; padding: 6px 8px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>${renderedHtml}<script>window.onload = () => { window.print(); };</script></body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Switch */}
      <div className="flex flex-wrap gap-2 bg-sand/60 p-1.5 rounded-2xl border border-stone-200 w-fit">
        <button
          type="button"
          onClick={() => { setMode('pdf-to-word'); handleFileSelect(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            mode === 'pdf-to-word' ? 'bg-olive text-white shadow-sm' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          PDF → Word (.docx)
        </button>
        <button
          type="button"
          onClick={() => { setMode('word-to-pdf'); handleFileSelect(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            mode === 'word-to-pdf' ? 'bg-olive text-white shadow-sm' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Word (.docx) → PDF
        </button>
      </div>

      {/* Dropzone */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col gap-5">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-850">
            {mode === 'pdf-to-word' ? 'Chuyển đổi PDF sang Word (.docx)' : 'Chuyển đổi Word (.docx) sang PDF'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {mode === 'pdf-to-word'
              ? 'Tự động giữ tiêu đề (H1–H3), in đậm/in nghiêng, cỡ chữ, căn lề, gộp đoạn văn thông minh và nhận diện bảng biểu. Có thêm chế độ giữ nguyên 100% bố cục cho CV/tờ rơi/PDF scan.'
              : 'Dàn trang chuẩn A4 tự động tránh cắt ngang dòng chữ, hỗ trợ trọn vẹn dấu tiếng Việt, bảng biểu và hình ảnh trong file .docx. Có thêm tùy chọn lưu PDF vector.'}
          </p>
        </div>

        {mode === 'pdf-to-word' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPdfToWordMode('editable')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                pdfToWordMode === 'editable'
                  ? 'border-olive bg-olive/5 ring-1 ring-olive/20'
                  : 'border-stone-200 hover:bg-sand/40'
              }`}
            >
              <div className="text-xs font-bold text-stone-850">Giữ định dạng &amp; Chỉnh sửa được (Khuyên dùng)</div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Phục hồi tiêu đề, đậm/nghiêng, cỡ chữ, căn lề, bảng biểu &amp; đoạn văn liền mạch.
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPdfToWordMode('exact-layout')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                pdfToWordMode === 'exact-layout'
                  ? 'border-olive bg-olive/5 ring-1 ring-olive/20'
                  : 'border-stone-200 hover:bg-sand/40'
              }`}
            >
              <div className="text-xs font-bold text-stone-850">Giữ nguyên 100% bố cục (CV / Thiết kế / Scan)</div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Xuất từng trang PDF nét cao đúng kích thước chuẩn vào Word, không xê dịch layout.
              </div>
            </button>
          </div>
        )}

        <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-stone-200 hover:border-olive/50 hover:bg-olive/[0.02] transition-all cursor-pointer text-center">
          <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">
              {file ? file.name : mode === 'pdf-to-word' ? 'Chọn file PDF (.pdf) từ máy tính' : 'Chọn file Word (.docx) từ máy tính'}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Sẵn sàng chuyển đổi`
                : 'File không tải lên máy chủ — bảo mật tuyệt đối tài liệu cá nhân'}
            </p>
          </div>
          <input
            type="file"
            accept={mode === 'pdf-to-word' ? '.pdf,application/pdf' : '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!file || processing}
            onClick={mode === 'pdf-to-word' ? convertPdfToWord : convertWordToPdf}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-olive text-white text-sm font-bold hover:bg-olive-dark disabled:opacity-50 transition-colors cursor-pointer"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {processing
              ? progress || 'Đang xử lý...'
              : mode === 'pdf-to-word'
              ? 'Chuyển sang Word (.docx)'
              : 'Chuyển sang PDF (.pdf)'}
          </button>

          {mode === 'word-to-pdf' && renderedHtml && (
            <button
              type="button"
              onClick={openPrintVectorPdf}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-sand/60 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-olive" />
              In / Lưu PDF Vector (chọn chữ được)
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-olive/10 border border-olive/20 text-olive-dark text-xs sm:text-sm font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-olive" />
            <span>{successMsg}</span>
          </div>
        )}

        {previewText && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Xem nhanh nội dung đã trích xuất</span>
            <pre className="p-4 rounded-2xl bg-sand/50 border border-stone-200 text-xs text-stone-700 whitespace-pre-wrap max-h-60 overflow-y-auto font-sans leading-relaxed">
              {previewText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   TAB 2: PDF UTILITIES (IMAGES <-> PDF, MERGE, SPLIT)
   ============================================================================ */
interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
}

function PdfUtilitiesPanel() {
  const [mode, setMode] = useState<PdfToolMode>('img-to-pdf');
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // PDF -> Images state
  const [renderedPages, setRenderedPages] = useState<RenderedPdfPage[]>([]);

  // Split PDF state
  const [splitTotalPages, setSplitTotalPages] = useState<number>(0);
  const [pageRangeInput, setPageRangeInput] = useState('1-2');

  const resetState = (nextMode?: PdfToolMode) => {
    if (nextMode) setMode(nextMode);
    setFiles([]);
    setError('');
    setSuccessMsg('');
    setRenderedPages([]);
    setSplitTotalPages(0);
  };

  const handleImagesToPdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError('');
    setSuccessMsg('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const imgFile = files[i];
        setProgress(`Đang ghép ảnh ${i + 1}/${files.length}...`);

        // Normalize any browser-supported image (JPG, PNG, WebP) into JPEG/PNG via canvas
        const bitmapUrl = URL.createObjectURL(imgFile);
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error(`Không đọc được ảnh "${imgFile.name}"`));
          el.src = bitmapUrl;
        });
        URL.revokeObjectURL(bitmapUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Không khởi tạo được canvas trình duyệt.');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const isPng = imgFile.type === 'image/png';
        const dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.92);
        const imgBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
        const embedded = isPng
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);

        // Fit inside A4 preserving aspect ratio
        const isLandscape = embedded.width > embedded.height;
        const pageW = isLandscape ? 841.89 : 595.28;
        const pageH = isLandscape ? 595.28 : 841.89;
        const margin = 24;
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const scale = Math.min(maxW / embedded.width, maxH / embedded.height);
        const drawW = embedded.width * scale;
        const drawH = embedded.height * scale;

        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(embedded, {
          x: (pageW - drawW) / 2,
          y: (pageH - drawH) / 2,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }), 'harryshare-anh-sang-pdf.pdf');
      setSuccessMsg(`Đã tạo xong file PDF gồm ${files.length} ảnh!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi chuyển ảnh sang PDF.');
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  const handlePdfToImages = async () => {
    const pdfFile = files[0];
    if (!pdfFile) return;
    setProcessing(true);
    setError('');
    setSuccessMsg('');
    setRenderedPages([]);

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const pages: RenderedPdfPage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Đang xuất ảnh trang ${i}/${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.8 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        pages.push({ pageNumber: i, dataUrl: canvas.toDataURL('image/png') });
      }

      setRenderedPages(pages);
      setSuccessMsg(`Đã tách thành công ${pages.length} trang ảnh PNG nét cao!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tách ảnh từ PDF.');
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  const handleMergePdfs = async () => {
    if (files.length < 2) {
      setError('Vui lòng chọn ít nhất 2 file PDF để gộp.');
      return;
    }
    setProcessing(true);
    setError('');
    setSuccessMsg('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setProgress(`Đang gộp file ${i + 1}/${files.length}...`);
        const bytes = await files[i].arrayBuffer();
        const srcDoc = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }

      const outBytes = await mergedPdf.save();
      downloadBlob(new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }), 'harryshare-gop-pdf.pdf');
      setSuccessMsg(`Đã gộp ${files.length} file PDF (${mergedPdf.getPageCount()} trang) thành công!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gộp các file PDF này (có thể có file bị đặt mật khẩu).');
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  const inspectSplitPdf = async (f: File | null) => {
    setFiles(f ? [f] : []);
    setError('');
    setSuccessMsg('');
    setSplitTotalPages(0);
    if (!f) return;

    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const count = doc.getPageCount();
      setSplitTotalPages(count);
      setPageRangeInput(count > 1 ? `1-${Math.min(2, count)}` : '1');
    } catch {
      setError('Không đọc được số trang của file PDF này.');
    }
  };

  const handleSplitPdf = async () => {
    const pdfFile = files[0];
    if (!pdfFile || splitTotalPages === 0) return;

    const selectedPages = parsePageRanges(pageRangeInput, splitTotalPages);
    if (selectedPages.length === 0) {
      setError(`Vui lòng nhập khoảng trang hợp lệ từ 1 đến ${splitTotalPages} (ví dụ: 1-3, 5).`);
      return;
    }

    setProcessing(true);
    setError('');
    setSuccessMsg('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const srcDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(
        srcDoc,
        selectedPages.map((p) => p - 1)
      );
      copied.forEach((p) => newDoc.addPage(p));

      const outBytes = await newDoc.save();
      const outName = `${stripExt(pdfFile.name)}-trang-${selectedPages.join('_')}.pdf`;
      downloadBlob(new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }), outName);
      setSuccessMsg(`Đã tách ${selectedPages.length} trang (${selectedPages.join(', ')}) sang "${outName}"!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tách trang PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const moveFile = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-mode pills */}
      <div className="flex flex-wrap gap-2 bg-sand/60 p-1.5 rounded-2xl border border-stone-200 w-fit">
        {[
          { id: 'img-to-pdf' as PdfToolMode, label: 'Ảnh → PDF', icon: ImageIcon },
          { id: 'pdf-to-img' as PdfToolMode, label: 'PDF → Ảnh PNG', icon: ImageIcon },
          { id: 'merge-pdf' as PdfToolMode, label: 'Gộp PDF', icon: Merge },
          { id: 'split-pdf' as PdfToolMode, label: 'Tách trang PDF', icon: Scissors },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => resetState(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === item.id ? 'bg-olive text-white shadow-sm' : 'text-stone-600 hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col gap-5">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-850">
            {mode === 'img-to-pdf' && 'Gộp nhiều ảnh (JPG, PNG, WebP) thành 1 file PDF'}
            {mode === 'pdf-to-img' && 'Chuyển từng trang PDF thành ảnh PNG sắc nét'}
            {mode === 'merge-pdf' && 'Gộp nhiều file PDF thành một tài liệu duy nhất'}
            {mode === 'split-pdf' && 'Tách / Trích xuất các trang cần dùng từ PDF'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Xử lý hoàn toàn trên trình duyệt — không giới hạn dung lượng máy chủ, giữ nguyên bảo mật tài liệu.
          </p>
        </div>

        {/* File input */}
        <label className="flex flex-col items-center justify-center gap-3 p-7 rounded-2xl border-2 border-dashed border-stone-200 hover:border-olive/50 hover:bg-olive/[0.02] transition-all cursor-pointer text-center">
          <div className="w-11 h-11 rounded-2xl bg-olive/10 text-olive flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">
              {mode === 'img-to-pdf' && 'Chọn một hoặc nhiều ảnh (JPG, PNG, WebP)'}
              {mode === 'pdf-to-img' && (files[0] ? files[0].name : 'Chọn 1 file PDF cần xuất ảnh')}
              {mode === 'merge-pdf' && 'Chọn nhiều file PDF cần gộp lại'}
              {mode === 'split-pdf' && (files[0] ? `${files[0].name} (${splitTotalPages} trang)` : 'Chọn 1 file PDF cần tách trang')}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {mode === 'img-to-pdf' || mode === 'merge-pdf'
                ? 'Bạn có thể thêm nhiều file và sắp xếp lại thứ tự bên dưới'
                : 'Hỗ trợ mọi file PDF không khóa mật khẩu'}
            </p>
          </div>
          <input
            type="file"
            multiple={mode === 'img-to-pdf' || mode === 'merge-pdf'}
            accept={mode === 'img-to-pdf' ? 'image/jpeg,image/png,image/webp' : '.pdf,application/pdf'}
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              if (selected.length === 0) return;
              if (mode === 'split-pdf') {
                void inspectSplitPdf(selected[0]);
              } else if (mode === 'img-to-pdf' || mode === 'merge-pdf') {
                setFiles((prev) => [...prev, ...selected]);
                setError('');
                setSuccessMsg('');
              } else {
                setFiles([selected[0]]);
                setError('');
                setSuccessMsg('');
                setRenderedPages([]);
              }
              e.target.value = '';
            }}
          />
        </label>

        {/* Sortable list for multi-file modes */}
        {(mode === 'img-to-pdf' || mode === 'merge-pdf') && files.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Danh sách file ({files.length})
              </span>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-xs font-semibold text-stone-400 hover:text-red-600 cursor-pointer"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {files.map((f, idx) => (
                <div
                  key={`${f.name}-${idx}`}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-sand/50 border border-stone-200/80 text-xs"
                >
                  <span className="truncate font-medium text-stone-800">
                    <span className="font-bold text-olive mr-2">#{idx + 1}</span>
                    {f.name}
                    <span className="text-stone-400 ml-2">({(f.size / 1024).toFixed(0)} KB)</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveFile(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-lg hover:bg-white disabled:opacity-30 cursor-pointer"
                      title="Đẩy lên"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFile(idx, 1)}
                      disabled={idx === files.length - 1}
                      className="p-1 rounded-lg hover:bg-white disabled:opacity-30 cursor-pointer"
                      title="Đẩy xuống"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Split page range input */}
        {mode === 'split-pdf' && splitTotalPages > 0 && (
          <div className="flex flex-col gap-2 bg-sand/50 p-4 rounded-2xl border border-stone-200">
            <label className="text-xs font-bold text-stone-700">
              Nhập các trang muốn tách (tổng cộng {splitTotalPages} trang)
            </label>
            <input
              type="text"
              value={pageRangeInput}
              onChange={(e) => setPageRangeInput(e.target.value)}
              placeholder="Ví dụ: 1-3, 5, 8-10"
              className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 focus:outline-none focus:border-olive"
            />
            <span className="text-[11px] text-stone-500">
              Dùng dấu gạch ngang cho khoảng trang (1-3) và dấu phẩy cho các trang rời rạc (1, 4, 6).
            </span>
          </div>
        )}

        {/* Action Button */}
        <div>
          <button
            type="button"
            disabled={files.length === 0 || processing}
            onClick={() => {
              if (mode === 'img-to-pdf') void handleImagesToPdf();
              else if (mode === 'pdf-to-img') void handlePdfToImages();
              else if (mode === 'merge-pdf') void handleMergePdfs();
              else void handleSplitPdf();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-olive text-white text-sm font-bold hover:bg-olive-dark disabled:opacity-50 transition-colors cursor-pointer"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {processing
              ? progress || 'Đang xử lý...'
              : mode === 'img-to-pdf'
              ? 'Tạo file PDF từ ảnh'
              : mode === 'pdf-to-img'
              ? 'Xuất các trang thành ảnh PNG'
              : mode === 'merge-pdf'
              ? 'Gộp thành 1 file PDF'
              : 'Tách & Tải file PDF mới'}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-olive/10 border border-olive/20 text-olive-dark text-xs sm:text-sm font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-olive" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Rendered PNG gallery */}
        {mode === 'pdf-to-img' && renderedPages.length > 0 && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Kết quả ({renderedPages.length} trang)
              </span>
              <button
                type="button"
                onClick={() => {
                  renderedPages.forEach((p, idx) => {
                    setTimeout(() => {
                      const a = document.createElement('a');
                      a.href = p.dataUrl;
                      a.download = `${files[0] ? stripExt(files[0].name) : 'page'}-trang-${p.pageNumber}.png`;
                      a.click();
                    }, idx * 250);
                  });
                }}
                className="text-xs font-bold text-olive hover:underline cursor-pointer"
              >
                Tải tất cả ({renderedPages.length} ảnh)
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {renderedPages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="rounded-2xl border border-stone-200 overflow-hidden bg-sand/30 flex flex-col"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.dataUrl}
                    alt={`Trang ${p.pageNumber}`}
                    className="w-full aspect-[3/4] object-contain bg-white p-1"
                  />
                  <div className="flex items-center justify-between px-3 py-2 border-t border-stone-200 bg-white">
                    <span className="text-[11px] font-bold text-stone-600">Trang {p.pageNumber}</span>
                    <a
                      href={p.dataUrl}
                      download={`${files[0] ? stripExt(files[0].name) : 'page'}-trang-${p.pageNumber}.png`}
                      className="text-[11px] font-bold text-olive hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      PNG
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   MAIN STUDIO SHELL (5 TABS)
   ============================================================================ */
const STUDIO_TABS: {
  id: StudioTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'pdf-word', label: 'PDF ↔ Word', sublabel: 'Đổi qua lại .docx & .pdf', icon: FileText },
  { id: 'pdf-tools', label: 'Công cụ PDF', sublabel: 'Ảnh, Gộp & Tách trang', icon: Layers },
  { id: 'audio-srt', label: 'MP3 → Lyric SRT', sublabel: 'AI tự động + Sync tay', icon: Music },
  { id: 'youtube-audio', label: 'YouTube & Audio', sublabel: 'Link YT + Tách WAV từ Video', icon: PlayCircle },
  { id: 'data-convert', label: 'CSV / JSON / MD', sublabel: 'Chuyển đổi file dữ liệu', icon: FileCode2 },
];

export default function FileConverterStudio() {
  const [activeTab, setActiveTab] = useState<StudioTab>('pdf-word');

  return (
    <div className="flex flex-col gap-6">
      {/* Studio Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {STUDIO_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start gap-1.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                active
                  ? 'bg-olive text-white border-olive shadow-md shadow-olive/15'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-olive/40 hover:bg-sand/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-olive'}`} />
                <span className="text-xs sm:text-sm font-bold leading-tight">{tab.label}</span>
              </div>
              <span className={`text-[11px] leading-snug ${active ? 'text-white/80' : 'text-stone-500'}`}>
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div>
        {activeTab === 'pdf-word' && <PdfWordPanel />}
        {activeTab === 'pdf-tools' && <PdfUtilitiesPanel />}
        {activeTab === 'audio-srt' && <AudioToSrtPanel />}
        {activeTab === 'youtube-audio' && <YoutubeAndVideoAudioPanel />}
        {activeTab === 'data-convert' && <DataConvertPanel />}
      </div>

      {/* Quick Capability Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-sand/50 border border-stone-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-olive shrink-0 mt-0.5" />
          <div className="text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-850 block mb-0.5">Miễn phí &amp; không đóng dấu watermark</strong>
            Tất cả file PDF, Word, ảnh và phụ đề SRT xuất ra đều sạch sẽ, không gắn logo hay giới hạn lượt tải.
          </div>
        </div>
        <div className="bg-sand/50 border border-stone-200/80 rounded-2xl p-4 flex items-start gap-3">
          <FileSpreadsheet className="w-4 h-4 text-olive shrink-0 mt-0.5" />
          <div className="text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-850 block mb-0.5">Xử lý tại chỗ trên trình duyệt</strong>
            Các tác vụ PDF, Word, tách WAV từ video và CSV/JSON chạy trực tiếp trên thiết bị của bạn, không lưu file lên server.
          </div>
        </div>
        <div className="bg-sand/50 border border-stone-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Music className="w-4 h-4 text-olive shrink-0 mt-0.5" />
          <div className="text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-850 block mb-0.5">MP3 → SRT linh hoạt 2 chế độ</strong>
            Hỗ trợ AI nhận diện giọng nói tự động (file ≤ 4MB) và chế độ nghe &amp; bấm dấu mốc thời gian thủ công không giới hạn dung lượng.
          </div>
        </div>
      </div>
    </div>
  );
}
