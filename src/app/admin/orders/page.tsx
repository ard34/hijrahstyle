'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Edit, Eye } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

const initialOrders = [
  {
    id: 'ord-1',
    orderNumber: 'INV/202610290001',
    date: '28 Okt 2026',
    customer: 'Riski Ardiansyah',
    total: 815000,
    status: 'Dibayar',
    color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  },
  {
    id: 'ord-2',
    orderNumber: 'INV/202610250012',
    date: '25 Okt 2026',
    customer: 'Ahmad Fauzi',
    total: 299000,
    status: 'Diproses',
    color: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
  },
  {
    id: 'ord-3',
    orderNumber: 'INV/202610200008',
    date: '20 Okt 2026',
    customer: 'Siti Aisyah',
    total: 439000,
    status: 'Dikirim',
    color: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
  },
  {
    id: 'ord-4',
    orderNumber: 'INV/202610150005',
    date: '15 Okt 2026',
    customer: 'Budi Santoso',
    total: 199000,
    status: 'Selesai',
    color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  },
];

export default function AdminOrdersPage() {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const { addToast } = useToastStore();

  const filteredOrders = orders.filter((o) => {
    const matchSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua Status' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── Screen 16 Top Header ─── */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Daftar Pesanan</h1>
        <p className="text-xs text-slate-400 mt-0.5">Kelola dan update status pesanan.</p>
      </div>

      {/* ─── Screen 16 Filter Controls: Search Bar & Dropdown Status ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
            className="w-full h-10 rounded-xl bg-[#0b1220] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-[#0b1220] border border-slate-800 rounded-xl text-xs font-semibold text-white outline-none focus:border-blue-500 cursor-pointer"
        >
          <option>Semua Status</option>
          <option>Dibayar</option>
          <option>Diproses</option>
          <option>Dikirim</option>
          <option>Selesai</option>
        </select>
      </div>

      {/* ─── Screen 16 Table ─── */}
      <div className="bg-[#0b1220] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                <th className="py-4 px-6">#Pesanan</th>
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Pelanggan</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
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
                  <td className="py-4 px-6 font-extrabold text-white">
                    {formatRupiah(ord.total)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ord.color}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => addToast(`Update status #${ord.orderNumber}`, 'info')}
                        className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
                        title="Update Status"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/orders/${ord.id}`}
                        className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer inline-flex items-center"
                        title="Detail"
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
      </div>

    </div>
  );
}
