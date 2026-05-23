import React from 'react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return <div className="min-h-screen bg-cream flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Responsive Header & Sidebar */}
      <AdminSidebar />

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto bg-dot-pattern bg-[size:20px_20px]">
        {children}
      </main>
    </div>
  );
}

