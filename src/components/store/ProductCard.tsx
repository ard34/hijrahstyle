'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

export default function ProductCard({ 
  product, 
  showAddToCart = false 
}: { 
  product: any; 
  showAddToCart?: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToast } = useToastStore();
  const router = useRouter();

  const productName = product.name || product.title || 'Produk BBN';
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
    <div className="group bg-[#0b1220] hover:bg-[#0e172a] rounded-2xl border border-slate-800/80 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(37,99,235,0.2)] hover:-translate-y-1 relative">
      <div>
        {/* ─── Screen 02 Clean Image Showcase with Subtle Light Backdrop ─── */}
        <Link 
          href={`/products/${product.slug}`} 
          className="block relative aspect-square w-full bg-[#f1f5f9] dark:bg-[#1a2333]/60 p-4 overflow-hidden rounded-t-2xl flex items-center justify-center group"
        >
          {/* Product Image */}
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Discount Badge on Top-Left (Ref: Screen 02: red badge -20%) */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white font-black text-[11px] px-2 py-0.5 rounded-md shadow-md">
              -{discount}%
            </span>
          )}

          {/* Wishlist Heart Button on Top-Right (Ref: Screen 02 & 12) */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 scale-105'
                : 'bg-slate-900/40 text-slate-400 hover:text-rose-400 hover:bg-slate-900/80 hover:scale-105'
            }`}
            title="Tambah ke Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
          </button>
        </Link>

        {/* ─── Screen 02 Content Body ─── */}
        <div className="p-4 space-y-1.5">
          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
              {productName}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-slate-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Optional CTA Button (Ref Screen 12: Wishlist "Tambah ke Keranjang") */}
      {showAddToCart ? (
        <div className="p-4 pt-0">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            {isAdding ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
            <span>Tambah ke Keranjang</span>
          </button>
        </div>
      ) : (
        <div className="px-4 pb-3 pt-0">
          <button
            onClick={handleQuickAdd}
            className="w-full py-1.5 rounded-xl bg-[#0e172a] hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
            <span>Beli Cepat</span>
          </button>
        </div>
      )}
    </div>
  );
}
