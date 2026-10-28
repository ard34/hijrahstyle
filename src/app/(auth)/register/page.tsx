'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useToastStore } from '@/lib/store';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToastStore();

  const updateField = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast('Konfirmasi password tidak cocok', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Registrasi gagal', 'error');
        return;
      }
      addToast('Registrasi berhasil! Silakan login', 'success');
      router.push('/login');
    } catch {
      addToast('Terjadi kesalahan, coba lagi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Left Panel - Dark High Fashion Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12 bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-10000 hover:scale-100"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 z-10" />

        <div className="relative z-20 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Member Privilege &amp; Exclusive Voucher</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Bergabung Bersama Komunitas Fashion Hijrah.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Dapatkan voucher diskon langsung Rp 50.000 untuk transaksi pertama dan akses awal ke koleksi edisi terbatas.
          </p>

          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <span>Voucher Diskon Member</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <span>Poin Reward Belanja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-900/60 backdrop-blur-xl relative my-auto">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header Link & Brand Badge */}
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-600/30">
                H
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">HijrahStyle</span>
            </div>
          </div>

          {/* Card Container */}
          <div className="bg-slate-950/80 p-8 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Buat Akun Baru</h2>
              <p className="text-slate-400 text-xs mt-1.5">Isi data Anda untuk mulai menikmati layanan eksklusif</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="reg-name">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
                  <input
                    id="reg-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Nama lengkap Anda"
                    style={{ paddingLeft: '44px' }}
                    className="w-full h-11 pr-4 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="reg-email">
                  Alamat Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
                  <input
                    id="reg-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="nama@email.com"
                    style={{ paddingLeft: '44px' }}
                    className="w-full h-11 pr-4 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="reg-phone">
                  Nomor Telepon / WhatsApp
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
                  <input
                    id="reg-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="081234567890"
                    style={{ paddingLeft: '44px' }}
                    className="w-full h-11 pr-4 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="reg-password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Min. 8 kar."
                      style={{ paddingLeft: '38px' }}
                      className="w-full h-11 pr-9 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-200 p-1 rounded-lg z-10"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2" htmlFor="reg-confirm">
                    Konfirmasi
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
                    <input
                      id="reg-confirm"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Ulangi pass"
                      style={{ paddingLeft: '38px' }}
                      className="w-full h-11 pr-3 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Daftar Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-3 border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Sudah memiliki akun?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold hover:underline">
                  Masuk Sekarang
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

