'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit, Eye, Loader2, CheckCircle2, Truck, RefreshCw, X } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

interface AdminOrder {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  total: number;
  status: string;
  statusRaw: string;
  trackingNumber?: string;
  color: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToastStore();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          const mapped: AdminOrder[] = data.orders.map((o: any) => {
            let label = 'Menunggu Pembayaran';
            let color = 'bg-amber-500/20 text-amber-400 border border-amber-500/40';

            if (o.status === 'PAID') {
              label = 'Dibayar';
              color = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
            } else if (o.status === 'PROCESSING') {
              label = 'Diproses';
              color = 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40';
            } else if (o.status === 'SHIPPED') {
              label = 'Dikirim';
              color = 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
            } else if (o.status === 'DELIVERED' || o.status === 'COMPLETED') {
              label = 'Selesai';
              color = 'bg-purple-500/20 text-purple-400 border border-purple-500/40';
            } else if (o.status === 'CANCELLED') {
              label = 'Dibatalkan';
              color = 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
            }

            const dateStr = new Date(o.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return {
              id: o.id,
              orderNumber: o.orderNumber,
              date: dateStr,
              customer: o.user?.name || o.address?.recipientName || 'Pelanggan Butik',
              total: o.totalAmount,
              status: label,
              statusRaw: o.status,
              trackingNumber: o.shipment?.trackingNumber,
              color,
            };
          });
          setOrders(mapped);
        }
      }
    } catch (err) {
      console.error('Fetch admin orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (ord: AdminOrder) => {
    setSelectedOrder(ord);
    setNewStatus(ord.statusRaw);
    setTrackingNumber(ord.trackingNumber || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus,
          trackingNumber: newStatus === 'SHIPPED' ? trackingNumber : undefined,
        }),
      });

      if (res.ok) {
        addToast(`Status pesanan #${selectedOrder.orderNumber} berhasil diperbarui!`, 'success');
        setSelectedOrder(null);
        await fetchOrders();
      } else {
        addToast('Gagal memperbarui status pesanan', 'error');
      }
    } catch {
      addToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua Status' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      
      {/* ─── Screen 16 Top Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Daftar Pesanan Toko</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola dan update status pengiriman pesanan butik pelanggan.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* ─── Filter Controls ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nomor pesanan atau nama pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
            className="w-full h-11 rounded-xl bg-[#0b1220] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#0b1220] border border-slate-800 rounded-xl text-xs font-semibold text-white outline-none focus:border-blue-500 cursor-pointer"
        >
          <option>Semua Status</option>
          <option>Menunggu Pembayaran</option>
          <option>Dibayar</option>
          <option>Diproses</option>
          <option>Dikirim</option>
          <option>Selesai</option>
          <option>Dibatalkan</option>
        </select>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Memuat data pesanan database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Tidak ada pesanan yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 bg-[#070b14]/50">
                  <th className="py-4 px-6">#Pesanan</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6">Pelanggan</th>
                  <th className="py-4 px-6">Total Tagihan</th>
                  <th className="py-4 px-6">Status Terkini</th>
                  <th className="py-4 px-6 text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#0e172a] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {ord.date}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {ord.customer}
                    </td>
                    <td className="py-4 px-6 font-black text-blue-400">
                      {formatRupiah(ord.total)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${ord.color}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenStatusModal(ord)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          title="Ubah Status Pesanan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Ubah Status</span>
                        </button>
                        <Link
                          href={`/orders/${ord.id}`}
                          className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors inline-flex items-center"
                          title="Lihat Halaman Pesanan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modal Update Status Pesanan ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b1220] text-white rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white">Update Status Pesanan</h3>
                <p className="text-xs text-slate-400 font-mono">#{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Pilih Status Baru
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-semibold text-white outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
                  <option value="PAID">Dibayar (Lunas)</option>
                  <option value="PROCESSING">Diproses Butik (Packing)</option>
                  <option value="SHIPPED">Dikirim (Dalam Ekspedisi)</option>
                  <option value="DELIVERED">Selesai (Diterima)</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
              </div>

              {newStatus === 'SHIPPED' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Nomor Resi Pengiriman (SiCepat / JNE / J&amp;T)</span>
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Contoh: SCP88291039847"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
