import Link from 'next/link';

export const dynamic = 'force-dynamic';

const categoriesData = [
  {
    name: 'Pakaian',
    slug: 'pakaian',
    count: '120 produk',
    imageUrl: '/products/hoodie-bbn.jpg',
  },
  {
    name: 'Sepatu',
    slug: 'sepatu',
    count: '56 produk',
    imageUrl: '/products/sneakers-vortex.png',
  },
  {
    name: 'Aksesoris',
    slug: 'aksesoris',
    count: '42 produk',
    imageUrl: '/products/topi-trucker.jpg',
  },
  {
    name: 'Tas',
    slug: 'tas',
    count: '30 produk',
    imageUrl: '/products/tas-sling.jpg',
  },
  {
    name: 'Elektronik',
    slug: 'elektronik',
    count: '25 produk',
    imageUrl: '/products/smartwatch-forge-x.jpg',
  },
  {
    name: 'Lainnya',
    slug: 'lainnya',
    count: '20 produk',
    imageUrl: '/products/tas-sling.jpg',
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-140px)]">
      
      {/* ─── Screen 10 Header Banner ─── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#060c1a] via-[#0b1429] to-[#040814] p-8 sm:p-12 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 max-w-md z-10">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Kategori Produk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Temukan produk sesuai kebutuhan Anda.
          </p>
        </div>

        {/* Ambient portal lights */}
        <div className="relative w-48 h-32 flex items-center justify-center">
          <div className="w-36 h-36 bg-blue-600/30 rounded-full blur-2xl animate-pulse" />
          <img
            src="/hero-sneaker.png"
            alt=""
            className="relative w-40 h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,102,255,0.6)] rotate-[-12deg]"
          />
        </div>
      </div>

      {/* ─── Screen 10 Grid: 6 Category Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {categoriesData.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group bg-[#f8fafc] dark:bg-[#f1f5f9] rounded-2xl p-6 flex flex-col items-center justify-between gap-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20 border border-slate-200"
          >
            {/* Centered Product Image */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center p-2">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Category Name & Count (Screen 10) */}
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {cat.count}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
