'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, MapPin, ShoppingBag, Check } from 'lucide-react';
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
    <div className="group relative bg-[#0b1220] hover:bg-[#0e172a] rounded-xl border border-slate-800 hover:border-blue-500/50 shadow-md hover:shadow-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
      
      <div>
        {/* ─── Product Image Showcase ─── */}
        <Link 
          href={`/products/${product.slug}`} 
          className="block relative aspect-square w-full bg-[#111928] overflow-hidden flex items-center justify-center p-3"
        >
          {/* Main Product Image */}
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Ribbon on Top-Right Corner (Only shown when there's an actual discount) */}
          {hasDiscount && (
            <div className="absolute top-0 right-0 bg-rose-600 text-white font-black text-[10px] sm:text-[11px] px-1.5 py-0.5 shadow-sm text-center z-10 leading-none">
              <span>-{discount}%</span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-slate-900/60 backdrop-blur-xs text-slate-300 hover:text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
            title="Simpan ke Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </Link>

        {/* ─── Product Details ─── */}
        <div className="p-2.5 sm:p-3 space-y-1.5">
          
          {/* Product Title (2 Lines Clamped, Clean without Mall/Star+ badges) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-2 leading-snug text-xs sm:text-[13px] text-white font-semibold group-hover:text-blue-400 transition-colors">
              {productName}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="pt-1 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-blue-400 tracking-tight">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-slate-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Rating Star & Terjual Count */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-white text-[11px]">{rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-[10px]">{totalSold} Terjual</span>
          </div>

        </div>
      </div>

      {/* ─── Store Identity Footer (HijrahStyle Official • Kota Serang) ─── */}
      <div className="px-2.5 sm:px-3 pb-2.5 pt-0">
        {showAddToCart ? (
          <button
            onClick={handleQuickAdd}
            className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mb-1.5"
          >
            {isAdding ? <Check className="w-3 h-3 text-white" /> : <ShoppingBag className="w-3 h-3" />}
            <span>+ Keranjang</span>
          </button>
        ) : null}

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-normal pt-1.5 border-t border-slate-800/40">
          <span className="text-slate-400 font-semibold truncate">HijrahStyle</span>
          <span className="flex items-center gap-1 text-slate-500 shrink-0">
            <MapPin className="w-2.5 h-2.5 text-slate-500" />
            <span>{storeOrigin}</span>
          </span>
        </div>
      </div>

    </div>
  );
}
