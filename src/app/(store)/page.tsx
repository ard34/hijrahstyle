import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { 
  ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard, 
  Star, ShoppingBag, Sparkles, ChevronRight, Award
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const [categories, newProducts, bestSellers, promoProducts] = await Promise.all([
    prisma.category.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: true,
        variants: { where: { status: 'ACTIVE' } },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: true,
        variants: { where: { status: 'ACTIVE' } },
        reviews: true,
      },
      orderBy: { totalSold: 'desc' },
      take: 4,
    }),
    prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        compareAtPrice: { not: null },
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: true,
        variants: { where: { status: 'ACTIVE' } },
        reviews: true,
      },
      take: 4,
    }),
  ]);

  return { categories, newProducts, bestSellers, promoProducts };
}

export default async function HomePage() {
  const { categories, newProducts, bestSellers, promoProducts } = await getHomeData();

  return (
    <div className="bg-white min-h-screen space-y-12 pb-20">
      
      {/* ─── 1. Hero Section (Exact Match with Reference Image) ──────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 pt-4">
        <div className="bg-[#F7F5F3] rounded-[32px] p-8 sm:p-12 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[420px] overflow-hidden">
          {/* Left Text */}
          <div className="max-w-xl flex flex-col justify-center gap-4 text-left">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#3B1B54] tracking-tight leading-[1.2]">
              Tampil Syar&apos;i <br />
              Anggun &amp; Percaya Diri
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
              Koleksi fashion islami pilihan untuk <br className="hidden sm:inline" />
              menemani setiap langkah berhijrahmu.
            </p>
            <div className="pt-4 flex">
              <Link
                href="/products"
                className="btn-primary !bg-[#522880] hover:!bg-[#421D6B] !text-white !h-12 !px-8 !text-sm !font-bold rounded-xl shadow-md transition-all shrink-0"
              >
                Belanja Sekarang
              </Link>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
                alt="HijrahStyle Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Category Circles Row (Exact Match with Reference Image) ───── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-9 gap-4 text-center">
          {[
            { 
              name: 'Gamis', 
              slug: 'gamis', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 2L9 7H15L12 2Z" /><path d="M9 7L4 22H20L15 7H9Z" /></svg> 
            },
            { 
              name: 'Tunik', 
              slug: 'tunik', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 4L12 2L18 4V9H6V4Z" /><path d="M6 9V20H18V9" /></svg> 
            },
            { 
              name: 'Hijab', 
              slug: 'hijab', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 3C8 3 5 6 5 10C5 14 8 21 12 21C16 21 19 14 19 10C19 6 16 3 12 3Z" /></svg> 
            },
            { 
              name: 'Outerwear', 
              slug: 'outerwear', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 4H10V20H4V4Z" /><path d="M14 4H20V20H14V4Z" /></svg> 
            },
            { 
              name: 'Setelan', 
              slug: 'setelan', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 4H20V11H4V4Z" /><path d="M7 11V20H17V11" /></svg> 
            },
            { 
              name: 'Pria', 
              slug: 'pria', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 4L12 2L18 4L16 10H8L6 4Z" /><path d="M8 10V20H16V10" /></svg> 
            },
            { 
              name: 'Anak', 
              slug: 'anak', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="8" r="4" /><path d="M6 20C6 16 9 14 12 14C15 14 18 16 18 20" /></svg> 
            },
            { 
              name: 'Aksesoris', 
              slug: 'aksesoris', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 8V5C9 3.5 10.5 2 12 2C13.5 2 15 3.5 15 5V8" /></svg> 
            },
            { 
              name: 'Lihat Semua', 
              slug: '', 
              svg: <svg className="w-6 h-6 text-[#522880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12H19" /><path d="M13 6L19 12L13 18" /></svg> 
            },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F5F2EF] group-hover:bg-[#EAE4E0] flex items-center justify-center transition-colors border border-[#EBE5E0]">
                {cat.svg}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-[#522880] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. Produk Terbaru Section ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Produk Terbaru</h2>
          <Link href="/products?sort=newest" className="text-xs font-bold text-[#522880] hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {newProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── 4. Produk Terlaris Section ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Produk Terlaris</h2>
          <Link href="/products?sort=best-selling" className="text-xs font-bold text-[#522880] hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {bestSellers.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── 5. Guarantees Bar ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 pt-6 border-t border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: '100% Original', desc: 'Garansi busana islami original & berkualitas' },
            { title: 'Pengiriman Cepat', desc: 'Proses kemas dan pengiriman kilat' },
            { title: 'Garansi Retur', desc: 'Mudah tukar ukuran & pengembalian' },
            { title: 'Dukungan 24/7', desc: 'Customer service siap melayani Anda' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-[#522880] flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
