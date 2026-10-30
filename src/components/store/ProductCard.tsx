'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, ShoppingBag, Check, MapPin, Truck } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

function getAvgRating(reviews: { rating: number }[] = []) {
  if (!reviews || reviews.length === 0) return 4.9;
  return Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
}

function getTotalStock(variants: { stock: number }[] = []) {
  if (!variants || variants.length === 0) return 25;
  return variants.reduce((sum, v) => sum + v.stock, 0);
}

export default function ProductCard({ product }: { product: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToast } = useToastStore();
  const router = useRouter();

  const productName = product.name || product.title || 'Produk BBN';
  const avgRating = getAvgRating(product.reviews);
  const totalStock = getTotalStock(product.variants);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount ? getDiscountPercentage(product.compareAtPrice, product.price) : 0;
  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url || '/products/sneakers-vortex.png';

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Multi-variant products go to detail page
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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToast(
      isWishlisted ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist',
      isWishlisted ? 'info' : 'success'
    );
  };

  return (
    <div className="group bg-[#0e172a] rounded-2xl border border-slate-800/90 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-[0_0_25px_rgba(37,99,235,0.22)] hover:-translate-y-1 relative">
      <div>
        {/* ─── Shopee-Style Image Container with Badges ─── */}
        <Link 
          href={`/products/${product.slug}`} 
          className="block relative aspect-square w-full bg-[#070b14] overflow-hidden border-b border-slate-800/80 p-3 group"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial from-blue-600/15 via-transparent to-transparent opacity-60" />

          {/* Product Image */}
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Shopee Tag 1: Official / Mall Badge (Top-Left) */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
            <span className="bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm tracking-wider uppercase">
              Mall
            </span>
          </div>

          {/* Shopee Tag 2: Yellow Discount Ribbon (Top-Right) */}
          {hasDiscount && (
            <div className="absolute top-0 right-0 z-10 bg-amber-400 text-slate-950 font-black text-[11px] px-1.5 py-0.5 text-center font-sans shadow-md rounded-bl-lg">
              <span className="block leading-none text-rose-600 font-black text-[11px]">-{discount}%</span>
              <span className="block text-[8px] font-black text-slate-900 uppercase tracking-tighter">OFF</span>
            </div>
          )}

          {/* Shopee Tag 3: Gratis Ongkir Xtra & COD Badge (Bottom-Left) */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1">
            <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" />
              <span>Gratis Ongkir</span>
            </span>
            <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1 py-0.5 rounded shadow-xs">
              COD
            </span>
          </div>

          {/* Wishlist Heart Button (Top-Right beside discount or below) */}
          <button
            className={`absolute ${hasDiscount ? 'top-10' : 'top-2'} right-2 z-10 w-7 h-7 rounded-lg backdrop-blur-md flex items-center justify-center transition-all border cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/40 scale-105'
                : 'bg-slate-900/80 text-slate-400 hover:text-rose-400 hover:bg-slate-900 border-slate-700/80 hover:scale-105'
            }`}
            onClick={handleToggleWishlist}
            title="Tambah ke Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
          </button>

          {/* Out of Stock Overlay */}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="bg-slate-900 text-rose-400 font-extrabold text-xs px-3 py-1 rounded-lg border border-rose-500/30 shadow-md">
                Stok Habis
              </span>
            </div>
          )}
        </Link>

        {/* ─── Shopee-Style Content Body ─── */}
        <div className="p-3.5 space-y-2">
          {/* Title (2-Lines Clamp ala Shopee) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-white text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors h-9">
              {productName}
            </h3>
          </Link>

          {/* Special Shopee Voucher / Promo Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Diskon Rp50RB
            </span>
            {product.category?.name && (
              <span className="text-[10px] font-semibold text-blue-400">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Price Row */}
          <div className="pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-blue-400 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-500 line-through font-medium">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Rating, Sold Count & Location (Shopee Signature Triad) */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <div className="flex items-center gap-1 font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating}</span>
              <span className="text-slate-600 font-normal">|</span>
              <span className="text-slate-400 font-medium">
                {product.totalSold || 120} terjual
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Kota Serang</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Shopee Quick Add Button ─── */}
      <div className="p-3 pt-0 border-t border-slate-800/80 mt-1">
        <button
          onClick={handleQuickAdd}
          disabled={totalStock === 0}
          className="w-full mt-2.5 h-9 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 hover:border-blue-500 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md hover:shadow-blue-600/30 cursor-pointer disabled:opacity-40"
          title="Tambah ke Keranjang"
        >
          {isAdding ? (
            <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
          )}
          <span>+ Keranjang</span>
        </button>
      </div>
    </div>
  );
}
