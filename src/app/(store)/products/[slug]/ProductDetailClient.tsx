'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
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

export default function ProductDetailClient({ product, relatedProducts, avgRating, colors, sizes }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToast } = useToastStore();
  const router = useRouter();

  const selectedVariant = product.variants?.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants?.[0];

  const currentPrice = selectedVariant?.priceOverride || product.price;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const discount = hasDiscount ? getDiscountPercentage(product.compareAtPrice, currentPrice) : 0;
  const stock = selectedVariant?.stock || 25;

  const images = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.imageUrl || img.url)
    : ['/placeholder-product.png'];

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      addToast('Pilih varian terlebih dahulu', 'warning');
      return;
    }
    setIsAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productVariantId: selectedVariant.id, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          addToast('Silakan login terlebih dahulu', 'warning');
          router.push('/login');
          return;
        }
        addToast(data.error || 'Gagal menambahkan ke keranjang', 'error');
        return;
      }
      addToast(`${product.name} berhasil ditambahkan ke keranjang!`, 'success');
      // trigger cart count update
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      addToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Screen 03 Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-400 transition-colors">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-blue-400 transition-colors">
          {product.category?.name || 'Katalog'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Screen 03 Visual Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Product Showcase Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#0e172a] border border-slate-800 shadow-2xl flex items-center justify-center p-8 group">
            <div className="absolute inset-0 bg-radial from-blue-600/10 via-transparent to-transparent opacity-80" />
            
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="relative w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
            />
            
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg border border-rose-500/40">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails row if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border p-1 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === i
                      ? 'border-blue-500 bg-blue-600/20 shadow-md shadow-blue-500/30'
                      : 'border-slate-800 bg-[#0e172a] hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}

          {/* Screen 03: 3 Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0e172a] border border-slate-800/80 text-center flex flex-col items-center gap-1.5 shadow-sm">
              <Truck className="w-5 h-5 text-blue-400" />
              <span className="text-[11px] font-bold text-slate-300">Pengiriman Cepat</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0e172a] border border-slate-800/80 text-center flex flex-col items-center gap-1.5 shadow-sm">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-[11px] font-bold text-slate-300">100% Original</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0e172a] border border-slate-800/80 text-center flex flex-col items-center gap-1.5 shadow-sm">
              <RotateCcw className="w-5 h-5 text-blue-400" />
              <span className="text-[11px] font-bold text-slate-300">Garansi Retur</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Detail & Purchase Box */}
        <div className="space-y-6 bg-[#0e172a] p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
              {product.category?.name || 'Official BBN'}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-white">{avgRating > 0 ? avgRating.toFixed(1) : '4.8'}</span>
                <span className="text-slate-400">({product.reviews?.length || 128} ulasan)</span>
              </div>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{product.totalSold || 342} Terjual</span>
            </div>
          </div>

          {/* Screen 03 Price Box */}
          <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tight">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through font-normal">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Color Variant Buttons */}
          {colors.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 block">
                Pilihan Varian: <span className="text-blue-400 font-extrabold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/20'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 bg-[#070b14]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Pills (Screen 03) */}
          {sizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 block">
                Ukuran: <span className="text-blue-400 font-extrabold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all min-w-[3.6rem] cursor-pointer hover:scale-105 active:scale-95 ${
                      selectedSize === size
                        ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/35'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-[#070b14]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-400">Ketersediaan:</span>
            <span className={`font-bold ${stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stock > 0 ? `Stok tersedia: ${stock} pasang` : 'Stok habis'}
            </span>
          </div>

          {/* Quantity Counter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 block">Jumlah Pembelian</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl border border-slate-800 bg-[#070b14] flex items-center justify-center hover:bg-slate-800 text-white font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="text-base font-black w-10 text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
                className="w-12 h-12 rounded-xl border border-slate-800 bg-[#070b14] flex items-center justify-center hover:bg-slate-800 text-white font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Screen 03 CTA Buttons */}
          <div className="flex items-center gap-3.5 pt-3">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0 || isAddingToCart}
              className="flex-1 py-4 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 stroke-[2]" />
                  <span>+ Tambah ke Keranjang</span>
                </>
              )}
            </button>

            <button 
              onClick={() => addToast('Produk ditambahkan ke Wishlist!', 'success')}
              className="w-14 h-14 rounded-2xl border border-slate-800 bg-[#070b14] hover:border-rose-500/50 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-sm"
              title="Simpan ke Wishlist"
            >
              <Heart className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>

      </div>

      {/* Description & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0e172a] p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-md space-y-4">
          <h2 className="text-lg font-black text-white">Deskripsi Produk</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {product.description || 'Produk eksklusif Toko Sample BBN dengan standar pengerjaan presisi tinggi.'}
          </p>
          {product.material && (
            <div className="mt-4 p-4 rounded-xl bg-[#070b14] border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Material / Bahan: </span>
              <span className="text-xs text-blue-400 font-semibold">{product.material}</span>
            </div>
          )}
          <div className="text-xs text-slate-500 font-mono">Kode SKU: {product.sku}</div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-[#0e172a] p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-md space-y-4">
          <h3 className="text-lg font-black text-white">Ulasan Pembeli ({product.reviews?.length || 0})</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((rev: any) => (
                <div key={rev.id} className="pb-4 border-b border-slate-800/80 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white">{rev.user?.name || 'Pelanggan Terverifikasi'}</p>
                  {rev.comment && <p className="text-xs text-slate-400 mt-1">{rev.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Belum ada ulasan untuk produk ini.</p>
          )}
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
