'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary-950 to-black text-white mt-20">
      {/* Wave Divider */}
      <div className="relative -mt-20">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#3b0764"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg font-heading">H</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">HijrahStyle</h3>
                <p className="text-xs text-primary-300">Fashion Islami</p>
              </div>
            </div>
            <p className="text-sm text-primary-200 leading-relaxed mb-4">
              Belanja fashion Islami — Mudah, Aman & Terpercaya. Koleksi lengkap gamis, hijab, koko, dan aksesoris muslimah berkualitas.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-all duration-300">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Belanja</h4>
            <ul className="space-y-3">
              {[
                { label: 'Semua Produk', href: '/products' },
                { label: 'Kategori', href: '/products' },
                { label: 'Promo', href: '/products?sort=promo' },
                { label: 'Produk Baru', href: '/products?sort=newest' },
                { label: 'Terlaris', href: '/products?sort=best-selling' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-primary-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Bantuan</h4>
            <ul className="space-y-3">
              {[
                'Cara Belanja',
                'Pengiriman',
                'Pengembalian',
                'FAQ',
                'Hubungi Kami',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-primary-200 hover:text-white cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-200">+62 812-3456-7890</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-200">hello@hijrahstyle.id</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-200">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-300">
            © {new Date().getFullYear()} HijrahStyle. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-primary-400 hover:text-white cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span className="text-xs text-primary-400 hover:text-white cursor-pointer transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
