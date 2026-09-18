'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Instantiate audio object on mount with preload none
    const audio = new Audio('/amthanhsaotruc2.MP3');
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'none';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  if (pathname?.startsWith('/quan-tri-harry')) {
    return null;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio play blocked:', err);
      });
    }
  };

  return (
    <button 
      type="button"
      onClick={togglePlay}
      aria-label={isPlaying ? 'Tạm dừng nhạc sáo trúc' : 'Phát nhạc sáo trúc thư giãn'}
      aria-pressed={isPlaying}
      title={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền sáo trúc thư giãn'}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3 py-2 rounded-full bg-cream/90 hover:bg-cream backdrop-blur-md border border-olive/15 shadow-lg text-olive transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-olive text-cream shadow-xs">
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
        )}
      </div>
      
      <div className="flex flex-col text-left select-none pr-1">
        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none">Relax Sound</span>
        <span className="text-xs font-serif text-olive font-semibold leading-tight">
          {isPlaying ? 'Đang phát' : 'Sáo trúc'}
        </span>
      </div>

      {/* Equalizer animation when playing */}
      <div className="flex items-end gap-0.5 h-3 w-4 px-0.5" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span 
            key={bar} 
            className="w-0.5 bg-olive/80 rounded-full transition-all duration-300"
            style={{
              height: isPlaying ? `${30 + bar * 25}%` : '20%',
              animation: isPlaying ? `bounce-bar 1.2s ease-in-out infinite alternate` : 'none',
              animationDelay: `${bar * 0.15}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes bounce-bar {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </button>
  );
}

