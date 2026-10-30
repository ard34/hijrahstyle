'use client';

import { useState } from 'react';
import { BarChart, DollarSign, TrendingUp, Download, ShoppingBag, ArrowUpRight, Users, Package } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('Bulan Ini');

  const barData = [
    { day: '1 Okt', height: 45, amount: 'Rp 650.000' },
    { day: '3 Okt', height: 60, amount: 'Rp 820.000' },
    { day: '6 Okt', height: 35, amount: 'Rp 450.000' },
    { day: '9 Okt', height: 75, amount: 'Rp 980.000' },
    { day: '12 Okt', height: 50, amount: 'Rp 710.000' },
    { day: '15 Okt', height: 95, amount: 'Rp 1.250.000', highlighted: true },
    { day: '18 Okt', height: 65, amount: 'Rp 890.000' },
    { day: '21 Okt', height: 40, amount: 'Rp 560.000' },
    { day: '24 Okt', height: 80, amount: 'Rp 1.050.000' },
    { day: '27 Okt', height: 70, amount: 'Rp 920.000' },
    { day: '30 Okt', height: 85, amount: 'Rp 1.120.000' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Screen 18 Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e172a] p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Laporan Penjualan</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Analisis performa toko Anda.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 outline-none focus:border-blue-500"
          >
            <option>Bulan Ini</option>
            <option>Bulan Lalu</option>
            <option>Kuartal Ini</option>
            <option>Tahun 2026</option>
          </select>

          <button 
            onClick={() => alert('Laporan penjualan Oktober 2026 berhasil diunduh.')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV / PDF
          </button>
        </div>
      </div>

      {/* Screen 18: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Omset</p>
          <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">{formatRupiah(12450000)}</h3>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs bulan lalu
          </p>
        </div>

        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pesanan</p>
          <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">248</h3>
          <p className="text-xs text-blue-400 font-bold flex items-center gap-1 mt-2">
            Rata-rata Rp 50.200 / trx
          </p>
        </div>

        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produk Terjual</p>
          <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">530</h3>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> +42 unit produk
          </p>
        </div>

        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pelanggan Baru</p>
          <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">132</h3>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> Konversi checkout 88%
          </p>
        </div>
      </div>

      {/* Screen 18: Bar Chart - Grafik Omset */}
      <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-md p-6 space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Grafik Omset</h2>
            <p className="text-xs text-slate-400">Distribusi omset harian bulan ini</p>
          </div>
          <span className="text-xs font-bold text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
            Kanal Duitku Gateway
          </span>
        </div>

        {/* Vertical Bar Chart */}
        <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-10 pb-4 px-2 border-b border-slate-800 relative">
          {barData.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on Highlight or Hover */}
              {bar.highlighted ? (
                <div className="absolute -top-10 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-blue-600/40 whitespace-nowrap z-10 animate-bounce">
                  {bar.amount} (15 Okt)
                </div>
              ) : (
                <div className="absolute -top-8 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {bar.amount}
                </div>
              )}

              {/* Bar pillar */}
              <div 
                style={{ height: `${bar.height}%` }}
                className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                  bar.highlighted
                    ? 'bg-gradient-to-t from-blue-700 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                    : 'bg-blue-600/30 group-hover:bg-blue-500/60'
                }`}
              />

              {/* X Axis Label */}
              <span className="text-[10px] text-slate-400 font-medium mt-3 block whitespace-nowrap">
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
