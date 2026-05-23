'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSlideshowProps {
  slides: { id: string; imageUrl: string; order: number }[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px]">
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-olive/15 shadow-xl bg-sand flex items-center justify-center text-stone-400">
          Chưa có hình ảnh
        </div>
      </div>
    );
  }

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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                priority={index === 0}
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
          ))}
        </div>

        {/* Carousel indicators */}
        {slides.length > 1 && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-cream/85 backdrop-blur-xs px-3 py-1 rounded-full border border-olive/10 shadow-sm">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? 'bg-olive w-3.5' : 'bg-olive/30 hover:bg-olive/50'
                }`}
                aria-label={`Chuyển tới slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
