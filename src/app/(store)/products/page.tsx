'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Loader2, Check } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { imageUrl?: string; url?: string }[];
  category: { name: string; slug: string };
  variants: { stock: number }[];
}

const fallbackCatalogProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    price: 249000,
    compareAtPrice: 299000,
    images: [{ imageUrl: '/products/hoodie-bbn.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ stock: 40 }],
  },
  {
    id: 'prod-2',
    name: 'Sneakers Vortex',
    slug: 'sneakers-vortex',
    price: 590000,
    compareAtPrice: 699000,
    images: [{ imageUrl: '/products/sneakers-vortex.png' }],
    category: { name: 'Sepatu', slug: 'sepatu' },
    variants: [{ stock: 25 }],
  },
  {
    id: 'prod-3',
    name: 'Kaos Forge',
    slug: 'kaos-forge',
    price: 129000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/kaos-forge.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ stock: 50 }],
  },
  {
    id: 'prod-4',
    name: 'Jaket Windbreaker',
    slug: 'jaket-windbreaker',
    price: 299000,
    compareAtPrice: 389000,
    images: [{ imageUrl: '/products/jaket-windbreaker.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [{ stock: 35 }],
  },
  {
    id: 'prod-5',
    name: 'Tas Sling BBN',
    slug: 'tas-sling-bbn',
    price: 189000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/tas-sling.jpg' }],
    category: { name: 'Tas', slug: 'tas' },
    variants: [{ stock: 30 }],
  },
  {
    id: 'prod-6',
    name: 'Topi Trucker',
    slug: 'topi-trucker',
    price: 99000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/topi-trucker.jpg' }],
    category: { name: 'Aksesoris', slug: 'aksesoris' },
    variants: [{ stock: 60 }],
  },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');

  const categoryList = [
    { label: 'Semua', slug: '' },
    { label: 'Pakaian', slug: 'pakaian' },
    { label: 'Sepatu', slug: 'sepatu' },
    { label: 'Aksesoris', slug: 'aksesoris' },
    { label: 'Tas', slug: 'tas' },
    { label: 'Elektronik', slug: 'elektronik' },
  ];

  const colorOptions = [
    { name: 'Putih', hex: '#ffffff' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Ungu', hex: '#a855f7' },
    { name: 'Hijau', hex: '#4ade80' },
    { name: 'Biru', hex: '#2563eb' },
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    const s = searchParams.get('search');
    if (s) params.set('search', s);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('maxPrice', String(maxPrice));
    params.set('limit', '12');

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        // filter fallbacks
        let filtered = [...fallbackCatalogProducts];
        if (category) filtered = filtered.filter(p => p.category.slug === category);
        filtered = filtered.filter(p => p.price <= maxPrice);
        setProducts(filtered);
      }
    } catch {
      let filtered = [...fallbackCatalogProducts];
      if (category) filtered = filtered.filter(p => p.category.slug === category);
      filtered = filtered.filter(p => p.price <= maxPrice);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [category, sort, maxPrice, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ─── Screen 02 Left Sidebar Filter ─── */}
        <aside className={`${showMobileFilter ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0 space-y-6 p-6 rounded-2xl bg-[#0b1220] border border-slate-800/80 shadow-xl`}>
          
          {/* 1. Kategori Radio List (Screen 02) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm tracking-tight">Kategori</h3>
            <div className="space-y-2 text-xs">
              {categoryList.map((cat) => {
                const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
                return (
                  <button
                    key={cat.label}
                    onClick={() => setCategory(cat.slug)}
                    className="w-full flex items-center gap-2.5 text-left py-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-600' : 'border-slate-600 bg-transparent'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={isSelected ? 'text-white font-bold' : 'text-slate-400'}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* 2. Rentang Harga (Screen 02: Rp 0 - Rp 1.000.000 Slider) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm tracking-tight">Rentang Harga</h3>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Rp 0</span>
              <span>Rp {maxPrice.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <hr className="border-slate-800" />

          {/* 3. Tersedia (Screen 02: Stok tersedia) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm tracking-tight">Tersedia</h3>
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                inStockOnly ? 'border-blue-500 bg-blue-600' : 'border-slate-600'
              }`}>
                {inStockOnly && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </div>
              <span className={inStockOnly ? 'text-white font-bold' : 'text-slate-400'}>
                Stok tersedia
              </span>
            </button>
          </div>

          <hr className="border-slate-800" />

          {/* 4. Warna (Screen 02: Swatches) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm tracking-tight">Warna</h3>
            <div className="flex items-center gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    selectedColor === c.name 
                      ? 'border-blue-400 scale-125 shadow-lg shadow-blue-500/50' 
                      : 'border-slate-700 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

        </aside>

        {/* ─── Screen 02 Main Product Grid Area ─── */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          
          {/* Header Row: Title & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Katalog Produk</h1>
              <p className="text-xs text-slate-400 mt-1">Temukan produk terbaik pilihan kami.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1220] border border-slate-800 text-xs font-bold text-white"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>Filter</span>
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0b1220] border border-slate-800 text-xs font-semibold text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="newest">Urutkan: Terbaru</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
              </select>
            </div>
          </div>

          {/* 3-Column Product Grid (Screen 02) */}
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs text-slate-400 mt-2">Memuat katalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#0b1220] rounded-2xl border border-slate-800 p-8 space-y-3">
              <p className="text-slate-400 text-sm">Tidak ada produk yang cocok dengan filter yang dipilih.</p>
              <button
                onClick={() => { setCategory(''); setMaxPrice(1000000); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
