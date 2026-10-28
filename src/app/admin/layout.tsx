'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, ShoppingCart, 
  Users, Ticket, FileText, LogOut, Menu, X, ChevronRight, ExternalLink, Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Katalog Produk' },
  { href: '/admin/categories', icon: Tag, label: 'Kategori' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Pesanan Customer' },
  { href: '/admin/customers', icon: Users, label: 'Pelanggan' },
  { href: '/admin/vouchers', icon: Ticket, label: 'Voucher Promo' },
  { href: '/admin/reports', icon: FileText, label: 'Laporan Penjualan' },
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
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router, setUser]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const currentNav = navItems.find(i => pathname?.startsWith(i.href));

  return (
    <div className="min-h-screen bg-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 flex flex-col justify-between border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-purple-600/30">
                H
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block leading-none">HijrahStyle</span>
                <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest block mt-1">Admin Panel</span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/admin/dashboard');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-200" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@hijrahstyle.id'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link 
              href="/" 
              target="_blank" 
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              <ExternalLink className="w-3 h-3" /> Toko
            </Link>

            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20"
            >
              <LogOut className="w-3 h-3" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="admin-main-wrapper min-h-screen flex flex-col">
        
        {/* Top Sticky Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Admin /</span>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {currentNav?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>HijrahStyle Control Center</span>
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="p-6 sm:p-10 lg:p-12 w-full flex-1 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

