'use client';

import React, { useState } from 'react';
import { Send, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Subscriber {
  id: string;
  email: string;
  createdAt: Date | string;
}

export default function SubscribersClient({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa email này khỏi danh sách nhận tin?')) return;

    try {
      const res = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers = ['Email', 'Ngay Dang Ky'];
      const rows = subscribers.map(s => [
        s.email,
        new Date(s.createdAt).toISOString()
      ]);

      const csvContent = 
        'data:text/csv;charset=utf-8,' + 
        [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `subscribers_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CSV export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* CSV Export Button */}
      {subscribers.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-olive/10 hover:border-olive/30 text-olive text-xs font-semibold bg-cream/70 hover:bg-cream transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Đang xuất...' : 'Xuất danh sách CSV'}
          </button>
        </div>
      )}

      {subscribers.length === 0 ? (
        <div className="py-20 border border-dashed border-olive/10 rounded-2xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
          <Send className="w-8 h-8 text-stone-400" />
          <p className="text-sm font-semibold">Danh sách trống.</p>
          <p className="text-xs text-stone-400">Chưa có độc giả nào đăng ký nhận tin tức qua email.</p>
        </div>
      ) : (
        <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand/40 border-b border-olive/5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Địa chỉ Email</th>
                <th className="p-4">Ngày đăng ký</th>
                <th className="p-4 pr-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/5">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="text-xs text-stone-700 hover:bg-cream/40 transition-colors">
                  <td className="p-4 pl-6 font-semibold">{sub.email}</td>
                  <td className="p-4 font-sans text-stone-500">
                    {new Date(sub.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer inline-flex items-center"
                      title="Xóa khỏi danh sách"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
