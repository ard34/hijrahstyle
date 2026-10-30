'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { useAuthStore, useToastStore } from '@/lib/store';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const handleDemoFill = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setName(`Pelanggan Baru ${randomNum}`);
    setEmail(`customer${randomNum}@hijrahstyle.id`);
    setPhone(`0812${randomNum}${randomNum}`);
    setPassword('password123');
    setConfirmPassword('password123');
    addToast('Data akun demo telah diisi otomatis!', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      addToast('Anda harus menyetujui Syarat & Ketentuan', 'warning');
      return;
    }
    if (password.length < 8) {
      addToast('Password minimal 8 karakter', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Konfirmasi password tidak cocok', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Pendaftaran gagal', 'error');
        return;
      }
      setUser(data.user);
      addToast(`Selamat datang, ${data.user.name}! Akun berhasil dibuat 🎉`, 'success');
      router.push('/');
      router.refresh();
    } catch {
      addToast('Terjadi kesalahan koneksi, coba lagi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 py-12">
      {/* ─── Modern Dark Navy Container Card ─── */}
      <div className="w-full max-w-md bg-[#0b1220] text-white rounded-3xl border border-slate-800/90 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>HIJRAHSTYLE RESMI</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Buat Akun Pelanggan
          </h1>
          <p className="text-xs text-slate-400">
            Daftar untuk menikmati belanja busana muslimah pilihan
          </p>
        </div>

        {/* Quick Demo Fill Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>⚡ Isi Cepat Akun Demo Otomatis</span>
          </button>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '38px' }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-white text-xs font-medium focus:border-blue-500 outline-none placeholder:text-slate-500"
                placeholder="Contoh: Fatimah Az-Zahra"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

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
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-white text-xs font-medium focus:border-blue-500 outline-none placeholder:text-slate-500"
                placeholder="nama@email.com"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Nomor WhatsApp / HP
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '38px' }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-white text-xs font-medium focus:border-blue-500 outline-none placeholder:text-slate-500"
                placeholder="081234567890"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Password (Min. 8 Karakter)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-white text-xs font-medium focus:border-blue-500 outline-none placeholder:text-slate-500"
                placeholder="Minimal 8 karakter"
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

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Ulangi Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-white text-xs font-medium focus:border-blue-500 outline-none placeholder:text-slate-500"
                placeholder="Masukkan kembali password"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
            />
            <label htmlFor="terms" className="cursor-pointer text-slate-300">
              Saya menyetujui Syarat &amp; Ketentuan Butik
            </label>
          </div>

          {/* CTA: Daftar Sekarang */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? (
              <span>Membuat Akun...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-400 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>

      </div>
    </div>
  );
}
