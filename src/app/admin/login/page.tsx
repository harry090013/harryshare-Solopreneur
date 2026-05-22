'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to dashboard
        router.push('/admin');
        router.refresh();
      } else {
        const errMsg = data.detail ? `${data.error} (${data.detail})` : (data.error || 'Đăng nhập không thành công.');
        setError(errMsg);
        setLoading(false);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-olive/10 bg-cream/70 backdrop-blur-md shadow-lg flex flex-col gap-6 animate-slide-up">
        {/* Title */}
        <div className="flex flex-col gap-1.5 text-center">
          <span className="text-xs font-bold text-olive uppercase tracking-widest bg-olive/5 px-3 py-1.5 rounded-full w-fit mx-auto">
            🔐 Admin Portal
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-stone-850">
            Quản trị HarryShare
          </h1>
          <p className="text-xs text-stone-500 font-sans">
            Đăng nhập để quản lý bài viết, xem liên hệ và newsletter.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tên đăng nhập</label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="harry"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400 font-medium"
              />
              <User className="absolute left-3.5 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-olive/10 bg-cream focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 transition-all placeholder:text-stone-400 font-medium"
              />
              <Lock className="absolute left-3.5 w-4 h-4 text-stone-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-150 p-3 rounded-xl animate-fade-in font-medium mt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-olive text-cream font-bold hover:bg-olive-dark shadow-md transition-all cursor-pointer active:scale-95 text-sm mt-3"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <Link href="/" className="text-xs font-semibold text-stone-400 hover:text-olive transition-colors text-center cursor-pointer mt-1">
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
