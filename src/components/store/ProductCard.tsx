'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, MapPin, ShoppingBag, Check, Eye } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

export default function ProductCard({ 
  product, 
  showAddToCart = false 
}: { 
  product: any; 
  showAddToCart?: boolean;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToast } = useToastStore();
  const router = useRouter();

  const productName = product.name || product.title || 'Produk Muslimah';
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount 
    ? getDiscountPercentage(product.compareAtPrice, product.price) 
    : 0;

  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url || '/products/kaos-forge.jpg';

  // Toko Resmi HijrahStyle, Kota Serang
  const storeOrigin = 'Kota Serang';

  // Rating & Jumlah Terjual
  const hash = Math.abs(String(product.id || product.slug || 'prod').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const totalSold = product.totalSold || (product.reviews?.length ? product.reviews.length * 15 : (hash % 200) + 85);
  const rating = product.rating || (product.reviews?.length ? 4.9 : 4.8);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToast(
      isWishlisted ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist',
      isWishlisted ? 'info' : 'success'
    );
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 1) {
      router.push(`/products/${product.slug}`);
      return;
    }

    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      router.push(`/products/${product.slug}`);
      return;
    }

    try {
      setIsAdding(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productVariantId: variantId, quantity: 1 }),
      });
      if (res.ok) {
        addToast(`${productName} berhasil ditambahkan!`, 'success');
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        router.push(`/products/${product.slug}`);
      }
    } catch {
      router.push(`/products/${product.slug}`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative bg-[#0b1220] hover:bg-[#0e172a] rounded-[18px] border border-slate-800/80 hover:border-blue-500/50 shadow-sm hover:shadow-[0_12px_28px_rgba(37,99,235,0.18)] transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between h-full hover:-translate-y-1">
      
      {/* ─── Top Segment: Gambar & Detail Produk ─── */}
      <div className="flex flex-col flex-1">
        
        {/* ─── A. Area Gambar Produk (1:1 Ratio, Padding 16-20px, Dedicated Background) ─── */}
        <div className="relative aspect-square w-full bg-[#10192e] overflow-hidden flex items-center justify-center p-4 sm:p-5 before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:transition-transform before:duration-700 before:z-20 pointer-events-none">
          <Link 
            href={`/products/${product.slug}`} 
            prefetch={true}
            className="w-full h-full flex items-center justify-center pointer-events-auto"
          >
            {/* Main Product Image (object-contain with comfortable breathing room) */}
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badge Diskon Konsisten di Pojok Kanan Atas */}
          {hasDiscount && (
            <div className="absolute top-3.5 right-3.5 bg-rose-600 text-white font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-lg shadow-md z-20 tracking-tight leading-tight pointer-events-none">
              <span>-{discount}%</span>
            </div>
          )}

          {/* Tombol Wishlist di Pojok Kiri Atas */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3.5 left-3.5 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer shadow-md pointer-events-auto"
            title="Simpan ke Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
          </button>

          {/* Floating Hover Action Pill (Detail & Keranjang Cepat) */}
          <div className="absolute inset-x-3.5 bottom-3.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
            <Link
              href={`/products/${product.slug}`}
              prefetch={true}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-lg shadow-blue-600/40 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Eye className="w-3 h-3" />
              <span>Detail</span>
            </Link>

            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-emerald-600 text-slate-200 hover:text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0"
              title="Beli Cepat / Masukkan Keranjang"
            >
              {isAdding ? <Check className="w-3.5 h-3.5 text-white" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ─── B. Informasi Produk (Padding 16-20px, Typography & Spacing Standar) ─── */}
        <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-3.5 flex-1 flex flex-col justify-between">
          
          <div>
            {/* 1. Nama Produk: Font Semibold, Ukuran 17-19px (Responsive), Line-height nyaman */}
            <Link href={`/products/${product.slug}`} prefetch={true} className="block group/title">
              <h3 className="line-clamp-2 leading-snug text-sm sm:text-[15px] md:text-base lg:text-[18px] font-semibold text-white group-hover/title:text-blue-400 transition-colors tracking-tight">
                {productName}
              </h3>
            </Link>

            {/* 2. Harga Produk: Jarak 8-12px, Warna Biru, 22-24px, Flex-wrap Layar Kecil */}
            <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2 flex-wrap pt-0.5">
              <span className="text-base sm:text-lg md:text-xl lg:text-[22px] font-black text-blue-400 tracking-tight leading-tight">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-[13px] md:text-sm text-slate-500 line-through font-medium leading-none">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* 3. Rating & Penjualan: Jarak 8-10px, Bintang Kuning, Horizontal Gap 8-12px */}
          <div className="mt-2.5 sm:mt-3 flex items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] text-slate-400 pt-0.5">
            <div className="flex items-center text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-white text-xs sm:text-[13px]">{rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-xs sm:text-[13px]">{totalSold} Terjual</span>
          </div>

        </div>
      </div>

      {/* ─── C. Informasi Toko & Lokasi Footer (Padding 12-20px, Border-top Tipis, Truncation) ─── */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        {showAddToCart ? (
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mb-3 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isAdding ? <Check className="w-4 h-4 text-white" /> : <ShoppingBag className="w-4 h-4" />}
            <span>+ Keranjang</span>
          </button>
        ) : null}

        <div className="flex items-center justify-between text-xs sm:text-[13px] text-slate-400 font-normal pt-3 border-t border-slate-800/80 leading-normal gap-2">
          <span className="text-slate-400 font-medium truncate hover:text-blue-400 transition-colors">
            HijrahStyle
          </span>
          <span className="flex items-center gap-1 text-slate-500 shrink-0 text-xs sm:text-[12px]">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span>{storeOrigin}</span>
          </span>
        </div>
      </div>

    </div>
  );
}
