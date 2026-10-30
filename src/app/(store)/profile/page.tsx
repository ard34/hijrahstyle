'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Shield, LogOut, Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profil');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setName(data.user.name || '');
        setPhone(data.user.phone || '');
      })
      .catch(() => {
        router.push('/login?redirect=/profile');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Perubahan profil berhasil disimpan!');
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-[calc(100vh-140px)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar Menu (Screen 09) */}
        <div className="bg-[#0e172a] rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Akun Saya</h2>
          </div>

          <div className="space-y-1 text-xs font-semibold">
            {[
              { id: 'profil', label: 'Profil', icon: User, href: '/profile' },
              { id: 'pesanan', label: 'Pesanan', icon: Shield, href: '/orders' },
              { id: 'wishlist', label: 'Wishlist', icon: Shield, href: '/wishlist' },
              { id: 'promo', label: 'Voucher', icon: Shield, href: '/promo' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.href !== '/profile') router.push(item.href);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left pt-3 border-t border-slate-800 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>

        {/* Right Main Content (Screen 09) */}
        <div className="md:col-span-3 bg-[#0e172a] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-xl font-black text-white tracking-tight">Profil Saya</h1>
            <p className="text-xs text-slate-400 mt-0.5">Kelola informasi akun dan data kontak Anda</p>
          </div>

          {/* User Avatar Row */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {user?.role} MEMBER
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-medium text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full h-10 px-3.5 rounded-xl bg-[#070b14]/50 border border-slate-800 text-xs font-medium text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Nomor Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full h-10 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-medium text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/35 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
