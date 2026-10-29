'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, CreditCard, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/90 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* 1. Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Toko Sample BBN"
                className="w-10 h-10 rounded-xl object-contain bg-slate-950 p-1 border border-blue-500/30 shadow-md shadow-blue-500/20"
              />
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">Toko Sample BBN</h3>
                <p className="text-xs text-blue-400 font-semibold">Official Digital Store</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Platform e-commerce modern terpercaya dengan jaminan 100% produk berkualitas, sistem checkout cepat, dan pembayaran otomatis via Duitku Gateway.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Terverifikasi &amp; Bergaransi
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm tracking-tight uppercase tracking-wider text-slate-400">
              Belanja &amp; Kategori
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Semua Produk', href: '/products' },
                { label: 'Produk Terbaru', href: '/products?sort=newest' },
                { label: 'Promo Spesial', href: '/products?sort=promo' },
                { label: 'Produk Terlaris', href: '/products?sort=best-selling' },
                { label: 'Daftar Wishlist', href: '/products?filter=wishlist' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 text-[10px]">&rsaquo;</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Bantuan & Panduan */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm tracking-tight uppercase tracking-wider text-slate-400">
              Bantuan Pelanggan
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                'Panduan Cara Belanja',
                'Metode Pembayaran Duitku',
                'Status & Lacak Pengiriman',
                'Kebijakan Retur & Garansi',
                'Syarat & Ketentuan',
              ].map((item) => (
                <li key={item}>
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="text-blue-500 text-[10px]">&rsaquo;</span>
                    <span>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Kontak & Pembayaran */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-white text-sm tracking-tight uppercase tracking-wider text-slate-400">
              Kontak &amp; Dukungan
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@tokosamplebbn.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Didukung Pembayaran Duitku:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata', 'QRIS'].map((bank) => (
                  <span key={bank} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                    {bank}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Toko Sample BBN. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Ketentuan Layanan</span>
            <span>•</span>
            <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
              Admin <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
