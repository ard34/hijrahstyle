import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { 
  ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard, 
  Star, ShoppingBag, Sparkles, ChevronRight, Award, Flame, Tag, Layers
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
      take: 10,
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
      take: 5,
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
    <div className="min-h-screen space-y-12 pb-24">
      
      {/* ─── 1. Modern Flagship Hero Banner ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 md:p-14 overflow-hidden border border-slate-800/80 shadow-2xl min-h-[460px] flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="relative z-10 max-w-xl space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Toko Sample BBN • Official Store
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Belanja Modern &amp; Berkualitas Tinggi.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md">
              Koleksi produk pilihan dengan jaminan 100% original, transaksi instan terverifikasi otomatis via <strong>Duitku Sandbox</strong>, dan pengiriman kilat.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Mulai Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/products?sort=promo"
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lihat Promo Spesial</span>
              </Link>
            </div>

            {/* Quick Guarantees Pill */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Original
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <CreditCard className="w-4 h-4 text-blue-400" /> Duitku Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-amber-400" /> Pengiriman Kilat
              </span>
            </div>
          </div>

          {/* Right Visual Banner Showcase */}
          <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
                alt="Toko Sample BBN Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Floating Feature Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Produk Pilihan</p>
                  <p className="text-xs font-bold text-white">Koleksi Terpopuler &amp; Terbaik</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9/5
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. Kategori Pilihan (Interactive Grid) ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Kategori Pilihan
            </h2>
            <p className="text-xs text-slate-500 font-medium">Temukan produk berdasarkan kategori kebutuhan Anda</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500/40 hover:bg-blue-50/30 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100/60 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate max-w-full">
                {cat.name}
              </span>
            </Link>
          ))}
          <Link
            href="/products"
            className="p-3 sm:p-4 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold truncate max-w-full">
              Semua
            </span>
          </Link>
        </div>
      </section>

      {/* ─── 3. Flash Sale / Promo Banner Highlight ──────────────────────── */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-500 text-white">
                  <Flame className="w-3.5 h-3.5 fill-current" /> FLASH PROMO
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Penawaran Spesial Terbatas</h2>
                <p className="text-xs text-blue-100">Dapatkan harga hemat spesial untuk produk-produk terbaik kami</p>
              </div>

              <Link
                href="/products?sort=promo"
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-bold text-xs transition-colors shrink-0 shadow-xs"
              >
                Lihat Semua Promo &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 4. Produk Terbaru Section ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Produk Terbaru
            </h2>
            <p className="text-xs text-slate-500 font-medium">Koleksi produk yang baru saja mendarat di toko kami</p>
          </div>
          <Link href="/products?sort=newest" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {newProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── 5. Produk Terlaris Section ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Produk Terlaris
            </h2>
            <p className="text-xs text-slate-500 font-medium">Pilihan favorit pelanggan dengan ulasan terbaik</p>
          </div>
          <Link href="/products?sort=best-selling" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── 6. Trust Highlights Bar ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: '100% Produk Original',
              desc: 'Garansi produk asli dan berkualitas terbaik dari Toko Sample BBN.',
              color: 'text-blue-600 bg-blue-50',
            },
            {
              icon: CreditCard,
              title: 'Pembayaran Duitku',
              desc: 'Transaksi instan otomatis via Virtual Account, QRIS, & e-Wallet.',
              color: 'text-indigo-600 bg-indigo-50',
            },
            {
              icon: Truck,
              title: 'Pengiriman Terlacak',
              desc: 'Bekerja sama dengan kurir terpercaya dan nomor resi otomatis.',
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              icon: RefreshCw,
              title: 'Layanan Responsif',
              desc: 'Customer support yang siap membantu keluhan & pertanyaan Anda.',
              color: 'text-amber-600 bg-amber-50',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
