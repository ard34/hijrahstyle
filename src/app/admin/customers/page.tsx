'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, Loader2, Search, UserCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count?: { orders: number };
}

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(() => {
        setCustomers([
          { id: '1', name: 'Siti Aminah', email: 'siti@gmail.com', phone: '081234567890', createdAt: new Date().toISOString(), _count: { orders: 3 } },
          { id: '2', name: 'Ahmad Fauzi', email: 'ahmad@gmail.com', phone: '089876543210', createdAt: new Date().toISOString(), _count: { orders: 1 } },
          { id: '3', name: 'Dewi Lestari', email: 'dewi@gmail.com', phone: '085712349876', createdAt: new Date().toISOString(), _count: { orders: 5 } },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Pelanggan</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Daftar pengguna terdaftar, riwayat keanggotaan, dan statistik total pesanan.</p>
        </div>
        <div className="px-4 py-2 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 flex items-center gap-2">
          <UserCheck className="w-4 h-4" /> {customers.length} Pelanggan Aktif
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Cari nama atau email pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
            className="w-full text-xs h-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-600 outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200/60">
                <th className="py-3.5 px-6">Pelanggan</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">No. HP / WA</th>
                <th className="py-3.5 px-6">Terdaftar</th>
                <th className="py-3.5 px-6">Total Pesanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-700 mx-auto" />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">Belum ada pelanggan ditemukan</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-extrabold text-xs shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{c.email}</td>
                    <td className="py-4 px-6 text-slate-600 font-mono">{c.phone || '-'}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{formatDate(c.createdAt)}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold border border-purple-200 text-[11px]">
                        {c._count?.orders || 0} Transaksi
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
