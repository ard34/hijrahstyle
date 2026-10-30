'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Loader2, Check, ChevronDown, X, RotateCcw } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { imageUrl?: string; url?: string }[];
  category: { name: string; slug: string };
  variants: { color?: string; size?: string; stock: number }[];
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
    variants: [
      { color: 'Midnight Black', size: 'M', stock: 40 },
      { color: 'Midnight Black', size: 'L', stock: 35 },
    ],
  },
  {
    id: 'prod-2',
    name: 'Sneakers Vortex',
    slug: 'sneakers-vortex',
    price: 590000,
    compareAtPrice: 699000,
    images: [{ imageUrl: '/products/sneakers-vortex.png' }],
    category: { name: 'Sepatu', slug: 'sepatu' },
    variants: [
      { color: 'Hitam Neon', size: '41', stock: 25 },
      { color: 'Putih Cyber', size: '42', stock: 15 },
    ],
  },
  {
    id: 'prod-3',
    name: 'Kaos Forge',
    slug: 'kaos-forge',
    price: 129000,
    compareAtPrice: 159000,
    images: [{ imageUrl: '/products/kaos-forge.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [
      { color: 'Hitam', size: 'L', stock: 50 },
      { color: 'Putih', size: 'L', stock: 30 },
    ],
  },
  {
    id: 'prod-4',
    name: 'Jaket Windbreaker',
    slug: 'jaket-windbreaker',
    price: 299000,
    compareAtPrice: 389000,
    images: [{ imageUrl: '/products/jaket-windbreaker.jpg' }],
    category: { name: 'Pakaian', slug: 'pakaian' },
    variants: [
      { color: 'Black Tactical', size: 'L', stock: 35 },
    ],
  },
  {
    id: 'prod-5',
    name: 'Tas Sling BBN',
    slug: 'tas-sling-bbn',
    price: 189000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/tas-sling.jpg' }],
    category: { name: 'Tas', slug: 'tas' },
    variants: [
      { color: 'Black', size: 'All Size', stock: 30 },
    ],
  },
  {
    id: 'prod-6',
    name: 'Topi Trucker',
    slug: 'topi-trucker',
    price: 99000,
    compareAtPrice: null,
    images: [{ imageUrl: '/products/topi-trucker.jpg' }],
    category: { name: 'Aksesoris', slug: 'aksesoris' },
    variants: [
      { color: 'Black/Grey', size: 'Adjustable', stock: 60 },
    ],
  },
];

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

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(fallbackCatalogProducts);
  const [loading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    const s = searchParams.get('search');
    if (s) params.set('search', s);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('maxPrice', String(maxPrice));
    params.set('limit', '16');

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        let prods = data.products;
        if (inStockOnly) {
          prods = prods.filter((p: any) => 
            p.variants && p.variants.length > 0 ? p.variants.some((v: any) => v.stock > 0) : true
          );
        }
        if (selectedColor) {
          prods = prods.filter((p: any) => 
            p.variants?.some((v: any) => v.color?.toLowerCase().includes(selectedColor.toLowerCase()))
          );
        }
        setProducts(prods);
      } else {
        // filter fallbacks
        let filtered = [...fallbackCatalogProducts];
        if (category) filtered = filtered.filter(p => p.category.slug === category);
        filtered = filtered.filter(p => p.price <= maxPrice);
        if (inStockOnly) {
          filtered = filtered.filter(p => p.variants?.some(v => v.stock > 0));
        }
        if (selectedColor) {
          filtered = filtered.filter(p => 
            p.variants?.some(v => v.color?.toLowerCase().includes(selectedColor.toLowerCase()))
          );
        }
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
  }, [category, sort, maxPrice, inStockOnly, selectedColor, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const hasActiveFilters = Boolean(category || maxPrice < 1000000 || !inStockOnly || selectedColor);

  const resetFilters = () => {
    setCategory('');
    setMaxPrice(1000000);
    setInStockOnly(true);
    setSelectedColor('');
  };

  // Reusable Filter Sections (for both Desktop Sidebar & Mobile Drawer)
  const FilterSectionContent = () => (
    <div className="space-y-7">
      
      {/* 1. Kategori (Ref: Screen 02 - Radio Buttons with glowing cyan/blue rings) */}
      <div className="space-y-3">
        <h3 className="font-black text-white text-sm tracking-tight">Kategori</h3>
        <div className="space-y-2">
          {categoryList.map((cat) => {
            const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.slug)}
                className="w-full flex items-center gap-3 text-left py-1 text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.6)]' 
                    : 'border-blue-500/40 bg-blue-950/20 group-hover:border-blue-400'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={`text-xs transition-colors ${isSelected ? 'text-white font-extrabold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Rentang Harga (Ref: Screen 02 - Clean Slider with Prices) */}
      <div className="space-y-3">
        <h3 className="font-black text-white text-sm tracking-tight">Rentang Harga</h3>
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>Rp 0</span>
          <span className="text-blue-400 font-extrabold">Rp {maxPrice.toLocaleString('id-ID')}</span>
        </div>
        <div className="pt-1">
          <input
            type="range"
            min="0"
            max="1000000"
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Tersedia (Ref: Screen 02 - Stok Tersedia Toggle) */}
      <div className="space-y-3">
        <h3 className="font-black text-white text-sm tracking-tight">Tersedia</h3>
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className="flex items-center gap-3 text-xs text-slate-300 hover:text-white transition-all cursor-pointer group"
        >
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
            inStockOnly 
              ? 'border-blue-500 bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
              : 'border-blue-500/40 bg-blue-950/20 group-hover:border-blue-400'
          }`}>
            {inStockOnly && <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />}
          </div>
          <span className={inStockOnly ? 'text-white font-extrabold' : 'text-slate-400 group-hover:text-slate-200'}>
            Stok tersedia
          </span>
        </button>
      </div>

      {/* 4. Warna (Ref: Screen 02 - Color Swatches) */}
      <div className="space-y-3">
        <h3 className="font-black text-white text-sm tracking-tight">Warna</h3>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {colorOptions.map((c) => {
            const isSelected = selectedColor === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedColor(isSelected ? '' : c.name)}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                  isSelected 
                    ? 'border-blue-400 scale-110 shadow-[0_0_12px_rgba(59,130,246,0.8)] ring-2 ring-blue-500/50' 
                    : 'border-slate-700/80 hover:scale-105 hover:border-slate-500'
                }`}
              >
                {isSelected && (
                  <Check className={`w-3.5 h-3.5 ${c.hex === '#ffffff' ? 'text-slate-900 stroke-[3]' : 'text-white stroke-[3]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 px-4 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span>Reset Semua Filter</span>
        </button>
      )}

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)] animate-fade-in-up">
      
      {/* ─── Screen 02 Grid Layout: Desktop Sidebar + Main Product Showcase Card ─── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ─── Desktop Sidebar Filter (Ref: Screen 02) ─── */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0 p-6 sm:p-7 rounded-3xl bg-[#0b1220] border border-slate-800/80 shadow-2xl">
          <FilterSectionContent />
        </aside>

        {/* ─── Main Product Showcase Card (Ref: Screen 02 & Screen 19) ─── */}
        <div className="flex-1 min-w-0 w-full space-y-6 bg-[#0b1220] rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
          
          {/* Header Row: Title, Subtitle & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Katalog <span className="bg-gradient-to-r from-blue-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Produk</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Temukan busana muslimah dan apparel pilihan terbaik.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-bold text-white hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Filter Lanjutan</span>
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
              </button>

              {/* Sort Dropdown (Ref: Screen 02 Pill) */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-9 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-bold text-white outline-none focus:border-blue-500 cursor-pointer shadow-sm hover:border-slate-700 transition-colors"
                >
                  <option value="newest">Urutkan: Terbaru</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-blue-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Horizontal Category Quick Filter (Ref: Screen 19 Mobile & Quick Tap on Desktop) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {categoryList.map((cat) => {
              const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/35 scale-[1.02]'
                      : 'bg-[#070b14] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Product Grid (Ref: Screen 02 - 3 Cols on desktop, 2 Cols on mobile) */}
          {loading ? (
            <div className="py-28 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs text-slate-400 font-semibold tracking-wide">Memuat katalog produk...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#070b14] rounded-2xl border border-slate-800/80 p-8 space-y-4">
              <p className="text-slate-300 font-bold text-sm">Tidak ada produk yang cocok dengan filter yang dipilih.</p>
              <p className="text-xs text-slate-500">Coba ubah rentang harga atau reset kategori pilihan Anda.</p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 pt-2">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ─── Mobile Slide-over Drawer for Advanced Filters (Ref: Screen 19) ─── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" 
            onClick={() => setShowMobileFilter(false)} 
          />
          
          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs bg-[#0b1220] h-full p-6 overflow-y-auto border-l border-slate-800 shadow-2xl flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <span>Filter Produk</span>
                </h2>
                <button 
                  onClick={() => setShowMobileFilter(false)}
                  className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Content */}
              <FilterSectionContent />
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
              >
                Terapkan Filter ({products.length} Produk)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-28 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        <p className="text-xs text-slate-400 font-semibold tracking-wide">Menyiapkan halaman...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
