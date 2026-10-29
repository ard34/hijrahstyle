'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useCartStore, useToastStore } from '@/lib/store';

const categoryIcons: Record<string, string> = {
  gamis: '👗', hijab: '🧕', abaya: '✨', koko: '👔', tunik: '👚', mukena: '🕌', aksesoris: '💍', 'dress-muslimah': '👗',
};

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
  const { addToast } = useToastStore();
  const router = useRouter();

  const selectedVariant = product.variants.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  );

  const currentPrice = selectedVariant?.priceOverride || product.price;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const discount = hasDiscount ? getDiscountPercentage(product.compareAtPrice, currentPrice) : 0;
  const stock = selectedVariant?.stock || 0;

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
      addToast('Berhasil ditambahkan ke keranjang! 🛒', 'success');
    } catch {
      addToast('Terjadi kesalahan', 'error');
    }
    setIsAddingToCart(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#522880]">Beranda</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/products" className="hover:text-[#522880]">Produk</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-[#522880]">{product.category?.name}</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-bold truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#F7F5F2] border border-slate-200/80 flex items-center justify-center relative shadow-2xs">
            {product.images && product.images[0]?.url ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[120px] opacity-20">
                {categoryIcons[product.category?.slug] || '🛍️'}
              </span>
            )}
            
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#522880] bg-[#F2EDFA] px-3 py-1 rounded-full inline-block mb-2">
              {product.category?.name || 'Fashion Islami'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              {avgRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= avgRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{avgRating.toFixed(1)}</span>
                  <span className="text-slate-400">({product.reviews.length} ulasan)</span>
                </div>
              )}
              <span>•</span>
              <span className="font-semibold text-slate-700">{product.totalSold || 0} Terjual</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through font-medium">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Pilih Warna: <span className="text-blue-600 font-extrabold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Pilih Ukuran: <span className="text-blue-600 font-extrabold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all min-w-[3.5rem] ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-500">Stok:</span>
            <span className={`font-bold ${stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stock > 0 ? `${stock} tersedia` : 'Habis'}
            </span>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">Jumlah</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-700 font-bold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold w-10 text-center text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-700 font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0 || isAddingToCart}
              className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Tambah ke Keranjang</span>
                </>
              )}
            </button>

            <button className="w-12 h-12 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-all shrink-0">
              <Heart className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
            {[
              { icon: Truck, label: 'Pengiriman Cepat' },
              { icon: Shield, label: 'Garansi Kualitas' },
              { icon: RotateCcw, label: 'Bisa Retur' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 block">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-static p-6 sm:p-8">
          <h2 className="text-xl font-heading font-bold text-surface-800 mb-4">Deskripsi Produk</h2>
          <p className="text-surface-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          {product.material && (
            <div className="mt-4 p-4 rounded-xl bg-surface-50">
              <span className="text-sm font-semibold text-surface-700">Material: </span>
              <span className="text-sm text-surface-600">{product.material}</span>
            </div>
          )}
          <div className="mt-4 text-sm text-surface-500">SKU: {product.sku}</div>
        </div>

        {/* Reviews */}
        <div className="card-static p-6">
          <h3 className="text-lg font-heading font-bold text-surface-800 mb-4">Ulasan ({product.reviews.length})</h3>
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="pb-4 border-b border-surface-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-surface-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-surface-400">{new Date(review.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <p className="text-xs font-semibold text-surface-700">{review.user?.name}</p>
                  {review.comment && <p className="text-sm text-surface-600 mt-1">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400">Belum ada ulasan</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-surface-800 mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rp: any) => {
              const rpDiscount = rp.compareAtPrice && rp.compareAtPrice > rp.price ? getDiscountPercentage(rp.compareAtPrice, rp.price) : 0;
              return (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="product-card group">
                  <div className="product-card-image bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-20">{categoryIcons[rp.category?.slug] || '🛍️'}</span>
                    </div>
                    {rpDiscount > 0 && <span className="product-card-discount">-{rpDiscount}%</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary-500 font-medium mb-1">{rp.category?.name}</p>
                    <h3 className="font-heading font-semibold text-sm line-clamp-2 mb-2 text-surface-800">{rp.name}</h3>
                    <span className="font-heading font-bold text-primary-700">{formatPrice(rp.price)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
