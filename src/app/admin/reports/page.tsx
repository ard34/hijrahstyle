'use client';

import { useState } from 'react';

const stats = [
  { label: 'Total Omset', value: 'Rp 12.450.000' },
  { label: 'Pesanan Berhasil', value: '248' },
  { label: 'Produk Terjual', value: '520' },
  { label: 'Pelanggan Baru', value: '132' },
];

const monthsData = [
  { month: 'Jan', height: 20 },
  { month: 'Feb', height: 35 },
  { month: 'Mar', height: 50 },
  { month: 'Apr', height: 55 },
  { month: 'Mei', height: 75 },
  { month: 'Jun', height: 95 },
  { month: 'Jul', height: 60, tooltip: 'Rp 1.250.000' },
  { month: 'Agu', height: 62 },
  { month: 'Sep', height: 80 },
  { month: 'Okt', height: 52 },
  { month: 'Nov', height: 54 },
  { month: 'Des', height: 90 },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('Bulan ini');

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── Screen 18 Top Header: Laporan Penjualan & Dropdown ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Laporan Penjualan</h1>
          <p className="text-xs text-slate-400 mt-0.5">Analisis performa toko Anda.</p>
        </div>

        <div>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-[#0b1220] border border-slate-800 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 cursor-pointer"
          >
            <option>Bulan ini</option>
            <option>Bulan lalu</option>
            <option>Tahun ini</option>
          </select>
        </div>
      </div>

      {/* ─── Screen 18: 4 Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-[#0b1220] rounded-2xl border border-slate-800/80 p-5 space-y-2 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 block">{s.label}</span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* ─── Screen 18: Grafik Omset Bar Chart ─── */}
      <div className="bg-[#0b1220] rounded-2xl border border-slate-800/80 p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-extrabold text-white">Grafik Omset</h2>

        {/* Bar chart container */}
        <div className="pt-8 h-64 flex items-end justify-between gap-2 sm:gap-4 relative px-2 sm:px-6">
          {monthsData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group">
              {/* Tooltip on Highlighted Bar */}
              {item.tooltip && (
                <div className="absolute -top-10 z-20 px-3 py-1.5 rounded-lg bg-[#070b14] border border-blue-500/40 text-[10px] font-bold text-white shadow-xl whitespace-nowrap">
                  <span>Omset</span>
                  <span className="block font-black text-blue-400">{item.tooltip}</span>
                </div>
              )}

              {/* Bar */}
              <div 
                className="w-full max-w-[32px] bg-blue-600 group-hover:bg-cyan-400 rounded-t-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                style={{ height: `${item.height}%` }}
              />

              {/* Month label */}
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-white transition-colors">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
