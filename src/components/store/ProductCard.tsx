'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
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

  const avgRating = getAvgRating(product.reviews);
  const totalStock = getTotalStock(product.variants);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount ? getDiscountPercentage(product.compareAtPrice, product.price) : 0;
  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url || '/hero-sneaker.png';

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
        addToast(`${product.name} berhasil ditambahkan!`, 'success');
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        router.push(`/products/${product.slug}`);
      }
    } catch {
      router.push(`/products/${product.slug}`);
    } finally {
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToast(
      isWishlisted ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist!',
      'success'
    );
  };

  return (
    <div className="group bg-[#0e172a] rounded-2xl border border-slate-800/80 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full p-4 relative">
      <div>
        {/* Card Image Container */}
        <Link 
          href={`/products/${product.slug}`} 
          className="block relative h-48 sm:h-52 w-full bg-[#070b14] rounded-xl overflow-hidden mb-3.5 border border-slate-800/80 p-3 group"
        >
          <div className="absolute inset-0 bg-radial from-blue-600/10 via-transparent to-transparent opacity-60" />

          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm border border-rose-500/30">
              -{discount}%
            </span>
          )}

          {/* Category Tag */}
          {product.category?.name && (
            <span className="absolute bottom-2.5 left-2.5 bg-[#0b1120]/90 backdrop-blur-md text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-800/80">
              {product.category.name}
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            className={`absolute top-3 right-3 w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-all border cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/40 scale-105'
                : 'bg-slate-900/85 text-slate-300 hover:text-rose-400 hover:bg-slate-900 border-slate-700/80 hover:scale-105'
            }`}
            onClick={handleToggleWishlist}
            title="Tambah ke Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
          </button>

          {/* Out of Stock Overlay */}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-slate-900 text-rose-400 font-extrabold text-[11px] px-3 py-1 rounded-lg border border-rose-500/30">
                Stok Habis
              </span>
            </div>
          )}
        </Link>

        {/* Content Box */}
        <div className="space-y-1.5 px-0.5">
          {/* Rating & Sold Row */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-0.5 font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {avgRating}
            </span>
            <span>•</span>
            <span className="text-slate-400 font-medium">
              {product.totalSold || 120} terjual
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Price & Action Row (Screen 01 & 02) */}
      <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="text-sm sm:text-base font-black text-white">
            {formatPrice(product.price)}
          </div>
          {hasDiscount && (
            <div className="text-[11px] text-slate-500 line-through font-normal">
              {formatPrice(product.compareAtPrice)}
            </div>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={totalStock === 0}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 cursor-pointer whitespace-nowrap"
          title="Tambah ke Keranjang"
        >
          {isAdding ? (
            <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
          ) : (
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
          )}
          <span>+ Keranjang</span>
        </button>
      </div>
    </div>
  );
}
