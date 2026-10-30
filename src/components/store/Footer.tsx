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
    <footer id="footer" className="bg-[#050811] text-slate-300 border-t border-slate-800/80 pt-16 pb-28 md:pb-12 mt-20 relative overflow-hidden">
      {/* Subtle Blue Cyber Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-32 bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
        
        {/* ─── Feature Highlights: Mengapa Belanja di HijrahStyle? ─── */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Mengapa Belanja di HijrahStyle?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Produk Original',
                desc: '100% asli & berkualitas butik',
              },
              {
                icon: Truck,
                title: 'Pengiriman Cepat',
                desc: 'Langsung dari Kota Serang',
              },
              {
                icon: Lock,
                title: 'Pembayaran Aman',
                desc: 'Metode pembayaran terpercaya',
              },
              {
                icon: RotateCcw,
                title: 'Garansi Retur',
                desc: 'Mudah jika barang tidak sesuai',
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i}
                  className="bg-[#0b1220] border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Main 4-Column Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Information (Span 5 cols) */}
          <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0b1220] border border-blue-500/40 p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <img
                  src="/logo.png"
                  alt="HijrahStyle Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white tracking-wider font-sans">HIJRAH</span>
                  <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    STYLE
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              HijrahStyle adalah butik busana muslimah, mukena, dan gamis modern berkualitas dari Kota Serang, Banten.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { 
                  name: 'Web', 
                  href: '#',
                  svg: <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> 
                },
                { 
                  name: 'Facebook', 
                  href: '#',
                  svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" /> 
                },
                { 
                  name: 'Instagram', 
                  href: '#',
                  svg: <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" /> 
                },
                { 
                  name: 'Twitter', 
                  href: '#',
                  svg: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="currentColor" /> 
                },
              ].map((soc, idx) => (
                <a 
                  key={idx}
                  href={soc.href} 
                  className="w-8 h-8 rounded-full bg-[#0e172a] border border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/20 text-slate-400 hover:text-white flex items-center justify-center transition-all shadow-xs" 
                  title={soc.name}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    {soc.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Menu (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-xs tracking-wider uppercase">
              Menu
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Produk', href: '/products' },
                { label: 'Promo', href: '/promo' },
                { label: 'Tentang Kami', href: '/about' },
                { label: 'Kontak', href: '#footer' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-blue-400 transition-colors block py-0.5 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Bantuan (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-xs tracking-wider uppercase">
              Bantuan
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {[
                { label: 'FAQ', href: '/categories' },
                { label: 'Cara Belanja', href: '/products' },
                { label: 'Pengiriman', href: '/orders' },
                { label: 'Pembayaran', href: '/orders' },
                { label: 'Kebijakan Retur', href: '/profile' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="hover:text-blue-400 transition-colors block py-0.5 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Kontak (Span 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs tracking-wider uppercase">
              Kontak
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Serang, Banten</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono">081234567890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>cs@hijrahstyle.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Bottom: Copyright & Admin Portal Link ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 HijrahStyle. All rights reserved.</p>
          <Link 
            href="/admin/dashboard" 
            className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 font-semibold"
          >
            <span>Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </footer>
  );
}
