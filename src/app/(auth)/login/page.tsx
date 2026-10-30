'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, Mail, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuthStore, useToastStore } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const handleFillAdmin = () => {
    setEmail('admin@hijrahstyle.id');
    setPassword('admin123');
    addToast('Akun Admin terpilih: admin@hijrahstyle.id', 'info');
  };

  const handleFillCustomer = () => {
    setEmail('siti@gmail.com');
    setPassword('password123');
    addToast('Akun Pelanggan terpilih: siti@gmail.com', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Email dan password wajib diisi', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Login gagal, periksa email dan password', 'error');
        return;
      }
      setUser(data.user);
      addToast(`Selamat datang kembali, ${data.user.name}! 👋`, 'success');
      
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch {
      addToast('Terjadi kesalahan koneksi, coba lagi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-[#0b1220] text-white rounded-3xl border border-slate-800/90 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PORTAL LOGIN BUTIK</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-xs text-slate-400">
            Masuk sebagai Admin Toko atau Pelanggan
          </p>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Akses Cepat Pengujian:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillAdmin}
              className="py-2 px-3 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>👑 Akun Admin</span>
            </button>
            <button
              type="button"
              onClick={handleFillCustomer}
              className="py-2 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>🛍️ Pelanggan</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px' }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 focus:border-blue-500 text-xs text-white outline-none placeholder:text-slate-500 font-medium"
                placeholder="nama@email.com"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 focus:border-blue-500 text-xs text-white outline-none placeholder:text-slate-500 font-medium"
                placeholder="••••••••••"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600 bg-[#070b14] border-slate-700 cursor-pointer"
              />
              <span>Ingat saya</span>
            </label>
            <span className="text-slate-500 text-[11px]">HijrahStyle Serang</span>
          </div>

          {/* Masuk CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? 'Memproses Masuk...' : 'Masuk ke Akun'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-400 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>

      </div>
    </div>
  );
}
