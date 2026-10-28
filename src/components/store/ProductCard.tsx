'use client';

import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';

function getAvgRating(reviews: { rating: number }[] = []) {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function getTotalStock(variants: { stock: number }[] = []) {
  if (!variants) return 0;
  return variants.reduce((sum, v) => sum + v.stock, 0);
}

export default function ProductCard({ product }: { product: any }) {
  const avgRating = getAvgRating(product.reviews);
  const totalStock = getTotalStock(product.variants);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount ? getDiscountPercentage(product.compareAtPrice, product.price) : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between h-full p-2 sm:p-2.5">
      <div>
        {/* Card Image Box */}
        <div className="relative aspect-[3/4] bg-slate-100/90 rounded-xl overflow-hidden mb-3">
          {product.images && product.images[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#F7F5F2] text-slate-400">
              <span className="text-3xl font-light text-slate-300">HS</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Fashion</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              -{discount}%
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white flex items-center justify-center transition-all shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Out of Stock Overlay */}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-white text-slate-900 font-semibold text-[11px] px-3 py-1 rounded-md shadow-sm">
                Habis
              </span>
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="px-1 pb-1 flex flex-col justify-between space-y-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-[#522880] transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-normal">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
