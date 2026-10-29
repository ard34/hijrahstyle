'use client';

import { BarChart, DollarSign, TrendingUp, Download, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Laporan &amp; Analitik Penjualan</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Ringkasan performa omset bulanan, volume transaksi, dan tren produk terlaris.</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Unduh Laporan PDF
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Omset Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{formatRupiah(12450000)}</h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18% dibandingkan bulan lalu
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pesanan Sukses</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">48 Transaksi</h3>
          <p className="text-xs text-blue-700 font-semibold">Rata-rata transaksi: {formatRupiah(259375)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produk Terlaris</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 truncate">Produk Terfavorit</h3>
          <p className="text-xs text-slate-500 font-medium">Terjual <strong className="text-blue-700">34 unit</strong> dalam 30 hari terakhir</p>
        </div>
      </div>
    </div>
  );
}
