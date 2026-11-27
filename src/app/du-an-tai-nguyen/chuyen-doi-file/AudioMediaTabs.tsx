'use client';

import React, { useState, useRef } from 'react';
import {
  Music, PlayCircle, FileCode2, Upload, Download, Loader2,
  Play, Pause, CheckCircle, AlertCircle, Copy, Sparkles,
  Clock, Video, ExternalLink, RefreshCw
} from 'lucide-react';

function downloadTextFile(content: string, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatSrtTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const ms = Math.floor((safe - Math.floor(safe)) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function encodeWavFromAudioBuffer(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(buffer.numberOfChannels, 2);
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/* ============================================================
   TAB 3: MP3 / AUDIO -> LYRIC SRT (AI + MANUAL LIVE SYNC)
   ============================================================ */
export function AudioToSrtPanel() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [language, setLanguage] = useState<'vi' | 'en' | 'auto'>('vi');
  const [mode, setMode] = useState<'lyrics' | 'subtitle'>('lyrics');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [srtOutput, setSrtOutput] = useState('');
  const [provider, setProvider] = useState('');
  const [copied, setCopied] = useState(false);

  // Manual sync state
  const [subMode, setSubMode] = useState<'ai' | 'manual'>('ai');
  const [rawLyrics, setRawLyrics] = useState('');
  const [syncedLines, setSyncedLines] = useState<Array<{ time: number; text: string }>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAudioFile(f);
    setError('');
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(f));
    setSyncedLines([]);
    setCurrentIdx(0);
  };

  const handleAiTranscribe = async () => {
    if (!audioFile) {
      setError('Vui lòng chọn tệp âm thanh (MP3, WAV, M4A) trước.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', audioFile);
      fd.append('language', language);
      fd.append('mode', mode);

      const res = await fetch('/api/tools/audio-to-srt', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Không thể tách phụ đề lúc này.');
      } else {
        setSrtOutput(data.srt || '');
        setProvider(data.provider || 'AI');
      }
    } catch {
      setError('Lỗi kết nối khi gửi tệp âm thanh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const lyricLines = rawLyrics
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const handleMarkCurrentLine = () => {
    if (!audioRef.current || currentIdx >= lyricLines.length) return;
    const t = audioRef.current.currentTime;
    const nextSynced = [...syncedLines, { time: t, text: lyricLines[currentIdx] }];
    setSyncedLines(nextSynced);
    setCurrentIdx(currentIdx + 1);

    // Build SRT live
    const srt = nextSynced
      .map((item, idx) => {
        const start = item.time;
        const end = idx < nextSynced.length - 1 ? Math.max(start + 0.5, nextSynced[idx + 1].time) : start + 4;
        return `${idx + 1}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${item.text}`;
      })
      .join('\n\n');
    setSrtOutput(srt);
    setProvider('Đồng bộ thủ công trực tiếp');
  };

  const handleCopy = () => {
    if (!srtOutput) return;
    navigator.clipboard.writeText(srtOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseName = audioFile ? audioFile.name.replace(/\.[^/.]+$/, '') : 'lyric';

  return (
    <div className="flex flex-col gap-6">
      {/* Mode switch */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSubMode('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            subMode === 'ai'
              ? 'bg-olive text-cream shadow-xs'
              : 'bg-cream border border-olive/15 text-stone-600 hover:text-olive'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Tách tự động bằng AI (≤ 4MB)
        </button>
        <button
          onClick={() => setSubMode('manual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            subMode === 'manual'
              ? 'bg-olive text-cream shadow-xs'
              : 'bg-cream border border-olive/15 text-stone-600 hover:text-olive'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Đồng bộ Lyric thủ công (Không giới hạn dung lượng)
        </button>
      </div>

      {/* File Uploader */}
      <div className="p-6 rounded-2xl border border-dashed border-olive/25 bg-sand/20 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center">
          <Music className="w-6 h-6" />
        </div>
        <div>
          <p className="font-serif font-bold text-stone-850 text-base">
            {audioFile ? audioFile.name : 'Chọn tệp MP3 / WAV / M4A / OGG'}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {audioFile
              ? `Dung lượng: ${(audioFile.size / (1024 * 1024)).toFixed(2)} MB`
              : 'Hỗ trợ tách lời bài hát hoặc phụ đề giọng nói ra định dạng chuẩn .SRT'}
          </p>
        </div>
        <label className="px-5 py-2.5 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark transition-all cursor-pointer inline-flex items-center gap-2">
          <Upload className="w-3.5 h-3.5" />
          {audioFile ? 'Đổi tệp âm thanh' : 'Tải tệp âm thanh lên'}
          <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
        </label>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full max-w-md mt-2"
          />
        )}
      </div>

      {subMode === 'ai' ? (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end bg-cream/80 p-5 rounded-2xl border border-olive/10">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Ngôn ngữ</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'vi' | 'en' | 'auto')}
              className="px-3.5 py-2.5 rounded-xl border border-olive/15 bg-cream text-sm text-stone-700 focus:outline-none focus:border-olive"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">Tiếng Anh (English)</option>
              <option value="auto">Tự động nhận diện</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Loại nội dung</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'lyrics' | 'subtitle')}
              className="px-3.5 py-2.5 rounded-xl border border-olive/15 bg-cream text-sm text-stone-700 focus:outline-none focus:border-olive"
            >
              <option value="lyrics">Lời bài hát (Lyrics)</option>
              <option value="subtitle">Phụ đề giọng nói / Bài giảng</option>
            </select>
          </div>
          <button
            onClick={handleAiTranscribe}
            disabled={loading || !audioFile}
            className="px-6 py-2.5 rounded-xl bg-olive text-cream text-sm font-bold hover:bg-olive-dark disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'AI đang nghe & tách SRT...' : 'Tách sang .SRT ngay'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 bg-cream/80 p-5 rounded-2xl border border-olive/10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700">
              Bước 1: Dán lời bài hát hoặc lời thoại (mỗi câu một dòng)
            </label>
            <textarea
              rows={5}
              value={rawLyrics}
              onChange={(e) => {
                setRawLyrics(e.target.value);
                setSyncedLines([]);
                setCurrentIdx(0);
              }}
              placeholder={"Dòng lời thứ nhất...\nDòng lời thứ hai...\nDòng lời thứ ba..."}
              className="w-full p-3.5 rounded-xl border border-olive/15 bg-cream text-sm text-stone-700 focus:outline-none focus:border-olive font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-olive/10">
            <div className="text-xs text-stone-600">
              Tiến độ: <strong>{syncedLines.length} / {lyricLines.length}</strong> dòng
              {lyricLines[currentIdx] && (
                <span className="block text-olive font-semibold mt-0.5">
                  Dòng tiếp theo: “{lyricLines[currentIdx]}”
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!audioRef.current) return;
                  if (isPlaying) audioRef.current.pause();
                  else audioRef.current.play();
                }}
                disabled={!audioUrl}
                className="px-4 py-2 rounded-xl border border-olive/20 bg-cream text-xs font-bold text-stone-700 hover:text-olive disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
              </button>
              <button
                onClick={handleMarkCurrentLine}
                disabled={!audioUrl || currentIdx >= lyricLines.length}
                className="px-5 py-2 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Đánh dấu mốc thời gian dòng này
              </button>
              <button
                onClick={() => {
                  setSyncedLines([]);
                  setCurrentIdx(0);
                  setSrtOutput('');
                }}
                className="px-3 py-2 rounded-xl border border-olive/15 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                title="Làm lại từ đầu"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {srtOutput && (
        <div className="flex flex-col gap-3 bg-cream p-5 rounded-2xl border border-olive/15 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-olive" />
              <span className="text-xs font-bold text-stone-850">
                Kết quả phụ đề .SRT {provider ? `(${provider})` : ''} — có thể sửa trực tiếp trước khi tải
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg border border-olive/15 text-xs font-semibold text-stone-700 hover:text-olive cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Đã copy' : 'Copy'}
              </button>
              <button
                onClick={() => downloadTextFile(srtOutput, `${baseName}.srt`)}
                className="px-4 py-1.5 rounded-lg bg-olive text-cream text-xs font-bold hover:bg-olive-dark cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Tải file .SRT
              </button>
            </div>
          </div>
          <textarea
            rows={10}
            value={srtOutput}
            onChange={(e) => setSrtOutput(e.target.value)}
            className="w-full p-4 rounded-xl border border-olive/10 bg-sand/20 font-mono text-xs text-stone-800 focus:outline-none focus:border-olive leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TAB 4: YOUTUBE AUDIO INFO + CLIENT-SIDE VIDEO -> WAV/AUDIO
   ============================================================ */
export function YoutubeAndVideoAudioPanel() {
  const [ytUrl, setYtUrl] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  const [ytResult, setYtResult] = useState<{
    videoId: string;
    title: string;
    authorName: string;
    thumbnailUrl: string;
    directDownloadAvailable: boolean;
    downloadUrl?: string;
    note?: string;
  } | null>(null);

  // Local Video -> WAV extractor
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedUrl, setExtractedUrl] = useState('');
  const [extractError, setExtractError] = useState('');

  const handleCheckYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytUrl.trim()) return;
    setYtLoading(true);
    setYtError('');
    setYtResult(null);

    try {
      const res = await fetch('/api/tools/youtube-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: ytUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setYtError(data.error || 'Không thể kiểm tra link YouTube.');
      } else {
        setYtResult(data);
      }
    } catch {
      setYtError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setYtLoading(false);
    }
  };

  const handleExtractVideoAudio = async (file: File) => {
    setVideoFile(file);
    setExtracting(true);
    setExtractError('');
    if (extractedUrl) URL.revokeObjectURL(extractedUrl);
    setExtractedUrl('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      const wavBlob = encodeWavFromAudioBuffer(decoded);
      await ctx.close();
      setExtractedUrl(URL.createObjectURL(wavBlob));
    } catch {
      setExtractError('Không thể giải mã rãnh âm thanh từ tệp video này. Hãy thử định dạng MP4/WebM chuẩn có âm thanh.');
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Section 1: 100% Client-Side Video -> Audio Extractor */}
      <div className="p-6 rounded-2xl border border-olive/15 bg-cream/80 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-850 text-base">
              Tách âm thanh từ Video (MP4 / WebM / MOV → WAV)
            </h3>
            <p className="text-xs text-stone-500">
              Xử lý 100% ngay trên trình duyệt bằng Web Audio API — giữ nguyên chất lượng âm thanh gốc, không tải video lên máy chủ.
            </p>
          </div>
        </div>

        <label className="p-6 rounded-xl border border-dashed border-olive/25 bg-sand/20 flex flex-col items-center gap-2 cursor-pointer hover:border-olive/45 transition-all text-center">
          <Upload className="w-5 h-5 text-olive" />
          <span className="text-xs font-bold text-stone-700">
            {videoFile ? `Đã chọn: ${videoFile.name}` : 'Chọn tệp video MP4 / WebM / MOV để tách âm thanh'}
          </span>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleExtractVideoAudio(f);
            }}
            className="hidden"
          />
        </label>

        {extracting && (
          <div className="flex items-center gap-2 text-xs font-semibold text-olive">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang tách rãnh âm thanh trên trình duyệt...
          </div>
        )}

        {extractError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{extractError}</span>
          </div>
        )}

        {extractedUrl && videoFile && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-olive/5 border border-olive/15">
            <audio src={extractedUrl} controls className="w-full sm:flex-1" />
            <a
              href={extractedUrl}
              download={`${videoFile.name.replace(/\.[^/.]+$/, '')}.wav`}
              className="px-5 py-2.5 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark inline-flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Tải file âm thanh (.WAV)
            </a>
          </div>
        )}
      </div>

      {/* Section 2: YouTube HD Thumbnail & Metadata Finder */}
      <div className="p-6 rounded-2xl border border-olive/15 bg-cream/80 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-850 text-base">
              Lấy ảnh bìa HD &amp; Thông tin Video YouTube
            </h3>
            <p className="text-xs text-stone-500">
              Dán đường dẫn YouTube để lấy nhanh tiêu đề, tên kênh và ảnh bìa độ phân giải cao (Full HD / HQ).
            </p>
          </div>
        </div>

        <form onSubmit={handleCheckYoutube} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=..."
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-olive/15 bg-cream text-sm text-stone-800 focus:outline-none focus:border-olive"
          />
          <button
            type="submit"
            disabled={ytLoading}
            className="px-6 py-2.5 rounded-xl bg-olive text-cream text-sm font-bold hover:bg-olive-dark disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {ytLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            Lấy ảnh bìa
          </button>
        </form>

        {ytError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{ytError}</span>
          </div>
        )}

        {ytResult && (
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-olive/15 bg-sand/20 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ytResult.thumbnailUrl}
              alt={ytResult.title}
              className="w-full sm:w-44 aspect-video object-cover rounded-lg border border-olive/10 shrink-0"
            />
            <div className="flex flex-col gap-2 flex-1">
              <h4 className="font-serif font-bold text-stone-850 text-sm leading-snug">
                {ytResult.title}
              </h4>
              {ytResult.authorName && (
                <span className="text-xs text-stone-500">Kênh: {ytResult.authorName}</span>
              )}
              <div className="flex flex-wrap gap-2 mt-1">
                {ytResult.directDownloadAvailable && ytResult.downloadUrl ? (
                  <a
                    href={ytResult.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải MP3 ngay
                  </a>
                ) : null}
                <a
                  href={`https://i.ytimg.com/vi/${ytResult.videoId}/maxresdefault.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-olive text-cream text-xs font-bold hover:bg-olive-dark inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ảnh bìa Full HD (1280×720)
                </a>
                <a
                  href={`https://i.ytimg.com/vi/${ytResult.videoId}/hqdefault.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-olive/20 bg-cream text-xs font-semibold text-stone-700 hover:text-olive inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ảnh bìa chuẩn (HQ)
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TAB 5: DATA & TEXT CONVERTERS (CSV <-> JSON, MD -> HTML, SRT -> TXT)
   ============================================================ */
export function DataConvertPanel() {
  const [tool, setTool] = useState<'csv2json' | 'json2csv' | 'srt2txt' | 'md2html'>('csv2json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError('');
    try {
      if (tool === 'csv2json') {
        const lines = input.trim().split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) throw new Error('Cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu CSV.');
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const rows = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = vals[i] ?? '';
          });
          return obj;
        });
        setOutput(JSON.stringify(rows, null, 2));
      } else if (tool === 'json2csv') {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('Dữ liệu JSON phải là một mảng đối tượng (ví dụ: [{"ten": "An", "diem": 9}]).');
        }
        const headers = Array.from(new Set(parsed.flatMap((row) => Object.keys(row || {}))));
        const escapeCsv = (val: unknown) => {
          const s = val == null ? '' : String(val);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const csvLines = [
          headers.map(escapeCsv).join(','),
          ...parsed.map((row) => headers.map((h) => escapeCsv(row?.[h])).join(',')),
        ];
        setOutput(csvLines.join('\n'));
      } else if (tool === 'srt2txt') {
        const clean = input
          .split(/\r?\n/)
          .filter((line) => {
            const t = line.trim();
            if (!t) return false;
            if (/^\d+$/.test(t)) return false;
            if (/^\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(t)) return false;
            return true;
          })
          .join('\n');
        setOutput(clean);
      } else if (tool === 'md2html') {
        const html = input
          .replace(/^### (.*)$/gm, '<h3>$1</h3>')
          .replace(/^## (.*)$/gm, '<h2>$1</h2>')
          .replace(/^# (.*)$/gm, '<h1>$1</h1>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>')
          .replace(/\n{2,}/g, '</p>\n<p>')
          .replace(/^/, '<p>')
          .replace(/$/, '</p>');
        setOutput(html);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Định dạng đầu vào chưa đúng.');
    }
  };

  const extMap = {
    csv2json: 'data.json',
    json2csv: 'data.csv',
    srt2txt: 'lyrics.txt',
    md2html: 'document.html',
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'csv2json', label: 'CSV → JSON' },
          { id: 'json2csv', label: 'JSON → CSV' },
          { id: 'srt2txt', label: 'SRT → Lời thuần (.TXT)' },
          { id: 'md2html', label: 'Markdown → HTML' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTool(item.id as typeof tool);
              setOutput('');
              setError('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tool === item.id
                ? 'bg-olive text-cream shadow-xs'
                : 'bg-cream border border-olive/15 text-stone-600 hover:text-olive'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <FileCode2 className="w-3.5 h-3.5 text-olive" />
            Dữ liệu đầu vào
          </label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Dán nội dung cần chuyển đổi tại đây..."
            className="w-full p-4 rounded-2xl border border-olive/15 bg-cream font-mono text-xs text-stone-800 focus:outline-none focus:border-olive"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700">Kết quả chuyển đổi</label>
            {output && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-olive/15 text-[11px] font-semibold text-stone-600 hover:text-olive cursor-pointer"
                >
                  {copied ? 'Đã copy' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadTextFile(output, extMap[tool])}
                  className="px-3 py-1 rounded-lg bg-olive text-cream text-[11px] font-bold hover:bg-olive-dark cursor-pointer"
                >
                  Tải {extMap[tool]}
                </button>
              </div>
            )}
          </div>
          <textarea
            rows={10}
            readOnly
            value={output}
            placeholder="Kết quả sẽ hiển thị tại đây..."
            className="w-full p-4 rounded-2xl border border-olive/10 bg-sand/20 font-mono text-xs text-stone-800 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="px-6 py-2.5 rounded-xl bg-olive text-cream text-sm font-bold hover:bg-olive-dark disabled:opacity-50 cursor-pointer"
        >
          Chuyển đổi ngay
        </button>
      </div>
    </div>
  );
}
