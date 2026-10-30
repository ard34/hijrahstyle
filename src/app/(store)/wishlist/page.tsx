'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToastStore();

  useEffect(() => {
    fetch('/api/products?limit=8')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product: any) => {
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) {
        addToast('Varian produk belum tersedia', 'warning');
        return;
      }
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productVariantId: variantId, quantity: 1 }),
      });
      if (res.ok) {
        addToast(`${product.name} ditambahkan ke keranjang! 🛒`, 'success');
      } else {
        addToast('Gagal menambahkan ke keranjang', 'error');
      }
    } catch {
      addToast('Terjadi kesalahan', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-140px)]">
      
      {/* Header (Screen 12) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Wishlist Saya
          </h1>
          <p className="text-xs text-slate-400 mt-1">Daftar produk favorit yang Anda simpan untuk dibeli nanti</p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <span>Eksplor Produk Lain</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Memuat wishlist...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#0e172a] border border-slate-800 p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Wishlist Anda Masih Kosong</h3>
          <p className="text-xs text-slate-400">Simpan produk yang Anda minati dengan mengklik tombol hati pada kartu produk.</p>
          <Link
            href="/products"
            className="inline-flex px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => {
            const img = p.images?.[0]?.imageUrl || p.images?.[0]?.url;
            return (
              <div 
                key={p.id}
                className="group bg-[#0e172a] rounded-2xl border border-slate-800 p-3 sm:p-4 flex flex-col justify-between shadow-xl hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] transition-all"
              >
                <div>
                  <div className="relative aspect-square rounded-xl bg-[#070b14] overflow-hidden mb-3 border border-slate-800">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400 font-black">BBN</div>
                    )}
                    <span className="absolute top-2.5 right-2.5 w-9 h-9 rounded-xl bg-slate-900/90 text-rose-500 border border-slate-700 flex items-center justify-center shadow-md">
                      <Heart className="w-4 h-4 fill-current" />
                    </span>
                  </div>

                  <Link href={`/products/${p.slug}`} className="block">
                    <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-black text-blue-400 mt-1">
                    {formatPrice(p.price)}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/35 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>+ Keranjang</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

