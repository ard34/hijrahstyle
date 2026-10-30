'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToastStore } from '@/lib/store';

const initialVouchers = [
  { id: '1', code: 'DISKON50K', type: 'Nominal', value: 'Rp 50.000', minSpend: 'Rp 300.000', expires: '1 Nov 2026', status: 'Aktif' },
  { id: '2', code: 'HEMAT10', type: 'Persentase', value: '10%', minSpend: 'Rp 100.000', expires: '31 Des 2026', status: 'Aktif' },
  { id: '3', code: 'WELCOME20', type: 'Persentase', value: '20%', minSpend: 'Rp 50.000', expires: '31 Des 2026', status: 'Aktif' },
  { id: '4', code: 'FREESHIP', type: 'Nominal', value: 'Rp 20.000', minSpend: 'Rp 200.000', expires: '31 Des 2026', status: 'Nonaktif' },
];

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const { addToast } = useToastStore();

  const handleDelete = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
    addToast('Voucher berhasil dihapus', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── Screen 17 Top Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Voucher Diskon</h1>
          <p className="text-xs text-slate-400 mt-0.5">Buat dan kelola kode promo.</p>
        </div>

        <button 
          onClick={() => addToast('Modal buat voucher aktif', 'info')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/35 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Buat Voucher
        </button>
      </div>

      {/* ─── Screen 17 Table ─── */}
      <div className="bg-[#0b1220] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                <th className="py-4 px-6">Kode</th>
                <th className="py-4 px-6">Tipe</th>
                <th className="py-4 px-6">Nilai</th>
                <th className="py-4 px-6">Min. Belanja</th>
                <th className="py-4 px-6">Masa Berlaku</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-[#0e172a] transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-white">
                    {v.code}
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {v.type}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-white">
                    {v.value}
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {v.minSpend}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {v.expires}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      v.status === 'Aktif' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => addToast(`Edit ${v.code}`, 'info')}
                        className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
