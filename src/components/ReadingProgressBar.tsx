'use client';

import React, { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-olive/10 z-50 pointer-events-none">
      <div 
        className="h-full bg-olive rounded-r-full shadow-[0_0_8px_rgba(20,83,45,0.4)] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
