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
  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url;

  return (
    <div className="group bg-[#0e172a] rounded-2xl border border-slate-800/90 shadow-md hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full p-3 sm:p-3.5 relative">
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-square sm:aspect-[4/5] bg-[#070b14] rounded-xl overflow-hidden mb-3 border border-slate-800/60">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#070b14] text-slate-400 p-4 text-center">
              <span className="text-2xl font-black text-blue-400">BBN</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Digital Forge</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm border border-rose-500/40">
              -{discount}%
            </span>
          )}

          {/* Category Tag */}
          {product.category?.name && (
            <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-800">
              {product.category.name}
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/80 backdrop-blur-xs text-slate-300 hover:text-rose-500 hover:bg-slate-900 flex items-center justify-center transition-all border border-slate-800 cursor-pointer"
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
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-slate-900 text-rose-400 font-extrabold text-[11px] px-3 py-1 rounded-lg border border-rose-500/30">
                Stok Habis
              </span>
            </div>
          )}
        </div>

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
              {product.totalSold ? `${product.totalSold} terjual` : 'Produk Baru'}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="pt-3 mt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs sm:text-sm font-extrabold text-white">
            {formatPrice(product.price)}
          </div>
          {hasDiscount && (
            <div className="text-[10px] text-slate-500 line-through font-normal">
              {formatPrice(product.compareAtPrice)}
            </div>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-200 border border-blue-500/30"
          title="Lihat Detail Produk"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
