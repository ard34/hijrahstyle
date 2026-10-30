import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Truck, ShieldCheck, Lock, RotateCcw,
  Shirt, Footprints, Glasses, Briefcase, Watch, LayoutGrid, Sparkles
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

export const revalidate = 60; // Cache on edge for 60 seconds (Instant navigation)

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
    name: 'Sneakers Vortex',
    title: 'Sneakers Vortex',
    slug: 'sneakers-vortex',
    price: 590000,
    compareAtPrice: 699000,
    images: [{ id: 'img-1', imageUrl: '/products/sneakers-vortex.png', sortOrder: 1 }],
    category: { id: 'cat-2', name: 'Sepatu', slug: 'sepatu' },
    variants: [{ id: 'v-1', stock: 45 }],
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
  },
  {
    id: 'prod-3',
    name: 'Kaos Forge',
    title: 'Kaos Forge',
    slug: 'kaos-forge',
    price: 129000,
    compareAtPrice: null,
    images: [{ id: 'img-3', imageUrl: '/products/kaos-forge.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-3', stock: 80 }],
  },
  {
    id: 'prod-4',
    name: 'Jaket Windbreaker',
    title: 'Jaket Windbreaker',
    slug: 'jaket-windbreaker',
    price: 299000,
    compareAtPrice: 389000,
    images: [{ id: 'img-4', imageUrl: '/products/jaket-windbreaker.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-4', stock: 35 }],
  },
  {
    id: 'prod-5',
    name: 'Tas Sling BBN',
    title: 'Tas Sling BBN',
    slug: 'tas-sling-bbn',
    price: 189000,
    compareAtPrice: null,
    images: [{ id: 'img-5', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    variants: [{ id: 'v-5', stock: 50 }],
  },
  {
    id: 'prod-6',
    name: 'Topi Trucker',
    title: 'Topi Trucker',
    slug: 'topi-trucker',
    price: 99000,
    compareAtPrice: null,
    images: [{ id: 'img-6', imageUrl: '/products/topi-trucker.jpg', sortOrder: 1 }],
    category: { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris' },
    variants: [{ id: 'v-6', stock: 40 }],
  },
];

async function getHomeData() {
  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { sortOrder: 'asc' },
        take: 6,
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          category: true,
          variants: { where: { status: 'ACTIVE' } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);

    return { 
      categories: categories.length > 0 ? categories : fallbackCategories, 
      products: products.length > 0 ? products : fallbackProducts, 
    };
  } catch (error) {
    return {
      categories: fallbackCategories,
      products: fallbackProducts,
    };
  }
}

export default async function HomePage() {
  const { categories, products } = await getHomeData();

  // Multi-Tone Vibrant Category Palette
  const getCatStyle = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'pakaian': 
        return {
          icon: <Shirt className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />,
          badge: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
          hoverBorder: 'hover:border-rose-500/60 hover:shadow-rose-500/20'
        };
      case 'sepatu': 
        return {
          icon: <Footprints className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />,
          badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
          hoverBorder: 'hover:border-sky-500/60 hover:shadow-sky-500/20'
        };
      case 'aksesoris': 
        return {
          icon: <Glasses className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />,
          badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
          hoverBorder: 'hover:border-amber-500/60 hover:shadow-amber-500/20'
        };
      case 'tas': 
        return {
          icon: <Briefcase className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />,
          badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
          hoverBorder: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20'
        };
      case 'elektronik': 
        return {
          icon: <Watch className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />,
          badge: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
          hoverBorder: 'hover:border-purple-500/60 hover:shadow-purple-500/20'
        };
      default: 
        return {
          icon: <LayoutGrid className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />,
          badge: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
          hoverBorder: 'hover:border-indigo-500/60 hover:shadow-indigo-500/20'
        };
    }
  };

  return (
    <div className="min-h-screen pb-16 space-y-12 sm:space-y-16 animate-fade-in-up">

      {/* ─── Hero Section Multi-Tone Vibrant Aurora ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="relative rounded-[32px] bg-gradient-to-br from-[#080e1e] via-[#0d172e] to-[#0a1122] text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.22)] flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Vibrant Aurora Orbs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 bg-rose-500/18 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-16 left-1/3 w-72 h-72 bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />

          {/* Left Headline Content */}
          <div className="relative z-10 max-w-xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 via-rose-500/20 to-amber-500/20 border border-white/15 text-white text-xs font-bold tracking-wide backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="bg-gradient-to-r from-blue-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                Koleksi Spesial Busana Muslimah &amp; Apparel
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Tampil Anggun <br />
              <span className="bg-gradient-to-r from-blue-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                dalam Balutan Kesantunan
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg">
              Koleksi mukena eksklusif, gamis elegan, dan busana modern dengan kualitas butik pilihan, harga bersahabat, dan pengiriman kilat dari Kota Serang.
            </p>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/products"
                prefetch={true}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:from-blue-500 hover:via-indigo-500 hover:to-rose-500 text-white text-sm sm:text-base font-black shadow-[0_6px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_8px_30px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/promo"
                prefetch={true}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#0e172a] hover:bg-[#131f38] border border-rose-500/30 text-rose-300 hover:text-white text-sm font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
              >
                <span>🔥 Promo Spesial</span>
              </Link>
            </div>
          </div>

          {/* Right Floating Visual with Animated Glow & Floating Motion */}
          <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-72 sm:w-80 md:w-96 aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-rose-500/20 to-amber-400/20 rounded-full blur-3xl animate-pulse-glow" />
              <img
                src="/hero-sneaker.png"
                alt="Busana Modern HijrahStyle"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,102,255,0.6)] animate-float"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─── Multi-Color Vibrant 4 Value Highlight Cards ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { 
              icon: ShieldCheck, 
              title: '100% Original', 
              desc: 'Kualitas butik terjamin',
              color: 'text-sky-400',
              bgColor: 'bg-sky-500/10 border-sky-500/30',
              glow: 'hover:border-sky-500/50 hover:shadow-sky-500/15'
            },
            { 
              icon: Truck, 
              title: 'Pengiriman Kilat', 
              desc: 'Langsung dari Kota Serang',
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-500/10 border-emerald-500/30',
              glow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/15'
            },
            { 
              icon: Lock, 
              title: 'Pembayaran Aman', 
              desc: 'Transfer Bank & QRIS',
              color: 'text-amber-400',
              bgColor: 'bg-amber-500/10 border-amber-500/30',
              glow: 'hover:border-amber-500/50 hover:shadow-amber-500/15'
            },
            { 
              icon: RotateCcw, 
              title: 'Garansi Kepuasan', 
              desc: 'Layanan retur transparan',
              color: 'text-rose-400',
              bgColor: 'bg-rose-500/10 border-rose-500/30',
              glow: 'hover:border-rose-500/50 hover:shadow-rose-500/15'
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl bg-[#0b1220] border border-slate-800/80 flex flex-col items-center text-center gap-2.5 shadow-md ${item.glow} transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className={`w-11 h-11 rounded-xl ${item.bgColor} border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-xs`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Kategori Populer dengan Warna Warni Hidup ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Kategori Pilihan
            </h2>
            <p className="text-xs text-slate-400 font-medium">Temukan koleksi favorit sesuai kebutuhan gaya Anda</p>
          </div>
          <Link 
            href="/categories" 
            prefetch={true}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Semua Kategori</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const style = getCatStyle(cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                prefetch={true}
                className={`p-4 sm:p-5 rounded-2xl bg-[#0b1220] border border-slate-800 ${style.hoverBorder} hover:bg-[#0e172a] transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group shadow-md hover:-translate-y-1.5`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner transition-all duration-300 ${style.badge}`}>
                  {style.icon}
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Shopee Signature REKOMENDASI Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="bg-gradient-to-r from-[#0b1220] via-[#101b33] to-[#0b1220] rounded-2xl border border-slate-800/80 p-1 shadow-lg">
          <div className="border-b-4 border-rose-500 py-3.5 text-center flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 bg-clip-text text-transparent font-black text-base sm:text-lg tracking-widest uppercase inline-block">
              REKOMENDASI UNTUK ANDA
            </h2>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
        </div>

        {/* Spacious Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4.5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Lihat Lebih Banyak CTA */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            prefetch={true}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#0b1220] hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-slate-800 hover:border-transparent text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <span>Lihat Semua Produk di Katalog</span>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
          </Link>
        </div>
      </section>

    </div>
  );
}
