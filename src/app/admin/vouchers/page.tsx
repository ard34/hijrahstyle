'use client';

import { useState } from 'react';
import { Ticket, Plus, Tag, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminVouchersPage() {
  const [vouchers] = useState([
    { id: '1', code: 'HIJRAH10', type: 'PERCENTAGE', value: 10, minPurchase: 100000, usageCount: 42, status: 'ACTIVE' },
    { id: '2', code: 'FREEONGKIR', type: 'FIXED', value: 15000, minPurchase: 150000, usageCount: 89, status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Voucher Promo</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Kelola kode diskon, persentase potongan harga, dan batas minimal belanja.</p>
        </div>
        <button className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Buat Voucher Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200/60">
                <th className="py-3.5 px-6">Kode Voucher</th>
                <th className="py-3.5 px-6">Jenis Diskon</th>
                <th className="py-3.5 px-6">Nilai Potongan</th>
                <th className="py-3.5 px-6">Min. Belanja</th>
                <th className="py-3.5 px-6">Total Penggunaan</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-700">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-extrabold text-purple-700 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{v.code}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{v.type === 'PERCENTAGE' ? 'Persentase (%)' : 'Potongan Tetap (Rp)'}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {v.type === 'PERCENTAGE' ? `${v.value}%` : formatRupiah(v.value)}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{formatRupiah(v.minPurchase)}</td>
                  <td className="py-4 px-6 text-slate-800 font-bold">{v.usageCount} kali digunakan</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                    </span>
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
