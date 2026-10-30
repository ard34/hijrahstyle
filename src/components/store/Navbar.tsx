'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, Heart, User, Search, Menu, X, 
  ExternalLink, LogOut, Package, Grid, Home, Sparkles,
  ChevronDown
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

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/products' },
    { label: 'Kategori', href: '/categories' },
    { label: 'Promo', href: '/promo' },
    { label: 'Tentang', href: '/profile' },
    { label: 'Kontak', href: '/#footer' },
  ];

  return (
    <>
      {/* ─── Screen 01 Header Bar ─── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* 1. Cyber Logo (Ref: Screen 01) */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-[#0b1220] border border-blue-500/40 p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.35)] group-hover:scale-105 transition-transform">
                  <img
                    src="/logo.png"
                    alt="BBN Digital Forge"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-wider font-sans group-hover:text-blue-400 transition-colors">
                    GBN
                  </span>
                  <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    FORGE
                  </span>
                </div>
              </div>
            </Link>

            {/* 2. Centered Search Bar (Ref: Screen 01) */}
            <div className="flex-1 max-w-xl hidden md:block">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '44px', paddingRight: '48px' }}
                  className="w-full h-10 rounded-full bg-[#0b1220] border border-slate-700/70 focus:border-blue-500 focus:bg-[#0f172a] text-xs sm:text-sm font-medium text-white placeholder:text-slate-400 outline-none transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

                <button
                  type="submit"
                  className="absolute right-1.5 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-600/30"
                  title="Cari"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* 3. Action Icons: Wishlist, Shopping Bag & User Profile (Ref: Screen 01) */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                className={`w-10 h-10 rounded-full bg-[#0e172a] border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer ${
                  pathname === '/wishlist' ? 'text-blue-400 border-blue-500/50 bg-slate-800' : ''
                }`}
                title="Wishlist Favorit"
              >
                <Heart className="w-4 h-4" />
              </Link>

              {/* Shopping Bag (Cart with counter badge) */}
              <Link 
                href="/cart" 
                className={`w-10 h-10 rounded-full bg-[#0e172a] border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer ${
                  pathname === '/cart' ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/40' : ''
                }`}
                title="Keranjang Belanja"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg border border-[#070b14]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 h-10 px-3 rounded-full border border-slate-800 hover:border-slate-700 bg-[#0e172a] transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-bold text-white hidden sm:inline max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                  className="w-10 h-10 rounded-full bg-[#0e172a] border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="Masuk ke Akun"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 4. Sub-Navigation Links Row (Ref: Screen 01: Beranda | Produk | Kategori | Promo | Tentang | Kontak) */}
          <nav className="hidden md:flex items-center gap-8 pt-3 mt-2 border-t border-slate-800/60 text-xs font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-all hover:text-blue-400 relative py-1 ${
                    isActive
                      ? 'text-blue-400 font-bold shadow-[0_1px_0_0_#3b82f6]'
                      : 'text-slate-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#070b14] border-b border-slate-800/90 p-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '16px' }}
                  className="w-full h-10 rounded-xl bg-[#0b1220] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1 text-xs font-semibold text-slate-300">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="py-2.5 px-3 rounded-lg hover:bg-slate-800 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-slate-800 hover:text-white"
              >
                Wishlist
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Screen 19 Mobile Responsive Bottom Navigation Bar ─── */}
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
          <span>Produk</span>
        </Link>
        <Link 
          href="/cart" 
          className={`flex flex-col items-center gap-1 relative ${pathname === '/cart' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span>Keranjang</span>
        </Link>
        <Link 
          href={user ? '/profile' : '/login'} 
          className={`flex flex-col items-center gap-1 ${pathname === '/profile' || pathname === '/login' ? 'text-blue-400 font-bold' : 'hover:text-blue-400'}`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span>{user ? 'Akun' : 'Masuk'}</span>
        </Link>
      </div>
    </>
  );
}
