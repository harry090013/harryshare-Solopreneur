'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, BookOpen, User, FolderGit2, Mail, Compass, ShoppingBag } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-olive/10 group-hover:border-olive/30 transition-all duration-300">
              <Image 
                src="/logo.png" 
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
              <span className="text-[9px] font-semibold text-stone-500 tracking-wider uppercase leading-none">
                Product & solopreneur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
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

          {/* Right Controls (Music + Mobile Button) */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <MusicPlayer />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full border border-olive/10 bg-cream/70 backdrop-blur-md text-stone-700 hover:text-olive hover:border-olive/30 transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed inset-0 top-[60px] z-30 w-full glass transition-all duration-300 md:hidden flex flex-col justify-between ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="sm:hidden mb-4">
            <MusicPlayer />
          </div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest px-3">Menu</p>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                    active 
                      ? 'bg-olive/5 text-olive font-semibold' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-olive'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-olive/5 bg-sand/30 flex flex-col items-center text-center gap-2">
          <p className="font-serif text-sm font-bold text-olive">HarryShare.vn</p>
          <p className="text-xs text-stone-500">Chia sẻ tư duy làm sản phẩm & thương hiệu cá nhân.</p>
        </div>
      </div>
    </header>
  );
}
