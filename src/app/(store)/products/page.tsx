'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2, Filter } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  totalSold: number;
  images: { url: string }[];
  category: { name: string; slug: string };
  reviews: { rating: number }[];
  variants: { stock: number }[];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    size: '',
    page: 1,
  });

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    params.set('page', String(filters.page));
    params.set('limit', '12');

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || prev.sort,
      page: 1,
    }));
  }, [searchParams]);

  const handlePriceRangeSelect = (range: string, min: string, max: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range,
      minPrice: min,
      maxPrice: max,
      page: 1
    }));
  };

  const activeCategoryName = filters.category
    ? categories.find(c => c.slug.toLowerCase() === filters.category.toLowerCase())?.name || filters.category
    : 'Semua Kategori';

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-4 pb-12 min-h-[calc(100vh-110px)]">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-blue-400">Beranda</Link>
        <span>&gt;</span>
        <Link href="/products" className="hover:text-blue-400">Katalog</Link>
        {filters.category && (
          <>
            <span>&gt;</span>
            <span className="font-bold text-white capitalize">{activeCategoryName}</span>
          </>
        )}
      </nav>

      <div className="flex gap-8 items-start">
        
        {/* 2. Left Sidebar Filter (Screen 02) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 p-5 rounded-2xl bg-[#0e172a] border border-slate-800/80 shadow-md">
          
          {/* Header Title */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" /> Filter Produk
            </span>
            {(filters.category || filters.minPrice || filters.maxPrice || filters.color) && (
              <button
                onClick={() => setFilters({ search: '', category: '', sort: 'newest', priceRange: '', minPrice: '', maxPrice: '', color: '', size: '', page: 1 })}
                className="text-[11px] text-blue-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Kategori List */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Kategori</h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  !filters.category ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>Semua Kategori</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                  className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    filters.category.toLowerCase() === cat.slug.toLowerCase() ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Rentang Harga Slider / Box */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Rentang Harga</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Rp Min"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, page: 1 }))}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-800 text-xs outline-none focus:border-blue-500 placeholder:text-slate-500 bg-[#070b14] text-white"
              />
              <input
                type="number"
                placeholder="Rp Maks"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, page: 1 }))}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-800 text-xs outline-none focus:border-blue-500 placeholder:text-slate-500 bg-[#070b14] text-white"
              />
            </div>

            <button
              onClick={() => fetchProducts()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Terapkan Harga
            </button>
          </div>

          <hr className="border-slate-800" />

          {/* Warna Color Swatches */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Warna</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: 'Hitam', hex: '#0f172a' },
                { name: 'Putih', hex: '#f8fafc' },
                { name: 'Biru', hex: '#2563eb' },
                { name: 'Navy', hex: '#1e3a8a' },
                { name: 'Kuning', hex: '#eab308' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setFilters(prev => ({ ...prev, color: filters.color === c.name ? '' : c.name }))}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    filters.color === c.name ? 'border-blue-400 scale-125 shadow-md' : 'border-slate-700 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* 3. Main Product Grid Area */}
        <div className="flex-1 min-w-0">
          
          {/* Section Header with Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Katalog Produk</h1>
              <p className="text-xs text-slate-400 mt-0.5">Temukan produk terbaik pilihan kami</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e172a] border border-slate-800 text-xs font-bold text-white"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>Filter</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                className="px-3 py-2 rounded-xl bg-[#0e172a] border border-slate-800 text-xs font-semibold text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="newest">Urutkan: Terbaru</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="best-selling">Terlaris</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs text-slate-400 mt-2">Memuat katalog produk...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-[#0e172a] border border-slate-800 p-8">
              <p className="text-slate-400 text-sm">Tidak ada produk yang sesuai dengan filter.</p>
              <button
                onClick={() => setFilters({ search: '', category: '', sort: 'newest', priceRange: '', minPrice: '', maxPrice: '', color: '', size: '', page: 1 })}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
    <Suspense fallback={
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

