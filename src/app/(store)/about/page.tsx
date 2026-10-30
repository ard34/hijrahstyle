import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Truck, 
  Award, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami — HijrahStyle',
  description: 'Mengenal HijrahStyle, butik busana muslimah, mukena, dan gamis modern berkualitas dari Kota Serang, Banten.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-16">
      
      {/* ─── Breadcrumb ─── */}
      <nav className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-400 transition-colors">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold">Tentang Kami</span>
      </nav>

      {/* ─── Hero Section: Tentang HijrahStyle ─── */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#0b1220] via-[#0d172e] to-[#070b14] border border-slate-800/90 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TENTANG HIJRAHSTYLE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Keanggunan &amp; Kesantunan <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              dalam Setiap Sentuhan Busana
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            <strong>HijrahStyle</strong> adalah butik busana muslimah independen yang berpusat di Kota Serang, Banten. 
            Kami berdedikasi menyediakan koleksi mukena premium, gamis elegan, hijab syar'i, dan busana muslimah modern 
            dengan standar jahitan butik berkualitas tinggi, bahan pilihan yang adem, serta harga yang tetap ramah.
          </p>

          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Jelajahi Koleksi Produk</span>
            </Link>
            <Link
              href="/#footer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0e172a] hover:bg-[#131f38] border border-slate-700/80 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <span>Hubungi Kami</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Visi & Cerita Toko ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Cerita &amp; Komitmen Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Toko Pribadi Tepercaya dengan Pelayanan Penuh Kehangatan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Berbeda dengan marketplace massal dengan banyak penjual yang tidak terverifikasi, 
            <strong> HijrahStyle dikelola langsung oleh satu tim admin seller terpercaya</strong>. 
            Setiap helai pakaian, gamis, maupun mukena melalui proses kurasi bahan dan pemeriksaan kualitas yang ketat sebelum dikemas dan dikirimkan ke alamat Anda.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Misi kami adalah menghadirkan pakaian muslimah yang tidak hanya indah dipandang, namun juga nyaman dipakai beribadah maupun beraktivitas sehari-hari tanpa rasa gerah, tidak menerawang, dan tetap memancarkan aura kesopanan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {[
              '100% Produk Berkualitas Terjamin',
              'Jahitan Rapi Berstandar Butik',
              'Bahan Lembut, Adem & Nyaman',
              'Pelayanan Personal & Respon Cepat',
            ].map((point, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box Card */}
        <div className="lg:col-span-5 bg-[#0b1220] rounded-3xl border border-slate-800/90 p-7 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Profil Toko HijrahStyle</span>
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-xs">Lokasi Workshop &amp; Pengiriman</p>
                <p className="font-bold text-white mt-0.5">Kota Serang, Banten, Indonesia</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
              <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-xs">Jam Operasional Layanan</p>
                <p className="font-bold text-white mt-0.5">Senin – Minggu (08:00 – 21:00 WIB)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-xs">Jangkauan Pengiriman</p>
                <p className="font-bold text-white mt-0.5">Seluruh Indonesia (JNE, SiCepat, J&amp;T)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-xs">Kontak Langsung Seller</p>
                <p className="font-mono font-bold text-white mt-0.5">0812-3456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Pilar Keunggulan Toko ─── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mengapa Memilih HijrahStyle?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Komitmen kami untuk memberikan pengalaman berbelanja busana muslimah terbaik dan terpercaya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: '100% Produk Original',
              desc: 'Semua produk merupakan karya asli dengan standar bahan pilihan yang bermutu tinggi.',
              color: 'text-blue-400',
              bgColor: 'bg-blue-600/15',
            },
            {
              icon: Award,
              title: 'Standar Jahitan Butik',
              desc: 'Jahitan rapi, pola presisi, dan finishing halus untuk kenyamanan maksimal sepanjang hari.',
              color: 'text-amber-400',
              bgColor: 'bg-amber-600/15',
            },
            {
              icon: Truck,
              title: 'Pengiriman Kilat',
              desc: 'Pesanan diproses langsung dari Kota Serang dengan packaging aman dan rapi.',
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-600/15',
            },
            {
              icon: HeartHandshake,
              title: 'Garansi Kepuasan',
              desc: 'Layanan purnajual ramah dengan jaminan retur jika produk yang diterima tidak sesuai pesanan.',
              color: 'text-rose-400',
              bgColor: 'bg-rose-600/15',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i}
                className="bg-[#0b1220] border border-slate-800/90 hover:border-blue-500/40 rounded-2xl p-6 space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} border border-white/10 ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}>
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CTA Banner Bawah ─── */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 text-center text-white space-y-5 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
          Temukan Gaya Muslimah Terbaik Anda Sekarang
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
          Koleksi mukena, gamis, dan pakaian muslimah elegan siap melengkapi hari-hari istimewa Anda. 
          Dapatkan diskon promo eksklusif dan gratis ongkir ke seluruh Indonesia.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mulai Belanja</span>
          </Link>
        </div>
      </section>

    </div>
  );
}

