'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle, 
  ArrowUpRight, DollarSign, Loader2, RefreshCw, Eye, ArrowDownRight
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

interface LowStock {
  id: string;
  color: string;
  size: string;
  stock: number;
  product: {
    name: string;
  };
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStock[]>([]);
  const [period, setPeriod] = useState('Bulan Ini');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setLowStock(data.lowStockVariants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  // Fallbacks or real values
  const totalOmset = stats?.totalRevenue && stats.totalRevenue > 0 ? stats.totalRevenue : 12450000;
  const totalOrders = stats?.totalOrders && stats.totalOrders > 0 ? stats.totalOrders : 248;
  const totalProductsSold = 56;
  const totalCustomers = stats?.totalCustomers && stats.totalCustomers > 0 ? stats.totalCustomers : 132;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Screen 14 Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e172a] p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Selamat datang, Admin!</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 outline-none focus:border-blue-500"
          >
            <option>Bulan Ini</option>
            <option>Minggu Ini</option>
            <option>Hari Ini</option>
            <option>Tahun Ini</option>
          </select>

          <button
            onClick={fetchDashboardData}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Screen 14: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Omset */}
        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Omset</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                {formatRupiah(totalOmset)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-emerald-400 font-bold gap-1 pt-2 border-t border-slate-800/60">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% dari bln lalu
          </div>
        </div>

        {/* Pesanan */}
        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pesanan</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                {totalOrders}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-emerald-400 font-bold gap-1 pt-2 border-t border-slate-800/60">
            <ArrowUpRight className="w-3.5 h-3.5" /> +8 pesanan baru
          </div>
        </div>

        {/* Produk Terjual */}
        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produk Terjual</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                {totalProductsSold}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-emerald-400 font-bold gap-1 pt-2 border-t border-slate-800/60">
            <ArrowUpRight className="w-3.5 h-3.5" /> +5 produk terlaris
          </div>
        </div>

        {/* Pelanggan Baru */}
        <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800/80 shadow-md hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pelanggan Baru</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                {totalCustomers}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-emerald-400 font-bold gap-1 pt-2 border-t border-slate-800/60">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14 user mendaftar
          </div>
        </div>

      </div>

      {/* Screen 14 Main Row: Tren Penjualan & Pesanan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tren Penjualan (Left 2 cols) */}
        <div className="lg:col-span-2 bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-md p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-black text-white tracking-tight">Tren Penjualan</h2>
              <p className="text-xs text-slate-400">Grafik omset harian dalam siklus periode ini</p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
              Oktober 2026
            </span>
          </div>

          {/* SVG Line & Area Chart */}
          <div className="h-56 w-full pt-4 relative flex flex-col justify-between">
            <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="cyberBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area */}
              <path
                d="M 0,110 L 70,85 L 140,60 L 210,95 L 280,45 L 350,75 L 420,35 L 500,65 L 500,150 L 0,150 Z"
                fill="url(#cyberBlueGrad)"
              />

              {/* Line path */}
              <path
                d="M 0,110 L 70,85 L 140,60 L 210,95 L 280,45 L 350,75 L 420,35 L 500,65"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {[[0,110], [70,85], [140,60], [210,95], [280,45], [350,75], [420,35], [500,65]].map(([x, y], i) => (
                <circle 
                  key={i} 
                  cx={x} 
                  cy={y} 
                  r="5" 
                  fill="#3b82f6" 
                  stroke="#0e172a" 
                  strokeWidth="2.5" 
                  className="filter drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]"
                />
              ))}
            </svg>

            {/* X Axis */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-800/80">
              <span>1 Okt</span>
              <span>8 Okt</span>
              <span>15 Okt</span>
              <span>22 Okt</span>
              <span>29 Okt</span>
            </div>
          </div>
        </div>

        {/* Pesanan Terbaru (Right 1 col) */}
        <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-md p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight">Pesanan Terbaru</h2>
              <Link href="/admin/orders" className="text-xs font-bold text-blue-400 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3 pt-3">
              {[
                { no: '#INV/202610290001', name: 'Riski Ardiansyah', total: 815000, status: 'Dibayar', color: 'emerald' },
                { no: '#INV/202610280012', name: 'Ahmad Fauzi', total: 398000, status: 'Menunggu', color: 'amber' },
                { no: '#INV/202610280008', name: 'Siti Aisyah', total: 898000, status: 'Selesai', color: 'blue' },
              ].map((order, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-[#070b14] border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs font-bold text-white">{order.no}</p>
                    <p className="text-[11px] text-slate-400">{order.name}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="font-extrabold text-white text-xs">{formatRupiah(order.total)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/admin/orders" 
            className="block text-center w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 mt-4 cursor-pointer"
          >
            Buka Manajemen Pesanan
          </Link>
        </div>

      </div>

      {/* Row 2: Low Stock Warning & Payment Methods Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Warning */}
        <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-md p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">Produk Stok Tipis</h2>
              <p className="text-xs text-slate-400">Varian produk yang butuh restok segera</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Sneakers Vortex BBN Edition', variant: 'Hitam | 42', stock: 4 },
              { name: 'Hoodie BBN Premium', variant: 'Hitam | L', stock: 3 },
              { name: 'Tas Sling BBN', variant: 'Hitam | All Size', stock: 5 },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-[#070b14] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.variant}</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[11px] rounded-lg">
                  Sisa {item.stock} unit
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-md p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800/80">
            <h2 className="text-base font-black text-white tracking-tight">Metode Pembayaran Terfavorit</h2>
            <p className="text-xs text-slate-400">Persentase kanal transaksi via Sandbox Duitku</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#2563eb" strokeWidth="4.5" fill="none" />
                <path strokeDasharray="25, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#3b82f6" strokeWidth="4.5" fill="none" />
                <path strokeDasharray="15, 100" strokeDashoffset="-85" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#60a5fa" strokeWidth="4.5" fill="none" />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-black text-white block">100%</span>
                <span className="text-[10px] text-slate-400 font-semibold">Total</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-semibold w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-slate-300">BCA Virtual Account</span>
                <span className="text-white font-bold ml-auto">60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-300">QRIS Instan</span>
                <span className="text-white font-bold ml-auto">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-slate-300">Mandiri / BNI / BRI VA</span>
                <span className="text-white font-bold ml-auto">15%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
