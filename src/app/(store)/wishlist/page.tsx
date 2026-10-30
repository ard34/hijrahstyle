'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

const wishlistData = [
  {
    id: 'w-1',
    name: 'Sneakers Vortex',
    slug: 'sneakers-vortex',
    price: 599000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/sneakers-vortex.png' }],
    category: { name: 'Sepatu', slug: 'sepatu' },
    variants: [{ id: 'v-1', stock: 25 }],
  },
  {
    id: 'w-2',
    name: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    price: 249000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/hoodie-bbn.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-2', stock: 40 }],
  },
  {
    id: 'w-3',
    name: 'Tas Sling BBN',
    slug: 'tas-sling-bbn',
    price: 189000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/tas-sling.jpg' }],
    category: { name: 'Tas', slug: 'tas' },
    variants: [{ id: 'v-3', stock: 35 }],
  },
  {
    id: 'w-4',
    name: 'Kaos Forge',
    slug: 'kaos-forge',
    price: 129000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/kaos-forge.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-4', stock: 50 }],
  },
  {
    id: 'w-5',
    name: 'Topi Trucker',
    slug: 'topi-trucker',
    price: 99000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/topi-trucker.jpg' }],
    category: { name: 'Aksesoris', slug: 'aksesoris' },
    variants: [{ id: 'v-5', stock: 60 }],
  },
  {
    id: 'w-6',
    name: 'Jaket Windbreaker',
    slug: 'jaket-windbreaker',
    price: 299000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/jaket-windbreaker.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-6', stock: 30 }],
  },
];

export default function WishlistPage() {
  const [products] = useState(wishlistData);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 space-y-6 min-h-[calc(100vh-140px)] animate-fade-in-up">
      
      {/* ─── Screen 12 Header: Wishlist Saya ─── */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Wishlist Saya
        </h1>
      </div>

      {/* ─── Screen 12 Grid: 3 Columns of Product Cards with "Tambah ke Keranjang" ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} showAddToCart={true} />
        ))}
      </div>

    </div>
  );
}
