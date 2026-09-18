'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, BookOpen, User, FolderGit2, Mail, Compass, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  if (pathname?.startsWith('/quan-tri-harry')) {
    return null;
  }

  // Optimized passive scroll listener with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable link in menu
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Trang chủ', path: '/', icon: Compass },
    { name: 'Chia sẻ', path: '/chia-se', icon: BookOpen },
    { name: 'Dự án & Tài nguyên', path: '/du-an-tai-nguyen', icon: FolderGit2 },
    { name: 'Sản phẩm', path: '/san-pham', icon: ShoppingBag },
    { name: 'Về Harry', path: '/ve-harry', icon: User },
    { name: 'Liên hệ', path: '/lien-he', icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-cream/85 backdrop-blur-md shadow-sm border-b border-olive/5 py-3' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-olive/10 group-hover:border-olive/30 transition-all duration-300">
              <Image 
                src="/logo.webp" 
                alt="HarryShare Logo" 
                fill 
                sizes="32px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-olive tracking-wide group-hover:text-olive-dark transition-colors">
                HarryShare
              </span>
              <span className="text-[11px] font-semibold text-stone-500 tracking-wider uppercase leading-none">
                Product & solopreneur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Menu chính">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                    active 
                      ? 'text-olive font-semibold active-nav-indicator' 
                      : 'text-stone-600 hover:text-olive'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Mobile Button) */}
          <div className="flex items-center gap-3">
            <button
              ref={toggleRef}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full border border-olive/10 bg-cream/70 backdrop-blur-md text-stone-700 hover:text-olive hover:border-olive/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-olive"
              aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className={`fixed inset-0 top-[60px] z-30 w-full glass transition-all duration-300 md:hidden flex flex-col justify-between ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <p className="text-[13px] font-bold text-stone-500 uppercase tracking-widest px-3">Menu</p>
          <nav className="flex flex-col gap-1" aria-label="Menu di động">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleCloseMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                    active 
                      ? 'bg-olive/5 text-olive font-semibold' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-olive'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-olive/5 bg-sand/30 flex flex-col items-center text-center gap-2">
          <p className="font-serif text-sm font-bold text-olive">HarryShare.vn</p>
          <p className="text-xs text-stone-500">Chia sẻ tư duy làm sản phẩm & thương hiệu cá nhân.</p>
        </div>
      </div>
    </header>
  );
}

