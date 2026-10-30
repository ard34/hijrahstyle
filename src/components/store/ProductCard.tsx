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

  // Single Store: HijrahStyle Official, Serang
  const storeOrigin = 'Kota Serang';

  // Rating & Terjual
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
    <div className="group relative bg-[#0b1220] hover:bg-[#0e172a] rounded-2xl border border-slate-800/90 hover:border-blue-500/60 shadow-md hover:shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between hover:-translate-y-1.5">
      
      {/* ─── Top Container: Image & Details ─── */}
      <div className="flex flex-col">
        {/* ─── Product Image Showcase ─── */}
        <div className="relative aspect-square w-full bg-[#111928] overflow-hidden flex items-center justify-center p-3.5 before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-700 before:z-20 pointer-events-none">
          <Link 
            href={`/products/${product.slug}`} 
            className="w-full h-full flex items-center justify-center pointer-events-auto"
          >
            {/* Main Product Image with Gentle Scale on Hover */}
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] group-hover:scale-108 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Discount Badge (Safely inset so it is NEVER clipped by rounded borders) */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg shadow-lg z-20 leading-tight">
              <span>-{discount}%</span>
            </div>
          )}

          {/* Wishlist Heart Button with Scale Animation */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer shadow-md pointer-events-auto"
            title="Simpan ke Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
          </button>

          {/* Floating Hover Action Pill (Slide-in on hover) */}
          <div className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
            <Link
              href={`/products/${product.slug}`}
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

        {/* ─── Product Details (Generous padding from outer borders: NEVER touching edges) ─── */}
        <div className="px-5 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-3.5 space-y-2.5">
          
          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-2 leading-snug text-xs sm:text-[13px] text-white font-semibold group-hover:text-blue-400 transition-colors">
              {productName}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="pt-0.5 flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-black text-blue-400 tracking-tight">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-slate-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Rating Star & Terjual Count */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-white text-[11px]">{rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-[10px]">{totalSold} Terjual</span>
          </div>

        </div>
      </div>

      {/* ─── Store Identity Footer (Safe bottom padding: NEVER clipped or touching bottom border) ─── */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
        {showAddToCart ? (
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mb-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isAdding ? <Check className="w-3.5 h-3.5 text-white" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>+ Keranjang</span>
          </button>
        ) : null}

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-normal pt-3 border-t border-slate-800/80 leading-normal gap-2">
          <span className="text-slate-400 font-semibold truncate hover:text-blue-400 transition-colors">HijrahStyle</span>
          <span className="flex items-center gap-1 text-slate-500 shrink-0">
            <MapPin className="w-2.5 h-2.5 text-slate-500" />
            <span>{storeOrigin}</span>
          </span>
        </div>
      </div>

    </div>
  );
}
