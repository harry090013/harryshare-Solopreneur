'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Search, Trash2, Check, FileText, X, AlertCircle, RefreshCw, 
  ShoppingCart, Clock, CheckCircle2, XCircle, Mail, Phone, User, Calendar
} from 'lucide-react';

interface Product {
  title: string;
  slug: string;
  price: number | null;
  image: string;
  type: string;
}

interface Order {
  id: string;
  productId: string;
  product: Product;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note: string | null;
  status: string; // "pending", "completed", "cancelled"
  createdAt: string;
}

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    return { total, pending, completed, cancelled };
  }, [orders]);

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể cập nhật trạng thái đơn hàng.');
      }

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setSuccess('Cập nhật trạng thái đơn hàng thành công!');
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete order
  const handleDelete = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn đặt hàng này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        setSuccess('Đã xóa đơn đặt hàng thành công!');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Có lỗi xảy ra khi xóa đơn hàng.');
      }
    } catch (err) {
      console.error('Delete order error:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        o.customerName.toLowerCase().includes(query) || 
        o.customerEmail.toLowerCase().includes(query) || 
        o.customerPhone.toLowerCase().includes(query) || 
        o.product.title.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const formatPrice = (p: number | null) => {
    if (p === null) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-850">
          Quản lý Đơn đặt hàng
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Xem thông tin liên hệ và xử lý yêu cầu đặt mua sản phẩm chính chủ của bạn.
        </p>
      </div>

      {/* METRICS CARD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-olive/10 bg-cream/70 backdrop-blur-md flex flex-col gap-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tổng số đơn</span>
          <span className="font-serif text-2xl font-bold text-stone-850 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-stone-500" /> {metrics.total}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Chờ xử lý</span>
          <span className="font-serif text-2xl font-bold text-amber-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" /> {metrics.pending}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Đã hoàn thành</span>
          <span className="font-serif text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {metrics.completed}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Đã hủy</span>
          <span className="font-serif text-2xl font-bold text-red-800 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-650" /> {metrics.cancelled}
          </span>
        </div>
      </div>

      {/* ERROR / SUCCESS TOASTS */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 animate-slide-up text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 animate-slide-up text-sm font-medium">
          <Check className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, email, sđt hoặc sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status selection */}
        <div className="w-full md:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* LAYOUT GRID: Table on left, Detail panel on right (if selected) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Orders Table */}
        <div className={`${selectedOrder ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-4 transition-all duration-300`}>
          {filteredOrders.length === 0 ? (
            <div className="py-20 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold">Không tìm thấy đơn đặt hàng nào.</p>
              <p className="text-xs text-stone-450">Khi khách hàng gửi form trên trang chi tiết sản phẩm chính, đơn hàng sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <div className="border border-olive/10 rounded-2xl bg-cream/70 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-olive/10 bg-sand/30 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">Khách hàng</th>
                      <th className="py-4 px-4">Sản phẩm yêu cầu</th>
                      <th className="py-4 px-4">Ngày gửi</th>
                      <th className="py-4 px-4">Trạng thái</th>
                      <th className="py-4 px-5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/5 text-stone-700 text-xs font-medium">
                    {filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-cream/40 transition-colors cursor-pointer ${
                          selectedOrder?.id === order.id ? 'bg-olive/5' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        {/* Customer detail */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-stone-850 text-sm">{order.customerName}</span>
                            <span className="text-stone-550 text-[11px] font-mono">{order.customerPhone}</span>
                          </div>
                        </td>

                        {/* Product requested */}
                        <td className="py-4 px-4 max-w-xs truncate">
                          <span className="text-stone-850 font-serif font-bold">{order.product?.title || 'Sản phẩm đã bị xóa'}</span>
                        </td>

                        {/* Form submit date */}
                        <td className="py-4 px-4 text-stone-450 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold border cursor-pointer outline-none ${
                              order.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : order.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="completed">Đã duyệt / Xong</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>

                        {/* Trash actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/20 transition-all cursor-pointer"
                            title="Xóa đơn hàng này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Order Detail Sidebar Panel */}
        {selectedOrder && (
          <div className="lg:col-span-4 border border-olive/15 rounded-2xl bg-cream/80 backdrop-blur-md p-5 flex flex-col gap-5 animate-slide-up sticky top-6">
            <div className="flex justify-between items-center border-b border-olive/15 pb-3">
              <h3 className="font-serif font-black text-stone-850 text-base flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-olive" /> Chi tiết đặt hàng
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 bg-sand/30 hover:bg-sand/65 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product details */}
            <div className="bg-sand/30 border border-olive/5 rounded-xl p-3 flex gap-3.5 items-center">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-olive/5 bg-white">
                <Image 
                  src={selectedOrder.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'} 
                  alt={selectedOrder.product?.title || 'Product'} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Sản phẩm</span>
                <a 
                  href={`/san-pham/${selectedOrder.product?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif font-bold text-stone-850 text-sm hover:text-olive transition-colors truncate block"
                >
                  {selectedOrder.product?.title || 'Sản phẩm đã bị xóa'}
                </a>
                <span className="text-olive font-bold text-xs">{formatPrice(selectedOrder.product?.price)}</span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="flex flex-col gap-3 text-xs text-stone-750">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Thông tin khách hàng</span>
              
              <div className="flex gap-2.5 items-center bg-cream/40 p-2.5 rounded-lg border border-olive/5">
                <User className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-stone-450 uppercase font-semibold leading-none">Họ tên</p>
                  <p className="font-bold text-stone-850 mt-0.5">{selectedOrder.customerName}</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-center bg-cream/40 p-2.5 rounded-lg border border-olive/5">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-stone-450 uppercase font-semibold leading-none">Số điện thoại</p>
                  <p className="font-mono font-bold text-stone-850 mt-0.5">{selectedOrder.customerPhone}</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-center bg-cream/40 p-2.5 rounded-lg border border-olive/5">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-stone-450 uppercase font-semibold leading-none">Email liên hệ</p>
                  <p className="font-mono font-bold text-stone-850 mt-0.5 break-all">{selectedOrder.customerEmail}</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-center bg-cream/40 p-2.5 rounded-lg border border-olive/5">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-stone-450 uppercase font-semibold leading-none">Thời gian đặt</p>
                  <p className="font-bold text-stone-850 mt-0.5">
                    {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Note */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ghi chú của khách hàng</span>
              <div className="bg-sand/20 border border-olive/5 p-3 rounded-lg text-stone-650 font-serif italic whitespace-pre-wrap leading-relaxed">
                {selectedOrder.note || 'Không có ghi chú.'}
              </div>
            </div>

            {/* Update Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-olive/15 mt-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Cập nhật nhanh trạng thái</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                  disabled={updatingId === selectedOrder.id || selectedOrder.status === 'completed'}
                  className="py-2 px-3 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 disabled:opacity-50 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Hoàn thành
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  disabled={updatingId === selectedOrder.id || selectedOrder.status === 'cancelled'}
                  className="py-2 px-3 rounded-xl border border-red-200 bg-red-50 text-red-800 hover:bg-red-100/70 disabled:opacity-50 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Hủy yêu cầu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
