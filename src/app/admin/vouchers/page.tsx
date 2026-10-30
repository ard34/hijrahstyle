'use client';

import { useState } from 'react';
import { Ticket, Plus, Tag, CheckCircle2, XCircle, Edit, Trash2, X } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState([
    { id: '1', code: 'DISKON50K', type: 'Nominal', value: 'Rp 50.000', minPurchase: 300000, expires: '1 Nov 2026', status: 'Aktif' },
    { id: '2', code: 'HEMAT10', type: 'Persentase', value: '10%', minPurchase: 150000, expires: '31 Des 2026', status: 'Aktif' },
    { id: '3', code: 'WELCOME20', type: 'Persentase', value: '20%', minPurchase: 100000, expires: '31 Des 2026', status: 'Aktif' },
    { id: '4', code: 'FREESHIP', type: 'Nominal', value: 'Rp 20.000', minPurchase: 200000, expires: '15 Nov 2026', status: 'Nonaktif' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'Nominal',
    value: '',
    minPurchase: '',
    expires: '',
  });

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVouchers([
      ...vouchers,
      {
        id: String(Date.now()),
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.type === 'Persentase' ? `${formData.value}%` : `Rp ${Number(formData.value).toLocaleString('id-ID')}`,
        minPurchase: Number(formData.minPurchase),
        expires: formData.expires || '31 Des 2026',
        status: 'Aktif',
      }
    ]);
    setShowModal(false);
    setFormData({ code: '', type: 'Nominal', value: '', minPurchase: '', expires: '' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Screen 17 Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e172a] p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Voucher Diskon</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Buat dan kelola kode promo.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Buat Voucher
        </button>
      </div>

      {/* Screen 17 Table */}
      <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1120] text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800/80">
                <th className="py-4 px-6">Kode</th>
                <th className="py-4 px-6">Tipe</th>
                <th className="py-4 px-6">Nominal</th>
                <th className="py-4 px-6">Min. Belanja</th>
                <th className="py-4 px-6">Masa Berlaku</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-[#131f37] transition-colors">
                  <td className="py-4 px-6 font-mono font-black text-blue-400 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{v.code}</span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-300">{v.type}</td>
                  <td className="py-4 px-6 font-black text-white">{v.value}</td>
                  <td className="py-4 px-6 text-slate-400">{formatRupiah(v.minPurchase)}</td>
                  <td className="py-4 px-6 text-slate-400">{v.expires}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      v.status === 'Aktif' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => alert(`Edit voucher ${v.code}`)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setVouchers(vouchers.filter(item => item.id !== v.id))}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
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

      {/* Create Voucher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Buat Voucher Promo Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4 pt-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Kode Promo</label>
                <input
                  type="text"
                  placeholder="Contoh: FLASH50"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-800 bg-[#070b14] text-white rounded-xl font-mono uppercase mt-1 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Tipe Potongan</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-800 bg-[#070b14] text-white rounded-xl mt-1 outline-none focus:border-blue-500"
                  >
                    <option value="Nominal">Nominal (Rp)</option>
                    <option value="Persentase">Persentase (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Nilai</label>
                  <input
                    type="number"
                    placeholder="Contoh: 50000 / 10"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-800 bg-[#070b14] text-white rounded-xl mt-1 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Minimal Belanja (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 200000"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-800 bg-[#070b14] text-white rounded-xl mt-1 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
