'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, MapPin, Package, Heart, Ticket, MessageSquare, Settings, LogOut
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* ─── Screen 09 Left Sidebar: Akun Saya (Span 4 cols) ─── */}
        <aside className="md:col-span-4 bg-[#0b1220] rounded-2xl border border-slate-800/90 p-5 space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-800">
            Akun Saya
          </h2>

          <div className="space-y-1 text-xs font-semibold">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveMenu(item.label);
                    if (item.href !== '/profile') router.push(item.href);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left pt-3 border-t border-slate-800 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ─── Screen 09 Right Content: Profil Saya (Span 8 cols) ─── */}
        <div className="md:col-span-8 space-y-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Profil Saya
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola informasi akun Anda
            </p>
          </div>

          {/* White Container Card (Screen 09) */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Avatar Row */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{name}</h3>
                <p className="text-xs text-slate-500">{email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* CTA Button: Simpan Perubahan (Screen 09) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
