'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface HeroSlideshowProps {
  slides: { id: string; imageUrl: string; order: number }[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    // Preload current slide and next slide
    setLoadedSlides((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      if (slides.length > 1) {
        next.add((currentIndex + 1) % slides.length);
      }
      return next;
    });
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isHovered || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isHovered, isPaused]);

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px]">
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-olive/15 shadow-xl bg-sand flex items-center justify-center text-stone-400">
          Chưa có hình ảnh
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((c) => (c - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((c) => (c + 1) % slides.length);
  };

  return (
    <div 
      className="flex justify-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px]">
        {/* Visual Accent Shapes */}
        <div className="absolute inset-2 border-2 border-dashed border-olive/30 rounded-2xl rotate-3 transition-transform duration-500 hover:rotate-0" />
        <div className="absolute inset-0 bg-olive/5 rounded-2xl -rotate-3 transition-transform duration-500 hover:rotate-0" />
        
        {/* Main Portrait Frame */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-olive/15 shadow-xl bg-sand">
          {slides.map((slide, index) => (
            loadedSlides.has(index) && (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image 
                  src={slide.imageUrl} 
                  alt={`Harry Hero Slide ${index + 1}`} 
                  fill 
                  sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, 380px"
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                />
              </div>
            )
          ))}
        </div>

        {/* Prev / Next Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Slide trước"
              className="absolute -left-3.5 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-cream/90 hover:bg-cream border border-olive/15 text-stone-700 hover:text-olive shadow-md focus-visible:ring-2 focus-visible:ring-olive transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Slide sau"
              className="absolute -right-3.5 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-cream/90 hover:bg-cream border border-olive/15 text-stone-700 hover:text-olive shadow-md focus-visible:ring-2 focus-visible:ring-olive transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Carousel indicators & Pause/Play Control */}
        {slides.length > 1 && (
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-cream/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-olive/15 shadow-sm">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Tiếp tục tự chạy slide' : 'Tạm dừng tự chạy slide'}
              aria-pressed={isPaused}
              className="p-0.5 rounded-full text-stone-600 hover:text-olive focus-visible:ring-1 focus-visible:ring-olive transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3" aria-hidden="true" /> : <Pause className="w-3 h-3" aria-hidden="true" />}
            </button>

            <div className="h-3 w-px bg-olive/15" />

            <div className="flex gap-1.5 items-center">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? 'bg-olive w-4' : 'bg-olive/30 hover:bg-olive/50 w-1.5'
                  }`}
                  aria-label={`Chuyển tới slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

