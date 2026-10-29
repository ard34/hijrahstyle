'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ShoppingBag, Heart, User, Menu, X, 
  LogOut, Package, Sparkles, Home, Grid, ShieldCheck, Flame, ChevronDown
} from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCartStore();
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, [setUser]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const cartCount = totalItems();

  return (
    <>
      {/* ─── 0. Top Announcement Utility Bar ─────────────────────────────── */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              OFFICIAL
            </span>
            <span className="truncate">
              Selamat datang di <strong>Toko Sample BBN</strong> • Pembayaran otomatis terverifikasi via <strong>Duitku Sandbox</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px] shrink-0 font-medium">
            <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> 100% Produk Original
            </span>
            <span>•</span>
            <Link href="/admin/dashboard" className="text-slate-400 hover:text-blue-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 1. Main Sticky Header ────────────────────────────────────────── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Toko Sample BBN"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-slate-950 p-1 border border-blue-500/30 shadow-xs shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-sans block leading-none">
                Toko Sample BBN
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block mt-0.5">
                Official Digital Store
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari produk, kategori, atau promo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-12 rounded-full bg-slate-100/90 border border-slate-200/90 focus:border-blue-600 focus:bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 px-2.5 py-1 rounded-full bg-slate-900 text-white hover:bg-blue-600 text-[10px] font-bold transition-all shadow-2xs"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Wishlist */}
            <Link 
              href="/products?filter=wishlist" 
              className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all"
              title="Daftar Keinginan"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              <span className="text-xs font-semibold hidden lg:inline">Wishlist</span>
            </Link>

            {/* Cart Button */}
            <Link 
              href="/cart" 
              className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100/80 hover:bg-blue-50 text-slate-800 hover:text-blue-600 transition-all relative border border-slate-200/80"
              title="Keranjang Belanja"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">Keranjang</span>
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/80 hover:border-blue-400 bg-white transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <p className="text-xs font-bold text-slate-900 max-w-[90px] truncate">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400">Akun Saya</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-1 space-y-0.5">
                        <Link 
                          href="/profile" 
                          onClick={() => setIsUserMenuOpen(false)} 
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" /> Profil Saya
                        </Link>
                        <Link 
                          href="/orders" 
                          onClick={() => setIsUserMenuOpen(false)} 
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-500" /> Pesanan Saya
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link 
                            href="/admin/dashboard" 
                            onClick={() => setIsUserMenuOpen(false)} 
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-blue-700 bg-blue-50/70 font-bold hover:bg-blue-100 transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-blue-600" /> Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 w-full text-left font-semibold transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─── 2. Desktop Navigation Sub-bar ─────────────────────────────────── */}
        <div className="bg-slate-900 text-slate-200 hidden md:block border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            <nav className="flex items-center gap-1 text-xs font-semibold h-11">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Semua Produk', href: '/products' },
                { label: 'Produk Terbaru', href: '/products?sort=newest' },
                { label: 'Promo Spesial', href: '/products?sort=promo', highlight: true },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.highlight && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Duitku Payment Gateway Aktif</span>
            </div>
          </div>
        </div>

        {/* ─── Mobile Menu Drawer ────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Cari produk di Toko Sample BBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 border border-slate-200 text-xs outline-none focus:border-blue-600"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1 text-xs font-semibold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-100">Beranda</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-100">Semua Produk</Link>
              <Link href="/products?sort=newest" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-100">Produk Terbaru</Link>
              <Link href="/products?sort=promo" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-100 text-amber-600 font-bold">Promo Spesial</Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. Mobile Fixed Bottom Navigation Bar ────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 shadow-lg flex items-center justify-around text-[10px] font-semibold text-slate-600">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span>Beranda</span>
        </Link>
        <Link 
          href="/products" 
          className={`flex flex-col items-center gap-1 ${pathname === '/products' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
        >
          <Grid className="w-5 h-5 stroke-[1.75]" />
          <span>Katalog</span>
        </Link>
        <Link 
          href="/products?filter=wishlist" 
          className={`flex flex-col items-center gap-1 ${pathname?.includes('wishlist') ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
        >
          <Heart className="w-5 h-5 stroke-[1.75]" />
          <span>Wishlist</span>
        </Link>
        <Link 
          href="/cart" 
          className={`flex flex-col items-center gap-1 relative ${pathname === '/cart' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-3.5 h-3.5 px-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Keranjang</span>
        </Link>
        <Link 
          href={user ? "/profile" : "/login"} 
          className={`flex flex-col items-center gap-1 ${pathname === '/profile' || pathname === '/login' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span>{user ? 'Profil' : 'Masuk'}</span>
        </Link>
      </div>
    </>
  );
}
