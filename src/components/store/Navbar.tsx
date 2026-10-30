'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, Heart, User, Search, Menu, X, 
  ExternalLink, LogOut, Package, Grid, Home, Sparkles,
  Bell, HelpCircle, Globe, ShieldCheck, ChevronDown
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

  const trendingKeywords = [
    'Sneakers Vortex',
    'Hoodie BBN',
    'Kaos Forge',
    'Jaket Windbreaker',
    'Tas Sling',
    'Topi Trucker',
    'Smartwatch',
  ];

  return (
    <>
      {/* ─── 01. Shopee-Style Top Utility Bar (Micro Header) ────────────────── */}
      <div className="bg-[#04070f] border-b border-slate-800/80 text-[11px] text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Store Portal & Mall Guarantee */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>BBN Mall Official Store</span>
            </span>
            <span className="text-slate-700">|</span>
            <Link href="/products" className="hover:text-slate-200 transition-colors">
              Katalog Lengkap
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/promo" className="hover:text-slate-200 transition-colors flex items-center gap-1">
              <span className="text-rose-400 font-bold">Promo Spesial</span>
              <span className="px-1 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-400 font-black">HOT</span>
            </Link>
          </div>

          {/* Right: Quick Links ala Shopee (Notifikasi, Bantuan, Bahasa, Akun) */}
          <div className="flex items-center gap-4">
            <Link href="/orders" className="hover:text-slate-200 transition-colors flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Pesanan Saya</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/categories" className="hover:text-slate-200 transition-colors flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Bantuan</span>
            </Link>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Bahasa Indonesia</span>
            </span>

            {user ? (
              <>
                <span className="text-slate-700">|</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{user.name.split(' ')[0]}</span>
                </span>
              </>
            ) : (
              <>
                <span className="text-slate-700">|</span>
                <Link href="/register" className="font-bold text-white hover:text-blue-400 transition-colors">
                  Daftar
                </Link>
                <span className="text-slate-700">/</span>
                <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── 02. Shopee-Style Main Header ───────────────────────────────────── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* 1. Brand Logo with Shopee "Mall" Tag */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="BBn Digital Forge"
                className="w-10 h-10 rounded-2xl object-contain bg-slate-950 p-1 border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[8px] font-black px-1 py-0.2 rounded uppercase tracking-wider shadow-xs">
                Mall
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  BBn
                </span>
                <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/15 border border-blue-500/30 px-1.5 py-0.5 rounded">
                  OFFICIAL
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider hidden sm:inline uppercase">
                DIGITAL FORGE
              </span>
            </div>
          </Link>

          {/* 2. Shopee-Style Prominent Search Bar in Center */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Daftar & dapatkan voucher diskon s/d 70% | Cari produk di toko..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '100px' }}
                className="w-full h-11 rounded-2xl bg-[#0b1220] border border-slate-700/80 focus:border-blue-500 focus:bg-[#0f172a] text-xs sm:text-sm font-medium text-white placeholder:text-slate-400 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

              <button
                type="submit"
                className="absolute right-1.5 h-8 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari</span>
              </button>
            </form>

            {/* Shopee Keyword Suggestions under Search Bar */}
            <div className="flex items-center gap-3 pt-1.5 text-[11px] text-slate-400 overflow-hidden whitespace-nowrap">
              {trendingKeywords.map((kw) => (
                <Link
                  key={kw}
                  href={`/products?search=${encodeURIComponent(kw)}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Shopee Action Icons: Wishlist, Shopping Cart & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className={`w-11 h-11 rounded-2xl bg-[#0e172a] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer ${
                pathname === '/wishlist' ? 'text-blue-400 border-blue-500/40 bg-slate-800' : ''
              }`}
              title="Wishlist Favorit"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Shopee Iconic Big Cart Icon with Badge */}
            <Link 
              href="/cart" 
              className={`w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-600/20 text-blue-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer ${
                pathname === '/cart' ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/40' : ''
              }`}
              title="Keranjang Belanja Shopee"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-rose-600/50 border border-[#070b14] animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 h-11 px-3 rounded-2xl border border-slate-800 hover:border-slate-700 bg-[#0e172a] transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold text-white hidden md:inline max-w-[90px] truncate">
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
                className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md shadow-blue-600/35 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <User className="w-4 h-4 stroke-[2]" />
                <span>Masuk</span>
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#070b14] border-b border-slate-800/90 p-4 space-y-3">
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

      {/* ─── Mobile Fixed Bottom Navigation Bar (Shopee Style) ──────────────── */}
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
          href="/promo" 
          className={`flex flex-col items-center gap-1 ${pathname === '/promo' ? 'text-rose-400 font-bold' : 'hover:text-rose-400'}`}
        >
          <Sparkles className="w-5 h-5 stroke-[1.75]" />
          <span>Promo</span>
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
          <span>{user ? 'Saya' : 'Masuk'}</span>
        </Link>
      </div>
    </>
  );
}
