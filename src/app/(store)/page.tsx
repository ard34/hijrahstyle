import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Truck, ShieldCheck, Lock, RotateCcw,
  Shirt, Footprints, Glasses, Briefcase, Watch, LayoutGrid
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

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

  const getCatIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'pakaian': return <Shirt className="w-6 h-6 text-cyan-400" />;
      case 'sepatu': return <Footprints className="w-6 h-6 text-cyan-400" />;
      case 'aksesoris': return <Glasses className="w-6 h-6 text-cyan-400" />;
      case 'tas': return <Briefcase className="w-6 h-6 text-cyan-400" />;
      case 'elektronik': return <Watch className="w-6 h-6 text-cyan-400" />;
      default: return <LayoutGrid className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen pb-16 space-y-12 sm:space-y-16">

      {/* ─── Screen 01 Hero Section: Style Modern Untuk Setiap Aktivitas ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#060c1a] via-[#091329] to-[#040814] text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.25)] flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Cyber Neon Glow Portals */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute right-1/4 top-1/4 w-60 h-60 border-2 border-blue-500/20 rounded-3xl rotate-12 pointer-events-none" />
          <div className="absolute right-16 bottom-10 w-44 h-44 border border-cyan-400/20 rounded-3xl -rotate-6 pointer-events-none" />

          {/* Left Headline Content (Screen 01) */}
          <div className="relative z-10 max-w-xl space-y-5 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Style Modern <br />
              <span className="text-white">Untuk Setiap Aktivitas</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg">
              Produk berkualitas, harga terbaik, dan pengiriman cepat ke seluruh Indonesia.
            </p>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-black shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Floating Sneaker Visual (Screen 01) */}
          <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-72 sm:w-80 md:w-96 aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
              <img
                src="/hero-sneaker.png"
                alt="Sneakers Modern BBN"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,102,255,0.7)] hover:scale-105 transition-transform duration-500 rotate-[-10deg]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─── Screen 01 Value Proposition Bar: 4 Highlight Points ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: ShieldCheck, title: '100% Original' },
            { icon: Truck, title: 'Pengiriman Cepat' },
            { icon: Lock, title: 'Pembayaran Aman Duitku' },
            { icon: RotateCcw, title: 'Garansi Retur' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#0b1220] border border-slate-800/80 flex flex-col items-center text-center gap-2.5 shadow-md hover:border-blue-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Screen 01 Section: Kategori Populer ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Kategori Populer
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-5 rounded-2xl bg-[#0b1220] border border-slate-800 hover:border-blue-500 hover:bg-[#0f172a] transition-all flex flex-col items-center justify-center gap-3 text-center group shadow-md hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-[#070b14] border border-slate-800 group-hover:border-cyan-400/50 flex items-center justify-center transition-colors shadow-inner">
                {getCatIcon(cat.slug)}
              </div>
              <span className="text-xs font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Screen 01 / 02 Product Catalog Grid ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Katalog Pilihan
          </h2>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
