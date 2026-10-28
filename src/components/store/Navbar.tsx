'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ShoppingBag, Heart, User, Menu, X, 
  LogOut, Package, Sparkles, Home, Grid
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
      <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-xs">
        {/* 1. Main Top Header */}
        <div className="border-b border-slate-100 py-3.5 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 flex items-center justify-between gap-6">
            
            {/* Logo with 8-pointed star icon */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-[#522880] text-white flex items-center justify-center font-bold text-base shadow-xs">
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-[#3B1B54] tracking-tight font-sans">
                HijrahStyle
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Cari produk, kategori, atau brand"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 rounded-full bg-white border border-slate-200 focus:border-[#522880] text-xs font-normal text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
                />
                <button type="submit" className="absolute right-3.5 text-slate-400 hover:text-[#522880]">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Action Icons with labels underneath */}
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Wishlist */}
              <Link href="/products?filter=wishlist" className="hidden sm:flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#522880] transition-colors">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                <span className="text-[11px] font-medium text-slate-600">Wishlist</span>
              </Link>

              {/* Keranjang */}
              <Link href="/cart" className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#522880] transition-colors relative">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#522880] text-white text-[10px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">Keranjang</span>
              </Link>

              {/* Akun */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#522880] transition-colors"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                    <span className="text-[11px] font-medium text-slate-600 max-w-[70px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                        <div className="px-3.5 py-2 border-b border-slate-100">
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium">
                          <User className="w-4 h-4 text-slate-500" /> Profil Saya
                        </Link>
                        <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium">
                          <Package className="w-4 h-4 text-slate-500" /> Pesanan Saya
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link href="/admin/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-2 text-[#522880] bg-purple-50/60 font-semibold border-t border-slate-100 mt-1">
                            <Sparkles className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 w-full text-left font-medium">
                            <LogOut className="w-4 h-4" /> Keluar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#522880] transition-colors">
                  <User className="w-5 h-5 stroke-[1.5]" />
                  <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">Akun</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1 text-slate-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Solid Purple Category Bar */}
        <div className="bg-[#522880] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
            <nav className="flex items-center gap-8 text-xs font-medium h-10">
              <Link href="/" className={`px-3 py-1 rounded-md transition-colors ${pathname === '/' ? 'bg-[#421D6B] font-bold text-white' : 'hover:text-purple-200'}`}>Beranda</Link>
              <Link href="/products" className={`px-3 py-1 rounded-md transition-colors ${pathname === '/products' ? 'bg-[#421D6B] font-bold text-white' : 'hover:text-purple-200'}`}>Kategori</Link>
              <Link href="/products?sort=newest" className="hover:text-purple-200 transition-colors">Produk Terbaru</Link>
              <Link href="/products?sort=promo" className="hover:text-purple-200 transition-colors">Promo</Link>
              <Link href="/products?category=HijrahStyle-Corner" className="hover:text-purple-200 transition-colors">HijrahStyle Corner</Link>
            </nav>
          </div>
        </div>

        {/* Mobile Search Header Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 rounded-lg bg-slate-100 border border-slate-200 text-xs outline-none"
                />
                <button type="submit" className="absolute right-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Beranda</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Kategori</Link>
              <Link href="/products?sort=newest" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Produk Terbaru</Link>
              <Link href="/products?sort=promo" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Promo</Link>
              <Link href="/products?category=HijrahStyle-Corner" onClick={() => setIsMobileMenuOpen(false)} className="py-2">HijrahStyle Corner</Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. Mobile Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 py-2 px-4 shadow-lg flex items-center justify-around text-[10px] font-medium text-slate-600">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-[#522880] font-bold' : 'hover:text-[#522880]'}`}
        >
          <Home className="w-5 h-5 stroke-[1.5]" />
          <span>Beranda</span>
        </Link>
        <Link 
          href="/products" 
          className={`flex flex-col items-center gap-1 ${pathname === '/products' ? 'text-[#522880] font-bold' : 'hover:text-[#522880]'}`}
        >
          <Grid className="w-5 h-5 stroke-[1.5]" />
          <span>Kategori</span>
        </Link>
        <Link 
          href="/products?filter=wishlist" 
          className={`flex flex-col items-center gap-1 ${pathname?.includes('wishlist') ? 'text-[#522880] font-bold' : 'hover:text-[#522880]'}`}
        >
          <Heart className="w-5 h-5 stroke-[1.5]" />
          <span>Wishlist</span>
        </Link>
        <Link 
          href="/cart" 
          className={`flex flex-col items-center gap-1 relative ${pathname === '/cart' ? 'text-[#522880] font-bold' : 'hover:text-[#522880]'}`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-1 rounded-full bg-[#522880] text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Keranjang</span>
        </Link>
        <Link 
          href={user ? "/profile" : "/login"} 
          className={`flex flex-col items-center gap-1 ${pathname === '/profile' || pathname === '/login' ? 'text-[#522880] font-bold' : 'hover:text-[#522880]'}`}
        >
          <User className="w-5 h-5 stroke-[1.5]" />
          <span>{user ? 'Profil' : 'Masuk'}</span>
        </Link>
      </div>
    </>
  );
}
