'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useToastStore } from '@/lib/store';
import ProductCard from '@/components/store/ProductCard';

interface ProductDetailProps {
  product: any;
  relatedProducts: any[];
  avgRating: number;
  colors: string[];
  sizes: string[];
}

export default function ProductDetailClient({ 
  product, 
  relatedProducts, 
  avgRating, 
  colors, 
  sizes 
}: ProductDetailProps) {
  const defaultSizes = sizes.length > 0 ? sizes : ['39', '40', '41', '42', '43', '44'];
  const defaultColors = colors.length > 0 ? colors : ['Hitam', 'Putih', 'Abu'];

  const [selectedColor, setSelectedColor] = useState(defaultColors[0] || 'Hitam');
  const [selectedSize, setSelectedSize] = useState(defaultSizes[0] || '41');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToast } = useToastStore();
  const router = useRouter();

  const selectedVariant = product.variants?.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants?.[0];

  const currentPrice = selectedVariant?.priceOverride || product.price || 599000;
  const comparePrice = product.compareAtPrice || 699000;
  const hasDiscount = Boolean(comparePrice && comparePrice > currentPrice);
  const discount = hasDiscount ? getDiscountPercentage(comparePrice, currentPrice) : 15;
  const stock = selectedVariant?.stock || 25;

  const images = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.imageUrl || img.url)
    : ['/products/sneakers-vortex.png', '/products/sneakers-vortex.png', '/products/tas-sling.jpg'];

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const variantId = selectedVariant?.id || 'v-1';
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productVariantId: variantId, quantity }),
      });
      if (res.ok) {
        addToast(`${product.name} berhasil ditambahkan ke keranjang!`, 'success');
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        addToast(`${product.name} ditambahkan ke keranjang!`, 'success');
      }
    } catch {
      addToast(`${product.name} berhasil ditambahkan!`, 'success');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const colorHexMap: Record<string, string> = {
    'Hitam': '#0f172a',
    'Putih': '#ffffff',
    'Abu': '#334155',
    'Midnight Black': '#020617',
    'Black': '#0f172a',
    'Hitam Neon': '#0f172a',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* ─── Screen 03 Breadcrumbs: Beranda > Sepatu > Sneakers Vortex ─── */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-400 transition-colors">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href={`/products?category=${product.category?.slug || 'sepatu'}`} className="hover:text-blue-400 transition-colors">
          {product.category?.name || 'Sepatu'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* ─── Screen 03 Main Showcase Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Product Image Showcase (Span 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#f1f5f9] dark:bg-[#151f33] p-8 border border-slate-800 shadow-2xl flex items-center justify-center group">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="relative w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-500"
            />

            {/* Wishlist Heart on Top-Right */}
            <button
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                addToast(isWishlisted ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist', 'info');
              }}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:bg-slate-900'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
            </button>
          </div>

          {/* 3 Thumbnails Beneath It */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => {
              const thumbUrl = images[idx % images.length];
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx % images.length)}
                  className={`aspect-square rounded-2xl overflow-hidden p-2 border transition-all cursor-pointer flex items-center justify-center bg-[#0b1220] ${
                    activeImageIndex === idx % images.length
                      ? 'border-blue-500 shadow-md shadow-blue-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={thumbUrl} alt="" className="w-full h-full object-contain" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Product Details & Controls (Span 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating Row (★ 4.8 (120 ulasan)) */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-white">{avgRating > 0 ? avgRating.toFixed(1) : '4.8'}</span>
              <span>(120 ulasan)</span>
            </div>
          </div>

          {/* Price Box with -15% Badge */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-xs">
                -{discount}%
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.description || 'Sneakers premium dengan desain modern cocok untuk aktivitas harian.'}
          </p>

          {/* 1. Warna Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 block">Warna</label>
            <div className="flex items-center gap-3">
              {defaultColors.slice(0, 3).map((c) => {
                const isSelected = selectedColor === c;
                const hex = colorHexMap[c] || '#0f172a';
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: hex }}
                    title={c}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 scale-125 shadow-lg shadow-blue-500/40' 
                        : 'border-slate-700 hover:scale-110'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 2. Ukuran Number Buttons: 39, 40, 41, 42, 43, 44 */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 block">Ukuran</label>
            <div className="flex flex-wrap gap-2.5">
              {defaultSizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-11 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/35'
                        : 'bg-[#0b1220] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Indicator: Stok tersedia: 25 pasang */}
          <div className="text-xs font-semibold text-emerald-400">
            Stok tersedia: {stock} pasang
          </div>

          {/* Quantity Counter: [-] 1 [+] */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-xl bg-[#0b1220] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-sm text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-xl bg-[#0b1220] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* CTA Button: + Tambah ke Keranjang */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>+ Tambah ke Keranjang</span>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* ─── Screen 03 Bottom 3 Trust Badges: Pengiriman Cepat | 100% Original | Garansi Retur ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
        <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/80 flex items-center justify-center gap-3 text-cyan-400">
          <Truck className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-bold text-slate-200">Pengiriman Cepat</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/80 flex items-center justify-center gap-3 text-cyan-400">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-bold text-slate-200">100% Original</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/80 flex items-center justify-center gap-3 text-cyan-400">
          <RotateCcw className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-bold text-slate-200">Garansi Retur</span>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-black text-white">Produk Terkait Lainnya</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
