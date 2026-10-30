'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, ShoppingBag, Users, Package, ChevronDown
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState('Bulan ini');

  const stats = [
    { label: 'Total Omset', value: 'Rp 12.450.000', change: '+12% dari bulan lalu', positive: true },
    { label: 'Pesanan', value: '248', change: '+8% dari bulan lalu', positive: true },
    { label: 'Produk', value: '56', change: '+12% terpilih', positive: true },
    { label: 'Pelanggan', value: '132', change: '+10% dari target', positive: true },
  ];

  const recentOrders = [
    { id: '1', orderNumber: 'INV/202610290001', amount: 815000, status: 'Dibayar', color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' },
    { id: '2', orderNumber: 'INV/202610250012', amount: 299000, status: 'Diproses', color: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' },
    { id: '3', orderNumber: 'INV/202610200008', amount: 439000, status: 'Dikirim', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/40' },
  ];

  // SVG Chart points for "Tren Penjualan" (Screen 14)
  const chartPoints = [
    { month: 'Jan', y: 70 },
    { month: 'Feb', y: 60 },
    { month: 'Mar', y: 40 },
    { month: 'Apr', y: 50 },
    { month: 'Mei', y: 45 },
    { month: 'Jun', y: 35 },
    { month: 'Jul', y: 20 },
    { month: 'Agu', y: 25 },
    { month: 'Sep', y: 10 },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── Screen 14 Top Header: Dashboard & Period Dropdown ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Selamat datang, Admin!</p>
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

      {/* ─── Screen 14: 4 Stat Cards Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-[#0b1220] rounded-2xl border border-slate-800/80 p-5 space-y-2 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 block">{s.label}</span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{s.value}</h3>
            <span className="text-[11px] font-bold text-emerald-400 block">
              {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Screen 14: Tren Penjualan & Pesanan Terbaru ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Tren Penjualan Chart (Span 7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1220] rounded-2xl border border-slate-800/80 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-extrabold text-white">Tren Penjualan</h2>

          {/* Smooth Blue SVG Line Chart */}
          <div className="pt-4 h-60 w-full relative flex flex-col justify-end">
            <svg className="w-full h-44 overflow-visible" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10,95 Q 60,85 100,75 T 160,65 T 220,55 T 280,35 T 340,30 T 390,10 L 390,120 L 10,120 Z"
                fill="url(#blueGlow)"
              />
              <path
                d="M 10,95 Q 60,85 100,75 T 160,65 T 220,55 T 280,35 T 340,30 T 390,10"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Glowing Dots */}
              {[
                { cx: 10, cy: 95 },
                { cx: 70, cy: 82 },
                { cx: 130, cy: 70 },
                { cx: 190, cy: 60 },
                { cx: 250, cy: 45 },
                { cx: 310, cy: 32 },
                { cx: 390, cy: 10 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#38bdf8" stroke="#070b14" strokeWidth="2" />
              ))}
            </svg>

            {/* Months Label */}
            <div className="flex justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-800">
              {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pesanan Terbaru (Span 5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1220] rounded-2xl border border-slate-800/80 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-extrabold text-white">Pesanan Terbaru</h2>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-mono font-bold text-xs text-white block">
                    #{ord.orderNumber}
                  </span>
                  <span className="text-xs font-extrabold text-white block mt-0.5">
                    {formatRupiah(ord.amount)}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ord.color}`}>
                  {ord.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 block text-center"
            >
              Lihat Semua Pesanan &rarr;
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
