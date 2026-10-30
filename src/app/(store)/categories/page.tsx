import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export const revalidate = 300; // Edge cached for instant response

const categoriesData = [
  {
    name: 'Pakaian',
    slug: 'pakaian',
    count: '120 Koleksi Busana',
    imageUrl: '/products/hoodie-bbn.jpg',
    colorTheme: 'from-rose-500/20 to-pink-500/5 hover:border-rose-500/50 hover:shadow-rose-500/20 text-rose-400',
    badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
  {
    name: 'Sepatu',
    slug: 'sepatu',
    count: '56 Koleksi Sepatu',
    imageUrl: '/products/sneakers-vortex.png',
    colorTheme: 'from-sky-500/20 to-blue-500/5 hover:border-sky-500/50 hover:shadow-sky-500/20 text-sky-400',
    badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  },
  {
    name: 'Aksesoris',
    slug: 'aksesoris',
    count: '42 Aksesoris Cantik',
    imageUrl: '/products/topi-trucker.jpg',
    colorTheme: 'from-amber-500/20 to-yellow-500/5 hover:border-amber-500/50 hover:shadow-amber-500/20 text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  {
    name: 'Tas',
    slug: 'tas',
    count: '30 Koleksi Tas',
    imageUrl: '/products/tas-sling.jpg',
    colorTheme: 'from-emerald-500/20 to-teal-500/5 hover:border-emerald-500/50 hover:shadow-emerald-500/20 text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    name: 'Elektronik',
    slug: 'elektronik',
    count: '25 Gadget & Smartwatch',
    imageUrl: '/products/smartwatch-forge-x.jpg',
    colorTheme: 'from-purple-500/20 to-indigo-500/5 hover:border-purple-500/50 hover:shadow-purple-500/20 text-purple-400',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  {
    name: 'Lainnya',
    slug: 'lainnya',
    count: '20 Koleksi Tambahan',
    imageUrl: '/products/tas-sling.jpg',
    colorTheme: 'from-orange-500/20 to-rose-500/5 hover:border-orange-500/50 hover:shadow-orange-500/20 text-orange-400',
    badgeColor: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 space-y-10 min-h-[calc(100vh-140px)] animate-fade-in-up">
      
      {/* ─── Vibrant Header Banner with Multi-Tone Mesh ─── */}
      <div className="relative rounded-[28px] bg-gradient-to-r from-[#070d1c] via-[#0d162d] to-[#091124] p-8 sm:p-12 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        
        {/* Glow ambient orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-3 max-w-md z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-rose-500/20 border border-white/10 text-xs font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Katalog Lengkap Pilihan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Kategori <span className="bg-gradient-to-r from-blue-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Produk</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Temukan busana muslimah, mukena, tas, dan aksesoris terbaik sesuai kebutuhan gaya Anda.
          </p>
        </div>

        {/* Ambient floating graphic */}
        <div className="relative w-48 h-36 flex items-center justify-center">
          <div className="w-36 h-36 bg-gradient-to-tr from-blue-600/30 to-rose-500/20 rounded-full blur-2xl animate-pulse-glow" />
          <img
            src="/hero-sneaker.png"
            alt="Kategori"
            className="relative w-40 h-40 object-contain drop-shadow-[0_10px_25px_rgba(0,102,255,0.6)] animate-float"
          />
        </div>
      </div>

      {/* ─── Grid: 6 Category Cards dengan Warna Warni Hidup & Animasi ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {categoriesData.map((cat, idx) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            prefetch={true}
            className={`group relative bg-gradient-to-b ${cat.colorTheme} bg-[#0b1220] rounded-2xl p-6 flex flex-col items-center justify-between gap-4 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-slate-800/90 overflow-hidden shadow-lg`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Top pill */}
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
              {cat.count}
            </span>

            {/* Centered Product Image */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center p-2 relative">
              <div className="absolute inset-2 bg-white/5 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500" />
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out relative z-10"
              />
            </div>

            {/* Category Name & Action */}
            <div className="space-y-1 w-full">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-blue-300 transition-colors flex items-center justify-center gap-1.5">
                <span>{cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400" />
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Lihat Semua Produk
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
