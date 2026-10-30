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
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050811] text-slate-300 border-t border-slate-800/80 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Glow backdrop subtle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Screen 20 Top Section: Mengapa Belanja di Toko Sample BBN? */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Mengapa Belanja di Toko Sample BBN?
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Kepercayaan dan kepuasan pelanggan adalah prioritas utama setiap layanan kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b1220] border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Produk Original</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  100% Produk Original resmi langsung dari produsen terverifikasi.
                </p>
              </div>
            </div>

            <div className="bg-[#0b1220] border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Bebas Ongkir</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Gratis ongkir &amp; subsidi pengiriman kilat ke seluruh Indonesia.
                </p>
              </div>
            </div>

            <div className="bg-[#0b1220] border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Pembayaran Aman</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Transaksi terenkripsi &amp; verifikasi otomatis via Sandbox Duitku.
                </p>
              </div>
            </div>

            <div className="bg-[#0b1220] border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Garansi Retur</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Jaminan tukar ukuran / garansi pengembalian dana dalam 7 hari.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Screen 20 Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Toko Sample BBN"
                className="w-10 h-10 rounded-xl object-contain bg-slate-950 p-1 border border-blue-500/40 shadow-lg shadow-blue-500/20"
              />
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">Toko Sample BBN</h3>
                <p className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">BBn DIGITAL FORGE</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Toko Sample BBN adalah platform e-commerce resmi dengan produk apparel, footwear &amp; aksesoris berdesain modern mutakhir, dilengkapi integrasi checkout instan Duitku.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" title="Twitter / X">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" title="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 3: Menu */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase text-slate-400">
              Menu
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Produk', href: '/products' },
                { label: 'Kategori', href: '/categories' },
                { label: 'Promo Spesial', href: '/promo' },
                { label: 'Wishlist Favorit', href: '/wishlist' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 text-[10px]">&rsaquo;</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Bantuan */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase text-slate-400">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                'Cara Belanja',
                'FAQ & Jawaban',
                'Pengiriman & Kurir',
                'Pengembalian / Retur',
                'Syarat & Ketentuan',
              ].map((item) => (
                <li key={item}>
                  <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="text-blue-500 text-[10px]">&rsaquo;</span>
                    <span>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Kontak */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase text-slate-400">
              Kontak
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Jl. Ciwaru Raya No. 42, Serang, Banten 42117</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@tokosamplebbn.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Screen 20 Bottom: Payment Channel Icons & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-[11px] font-semibold text-slate-400 mr-2">Didukung Oleh:</span>
            {['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata', 'QRIS', 'Duitku Gateway'].map((channel) => (
              <span 
                key={channel} 
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300"
              >
                {channel}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <p>© {new Date().getFullYear()} Toko Sample BBN — BBn DIGITAL FORGE. All rights reserved.</p>
            <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
              Admin <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
