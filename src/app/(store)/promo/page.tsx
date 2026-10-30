'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, Sparkles } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

const promoProducts = [
  {
    id: 'p-1',
    name: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    price: 200000,
    compareAtPrice: 299000,
    images: [{ imageUrl: '/products/hoodie-bbn.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ stock: 30 }],
  },
  {
    id: 'p-2',
    name: 'Sneakers Vortex Edition',
    slug: 'sneakers-vortex',
    price: 590000,
    compareAtPrice: 699000,
    images: [{ imageUrl: '/products/sneakers-vortex.png' }],
    category: { name: 'Sepatu', slug: 'sepatu' },
    variants: [{ stock: 25 }],
  },
  {
    id: 'p-3',
    name: 'Tas Sling BBN Utility',
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 min-h-[calc(100vh-140px)] animate-fade-in-up">
      
      {/* ─── Header: Promo Spesial & Animated Countdown ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/90">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>FLASH PROMO TOKO RESMI</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Promo <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">Spesial Hari Ini</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Dapatkan penawaran busana muslimah terbaik dengan potongan harga dan gratis ongkir!
          </p>
        </div>

        {/* Animated Fiery Countdown Timer */}
        <div className="space-y-1.5 bg-[#0b1220] border border-rose-500/30 p-3 sm:p-4 rounded-2xl shadow-lg shadow-rose-500/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Berakhir Dalam</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <div className="px-2.5 py-1.5 rounded-xl bg-[#070b14] border border-rose-500/40 text-center min-w-[42px] shadow-inner">
              <span className="text-base sm:text-lg font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-400 font-sans font-bold">Hari</span>
            </div>
            <span className="text-rose-500 font-bold">:</span>
            <div className="px-2.5 py-1.5 rounded-xl bg-[#070b14] border border-rose-500/40 text-center min-w-[42px] shadow-inner">
              <span className="text-base sm:text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-400 font-sans font-bold">Jam</span>
            </div>
            <span className="text-rose-500 font-bold">:</span>
            <div className="px-2.5 py-1.5 rounded-xl bg-[#070b14] border border-rose-500/40 text-center min-w-[42px] shadow-inner">
              <span className="text-base sm:text-lg font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-400 font-sans font-bold">Mnt</span>
            </div>
            <span className="text-rose-500 font-bold">:</span>
            <div className="px-2.5 py-1.5 rounded-xl bg-[#070b14] border border-rose-500/40 text-center min-w-[42px] shadow-inner">
              <span className="text-base sm:text-lg font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-400 font-sans font-bold">Dtk</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Animated Banner: FLASH SALE Multi-Tone Gradient ─── */}
      <div className="relative rounded-[28px] p-1 bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-600 shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-gradient-shift">
        <div className="rounded-[24px] bg-gradient-to-r from-[#080d1a] via-[#0f172d] to-[#070b14] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
          
          <div className="space-y-3 z-10 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-xs border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUPER DEAL BULAN INI</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              FLASH <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">SALE</span>
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg text-slate-300 font-medium">Diskon Spesial Hingga</span>
              <span className="text-4xl sm:text-6xl font-black text-amber-300">70%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Stok terbatas untuk setiap varian busana muslimah pilihan. Jangan lewatkan kesempatan belanja hemat!
            </p>
          </div>

          <div className="relative w-64 h-48 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-tr from-rose-500/30 to-amber-500/20 rounded-full blur-3xl animate-pulse-glow" />
            <img
              src="/hero-sneaker.png"
              alt="Promo"
              className="relative w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(244,63,94,0.7)] animate-float"
            />
          </div>

        </div>
      </div>

      {/* ─── Discounted Products Grid ─── */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <span>Produk Sedang Diskon</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold">Hemat s/d 40%</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {promoProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
}
