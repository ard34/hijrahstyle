'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, 
  Users, Ticket, FileText, Settings, X, ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Produk' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Pesanan' },
  { href: '/admin/vouchers', icon: Ticket, label: 'Voucher' },
  { href: '/admin/customers', icon: Users, label: 'Pelanggan' },
  { href: '/admin/reports', icon: FileText, label: 'Laporan' },
  { href: '/admin/inventory', icon: Settings, label: 'Pengaturan' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user?.role === 'ADMIN') {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [setUser]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* ─── Screen 14 Sidebar ─── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-60 bg-[#0b1220] text-slate-300 z-50 flex flex-col justify-between border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header (Screen 14: GBN Admin) */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#070b14] border border-blue-500/40 p-1 flex items-center justify-center shadow-md shadow-blue-500/20">
                <img
                  src="/logo.png"
                  alt="GBN Admin"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base tracking-tight">GBN</span>
                <span className="text-[11px] font-bold text-slate-400">Admin</span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Dashboard, Produk, Pesanan, Voucher, Pelanggan, Laporan, Pengaturan) */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/admin/dashboard');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t border-slate-800/80">
          <Link
            href="/"
            className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span>Kunjungi Toko</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-60 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
