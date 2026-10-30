'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, MapPin, Package, Heart, Ticket, MessageSquare, Settings, LogOut, ChevronRight, ShieldCheck, Check
} from 'lucide-react';
import { useAuthStore, useToastStore } from '@/lib/store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeMenu, setActiveMenu] = useState('Profil');
  const [name, setName] = useState('Riski Ardiansyah');
  const [email, setEmail] = useState('riski@example.com');
  const [phone, setPhone] = useState('081234567890');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setName(data.user.name || 'Riski Ardiansyah');
          setEmail(data.user.email || 'riski@example.com');
          setPhone(data.user.phone || '081234567890');
        }
      })
      .catch(() => {});
  }, [setUser]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Perubahan profil berhasil disimpan!', 'success');
    }, 400);
  };

  const menuItems = [
    { label: 'Profil', icon: User, href: '/profile' },
    { label: 'Alamat', icon: MapPin, href: '/checkout' },
    { label: 'Pesanan', icon: Package, href: '/orders' },
    { label: 'Wishlist', icon: Heart, href: '/wishlist' },
    { label: 'Voucher', icon: Ticket, href: '/promo' },
    { label: 'Ulasan', icon: MessageSquare, href: '/profile' },
    { label: 'Pengaturan', icon: Settings, href: '/profile' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 min-h-[calc(100vh-140px)] space-y-6">
      
      {/* ─── Breadcrumb ─── */}
      <nav className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-400 transition-colors">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold">Akun &amp; Profil</span>
      </nav>

      {/* ─── Page Header Title ─── */}
      <div className="pb-4 border-b border-slate-800/90 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Profil Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola informasi akun pelanggan butik HijrahStyle Anda
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Akun Terverifikasi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
        
        {/* ─── Left Sidebar Menu: Akun Saya (Span 4 cols) ─── */}
        <aside className="md:col-span-4 bg-[#0b1220] rounded-2xl border border-slate-800/90 p-5 space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-800">
            Menu Akun
          </h2>

          <div className="space-y-1.5 text-xs sm:text-sm font-semibold">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveMenu(item.label);
                    if (item.href !== '/profile') router.push(item.href);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left pt-3 border-t border-slate-800 mt-2"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ─── Right Content: Form Data Profil (Span 8 cols, Dark Theme) ─── */}
        <div className="md:col-span-8">
          <div className="bg-[#0b1220] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white">
            
            {/* Avatar & Identitas Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800/80">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/20 shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">{name}</h3>
                <p className="text-xs text-slate-400 font-medium">{email}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-blue-400 text-[10px] font-extrabold uppercase tracking-wide">
                  Customer HijrahStyle
                </span>
              </div>
            </div>

            {/* Form Fields dengan Dark Style */}
            <form onSubmit={handleSave} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-700/80 bg-[#0f172a] text-white text-xs sm:text-sm font-medium focus:border-blue-500 focus:bg-[#121d35] outline-none transition-all placeholder:text-slate-500"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-700/80 bg-[#0f172a] text-white text-xs sm:text-sm font-medium focus:border-blue-500 focus:bg-[#121d35] outline-none transition-all placeholder:text-slate-500"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-700/80 bg-[#0f172a] text-white text-xs sm:text-sm font-medium focus:border-blue-500 focus:bg-[#121d35] outline-none transition-all placeholder:text-slate-500"
                  placeholder="081234567890"
                />
              </div>

              {/* CTA Button: Simpan Perubahan */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  {saving ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
