import Link from 'next/link';
import { 
  Sparkles, 
  HeartHandshake, 
  Award, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Phone, 
  ShoppingBag,
  Scissors,
  Layers,
  Heart,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
  Truck,
  Home
} from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami — HijrahStyle',
  description: 'Mengenal HijrahStyle, butik busana muslimah, mukena premium, dan gamis modern berstandar butik dari Kota Serang, Banten.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16 sm:space-y-24 animate-fade-in-up">
      
      {/* ─── 1. Breadcrumb Navigasi: Floating Glassmorphic Pill dengan Jarak Lega & Animasi ─── */}
      <div className="pt-8 sm:pt-12 pb-2">
        <nav className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#0b1220]/90 border border-slate-800/90 text-xs sm:text-sm font-semibold text-slate-300 shadow-xl shadow-black/30 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300 group">
          <Link href="/" prefetch={true} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Beranda</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-white font-bold bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30 text-blue-300 shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Tentang Kami</span>
          </span>
        </nav>
      </div>

      {/* ─── 2. Hero Section: Simetris, Elegan & Seimbang dengan Spacing Mantap ─── */}
      <section className="relative rounded-[32px] bg-gradient-to-br from-[#0c1322] via-[#0f192d] to-[#080d18] border border-slate-800/80 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl mt-2">
        {/* Glow Ambient Lights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Kolom Kiri: Teks & Filosofi */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 to-rose-500/15 border border-white/10 text-white text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>BUTIK BUSANA MUSLIMAH • KOTA SERANG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Keanggunan Syar'i <br />
              <span className="bg-gradient-to-r from-blue-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                dengan Kualitas Butik Terbaik
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              <strong>HijrahStyle</strong> hadir sebagai butik independen tepercaya yang berdedikasi menyediakan 
              koleksi mukena eksklusif, gamis elegan, hijab syar'i, dan busana muslimah modern. 
              Setiap helai pakaian diproduksi dengan bahan pilihan yang adem, jahitan halus, serta potongan proporsional 
              agar Anda tampil anggun dan percaya diri dalam balutan kesantunan.
            </p>

            {/* Statistik Ringkas */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 border-y border-slate-800/80 py-4">
              <div>
                <p className="text-xl sm:text-2xl font-black text-blue-400">100%</p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Bahan Premium</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">4.9 / 5.0</p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Rating Kepuasan</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">Serang</p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Pusat Workshop</p>
              </div>
            </div>

            {/* Tombol Navigasi */}
            <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
              <Link
                href="/products"
                prefetch={true}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Lihat Koleksi Busana</span>
              </Link>
              <Link
                href="/#footer"
                prefetch={true}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0b1220] hover:bg-[#131d33] border border-slate-700/80 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <span>Hubungi Seller</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Visual Card Showcase dengan Animasi Mengambang */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl bg-[#070b14] border border-slate-800 p-4 shadow-2xl space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#10192e] flex items-center justify-center p-6">
                <img
                  src="/products/hoodie-bbn.jpg"
                  alt="Koleksi HijrahStyle"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] animate-float"
                />
                <div className="absolute top-3.5 right-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-md shadow-md animate-pulse">
                  Official Store
                </div>
              </div>

              <div className="p-3.5 bg-[#0c1424] rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Butik Pribadi HijrahStyle</span>
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terverifikasi</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Dikelola langsung oleh admin seller terpercaya tanpa perantara marketplace pihak ketiga.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. Nilai & Standar Kualitas ─── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Dedikasi &amp; Kualitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            3 Standar Utama di Setiap Produk Kami
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Kami memastikan setiap pesanan memberikan kepuasan berbusana yang nyaman dan syar'i.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Bahan */}
          <div className="bg-[#0b1220] border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
              <Layers className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">
                1. Kurasi Bahan Pilihan
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Memakai katun rayon grade A, sutra silk, dan jersey premium yang adem di kulit, tidak menerawang, serta nyaman dipakai beribadah maupun kegiatan harian.
              </p>
            </div>
          </div>

          {/* Card 2: Jahitan */}
          <div className="bg-[#0b1220] border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-amber-600/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <Scissors className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                2. Jahitan Rapi Berstandar Butik
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Dikerjakan oleh penjahit berpengalaman dengan kerapatan tusuk jarum presisi, obras tertutup rapi, dan pola potongan syar'i yang pas serta leluasa bergerak.
              </p>
            </div>
          </div>

          {/* Card 3: Pelayanan */}
          <div className="bg-[#0b1220] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
              <Heart className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                3. Pelayanan Personal &amp; Terpercaya
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Toko tunggal yang dikelola penuh kejujuran. Setiap pesanan diperiksa ulang (quality control) dan dikemas rapi sebelum diserahkan ke jasa ekspedisi.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. Informasi Operasional & Kontak Workshop ─── */}
      <section className="bg-[#0b1220] border border-slate-800/90 rounded-[28px] p-7 sm:p-10 shadow-xl space-y-6">
        <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pusat Informasi &amp; Lokasi Workshop
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Seluruh proses pengecekan kualitas dan pengiriman dipusatkan dari workshop resmi kami.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Toko Resmi Terdaftar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Lokasi Workshop</p>
            <p className="text-sm font-bold text-white">Kota Serang, Banten</p>
            <p className="text-[11px] text-slate-500">Pusat pengecekan &amp; pengiriman</p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Jam Pelayanan</p>
            <p className="text-sm font-bold text-white">08.00 – 21.00 WIB</p>
            <p className="text-[11px] text-slate-500">Setiap Hari (Senin – Minggu)</p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Jasa Pengiriman</p>
            <p className="text-sm font-bold text-white">JNE, SiCepat, J&amp;T</p>
            <p className="text-[11px] text-slate-500">Resi kilat ke seluruh Indonesia</p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-medium">WhatsApp Seller</p>
            <p className="text-sm font-bold text-white font-mono">0812-3456-7890</p>
            <p className="text-[11px] text-slate-500">Konsultasi ukuran &amp; pesanan</p>
          </div>

        </div>
      </section>

      {/* ─── 5. Langkah Mudah Berbelanja (1 - 2 - 3) ─── */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cara Mudah Belanja di HijrahStyle
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Transaksi simpel, aman, dan pesanan segera dikirim ke alamat Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Pilih Koleksi Favorit',
              desc: 'Telusuri katalog mukena, gamis, atau hijab syar\'i sesuai gaya dan warna kesukaan Anda.',
            },
            {
              step: '02',
              title: 'Tentukan Ukuran Pas',
              desc: 'Gunakan panduan ukuran lengkap (S sampai XXL) yang tertera pada setiap detail produk.',
            },
            {
              step: '03',
              title: 'Pembayaran & Kirim Kilat',
              desc: 'Selesaikan transaksi dengan mudah via transfer bank/QRIS, pesanan langsung dikemas rapi.',
            },
          ].map((item) => (
            <div 
              key={item.step}
              className="bg-[#0b1220] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden space-y-3"
            >
              <span className="text-4xl font-black text-blue-500/20 font-mono absolute top-4 right-5 select-none">
                {item.step}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                {item.step}
              </div>
              <h3 className="text-base font-extrabold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. CTA Card Penutup yang Rapi & Proporsional ─── */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-slate-900 border border-blue-500/30 p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
          Siap Tampil Cantik &amp; Syar'i Bersama HijrahStyle?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Temukan busana muslimah pilihan Anda dengan penawaran voucher diskon dan gratis ongkir hari ini.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mulai Belanja Sekarang</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
