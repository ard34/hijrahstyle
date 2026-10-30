'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  RotateCcw, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050811] text-slate-300 border-t border-slate-800/80 pt-20 pb-28 md:pb-16 mt-24 relative overflow-hidden">
      {/* Subtle Blue Cyber Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-36 bg-blue-600/10 blur-[110px] pointer-events-none" />

      {/* Main Container with Generous Side Padding */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 relative">
        
        {/* ─── Screen 20 Feature Highlights: Mengapa Belanja di Toko Sample BBN? ─── */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Keunggulan Layanan Kami
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mengapa Belanja di Toko Sample BBN?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Kepercayaan, kualitas produk original berstandar tinggi, dan kepuasan pelanggan adalah komitmen utama kami di setiap pesanan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: '100% Produk Original',
                desc: 'Jaminan keaslian resmi langsung dari produsen terverifikasi tanpa perantara.',
              },
              {
                icon: Truck,
                title: 'Bebas Ongkir & Cepat',
                desc: 'Subsidi ongkir serta pengiriman kilat terlacak ke seluruh wilayah Indonesia.',
              },
              {
                icon: Lock,
                title: 'Pembayaran Aman Duitku',
                desc: 'Transaksi instan terenkripsi dengan verifikasi otomatis 24 jam nonstop.',
              },
              {
                icon: RotateCcw,
                title: 'Garansi Retur 7 Hari',
                desc: 'Jaminan kemudahan tukar ukuran atau pengembalian dana penuh tanpa ribet.',
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i}
                  className="bg-[#0b1220] border border-slate-800/90 hover:border-blue-500/40 rounded-3xl p-6 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Elegant Glowing Divider Between Features and Links ─── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-16 sm:my-20" />

        {/* ─── Screen 20 Main 4-Column Grid with Spacious Gap ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-slate-800/80">
          
          {/* Col 1: Brand Information (Span 5 cols) */}
          <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#070b14] border border-blue-500/40 p-1.5 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <img
                  src="/logo.png"
                  alt="Toko Sample BBN Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Toko Sample BBN</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="text-xs font-bold text-blue-400 tracking-wider uppercase mt-0.5">
                  BBn DIGITAL FORGE
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Platform e-commerce modern dengan kurasi produk apparel, footwear, dan aksesoris berkualitas premium. Nikmati transaksi instan yang aman dan terverifikasi secara otomatis melalui Sandbox Duitku.
            </p>

            {/* Social Media Links with Touch-Friendly Size */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ikuti Kami</p>
              <div className="flex items-center gap-3">
                {[
                  { 
                    name: 'Instagram', 
                    href: '#',
                    svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> 
                  },
                  { 
                    name: 'X (Twitter)', 
                    href: '#',
                    svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> 
                  },
                  { 
                    name: 'YouTube', 
                    href: '#',
                    svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> 
                  },
                  { 
                    name: 'GitHub', 
                    href: 'https://github.com/ard34/hijrahstyle',
                    svg: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/> 
                  },
                ].map((soc) => (
                  <a 
                    key={soc.name}
                    href={soc.href} 
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-2xl bg-[#0e172a] border border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/20 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm" 
                    title={soc.name}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      {soc.svg}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Navigasi Menu (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-extrabold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span>Menu</span>
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Katalog Produk', href: '/products' },
                { label: 'Kategori Produk', href: '/categories' },
                { label: 'Promo Spesial', href: '/promo' },
                { label: 'Wishlist Favorit', href: '/wishlist' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-all flex items-center gap-2 py-0.5 group cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Layanan Bantuan (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-extrabold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span>Bantuan</span>
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                { label: 'Cara Belanja', href: '/products' },
                { label: 'FAQ & Bantuan', href: '/categories' },
                { label: 'Pengiriman & Kurir', href: '/orders' },
                { label: 'Syarat & Ketentuan', href: '/promo' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="hover:text-white transition-all flex items-center gap-2 py-0.5 group cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Kontak & Lokasi (Span 3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="font-extrabold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span>Kontak</span>
            </h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">Jl. Ciwaru Raya No. 42, Serang, Banten 42117</span>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-mono text-slate-200 font-bold">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-blue-400 font-semibold">support@tokosamplebbn.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Screen 20 Bottom: Payment Channel Icons & Copyright ─── */}
        <div className="pt-10 flex flex-col xl:flex-row justify-between items-center gap-8 text-xs text-slate-500">
          <div className="flex items-center gap-3 flex-wrap justify-center xl:justify-start">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Didukung Oleh:</span>
            </span>
            {['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata', 'QRIS', 'Duitku Gateway'].map((channel) => (
              <span 
                key={channel} 
                className="px-3.5 py-1.5 rounded-xl bg-[#0e172a] border border-slate-800 text-xs font-bold text-slate-300 shadow-xs"
              >
                {channel}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400 text-xs sm:text-sm font-medium">
            <p>© {new Date().getFullYear()} Toko Sample BBN — BBn DIGITAL FORGE. All rights reserved.</p>
            <Link 
              href="/admin/dashboard" 
              className="px-3.5 py-2 rounded-xl bg-[#0e172a] hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-blue-400 hover:text-white font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Admin Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
