'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Menu, X } from 'lucide-react';
import AdminNav from './AdminNav';
import AdminLogoutButton from './AdminLogoutButton';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sticky Top Header */}
      <header className="md:hidden w-full bg-sand/80 backdrop-blur-md border-b border-olive/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-olive/10 bg-white">
            <Image src="/logo.png" alt="HarryShare Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col animate-fade-in">
            <span className="font-serif font-bold text-olive leading-tight text-sm">HarryShare</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">Admin Panel</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl border border-olive/10 bg-cream/50 text-olive hover:bg-olive/5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* Sidebar Panel Container */}
      <aside 
        className={`
          w-full md:w-64 bg-sand/60 border-r border-olive/10 flex flex-col p-6 gap-8 shrink-0
          ${isOpen 
            ? 'flex absolute top-[68px] left-0 right-0 z-40 bg-sand/95 border-b border-olive/15 shadow-md p-6 max-h-[calc(100vh-68px)] overflow-y-auto animate-slide-down' 
            : 'hidden'
          } 
          md:flex md:static md:h-screen md:sticky md:top-0 md:bg-sand/60 md:border-b-0 md:shadow-none md:p-6 md:animate-none
        `}
      >
        {/* Desktop Logo (hidden on mobile header layout) */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-olive/10 bg-white">
            <Image src="/logo.png" alt="HarryShare Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-olive">HarryShare</span>
            <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest leading-none">Admin Panel</span>
          </div>
        </div>

        {/* Navigation - clicking links collapses mobile drawer */}
        <div className="flex-1 flex flex-col" onClick={() => setIsOpen(false)}>
          <AdminNav />
        </div>

        {/* Footer actions */}
        <div className="border-t border-olive/5 pt-4 flex flex-col gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-500 hover:text-olive transition-colors text-xs font-semibold cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Compass className="w-4 h-4" />
            Xem trang chủ
          </Link>
          
          <div onClick={() => setIsOpen(false)}>
            <AdminLogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
