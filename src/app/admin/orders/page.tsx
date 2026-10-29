'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, Truck, CheckCircle2, 
  Clock, Package, AlertCircle, Edit2, Loader2 
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
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Pesanan Customer</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Kelola status transaksi, update pembayaran, dan input nomor resi pengiriman kurir.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Cari berdasarkan Order ID, nama pelanggan, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
            className="w-full text-xs h-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-600 outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3.5 h-10 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 outline-none focus:border-purple-600"
        >
          <option value="ALL">Semua Status Pesanan</option>
          <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
          <option value="PAID">Sudah Bayar</option>
          <option value="PROCESSING">Diproses</option>
          <option value="SHIPPED">Dikirim</option>
          <option value="COMPLETED">Selesai</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-100">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Pelanggan</th>
                <th className="py-3 px-6">Tanggal</th>
                <th className="py-3 px-6">Total Biaya</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">No. Resi</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Tidak ada pesanan ditemukan
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-slate-900">{order.user.name}</p>
                      <p className="text-[11px] text-slate-400">{order.user.email}</p>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        order.status === 'PENDING_PAYMENT' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {order.shipment?.trackingNumber || '-'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setResi(order.shipment?.trackingNumber || '');
                        }}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Kelola Status
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">
              Update Order #{selectedOrder.orderNumber}
            </h3>

            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Ubah Status Pesanan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl mt-1"
                >
                  <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                  <option value="PAID">PAID (Pembayaran Berhasil)</option>
                  <option value="PROCESSING">PROCESSING (Diproses Toko)</option>
                  <option value="SHIPPED">SHIPPED (Dikirim Kurir)</option>
                  <option value="DELIVERED">DELIVERED (Sampai Tujuan)</option>
                  <option value="COMPLETED">COMPLETED (Selesai)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Nomor Resi Pengiriman</label>
                <input
                  type="text"
                  placeholder="Contoh: JNE123456789"
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono uppercase mt-1"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  {updating ? 'Disimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
