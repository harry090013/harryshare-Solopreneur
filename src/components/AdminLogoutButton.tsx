'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-xs font-semibold cursor-pointer w-full text-left"
    >
      <LogOut className="w-4 h-4" />
      <span>Đăng xuất</span>
    </button>
  );
}
