'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Instantiate audio object on mount
    audioRef.current = new Audio('/amthanhsaotruc.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play blocked:', err);
      });
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-olive/10 bg-cream/70 backdrop-blur-md transition-all hover:border-olive/30 shadow-sm">
      <button 
        onClick={togglePlay}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-olive text-cream hover:bg-olive-dark transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
        title={isPlaying ? "Tạm dừng nhạc sáo trúc" : "Phát nhạc sáo trúc thư giãn"}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
      </button>
      
      <div className="flex flex-col select-none">
        <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest leading-none">Relaxing Sound</span>
        <span className="text-xs font-serif text-olive font-medium leading-tight">Sáo Trúc Nền</span>
      </div>

      {/* Mini Equalizer animation */}
      <div className="flex items-end gap-0.5 h-3 w-6 px-1">
        {[1, 2, 3, 4].map((bar) => (
          <span 
            key={bar} 
            className="w-0.5 bg-olive/70 rounded-full transition-all duration-300"
            style={{
              height: isPlaying ? '100%' : '20%',
              animation: isPlaying ? `bounce-bar 1.2s ease-in-out infinite alternate` : 'none',
              animationDelay: `${bar * 0.15}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes bounce-bar {
          0% { height: 15%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
