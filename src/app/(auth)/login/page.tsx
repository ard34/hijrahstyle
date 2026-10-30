'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, ShieldCheck, User, KeyRound, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore, useToastStore } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Login gagal', 'error');
        return;
      }
      setUser(data.user);
      addToast('Login berhasil! Selamat datang 👋', 'success');
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch {
      addToast('Terjadi kesalahan, coba lagi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    addToast(`Kredensial demo (${demoEmail}) terisi`, 'info');
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Left Panel - Modern Editorial Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12 bg-slate-900">
        {/* Background Image with Dark Vignette Gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-10000 hover:scale-100"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/20 z-10" />

        <div className="relative z-20 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Store • Toko Sample BBN</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Belanja Modern, Praktis, &amp; Terpercaya.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Nikmati kemudahan berbelanja koleksi produk berkualitas tinggi dengan transaksi instan via Duitku Gateway dan pengiriman terlacak.
          </p>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>100% Produk Original</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Pembayaran Aman Duitku</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Clean Minimalist Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-900/60 backdrop-blur-xl relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Link & Brand Badge */}
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>

            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Toko Sample BBN"
                className="w-7 h-7 rounded-lg object-contain bg-slate-950 p-0.5 border border-slate-700/60 shadow-xs"
              />
              <span className="font-extrabold text-white text-sm tracking-tight">Toko Sample BBN</span>
            </div>
          </div>

          {/* Card Container */}
          <div className="bg-slate-950/80 p-8 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
              <p className="text-slate-400 text-xs mt-1.5">Masuk dengan akun Toko Sample BBN Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="login-email">
                  Alamat Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    style={{ paddingLeft: '44px' }}
                    className="w-full h-11 pr-4 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-slate-300" htmlFor="login-password">
                    Password
                  </label>
                  <button type="button" onClick={() => addToast('Fitur lupa password dikirim ke email Anda', 'info')} className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Lupa Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingLeft: '44px' }}
                    className="w-full h-11 pr-11 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#0e172a] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider relative">
                  atau
                </span>
              </div>

              <button
                type="button"
                onClick={() => alert('Fitur Google Sign-In Sandbox Aktif')}
                className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Masuk dengan Google</span>
              </button>
            </form>

            {/* Quick Demo Fill Buttons for instant preview */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                Akun Demo Uji Coba:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('siti@gmail.com', 'customer123')}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs transition-all hover:border-blue-500/50 group"
                >
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold group-hover:text-blue-300">
                    <User className="w-3.5 h-3.5" /> Customer
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">siti@gmail.com</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@tokosamplebbn.com', 'admin123')}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs transition-all hover:border-blue-500/50 group"
                >
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold group-hover:text-amber-300">
                    <KeyRound className="w-3.5 h-3.5" /> Admin Panel
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">admin@tokosamplebbn.com</p>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Belum memiliki akun?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">
                  Daftar Akun Baru
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

