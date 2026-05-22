"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Languages, 
  Sparkles,
  Loader2
} from 'lucide-react';

interface AudioReaderProps {
  content: string; // Markdown text of the article
  title: string;   // Title of the article
}

export default function AudioReader({ content, title }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [speed, setSpeed] = useState<number>(1.0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [engine, setEngine] = useState<'google' | 'device'>('google');
  const [consecutiveErrors, setConsecutiveErrors] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(0);
  const consecutiveErrorsRef = useRef<number>(0);
  const engineRef = useRef<'google' | 'device'>('google');

  // Sync refs to avoid closures in event handlers
  useEffect(() => {
    sentencesRef.current = sentences;
  }, [sentences]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    consecutiveErrorsRef.current = consecutiveErrors;
  }, [consecutiveErrors]);

  useEffect(() => {
    engineRef.current = engine;
  }, [engine]);

  // Handle speed and mute modifications dynamically on active audio object
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      audioRef.current.muted = isMuted;
    }
  }, [speed, isMuted]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stripMarkdown = (md: string) => {
    return md
      .replace(/##+\s+/g, ' ') 
      .replace(/\*\*|__/g, '') 
      .replace(/\*|_/g, '') 
      .replace(/`[^`]+`/g, '') 
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') 
      .replace(/>\s+/g, ' ') 
      .replace(/-\s+/g, ' ') 
      .replace(/\n+/g, ' '); 
  };

  const splitIntoSentences = (text: string) => {
    const rawSentences = text.split(/(?<=[.?!])\s+/);
    const result: string[] = [];
    const MAX_LEN = 140;

    const splitByWords = (str: string): string[] => {
      const words = str.split(/\s+/);
      const subChunks: string[] = [];
      let current = "";
      
      for (const word of words) {
        if (!word) continue;
        if ((current + " " + word).trim().length > MAX_LEN) {
          if (current) subChunks.push(current.trim());
          current = word;
        } else {
          current = current ? current + " " + word : word;
        }
      }
      if (current) subChunks.push(current.trim());
      return subChunks;
    };

    const splitByPunctuation = (str: string): string[] => {
      const parts = str.split(/(?<=[,;:—])\s+/);
      const subChunks: string[] = [];
      let current = "";

      for (const part of parts) {
        if (!part) continue;
        if (part.length > MAX_LEN) {
          if (current) {
            subChunks.push(current.trim());
            current = "";
          }
          subChunks.push(...splitByWords(part));
        } else if ((current + " " + part).trim().length > MAX_LEN) {
          if (current) subChunks.push(current.trim());
          current = part;
        } else {
          current = current ? current + " " + part : part;
        }
      }
      if (current) subChunks.push(current.trim());
      return subChunks;
    };

    for (let sentence of rawSentences) {
      sentence = sentence.trim();
      if (!sentence) continue;
      
      if (sentence.length > MAX_LEN) {
        result.push(...splitByPunctuation(sentence));
      } else {
        result.push(sentence);
      }
    }
    return result;
  };

  // Helper to translate Vietnamese text to English client-side using public Google API
  const translateText = async (textList: string[]): Promise<string[]> => {
    setIsTranslating(true);
    const translated: string[] = [];
    
    try {
      // To prevent large request payloads and keep it fast, we can translate chunks of up to 4 sentences
      const chunkSize = 3;
      for (let i = 0; i < textList.length; i += chunkSize) {
        const chunk = textList.slice(i, i + chunkSize);
        const combined = chunk.join(' ||| ');
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(combined)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Translation request failed.');
        
        const json = await res.json();
        // The API returns translated sentences in the first nested array
        let chunkTranslation = json[0].map((item: any) => item[0]).join('');
        
        // Split back by our marker
        const splitTrans = chunkTranslation.split(/\s*\|\|\|\s*/);
        translated.push(...splitTrans.map((s: string) => s.trim()));
      }
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback: use original text if translation fails
      return textList;
    } finally {
      setIsTranslating(false);
    }
  };

  const prepareSentences = async (targetLang: 'vi' | 'en') => {
    const cleanText = stripMarkdown(content);
    const rawViSentences = splitIntoSentences(cleanText);

    if (targetLang === 'vi') {
      setSentences(rawViSentences);
      return rawViSentences;
    } else {
      // Translate sentences to English
      const enSentences = await translateText(rawViSentences);
      setSentences(enSentences);
      return enSentences;
    }
  };

  const playSentence = (index: number) => {
    const list = sentencesRef.current;
    if (index >= list.length) {
      stopAudio();
      return;
    }

    setCurrentIndex(index);
    const text = list[index];
    setCurrentText(text);

    // If using device-side speech synthesis
    if (engineRef.current === 'device') {
      playDevice(text, index);
      return;
    }

    // Google TTS Proxy mode
    const ttsUrl = `/api/tts?tl=${language}&q=${encodeURIComponent(text)}`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(ttsUrl);
    audioRef.current = audio;
    audio.playbackRate = speed;
    audio.muted = isMuted;

    audio.onended = () => {
      setConsecutiveErrors(0); // reset on successful playback
      playSentence(currentIndexRef.current + 1);
    };

    audio.onerror = (e) => {
      console.error('Audio play error, handling recovery...', e);
      handleAudioError();
    };

    audio.play().catch(err => {
      // AbortError is normal when we pause or skip rapidly
      if (err.name === 'AbortError') {
        console.warn('Playback aborted due to state transition');
        return;
      }
      console.error('Audio play trigger error:', err);
      handleAudioError();
    });
  };

  const playDevice = (text: string, index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      stopAudio();
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = speed;
    utterance.volume = isMuted ? 0 : 1;

    // Try to find matching voice for the target language
    const voices = synth.getVoices();
    const targetVoice = voices.find(v => 
      language === 'vi'
        ? (v.lang.toLowerCase().includes('vi'))
        : (v.lang.toLowerCase().includes('en'))
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onend = () => {
      // Check refs to avoid using outdated closures
      if (isPlaying && !isPaused && engineRef.current === 'device') {
        playSentence(currentIndexRef.current + 1);
      }
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      if (e.error !== 'interrupted' && isPlaying && !isPaused && engineRef.current === 'device') {
        playSentence(currentIndexRef.current + 1);
      }
    };

    synth.speak(utterance);
  };

  const handleAudioError = () => {
    const nextErrors = consecutiveErrorsRef.current + 1;
    setConsecutiveErrors(nextErrors);

    if (nextErrors >= 2) {
      console.warn('Multiple Google TTS errors, falling back to local SpeechSynthesis.');
      setEngine('device');
      setConsecutiveErrors(0);
      
      // Retry current sentence using local Device engine
      setTimeout(() => {
        playSentence(currentIndexRef.current);
      }, 100);
    } else {
      // Try next sentence with safe delay to avoid locking
      setTimeout(() => {
        playSentence(currentIndexRef.current + 1);
      }, 500);
    }
  };

  const startPlayback = async (targetLang: 'vi' | 'en') => {
    setIsPlaying(true);
    setIsPaused(false);
    
    let activeSentences = sentences;
    if (sentences.length === 0 || language !== targetLang) {
      activeSentences = await prepareSentences(targetLang);
    }
    
    const startIdx = language !== targetLang ? 0 : currentIndex;
    setLanguage(targetLang);
    
    setTimeout(() => {
      playSentence(startIdx);
    }, 100);
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      if (isPaused) {
        setIsPaused(false);
        if (engine === 'google') {
          audioRef.current?.play().catch(err => console.error(err));
        } else {
          playSentence(currentIndex);
        }
      } else {
        setIsPaused(true);
        if (engine === 'google') {
          audioRef.current?.pause();
        } else {
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        }
      }
    } else {
      await startPlayback(language);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setCurrentText('');
    setConsecutiveErrors(0);
  };

  const handleLanguageChange = async (newLang: 'vi' | 'en') => {
    if (newLang === language && isPlaying) return;
    
    stopAudio();
    setLanguage(newLang);
    await startPlayback(newLang);
  };

  const progressPercent = sentences.length > 0 
    ? Math.round(((currentIndex + 1) / sentences.length) * 100) 
    : 0;

  return (
    <div className="w-full bg-sand/20 border border-olive/15 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
      {/* Top player controller bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Title and Voice Info */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-olive/10 border border-olive/10 rounded-2xl text-olive shrink-0">
            <Volume2 className={`w-5 h-5 ${isPlaying && !isPaused ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">GIỌNG ĐỌC AI SONG NGỮ</span>
            <span className="font-serif font-bold text-olive text-sm truncate mt-1 leading-snug flex items-center gap-1.5">
              {isPlaying ? `Đang đọc: ${title}` : 'Nghe đọc bài viết cùng chị Google'}
              {engine === 'device' && (
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase rounded-md tracking-wider border border-amber-200" title="Giọng đọc cục bộ của thiết bị">
                  Thiết bị
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Buttons / Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          {/* Voice Engine settings dropdown */}
          <select
            value={engine}
            onChange={(e) => {
              const newEngine = e.target.value as 'google' | 'device';
              stopAudio();
              setEngine(newEngine);
            }}
            className="px-2.5 py-1.5 text-xs font-bold bg-white border border-olive/15 rounded-xl outline-none text-stone-700 cursor-pointer hover:bg-olive/5 transition-colors"
            title="Công nghệ giọng đọc"
          >
            <option value="google">Giọng Google (Mạng)</option>
            <option value="device">Giọng Thiết bị (Offline)</option>
          </select>

          {/* Language select toggles */}
          <div className="flex items-center border border-olive/15 rounded-xl bg-white p-0.5 shadow-xs">
            <button
              onClick={() => handleLanguageChange('vi')}
              disabled={isTranslating}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                language === 'vi' 
                  ? 'bg-olive text-white shadow-sm font-bold' 
                  : 'text-stone-600 hover:bg-olive/5'
              }`}
            >
              <span>Tiếng Việt</span>
              <span>🇻🇳</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              disabled={isTranslating}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                language === 'en' 
                  ? 'bg-olive text-white shadow-sm font-bold' 
                  : 'text-stone-600 hover:bg-olive/5'
              }`}
            >
              <span>English</span>
              <span>🇬🇧</span>
            </button>
          </div>

          {/* Speed settings dropdown */}
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="px-2.5 py-1.5 text-xs font-bold bg-white border border-olive/15 rounded-xl outline-none text-stone-700 cursor-pointer hover:bg-olive/5 transition-colors"
            title="Tốc độ đọc"
          >
            <option value="0.8">0.8x</option>
            <option value="1.0">1.0x</option>
            <option value="1.2">1.2x</option>
            <option value="1.5">1.5x</option>
          </select>

          {/* Mute button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 border border-olive/15 rounded-xl bg-white text-stone-600 hover:bg-olive/5 transition-colors cursor-pointer"
            title={isMuted ? 'Mở tiếng' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress & translation loading */}
      {isTranslating ? (
        <div className="py-4 border border-dashed border-olive/10 bg-white/50 rounded-2xl flex items-center justify-center gap-2">
          <Loader2 className="w-4.5 h-4.5 text-olive animate-spin" />
          <span className="text-xs font-semibold text-stone-500 animate-pulse">AI đang dịch bài viết sang Tiếng Anh...</span>
        </div>
      ) : (
        isPlaying && (
          <div className="flex flex-col gap-2 bg-white/80 border border-olive/10 rounded-2xl p-4 shadow-2xs">
            {/* Visualizer and Subtitle container */}
            <div className="flex items-start gap-4">
              {/* Waveform graphic animation */}
              <div className="flex items-end gap-0.5 h-6 pt-2 shrink-0">
                <span className={`w-0.75 bg-olive rounded-full transition-all duration-150 ${isPlaying && !isPaused ? 'h-3 animate-sound-wave-1' : 'h-1'}`} />
                <span className={`w-0.75 bg-olive rounded-full transition-all duration-150 ${isPlaying && !isPaused ? 'h-5 animate-sound-wave-2' : 'h-1'}`} />
                <span className={`w-0.75 bg-olive rounded-full transition-all duration-150 ${isPlaying && !isPaused ? 'h-2 animate-sound-wave-3' : 'h-1'}`} />
                <span className={`w-0.75 bg-olive rounded-full transition-all duration-150 ${isPlaying && !isPaused ? 'h-4.5 animate-sound-wave-4' : 'h-1'}`} />
                <span className={`w-0.75 bg-olive rounded-full transition-all duration-150 ${isPlaying && !isPaused ? 'h-1.5 animate-sound-wave-5' : 'h-1'}`} />
              </div>

              {/* Subtitle text */}
              <p className="text-xs md:text-sm font-semibold text-stone-700 italic leading-relaxed flex-1">
                "{currentText}"
              </p>
            </div>

            {/* Slider bar */}
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-bold text-stone-400 font-mono">
                {currentIndex + 1}/{sentences.length}
              </span>
              <div className="flex-1 h-1.5 bg-sand rounded-full overflow-hidden">
                <div 
                  className="h-full bg-olive rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-stone-400 font-mono">
                {progressPercent}%
              </span>
            </div>
          </div>
        )
      )}

      {/* Primary Trigger Buttons (Play, Pause, Stop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          disabled={isTranslating}
          className="flex-1 py-3 bg-olive hover:bg-olive-dark text-white rounded-2xl font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-4.5 h-4.5" />
              <span>Tạm dừng đọc</span>
            </>
          ) : (
            <>
              <Play className="w-4.5 h-4.5 fill-current" />
              <span>{isPlaying ? 'Tiếp tục nghe' : 'Nghe đọc bài viết'}</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={stopAudio}
            className="px-5 py-3 bg-white border border-olive/15 text-stone-600 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Dừng phát"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Dừng</span>
          </button>
        )}
      </div>
    </div>
  );
}
