import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Truck, ShieldCheck, RotateCcw, CreditCard, 
  Sparkles, ChevronRight, Flame, Shirt, Footprints, Glasses, 
  Briefcase, Watch, LayoutGrid 
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import FlashSaleTimer from '@/components/store/FlashSaleTimer';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const [categories, products, promoProducts] = await Promise.all([
    prisma.category.findMany({
      where: { 
        status: 'ACTIVE',
        slug: { in: ['pakaian', 'sepatu', 'aksesoris', 'tas', 'elektronik', 'lainnya'] }
      },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { 
        status: 'ACTIVE',
        slug: { in: [
          'sneakers-vortex',
          'hoodie-bbn-premium',
          'kaos-forge',
          'jaket-windbreaker',
          'tas-sling-bbn',
          'topi-trucker',
          'smartwatch-forge-x',
          'backpack-cyber-bbn'
        ]}
      },
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
        slug: { in: ['sneakers-vortex', 'hoodie-bbn-premium', 'jaket-windbreaker', 'tas-sling-bbn'] }
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

  // Category Icon Mapper matching Mockup Screen 01 & 10
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
    <div className="min-h-screen pb-16 space-y-16 sm:space-y-20 overflow-hidden">
      
      {/* ─── 01. Flagship Cyber Hero Banner (Screen 01) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#090e1d] to-[#04060c] text-white p-8 sm:p-12 md:p-16 overflow-hidden border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.18)] min-h-[460px] flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Ambient Cyber Neon Glow Backgrounds */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

          {/* Left Text Content */}
          <div className="relative z-10 max-w-xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>BBN DIGITAL FORGE • OFFICIAL STORE</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Style Modern
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 leading-tight">
                Untuk Setiap Aktivitas
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-md">
              Produk berkualitas, harga terbaik, dan pengiriman cepat ke seluruh Indonesia. Transaksi otomatis &amp; instan via Sandbox Duitku.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/products"
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/promo"
                className="px-6 py-3.5 rounded-2xl bg-[#0b1220]/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-700/80 transition-all flex items-center gap-2 shadow-sm"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lihat Promo</span>
              </Link>
            </div>
          </div>

          {/* Right Floating Sneaker Visual (Seamless blend, no black box!) */}
          <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-72 sm:w-88 md:w-[420px] aspect-square flex items-center justify-center">
              {/* Radial Cyan-Blue Neon Disc */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-600/40 via-cyan-400/25 to-transparent blur-3xl animate-pulse" />
              
              {/* Ethereal Glow Ring */}
              <div className="absolute w-60 sm:w-72 h-60 sm:h-72 rounded-full border border-blue-500/25 border-dashed animate-[spin_25s_linear_infinite]" />

              {/* Sneaker with mix-blend-screen to remove black rectangular background */}
              <img
                src="/hero-sneaker.png"
                alt="Sneakers Vortex BBN Edition"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(37,99,235,0.7)] hover:scale-105 transition-transform duration-500 mix-blend-screen rotate-[-6deg]"
              />

              {/* Floating Pill Badge */}
              <div className="absolute -bottom-1 z-20 px-4 py-2 rounded-2xl bg-[#0b1220]/95 border border-blue-500/40 text-xs font-black text-white shadow-2xl backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Sneakers Vortex • BBN Edition</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 02. Trust Badges Row (Screen 01) ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {[
            { icon: ShieldCheck, title: '100% Original', desc: 'Garansi Keaslian Resmi' },
            { icon: Truck, title: 'Pengiriman Cepat', desc: 'Resi Otomatis JNE/SiCepat' },
            { icon: CreditCard, title: 'Pembayaran Aman', desc: 'Sandbox Duitku Terverifikasi' },
            { icon: RotateCcw, title: 'Garansi Retur', desc: '7 Hari Tukar Ukuran' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 sm:p-5 rounded-2xl bg-[#0b1220] border border-slate-800/80 shadow-md flex items-center gap-3.5 hover:border-blue-500/40 hover:bg-[#0e1628] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 03. Kategori Populer (Screen 01 & 10) ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Kategori Populer
            </h2>
            <p className="text-xs text-slate-400 mt-1">Pilih kategori produk favorit Anda</p>
          </div>
          <Link href="/categories" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Exactly 6 Categories in 1 Clean Row on Desktop (Screen 01) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-5 rounded-2xl bg-[#0e172a] border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#111c33] transition-all text-center flex flex-col items-center justify-center gap-3 group shadow-md hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                {getCatIcon(cat.slug)}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors block truncate max-w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Koleksi BBN
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 04. Flash Sale / Promo Banner (Screen 01 & 11) ─────────────────── */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-950/70 via-[#0d1730] to-[#070b14] p-6 sm:p-10 border border-blue-900/50 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black bg-rose-600 text-white shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-current" /> FLASH SALE HINGGA 70%
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Penawaran Spesial Hari Ini
                </h2>
                <p className="text-xs text-slate-400">Koleksi terbatas dengan harga diskon khusus</p>
              </div>

              {/* Live Ticking Countdown */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <FlashSaleTimer />
                <Link
                  href="/promo"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30 whitespace-nowrap"
                >
                  Lihat Semua Promo &rarr;
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 05. Katalog Produk Pilihan (Screen 01 & 02) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Katalog Produk Pilihan
            </h2>
            <p className="text-xs text-slate-400 mt-1">Temukan koleksi pakaian, sepatu, dan aksesoris terbaik</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
            <span>Lihat Semua Produk</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
