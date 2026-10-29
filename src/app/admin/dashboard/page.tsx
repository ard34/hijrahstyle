'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle, 
  ArrowUpRight, DollarSign, Loader2, RefreshCw, Eye
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Memuat data ringkasan dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Ringkasan Performa</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Pantau indikator transaksi, pesanan, dan stok produk terkini toko Anda.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {formatRupiah(stats?.totalRevenue || 0)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-emerald-600 font-semibold gap-1 pt-1 border-t border-slate-100">
            <TrendingUp className="w-3.5 h-3.5" /> Terverifikasi dari transaksi lunas
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Pesanan</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {stats?.totalOrders || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="font-bold text-slate-900">{stats?.todayOrders || 0}</span> pesanan masuk hari ini
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Pelanggan</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {stats?.totalCustomers || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Pengguna terdaftar aktif
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Produk Aktif</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {stats?.totalProducts || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Dalam katalog produk
          </div>
        </div>

      </div>

      {/* Main Grid Row 1: Line Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Grafik Penjualan (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Grafik Penjualan</h2>
              <p className="text-xs text-slate-400">Trend omset toko (Dalam Rupiah)</p>
            </div>
            <select className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 outline-none">
              <option>Periode: Bulanan</option>
              <option>Periode: Mingguan</option>
              <option>Periode: Harian</option>
            </select>
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 w-full pt-4 relative flex flex-col justify-between">
            <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area Gradient */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,110 L 70,85 L 140,60 L 210,95 L 280,45 L 350,75 L 420,35 L 500,65 L 500,150 L 0,150 Z"
                fill="url(#blueGradient)"
              />

              {/* Line path */}
              <path
                d="M 0,110 L 70,85 L 140,60 L 210,95 L 280,45 L 350,75 L 420,35 L 500,65"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Points */}
              {[[0,110], [70,85], [140,60], [210,95], [280,45], [350,75], [420,35], [500,65]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
              <span>1 Mei</span>
              <span>8 Mei</span>
              <span>15 Mei</span>
              <span>22 Mei</span>
              <span>29 Mei</span>
            </div>
          </div>
        </div>

        {/* Pesanan Terbaru (Right 1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Pesanan Terbaru</h2>
              <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3 pt-3">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Belum ada pesanan terbaru.</p>
              ) : (
                recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {order.user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.user?.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">#{order.orderNumber}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">{formatRupiah(order.totalAmount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/admin/orders" className="block text-center w-full py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold rounded-xl transition-all shadow-xs mt-4">
            Kelola Semua Pesanan
          </Link>
        </div>

      </div>

      {/* Main Grid Row 2: Low Stock Warning & Payment Methods Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Low Stock Warning Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Produk Stok Tipis</h2>
              <p className="text-xs text-slate-400">Varian produk dengan stok &le; 5 unit</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {lowStock.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Semua stok varian dalam kondisi aman 👍</p>
            ) : (
              lowStock.slice(0, 3).map((variant) => (
                <div key={variant.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{variant.product.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Warna: {variant.color} | Ukuran: {variant.size}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold text-[11px] rounded-lg shrink-0 border border-rose-200">
                    Sisa {variant.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Methods Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Penjualan Berdasarkan Metode Pembayaran</h2>
            <p className="text-xs text-slate-400">Persentase kanal transaksi pilihan customer</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#5B21B6" strokeWidth="4" fill="none" />
                <path strokeDasharray="25, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#8B5CF6" strokeWidth="4" fill="none" />
                <path strokeDasharray="10, 100" strokeDashoffset="-85" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#C084FC" strokeWidth="4" fill="none" />
                <path strokeDasharray="5, 100" strokeDashoffset="-95" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#E9D5FF" strokeWidth="4" fill="none" />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-extrabold text-slate-900 block">100%</span>
                <span className="text-[10px] text-slate-400 font-semibold">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#5B21B6]" />
                <span className="text-slate-700">Transfer Bank</span>
                <span className="text-slate-900 font-bold ml-auto">60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span className="text-slate-700">E-Wallet</span>
                <span className="text-slate-900 font-bold ml-auto">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C084FC]" />
                <span className="text-slate-700">QRIS</span>
                <span className="text-slate-900 font-bold ml-auto">10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E9D5FF]" />
                <span className="text-slate-700">Kartu Kredit</span>
                <span className="text-slate-900 font-bold ml-auto">5%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

