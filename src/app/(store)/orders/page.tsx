'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Dibayar' | 'Dikirim' | 'Selesai' | 'Menunggu Pembayaran';
  statusRaw: string;
  amount: number;
  productCount: number;
  imageUrl: string;
}

const mockOrders: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: 'INV/202610290001',
    date: '28 Okt 2026',
    status: 'Dibayar',
    statusRaw: 'PAID',
    amount: 815000,
    productCount: 3,
    imageUrl: '/products/hoodie-bbn.jpg',
  },
  {
    id: 'ord-2',
    orderNumber: 'INV/202610250012',
    date: '25 Okt 2026',
    status: 'Dikirim',
    statusRaw: 'SHIPPED',
    amount: 299000,
    productCount: 1,
    imageUrl: '/products/sneakers-vortex.png',
  },
  {
    id: 'ord-3',
    orderNumber: 'INV/202610200008',
    date: '20 Okt 2026',
    status: 'Selesai',
    statusRaw: 'COMPLETED',
    amount: 439000,
    productCount: 2,
    imageUrl: '/products/tas-sling.jpg',
  },
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Semua');
  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);
  const [loading, setLoading] = useState(false);

  const tabs = ['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Diproses') return o.status === 'Dibayar' || o.statusRaw === 'PROCESSING';
    return o.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dibayar':
      case 'Selesai':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'Dikirim':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
      case 'Menunggu Pembayaran':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)] space-y-8">
      
      {/* ─── Screen 07 Header: Riwayat Pesanan ─── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Riwayat Pesanan
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Lihat dan lacak status pesanan Anda.
        </p>
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
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-[#0b1220] rounded-2xl border border-slate-800 p-8 space-y-2">
            <p className="text-slate-400 text-sm">Belum ada pesanan pada status ini.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-blue-500/40 transition-colors"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#f1f5f9] dark:bg-[#1a2333] p-1.5 border border-slate-800 shrink-0 flex items-center justify-center">
                  <img src={ord.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
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

              {/* Right CTA Button: Lihat Detail (Screen 07) */}
              <Link
                href={`/orders/${ord.id}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0e172a] hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 text-blue-400 hover:text-white text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
              >
                Lihat Detail
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
