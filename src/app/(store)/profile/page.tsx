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

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-[calc(100vh-140px)]">
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 relative p-6 flex items-end">
          <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-200">
            <div className="w-full h-full rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-inner">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="pt-12 px-8 pb-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">{user?.role.toLowerCase()} Member</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200/60 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Keluar (Logout)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1">
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Alamat Email
              </p>
              <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1">
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Nomor Telepon / WA
              </p>
              <p className="text-sm font-semibold text-slate-900">{user?.phone || 'Belum diatur'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
