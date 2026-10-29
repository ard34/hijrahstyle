'use client';

import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';

function getAvgRating(reviews: { rating: number }[] = []) {
  if (!reviews || reviews.length === 0) return 5.0;
  return Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
}

function getTotalStock(variants: { stock: number }[] = []) {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((sum, v) => sum + v.stock, 0);
}

export default function ProductCard({ product }: { product: any }) {
  const avgRating = getAvgRating(product.reviews);
  const totalStock = getTotalStock(product.variants);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount ? getDiscountPercentage(product.compareAtPrice, product.price) : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full p-2.5 sm:p-3 relative">
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-square sm:aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden mb-3">
          {product.images && product.images[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4 text-center">
              <span className="text-2xl font-black text-blue-400">BBN</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Official</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-600 to-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-xs">
              -{discount}%
            </span>
          )}

          {/* Category Tag if available */}
          {product.category?.name && (
            <span className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              {product.category.name}
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-600 hover:bg-white flex items-center justify-center transition-all shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            title="Tambah ke Wishlist"
          >
            <Heart className="w-3.5 h-3.5 stroke-[2]" />
          </button>

          {/* Out of Stock Overlay */}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-white/95 text-rose-700 font-extrabold text-[11px] px-3 py-1 rounded-lg shadow-sm border border-rose-200">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="space-y-1.5 px-0.5">
          {/* Rating & Sold Row */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-0.5 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {avgRating}
            </span>
            <span>•</span>
            <span className="text-slate-400 font-medium">
              {product.totalSold ? `${product.totalSold} terjual` : 'Produk Baru'}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            {formatPrice(product.price)}
          </div>
          {hasDiscount && (
            <div className="text-[10px] text-slate-400 line-through font-normal">
              {formatPrice(product.compareAtPrice)}
            </div>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition-all duration-200"
          title="Lihat Detail Produk"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
