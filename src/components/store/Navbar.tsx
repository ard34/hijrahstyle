'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, Heart, User, Search, Menu, X, 
  ExternalLink, LogOut, Package, Grid, Home, Sparkles 
} from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCartStore();
  const { user, setUser } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydrate auth status
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [setUser]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
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
      {/* ─── Main Sticky Header (Screen 01) ─────────────────────────────────── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* 1. Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="BBn Digital Forge"
                className="w-9 h-9 rounded-xl object-contain bg-slate-950 p-1 border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-slate-950 rounded-full" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white tracking-tight font-sans">
                BBn
              </span>
              <span className="text-[11px] font-bold text-blue-400 tracking-wider hidden sm:inline uppercase">
                DIGITAL FORGE
              </span>
            </div>
          </Link>

          {/* 2. Desktop Nav Links (Screen 01) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold shrink-0">
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Produk', href: '/products' },
              { label: 'Kategori', href: '/categories' },
              { label: 'Promo', href: '/promo', badge: 'Hot' },
              { label: 'Wishlist', href: '/wishlist' },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-blue-600/20 border border-blue-500/40 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Search Bar (Clean Pill without overlapping text) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari produk di toko..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '16px' }}
                className="w-full h-10 rounded-full bg-[#0b1120] border border-slate-800 focus:border-blue-500 focus:bg-[#0f172a] text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
              />
            </div>
          </form>

          {/* 4. Action Icons (Screen 01) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className={`w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer ${
                pathname === '/wishlist' ? 'text-blue-400 border-blue-500/40 bg-slate-800' : ''
              }`}
              title="Wishlist Favorit"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Cart Button (Clean matching icon with badge counter) */}
            <Link 
              href="/cart" 
              className={`w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer ${
                pathname === '/cart' ? 'text-blue-400 border-blue-500/40 bg-slate-800' : ''
              }`}
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-blue-600/50 border border-[#070b14] animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 h-10 px-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold text-white hidden md:inline max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0e172a] border border-slate-800 p-2 shadow-2xl z-50 text-xs font-medium space-y-1">
                    <div className="p-2 border-b border-slate-800/80 mb-1">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      <span>Profil Saya</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <Package className="w-4 h-4 text-blue-400" />
                      <span>Pesanan Saya</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Panel Admin</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 h-10 px-4 sm:px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md shadow-blue-600/35 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <User className="w-4 h-4 stroke-[2]" />
                <span>Masuk</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#070b14] border-b border-slate-800/90 p-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Cari produk di toko..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '16px' }}
                  className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1 text-xs font-semibold text-slate-300">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-800 hover:text-white">Beranda</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-800 hover:text-white">Katalog Produk</Link>
              <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-800 hover:text-white">Kategori</Link>
              <Link href="/promo" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-800 text-rose-400 font-bold">Promo Spesial</Link>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-slate-800 hover:text-white">Wishlist</Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Mobile Fixed Bottom Navigation Bar (Screen 19) ────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-t border-slate-800/90 py-2.5 px-4 shadow-2xl flex items-center justify-around text-[10px] font-semibold text-slate-400">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span>Beranda</span>
        </Link>
        <Link 
          href="/products" 
          className={`flex flex-col items-center gap-1 ${pathname === '/products' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
        >
          <Grid className="w-5 h-5 stroke-[1.75]" />
          <span>Katalog</span>
        </Link>
        <Link 
          href="/categories" 
          className={`flex flex-col items-center gap-1 ${pathname === '/categories' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
        >
          <Sparkles className="w-5 h-5 stroke-[1.75]" />
          <span>Kategori</span>
        </Link>
        <Link 
          href="/cart" 
          className={`flex flex-col items-center gap-1 relative ${pathname === '/cart' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
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
          className={`flex flex-col items-center gap-1 ${pathname === '/profile' || pathname === '/login' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span>{user ? 'Akun' : 'Masuk'}</span>
        </Link>
      </div>
    </>
  );
}
