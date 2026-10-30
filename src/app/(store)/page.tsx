import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Truck, ShieldCheck, RotateCcw, CreditCard, 
  Sparkles, ChevronRight, Flame, Shirt, Footprints, Glasses, 
  Briefcase, Watch, LayoutGrid, Zap, Tag, Gift, Award
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import FlashSaleTimer from '@/components/store/FlashSaleTimer';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const fallbackCategories = [
  { id: 'cat-1', name: 'Pakaian', slug: 'pakaian', sortOrder: 1 },
  { id: 'cat-2', name: 'Sepatu', slug: 'sepatu', sortOrder: 2 },
  { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris', sortOrder: 3 },
  { id: 'cat-4', name: 'Tas', slug: 'tas', sortOrder: 4 },
  { id: 'cat-5', name: 'Elektronik', slug: 'elektronik', sortOrder: 5 },
  { id: 'cat-6', name: 'Lainnya', slug: 'lainnya', sortOrder: 6 },
];

const fallbackProducts = [
  {
    id: 'prod-1',
    name: 'Sneakers Vortex BBN Edition',
    title: 'Sneakers Vortex BBN Edition',
    slug: 'sneakers-vortex',
    price: 599000,
    compareAtPrice: 699000,
    images: [{ id: 'img-1', imageUrl: '/products/sneakers-vortex.png', sortOrder: 1 }],
    category: { id: 'cat-2', name: 'Sepatu', slug: 'sepatu' },
    variants: [{ id: 'v-1', stock: 45 }],
    reviews: [{ id: 'r-1', rating: 5 }, { id: 'r-2', rating: 5 }],
  },
  {
    id: 'prod-2',
    name: 'Hoodie BBN Premium',
    title: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    price: 249000,
    compareAtPrice: 299000,
    images: [{ id: 'img-2', imageUrl: '/products/hoodie-bbn.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-2', stock: 60 }],
    reviews: [{ id: 'r-3', rating: 4.9 }],
  },
  {
    id: 'prod-3',
    name: 'Kaos Forge Cyber Edition',
    title: 'Kaos Forge Cyber Edition',
    slug: 'kaos-forge',
    price: 129000,
    compareAtPrice: 159000,
    images: [{ id: 'img-3', imageUrl: '/products/kaos-forge.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-3', stock: 80 }],
    reviews: [{ id: 'r-4', rating: 4.9 }],
  },
  {
    id: 'prod-4',
    name: 'Jaket Windbreaker Tactical',
    title: 'Jaket Windbreaker Tactical',
    slug: 'jaket-windbreaker',
    price: 299000,
    compareAtPrice: 389000,
    images: [{ id: 'img-4', imageUrl: '/products/jaket-windbreaker.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-4', stock: 35 }],
    reviews: [{ id: 'r-5', rating: 4.9 }],
  },
  {
    id: 'prod-5',
    name: 'Tas Sling BBN Utility',
    title: 'Tas Sling BBN Utility',
    slug: 'tas-sling-bbn',
    price: 189000,
    compareAtPrice: 239000,
    images: [{ id: 'img-5', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    variants: [{ id: 'v-5', stock: 50 }],
    reviews: [{ id: 'r-6', rating: 4.8 }],
  },
  {
    id: 'prod-6',
    name: 'Topi Trucker Forge Cyber',
    title: 'Topi Trucker Forge Cyber',
    slug: 'topi-trucker',
    price: 99000,
    compareAtPrice: 129000,
    images: [{ id: 'img-6', imageUrl: '/products/topi-trucker.jpg', sortOrder: 1 }],
    category: { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris' },
    variants: [{ id: 'v-6', stock: 40 }],
    reviews: [{ id: 'r-7', rating: 4.7 }],
  },
  {
    id: 'prod-7',
    name: 'Smartwatch Forge X Futuristic',
    title: 'Smartwatch Forge X Futuristic',
    slug: 'smartwatch-forge-x',
    price: 899000,
    compareAtPrice: 1199000,
    images: [{ id: 'img-7', imageUrl: '/products/smartwatch-forge-x.jpg', sortOrder: 1 }],
    category: { id: 'cat-5', name: 'Elektronik', slug: 'elektronik' },
    variants: [{ id: 'v-7', stock: 25 }],
    reviews: [{ id: 'r-8', rating: 5.0 }],
  },
  {
    id: 'prod-8',
    name: 'Backpack Cyber BBN Waterproof',
    title: 'Backpack Cyber BBN Waterproof',
    slug: 'backpack-cyber-bbn',
    price: 349000,
    compareAtPrice: 429000,
    images: [{ id: 'img-8', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    variants: [{ id: 'v-8', stock: 30 }],
    reviews: [{ id: 'r-9', rating: 4.9 }],
  },
];

async function getHomeData() {
  try {
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

    return { 
      categories: categories.length > 0 ? categories : fallbackCategories, 
      products: products.length > 0 ? products : fallbackProducts, 
      promoProducts: promoProducts.length > 0 ? promoProducts : fallbackProducts.slice(0, 4) 
    };
  } catch (error) {
    console.warn('Database offline or unreachable, using fallback Toko Sample BBN catalog data:', error);
    return {
      categories: fallbackCategories,
      products: fallbackProducts,
      promoProducts: fallbackProducts.slice(0, 4),
    };
  }
}

export default async function HomePage() {
  const { categories, products, promoProducts } = await getHomeData();

  // Category Icon Mapper
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

  // Shopee Quick Features Bar
  const shopeeQuickFeatures = [
    { label: 'Flash Sale', href: '/promo', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'BBN Mall', href: '/products', icon: Award, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
    { label: 'Gratis Ongkir', href: '/promo', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Semua Promo', href: '/promo', icon: Tag, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { label: 'Pakaian', href: '/products?category=pakaian', icon: Shirt, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
    { label: 'Sepatu', href: '/products?category=sepatu', icon: Footprints, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { label: 'Tas & Sling', href: '/products?category=tas', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    { label: 'Voucher 50RB', href: '/promo', icon: Gift, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  ];

  return (
    <div className="min-h-screen pb-16 space-y-10 sm:space-y-12 overflow-hidden">
      
      {/* ─── 01. Shopee Top Hero Area (Main Banner + 2 Right Mini Banners) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Hero Banner (Span 8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#090e1d] to-[#04060c] text-white p-6 sm:p-10 overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.18)] min-h-[380px] sm:min-h-[420px] flex flex-col sm:flex-row items-center justify-between gap-8">
            {/* Ambient Cyber Neon Glow */}
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

            {/* Left Content */}
            <div className="relative z-10 max-w-md space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>BBN MALL • OFFICIAL STORE</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Style Modern
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 leading-tight">
                  Untuk Setiap Aktivitas
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Koleksi eksklusif Toko Sample BBN. Garansi 100% original, pengiriman kilat, dan transaksi instan via Sandbox Duitku.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Belanja Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/promo"
                  className="px-5 py-3.5 rounded-2xl bg-[#0e172a] hover:bg-slate-800 text-slate-100 hover:text-white text-xs sm:text-sm font-bold border border-slate-700/80 transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Lihat Promo</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Sneaker */}
            <div className="relative z-10 w-full sm:w-1/2 flex items-center justify-center">
              <div className="relative w-64 sm:w-72 md:w-80 aspect-square flex items-center justify-center">
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-600/40 via-cyan-400/25 to-transparent blur-3xl animate-pulse" />
                <img
                  src="/hero-sneaker.png"
                  alt="Sneakers Vortex BBN Edition"
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(37,99,235,0.7)] hover:scale-105 transition-transform duration-500 rotate-[-8deg]"
                />
                <div className="absolute -bottom-1 z-20 px-3.5 py-1.5 rounded-2xl bg-[#0b1220]/95 border border-blue-500/40 text-[11px] font-black text-white shadow-xl backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Sneakers Vortex • BBN Edition</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shopee Right Stacked Mini Banners (Span 4 cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* Mini Banner 1: Flash Sale Drop */}
            <Link 
              href="/promo"
              className="flex-1 p-6 rounded-3xl bg-gradient-to-br from-[#1a0f2e] via-[#120b22] to-[#070b14] border border-rose-500/30 hover:border-rose-500/60 shadow-lg transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider inline-block">
                  🔥 Flash Sale
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-rose-400 transition-colors">
                  Diskon Hingga 70%
                </h3>
                <p className="text-xs text-slate-300">Gunakan kode voucher DISKON50K</p>
              </div>

              <div className="pt-4 flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Serbu Sekarang</span> &rarr;
                </span>
                <span className="text-2xl">⚡</span>
              </div>
            </Link>

            {/* Mini Banner 2: Gratis Ongkir Xtra */}
            <Link 
              href="/products"
              className="flex-1 p-6 rounded-3xl bg-gradient-to-br from-[#0c221a] via-[#091712] to-[#070b14] border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider inline-block">
                  🚚 Gratis Ongkir
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  Xtra Seluruh Indonesia
                </h3>
                <p className="text-xs text-slate-300">Tanpa minimal belanja via Duitku</p>
              </div>

              <div className="pt-4 flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Lihat Katalog</span> &rarr;
                </span>
                <span className="text-2xl">📦</span>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* ─── 02. Shopee Circular Quick-Access Icons Bar (8 Fitur Utama) ─────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0e172a] border border-slate-800 shadow-xl overflow-x-auto no-scrollbar">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-6 min-w-[560px] sm:min-w-0">
            {shopeeQuickFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={feat.label}
                  href={feat.href}
                  className="flex flex-col items-center text-center gap-2 group cursor-pointer"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${feat.bg} border flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg shadow-sm`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    {feat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 03. Shopee Flash Sale with Fire Flame Stock Progress Bars ───────── */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0b1220] p-6 sm:p-8 border border-slate-800/90 shadow-2xl relative overflow-hidden">
            
            {/* Shopee Flash Sale Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/40">
                    <Flame className="w-5 h-5 fill-current animate-pulse" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight uppercase">
                    FLASH SALE
                  </span>
                </div>

                {/* Shopee Countdown Clock Blocks */}
                <FlashSaleTimer />
              </div>

              <Link
                href="/promo"
                className="text-xs sm:text-sm font-extrabold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Shopee Flash Sale Cards with Flame Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {promoProducts.map((product, idx) => {
                const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
                const discount = hasDiscount && product.compareAtPrice ? getDiscountPercentage(product.compareAtPrice, product.price) : 25;
                const imageUrl = product.images?.[0]?.imageUrl || '/hero-sneaker.png';
                const soldPercents = [85, 92, 78, 64];
                const currentSoldPercent = soldPercents[idx % soldPercents.length];

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group bg-[#0e172a] rounded-2xl border border-slate-800 hover:border-rose-500/50 p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-rose-500/10"
                  >
                    <div>
                      {/* Image with Shopee Badges */}
                      <div className="relative aspect-square rounded-xl bg-[#070b14] overflow-hidden p-2.5 mb-3 border border-slate-800">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top-Left: Mall */}
                        <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm uppercase">
                          Mall
                        </span>

                        {/* Top-Right: Shopee Yellow Ribbon */}
                        <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[11px] px-1.5 py-0.5 text-center font-sans shadow-md rounded-bl-lg">
                          <span className="block leading-none text-rose-600 font-black text-[11px]">-{discount}%</span>
                          <span className="block text-[8px] font-black text-slate-900 uppercase">OFF</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>

                      {/* Price Row */}
                      <div className="pt-1.5 flex items-baseline gap-2">
                        <span className="text-sm sm:text-base font-black text-rose-500">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && product.compareAtPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shopee Signature Flame Progress Bar */}
                    <div className="mt-3">
                      <div className="relative w-full h-4 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60 shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-full transition-all duration-1000"
                          style={{ width: `${currentSoldPercent}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white tracking-wider uppercase drop-shadow-sm flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-amber-300 text-amber-300 animate-pulse" />
                          <span>SEGERA HABIS</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── 04. Shopee Category Grid (KATEGORI) ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>KATEGORI</span>
            </h2>
            <Link 
              href="/categories" 
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="p-4 rounded-2xl bg-[#070b14] border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#0c1427] transition-all text-center flex flex-col items-center justify-center gap-2.5 group shadow-sm hover:scale-105"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  {getCatIcon(cat.slug)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors block truncate max-w-full">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Koleksi Resmi
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 05. Shopee "REKOMENDASI" Tab & Product Grid ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Shopee Rekomendasi Tab */}
        <div className="mb-6 pb-2 border-b-2 border-blue-600 inline-block">
          <h2 className="text-base sm:text-lg font-black text-blue-400 tracking-wider uppercase flex items-center gap-2">
            <span>REKOMENDASI</span>
          </h2>
        </div>

        {/* 4-Column Grid with Shopee Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Shopee Bottom "Lihat Lebih Banyak" Button */}
        <div className="text-center pt-10">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0e172a] hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-800 hover:border-blue-500 font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Lihat Semua Produk Rekomendasi</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
