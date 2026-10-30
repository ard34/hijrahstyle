'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Play, Star, MapPin, ShoppingBag, Check } from 'lucide-react';
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

  const productName = product.name || product.title || 'Produk Pilihan';
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount 
    ? getDiscountPercentage(product.compareAtPrice, product.price) 
    : (product.discount || 17);

  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url || '/products/kaos-forge.jpg';

  // Shopee cities list
  const cities = ['KOTA SERANG', 'KOTA JAKARTA PUSAT', 'KAB. TANGERANG', 'KOTA BEKASI', 'KOTA JAKARTA BARAT', 'KOTA SEMARANG', 'KAB. WONOSOBO'];
  const hash = Math.abs(String(product.id || product.slug || 'prod').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const productCity = product.city || cities[hash % cities.length];

  // Shopee Mall vs Star+ badge
  const isMall = product.isMall ?? (hash % 2 === 0);

  // Shopee total sold count & rating
  const totalSold = product.totalSold || (product.reviews?.length ? product.reviews.length * 15 : (hash % 400) + 120);
  const rating = product.rating || (product.reviews?.length ? 4.9 : 4.8);

  // Shopee video play icon indicator
  const hasVideo = product.hasVideo ?? (hash % 3 === 0);

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
    <div className="group relative bg-[#0b1220] hover:bg-[#0e172a] rounded-xl border border-slate-800 hover:border-[#ee4d2d]/60 shadow-md hover:shadow-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
      
      <div>
        {/* ─── Shopee Image Showcase Box ─── */}
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

          {/* Shopee Discount Tag on Top-Right Corner */}
          <div className="absolute top-0 right-0 bg-yellow-400 text-rose-600 font-black text-[10px] sm:text-[11px] px-1.5 py-0.5 shadow-sm text-center z-10 leading-none">
            <span>-{discount}%</span>
          </div>

          {/* Shopee Promo Xtra Badge on Bottom-Left Corner */}
          <div className="absolute bottom-1.5 left-1.5 z-10 bg-yellow-300 text-slate-950 font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-xs shadow-sm flex items-center gap-0.5 tracking-tight uppercase leading-none">
            <span>PROMO</span>
            <span className="text-rose-600 font-black">XTRA</span>
          </div>

          {/* Shopee Video Play Icon Indicator on Bottom-Right */}
          {hasVideo && (
            <div className="absolute bottom-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
            </div>
          )}

          {/* Subtle Wishlist Heart on Top-Left */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-1.5 left-1.5 z-10 w-7 h-7 rounded-full bg-slate-900/60 backdrop-blur-xs text-slate-300 hover:text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Simpan ke Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </Link>

        {/* ─── Shopee Card Content Body ─── */}
        <div className="p-2.5 sm:p-3 space-y-1.5">
          
          {/* Badge + Title (2 Lines Clamped) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-2 leading-snug text-xs sm:text-[13px] text-white font-medium group-hover:text-orange-400 transition-colors">
              {isMall ? (
                <span className="bg-[#d0011b] text-white text-[9px] font-black px-1.5 py-0.5 rounded-xs mr-1.5 inline-block align-middle tracking-tight uppercase leading-none">
                  Mall | ORI
                </span>
              ) : (
                <span className="bg-[#ee4d2d] text-white text-[9px] font-black px-1.5 py-0.5 rounded-xs mr-1.5 inline-block align-middle tracking-tight uppercase leading-none">
                  Star+
                </span>
              )}
              <span>{productName}</span>
            </h3>
          </Link>

          {/* Shopee Promo Outlined Tag */}
          <div className="pt-0.5">
            <span className="inline-block text-[9px] text-[#ee4d2d] border border-[#ee4d2d]/50 bg-[#ee4d2d]/10 px-1 py-0.5 rounded-xs font-semibold leading-none">
              Garansi Harga Terbaik
            </span>
          </div>

          {/* Price Row (Vibrant Shopee Orange/Red) */}
          <div className="pt-1 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-[#ee4d2d] tracking-tight">
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

      {/* ─── Shopee Bottom Location Tag ─── */}
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

        <div className="flex items-center justify-end text-[10px] text-slate-400 font-normal uppercase truncate pt-1 border-t border-slate-800/40">
          <MapPin className="w-2.5 h-2.5 text-slate-500 mr-1 shrink-0" />
          <span className="truncate">{productCity}</span>
        </div>
      </div>

    </div>
  );
}
