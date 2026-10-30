'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Clock, Loader2 } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

export default function PromoPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Live countdown timer state (Screen 11)
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

  useEffect(() => {
    fetch('/api/products?limit=12')
      .then((res) => res.json())
      .then((data) => {
        // prioritize products with compareAtPrice
        const prods = data.products || [];
        setProducts(prods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 min-h-[calc(100vh-140px)]">
      
      {/* Top Header & Countdown Timer (Screen 11) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-2">
            <Flame className="w-3.5 h-3.5" /> Penawaran Eksklusif Terbatas
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Promo Spesial
          </h1>
          <p className="text-xs text-slate-400 mt-1">Dapatkan penawaran harga terbaik hari ini</p>
        </div>

        {/* Countdown Timer Display (Screen 11) */}
        <div className="flex items-center gap-2 bg-[#0e172a] p-3 rounded-2xl border border-slate-800 shadow-xl">
          <Clock className="w-4 h-4 text-rose-500 mr-1" />
          <div className="flex items-center gap-2 text-center text-xs font-mono font-bold">
            <div className="bg-[#070b14] px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-white text-sm">{String(timeLeft.days).padStart(2, '0')}</span>
              <p className="text-[9px] text-slate-500 font-sans">Hari</p>
            </div>
            <span className="text-slate-600">:</span>
            <div className="bg-[#070b14] px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-white text-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
              <p className="text-[9px] text-slate-500 font-sans">Jam</p>
            </div>
            <span className="text-slate-600">:</span>
            <div className="bg-[#070b14] px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-white text-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <p className="text-[9px] text-slate-500 font-sans">Menit</p>
            </div>
            <span className="text-slate-600">:</span>
            <div className="bg-[#070b14] px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-rose-400 text-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <p className="text-[9px] text-slate-500 font-sans">Detik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner FLASH SALE 70% (Screen 11) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-[#0d1730] to-[#070b14] p-8 sm:p-12 border border-blue-900/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        <div className="space-y-4 max-w-lg z-10">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-black">Limited Drop</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            FLASH SALE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">
              Hingga 70%
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Gunakan voucher <strong className="text-white font-mono bg-blue-600/30 px-2 py-0.5 rounded border border-blue-500/40">DISKON50K</strong> saat checkout untuk potongan langsung Rp 50.000!
          </p>
        </div>

        <div className="relative z-10 w-64 sm:w-80 aspect-square flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
            alt="Promo Sneaker"
            className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] rotate-[-15deg] hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* Promo Products Grid (Screen 11) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Produk Promo Spesial</h3>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Memuat produk promo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

