'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  statusRaw: string;
  amount: number;
  productCount: number;
  imageUrl: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Semua');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            const mapped: OrderItem[] = data.orders.map((o: any) => {
              let displayStatus = 'Menunggu Pembayaran';
              if (o.status === 'PAID') displayStatus = 'Dibayar';
              else if (o.status === 'PROCESSING') displayStatus = 'Diproses';
              else if (o.status === 'SHIPPED') displayStatus = 'Dikirim';
              else if (o.status === 'DELIVERED' || o.status === 'COMPLETED') displayStatus = 'Selesai';
              else if (o.status === 'CANCELLED') displayStatus = 'Dibatalkan';

              const firstItem = o.items?.[0];
              const imageUrl = firstItem?.productVariant?.product?.images?.[0]?.imageUrl || '/products/kaos-forge.jpg';

              const dateStr = new Date(o.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return {
                id: o.id,
                orderNumber: o.orderNumber,
                date: dateStr,
                status: displayStatus,
                statusRaw: o.status,
                amount: o.totalAmount,
                productCount: o.items?.length || 1,
                imageUrl,
              };
            });
            setOrders(mapped);
          }
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Diproses') return o.status === 'Dibayar' || o.status === 'Diproses' || o.statusRaw === 'PROCESSING';
    return o.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dibayar':
      case 'Selesai':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'Diproses':
        return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40';
      case 'Dikirim':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
      case 'Menunggu Pembayaran':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      case 'Dibatalkan':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 min-h-[calc(100vh-140px)] space-y-8 animate-fade-in-up">
      
      {/* ─── Screen 07 Header: Riwayat Pesanan ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Riwayat Pesanan
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lihat dan lacak status pesanan butik HijrahStyle Anda secara real-time.
          </p>
        </div>
        <Link
          href="/products"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 text-xs font-bold transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Belanja Lagi</span>
        </Link>
      </div>

      {/* ─── Screen 07 Filter Tabs ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0b1220] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ─── Screen 07 Orders List Cards ─── */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">Memuat riwayat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-[#0b1220] rounded-3xl border border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Tidak ada pesanan ditemukan</h3>
              <p className="text-xs text-slate-400">Belum ada transaksi pada status {activeTab}.</p>
            </div>
            <Link
              href="/products"
              prefetch={true}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <span>Mulai Belanja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-blue-500/40 transition-colors"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#10192e] p-1.5 border border-slate-800 shrink-0 flex items-center justify-center">
                  <img src={ord.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-white text-sm">
                      #{ord.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(ord.status)}`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{ord.date}</p>
                  <p className="text-xs font-bold text-white pt-0.5">
                    {formatRupiah(ord.amount)} <span className="text-slate-500 font-normal">• {ord.productCount} produk</span>
                  </p>
                </div>
              </div>

              {/* Right CTA Button: Lihat Detail */}
              <Link
                href={`/orders/${ord.id}`}
                prefetch={true}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0e172a] hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 text-blue-400 hover:text-white text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
              >
                Lihat Detail Pesanan
              </Link>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
