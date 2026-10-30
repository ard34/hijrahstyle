import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard, 
  Sparkles, ChevronRight, Flame, Shirt, Footprints, Glasses, 
  Briefcase, Watch, LayoutGrid 
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const [categories, products, promoProducts] = await Promise.all([
    prisma.category.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
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

  return { categories, products, promoProducts };
}

export default async function HomePage() {
  const { categories, products, promoProducts } = await getHomeData();

  // Category Icon Mapper matching Mockup 01
  const getCatIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'pakaian': return <Shirt className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'sepatu': return <Footprints className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'aksesoris': return <Glasses className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'tas': return <Briefcase className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'elektronik': return <Watch className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />;
      default: return <LayoutGrid className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <div className="min-h-screen space-y-12 pb-20">
      
      {/* ─── 01. Flagship Cyber Hero Banner (Screen 01) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0a1122] via-[#0d1730] to-[#070b14] text-white p-6 sm:p-10 md:p-12 overflow-hidden border border-slate-800/90 shadow-2xl min-h-[440px] flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Ambient Cyber Neon Glow */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Left Text Content */}
          <div className="relative z-10 max-w-lg space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> BBN DIGITAL FORGE • OFFICIAL
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Style Modern
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 leading-tight">
                Untuk Setiap Aktivitas
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Produk berkualitas, harga terbaik, dan pengiriman cepat ke seluruh Indonesia. Transaksi otomatis via Duitku Gateway.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/promo"
                className="px-5 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-700/80 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lihat Promo</span>
              </Link>
            </div>
          </div>

          {/* Right Floating Sneaker Visual */}
          <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-72 sm:w-88 md:w-96 aspect-square flex items-center justify-center">
              {/* Radial Glow Disc */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 to-cyan-400/20 blur-2xl animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
                alt="Sneakers Vortex BBN Edition"
                className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500 rotate-[-12deg]"
              />
              <div className="absolute -bottom-2 px-4 py-1.5 rounded-full bg-[#0b1120]/90 border border-blue-500/40 text-[11px] font-bold text-white shadow-xl backdrop-blur-md">
                Sneakers Vortex BBN Edition
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 02. Trust Badges Row (Screen 01) ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: ShieldCheck, title: '100% Original', desc: 'Garansi Keaslian' },
            { icon: Truck, title: 'Pengiriman Cepat', desc: 'Resi Otomatis' },
            { icon: CreditCard, title: 'Pembayaran Aman Duitku', desc: 'VA, QRIS & E-Wallet' },
            { icon: RefreshCw, title: 'Garansi Retur', desc: '7 Hari Pengembalian' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-3.5 sm:p-4 rounded-2xl bg-[#0e172a] border border-slate-800/80 shadow-md flex items-center gap-3 hover:border-blue-500/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{item.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 03. Kategori Populer (Screen 01 & 10) ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Kategori Populer
            </h2>
            <p className="text-xs text-slate-400">Pilih kategori produk favorit Anda</p>
          </div>
          <Link href="/categories" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-4 rounded-2xl bg-[#0e172a] border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#111c33] transition-all text-center flex flex-col items-center justify-center gap-2.5 group shadow-sm hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                {getCatIcon(cat.slug)}
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate max-w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 04. Flash Sale / Promo Banner (Screen 11) ─────────────────────── */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-[#0d1730] to-[#070b14] p-6 sm:p-8 border border-blue-900/40 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-600 text-white shadow-xs">
                  <Flame className="w-3.5 h-3.5 fill-current" /> FLASH SALE 70%
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Penawaran Spesial Hari Ini</h2>
                <p className="text-xs text-slate-400">Koleksi terbatas dengan harga diskon khusus</p>
              </div>

              <Link
                href="/promo"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30"
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

      {/* ─── 05. Katalog Produk Pilihan (Screen 01 & 02) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              Katalog Produk Pilihan
            </h2>
            <p className="text-xs text-slate-400">Temukan koleksi pakaian, sepatu, dan aksesoris terbaik</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
            <span>Lihat Semua Produk</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
