'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useToastStore } from '@/lib/store';

export default function RegisterPage() {
  const [name, setName] = useState('Riski Ardiansyah');
  const [email, setEmail] = useState('riski@example.com');
  const [password, setPassword] = useState('password123');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      addToast('Anda harus menyetujui Syarat & Ketentuan', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Pendaftaran gagal', 'error');
        return;
      }
      setUser(data.user);
      addToast('Akun berhasil dibuat! Selamat datang 🎉', 'success');
      router.push('/');
    } catch {
      addToast('Terjadi kesalahan, coba lagi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      {/* ─── Screen 13 Left Panel: White/Light Container Card ─── */}
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Buat Akun Baru
          </h1>
          <p className="text-xs text-slate-500">
            Bergabung dan mulai belanja sekarang!
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
              placeholder="Riski Ardiansyah"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
              placeholder="riski@example.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
              placeholder="••••••••••"
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
            />
            <label htmlFor="terms" className="cursor-pointer">
              Saya menyetujui Syarat & Ketentuan
            </label>
          </div>

          {/* CTA: Daftar Sekarang */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            {isLoading ? 'Membuat Akun...' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Divider: atau */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-xs text-slate-400">
            atau
          </span>
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={() => addToast('Google OAuth Sandbox aktif', 'info')}
          className="w-full h-11 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Daftar dengan Google</span>
        </button>

        <p className="text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>

      </div>
    </div>
  );
}
