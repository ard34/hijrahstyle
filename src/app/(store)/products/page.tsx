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
      
      {/* 1. Breadcrumbs (Matching Reference Image) */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#522880]">Beranda</Link>
        <span>&gt;</span>
        <Link href="/products" className="hover:text-[#522880]">Kategori</Link>
        {filters.category && (
          <>
            <span>&gt;</span>
            <span className="font-bold text-slate-900 capitalize">{activeCategoryName}</span>
          </>
        )}
      </nav>

      <div className="flex gap-10 items-start">
        
        {/* 2. Left Sidebar Filter (Exact Match with Reference Image) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 pr-4 pl-1">
          
          {/* Kategori List */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Kategori</h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${
                  !filters.category ? 'bg-[#F2EDFA] text-[#522880] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Semua Kategori
              </button>

              {[
                { name: 'Gamis', slug: 'gamis' },
                { name: 'Tunik', slug: 'tunik' },
                { name: 'Hijab', slug: 'hijab' },
                { name: 'Outerwear', slug: 'outerwear' },
                { name: 'Setelan', slug: 'setelan' },
                { name: 'Pria', slug: 'pria' },
                { name: 'Anak', slug: 'anak' },
                { name: 'Aksesoris', slug: 'aksesoris' },
              ].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    filters.category.toLowerCase() === cat.slug ? 'bg-[#F2EDFA] text-[#522880] font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Harga Radio List */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Harga</h3>
            <div className="space-y-2 text-xs font-medium text-slate-600">
              {[
                { label: '< Rp 100.000', min: '', max: '100000', val: 'lt100' },
                { label: 'Rp 100.000 - Rp 200.000', min: '100000', max: '200000', val: '100-200' },
                { label: 'Rp 200.000 - Rp 300.000', min: '200000', max: '300000', val: '200-300' },
                { label: '> Rp 300.000', min: '300000', max: '', val: 'gt300' },
              ].map((opt) => (
                <label key={opt.val} className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === opt.val}
                    onChange={() => handlePriceRangeSelect(opt.val, opt.min, opt.max)}
                    className="accent-[#522880]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Min & Max Price Input Box */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <input
                type="number"
                placeholder="Rp Min"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, priceRange: 'custom', page: 1 }))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#522880] placeholder:text-slate-400 bg-white"
              />
              <input
                type="number"
                placeholder="Rp Maks"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, priceRange: 'custom', page: 1 }))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#522880] placeholder:text-slate-400 bg-white"
              />
            </div>

            <button
              onClick={() => fetchProducts()}
              className="w-full py-2.5 bg-[#F2EDFA] hover:bg-[#E6DBF7] text-[#522880] text-xs font-bold rounded-xl transition-colors mt-2"
            >
              Terapkan
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Warna Color Swatches */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Warna</h3>
            <div className="flex items-center gap-2.5 flex-wrap">
              {[
                { name: 'Hitam', hex: '#1E1E1E' },
                { name: 'Terracotta', hex: '#D9531E' },
                { name: 'Kuning', hex: '#EAB308' },
                { name: 'Biru', hex: '#3B82F6' },
                { name: 'Ungu Slate', hex: '#7C3AED' },
                { name: 'Violet', hex: '#522880' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setFilters(prev => ({ ...prev, color: filters.color === c.name ? '' : c.name }))}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    filters.color === c.name ? 'border-slate-900 scale-110 shadow-xs' : 'border-white hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Ukuran Size Selectors */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Ukuran</h3>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFilters(prev => ({ ...prev, size: filters.size === sz ? '' : sz }))}
                  className={`w-9 h-9 rounded-lg border font-semibold flex items-center justify-center transition-colors ${
                    filters.size === sz ? 'bg-[#522880] text-white border-[#522880]' : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* 3. Right Product Area (3 Columns matching Reference Image) */}
        <main className="flex-1 space-y-6">
          
          {/* Header Title & Controls Bar */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
                {activeCategoryName}
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {pagination.total > 0 ? `${pagination.total} Produk` : '120 Produk'}
              </p>
            </div>

            {/* Filter Toggle & Sort Dropdown */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl flex items-center gap-2 shadow-2xs"
              >
                <Filter className="w-4 h-4 text-[#522880]" /> Filter
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#522880] shadow-2xs"
                >
                  <option value="newest">Urutkan: Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="best-selling">Terlaris</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid (3 Columns on Desktop) */}
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#522880] mx-auto" />
              <p className="text-xs text-slate-400 mt-2 font-medium">Memuat katalog produk...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <p className="font-bold text-slate-800 text-base mb-1">Produk Tidak Ditemukan</p>
              <p className="text-xs text-slate-500 mb-4">Coba sesuaikan kata kunci atau pilihan filter Anda.</p>
              <button
                onClick={() => setFilters({ search: '', category: '', sort: 'newest', priceRange: '', minPrice: '', maxPrice: '', color: '', size: '', page: 1 })}
                className="px-4 py-2 bg-[#522880] text-white rounded-xl text-xs font-semibold hover:bg-[#421D6B] transition-colors shadow-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#522880] mx-auto" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

