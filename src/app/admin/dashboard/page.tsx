'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, ShoppingBag, Users, Package, ChevronDown, RefreshCw, Loader2
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState('Bulan ini');
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalOmset: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStatsData({
            totalOmset: data.stats.totalRevenue || 0,
            totalOrders: data.stats.totalOrders || 0,
            totalProducts: data.stats.totalProducts || 0,
            totalCustomers: data.stats.totalCustomers || 0,
          });
        }
        if (data.recentOrders) {
          const mapped = data.recentOrders.map((o: any) => {
            let label = 'Menunggu Pembayaran';
            let color = 'bg-amber-500/20 text-amber-400 border border-amber-500/40';

            if (o.status === 'PAID') {
              label = 'Dibayar';
              color = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
            } else if (o.status === 'PROCESSING') {
              label = 'Diproses';
              color = 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40';
            } else if (o.status === 'SHIPPED') {
              label = 'Dikirim';
              color = 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
            } else if (o.status === 'DELIVERED' || o.status === 'COMPLETED') {
              label = 'Selesai';
              color = 'bg-purple-500/20 text-purple-400 border border-purple-500/40';
            } else if (o.status === 'CANCELLED') {
              label = 'Dibatalkan';
              color = 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
            }

            return {
              id: o.id,
              orderNumber: o.orderNumber,
              amount: o.totalAmount,
              status: label,
              color,
            };
          });
          setRecentOrders(mapped);
        }
      }
    } catch (err) {
      console.error('Fetch dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Omset Toko', value: formatRupiah(statsData.totalOmset), change: 'Transaksi Real-time', positive: true, icon: TrendingUp },
    { label: 'Total Pesanan Masuk', value: String(statsData.totalOrders), change: 'Pesanan Aktif', positive: true, icon: ShoppingBag },
    { label: 'Koleksi Produk', value: `${statsData.totalProducts} Produk`, change: 'Busana Siap Jual', positive: true, icon: Package },
    { label: 'Pelanggan Terdaftar', value: `${statsData.totalCustomers} Akun`, change: 'Member Butik', positive: true, icon: Users },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      
      {/* ─── Screen 14 Top Header: Dashboard & Period Dropdown ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard Butik HijrahStyle</h1>
          <p className="text-xs text-slate-400 mt-0.5">Ringkasan performa penjualan dan operasional butik Kota Serang.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-[#0b1220] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
        {statCards.map((s, idx) => (
          <div key={idx} className="bg-[#0b1220] rounded-3xl border border-slate-800/80 p-5 space-y-2 shadow-xl hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 block">{s.label}</span>
              <s.icon className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {loading ? '...' : s.value}
            </h3>
            <span className="text-[11px] font-bold text-emerald-400 block">
              ● {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Screen 14: Tren Penjualan & Pesanan Terbaru ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Tren Penjualan Chart (Span 7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1220] rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white">Tren Penjualan Butik</h2>
            <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Analitik Omset
            </span>
          </div>

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
              {['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pesanan Terbaru (Span 5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1220] rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white">Pesanan Terbaru</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Belum ada pesanan terbaru.</p>
            ) : (
              recentOrders.map((ord) => (
                <Link
                  key={ord.id}
                  href={`/orders/${ord.id}`}
                  className="p-3.5 rounded-2xl bg-[#070b14] border border-slate-800/80 hover:border-blue-500/40 flex items-center justify-between gap-3 transition-colors block"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-white block">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-xs font-black text-blue-400 block mt-0.5">
                      {formatRupiah(ord.amount)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${ord.color}`}>
                    {ord.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
