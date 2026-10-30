'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/store/ProductCard';

const promoProducts = [
  {
    id: 'p-1',
    name: 'Hoodie BBN',
    slug: 'hoodie-bbn-premium',
    price: 200000,
    compareAtPrice: 299000,
    images: [{ imageUrl: '/products/hoodie-bbn.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ stock: 30 }],
  },
  {
    id: 'p-2',
    name: 'Sneakers Vortex',
    slug: 'sneakers-vortex',
    price: 590000,
    compareAtPrice: 699000,
    images: [{ imageUrl: '/products/sneakers-vortex.png' }],
    category: { name: 'Sepatu', slug: 'sepatu' },
    variants: [{ stock: 25 }],
  },
  {
    id: 'p-3',
    name: 'Tas Sling BBN',
    slug: 'tas-sling-bbn',
    price: 150000,
    compareAtPrice: 199000,
    images: [{ imageUrl: '/products/tas-sling.jpg' }],
    category: { name: 'Tas', slug: 'tas' },
    variants: [{ stock: 40 }],
  },
];

export default function PromoPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 32,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-140px)]">
      
      {/* ─── Screen 11 Top Header: Promo Spesial & Countdown ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Promo Spesial
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dapatkan penawaran terbaik hari ini!
          </p>
        </div>

        {/* Countdown Timer (Screen 11: 02 Hari : 15 Jam : 32 Menit : 18 Detik) */}
        <div className="space-y-1 text-right sm:text-right">
          <span className="text-[11px] font-bold text-slate-400 block">Berakhir dalam</span>
          <div className="flex items-center gap-1.5 font-mono">
            <div className="px-2 py-1 rounded-lg bg-[#0b1220] border border-blue-500/40 text-center">
              <span className="text-sm font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[8px] block text-slate-400 font-sans">Hari</span>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div className="px-2 py-1 rounded-lg bg-[#0b1220] border border-blue-500/40 text-center">
              <span className="text-sm font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[8px] block text-slate-400 font-sans">Jam</span>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div className="px-2 py-1 rounded-lg bg-[#0b1220] border border-blue-500/40 text-center">
              <span className="text-sm font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[8px] block text-slate-400 font-sans">Menit</span>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div className="px-2 py-1 rounded-lg bg-[#0b1220] border border-blue-500/40 text-center">
              <span className="text-sm font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[8px] block text-slate-400 font-sans">Detik</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Screen 11 Neon Bordered Banner: FLASH SALE Hingga 70% ─── */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-rose-500 via-blue-500 to-cyan-400 shadow-[0_0_35px_rgba(37,99,235,0.3)]">
        <div className="rounded-[22px] bg-[#070b14] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
          
          <div className="space-y-2 z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              FLASH SALE
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-lg text-slate-400">Hingga</span>
              <span className="text-4xl sm:text-6xl font-black text-white">70%</span>
            </div>
          </div>

          <div className="relative w-64 h-48 flex items-center justify-center">
            <div className="w-48 h-48 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
            <img
              src="/hero-sneaker.png"
              alt=""
              className="relative w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,102,255,0.8)] rotate-[-10deg]"
            />
          </div>

        </div>
      </div>

      {/* ─── Screen 11 Discounted Products Grid ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {promoProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
}
