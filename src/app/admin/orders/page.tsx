'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Filter, Truck, CheckCircle2, 
  Clock, Package, AlertCircle, Edit2, Loader2, X, Eye
} from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  variantSnapshot: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  user: { name: string; email: string };
  items: OrderItem[];
  address?: { recipientName: string; phone: string; fullAddress: string; city: string };
  shipment?: { courier: string; trackingNumber?: string };
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit Resi modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [resi, setResi] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus || undefined,
          trackingNumber: resi || undefined,
        }),
      });
      if (res.ok) {
        setSelectedOrder(null);
        setResi('');
        setNewStatus('');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Dibayar</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Diproses</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Dikirim</span>;
      case 'COMPLETED':
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Selesai</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Screen 16 Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e172a] p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Daftar Pesanan</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Kelola dan lacak status pesanan.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3.5 h-10 bg-[#070b14] border border-slate-800 rounded-xl font-semibold text-slate-200 outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
            <option value="PAID">Dibayar</option>
            <option value="PROCESSING">Diproses</option>
            <option value="SHIPPED">Dikirim</option>
            <option value="COMPLETED">Selesai</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#0e172a] p-4 rounded-2xl border border-slate-800/80 shadow-md">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Cari berdasarkan No. Pesanan, nama atau email customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
            className="w-full text-xs h-10 pr-4 bg-[#070b14] border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-white placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Screen 16 Table */}
      <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1120] text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800/80">
                <th className="py-4 px-6">#Pesanan</th>
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Pelanggan</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#131f37] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-6 text-slate-400">{formatDate(order.createdAt)}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-white">{order.user?.name || 'Pelanggan'}</p>
                      <p className="text-[11px] text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6 font-black text-white">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setResi(order.shipment?.trackingNumber || '');
                        }}
                        className="px-3 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all ml-auto cursor-pointer"
                      >
                        Lihat / Kelola
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status & Resi Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                Update #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300">Ubah Status Pesanan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-800 bg-[#070b14] text-white rounded-xl mt-1.5 outline-none focus:border-blue-500"
                >
                  <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
                  <option value="PAID">Dibayar (Lunas)</option>
                  <option value="PROCESSING">Diproses Toko</option>
                  <option value="SHIPPED">Dikirim Kurir</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Nomor Resi Pengiriman</label>
                <input
                  type="text"
                  placeholder="Contoh: JNE829103847"
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-800 bg-[#070b14] text-white rounded-xl font-mono uppercase mt-1.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {updating ? 'Disimpan...' : 'Simpan Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
