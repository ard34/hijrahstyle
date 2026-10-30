import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Shirt, Footprints, Glasses, Briefcase, Watch, LayoutGrid, 
  ArrowRight, Sparkles 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { status: 'ACTIVE' },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { sortOrder: 'asc' },
  });

  const getCatIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'pakaian': return <Shirt className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'sepatu': return <Footprints className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'aksesoris': return <Glasses className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'tas': return <Briefcase className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'elektronik': return <Watch className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />;
      default: return <LayoutGrid className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 min-h-[calc(100vh-140px)]">
      
      {/* Hero Showcase (Screen 10) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0a1122] via-[#0d1730] to-[#070b14] p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" /> BBN Digital Forge
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Kategori Produk
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Temukan produk sesuai kebutuhan Anda, mulai dari pakaian streetwear, sneakers performa, tas technical, hingga aksesoris esensial.
          </p>
        </div>

        <div className="relative w-full md:w-80 h-44 rounded-2xl overflow-hidden border border-slate-800 bg-[#070b14] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
            alt="Kategori BBN"
            className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Edisi Eksklusif 2026</span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 rounded-full">Explore</span>
          </div>
        </div>
      </div>

      {/* 6 Category Cards Grid (Screen 10) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group p-6 rounded-3xl bg-[#0e172a] border border-slate-800 hover:border-blue-500/50 hover:bg-[#111c33] transition-all flex flex-col items-center text-center justify-between gap-4 shadow-xl hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:-translate-y-1"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#070b14] border border-slate-800 flex items-center justify-center group-hover:border-blue-500/40 transition-colors shadow-inner">
              {getCatIcon(cat.slug)}
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                {cat._count?.products || 0} produk
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/15 group-hover:bg-blue-600 group-hover:text-white text-blue-400 border border-blue-500/30 text-xs sm:text-sm font-bold transition-all shadow-xs">
              <span>Buka Katalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}

