'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, ArrowLeft, Loader2, Copy, ChevronDown, CheckCircle2, ShieldCheck, CreditCard
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

interface OrderSummaryItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const defaultCheckoutItems: OrderSummaryItem[] = [
  {
    id: 'item-1',
    name: 'Sneakers Vortex',
    variant: 'Putih / 42',
    price: 599000,
    quantity: 1,
    imageUrl: '/products/sneakers-vortex.png',
  },
  {
    id: 'item-2',
    name: 'Hoodie BBN',
    variant: 'Hitam / L',
    price: 249000,
    quantity: 1,
    imageUrl: '/products/hoodie-bbn.jpg',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [items, setItems] = useState<OrderSummaryItem[]>(defaultCheckoutItems);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields (Ref Screen 05)
  const [name, setName] = useState('Riski Ardiansyah');
  const [phone, setPhone] = useState('081234567890');
  const [address, setAddress] = useState('Jl. Contoh No. 123, Kota Serang');
  const [province, setProvince] = useState('Banten');
  const [city, setCity] = useState('Kota Serang');
  const [district, setDistrict] = useState('Serang');
  const [postalCode, setPostalCode] = useState('42111');

  // Couriers (Ref Screen 05)
  const couriers = [
    { id: 'jne', name: 'JNE', logo: 'JNE', price: 18000 },
    { id: 'sicepat', name: 'SiCepat', logo: 'SiCepat', price: 18000 },
    { id: 'jnt', name: 'J&T', logo: 'J&T', price: 20000 },
    { id: 'gosend', name: 'GoSend', logo: 'GoSend', price: 25000 },
  ];
  const [selectedCourier, setSelectedCourier] = useState(couriers[0]);

  // Payment channel
  const [paymentChannel, setPaymentChannel] = useState('va');

  // Screen 06: Duitku Modal State
  const [showDuitkuModal, setShowDuitkuModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [copiedVA, setCopiedVA] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedCourier.price;
  const voucherDiscount = 51000; // to match ~Rp 815.000 total as in mockup Screen 05 & 06
  const totalAmount = Math.max(0, subtotal + shippingCost - voucherDiscount);

  const handlePayNow = async () => {
    setSubmitting(true);
    // Simulate payment creation and open Screen 06 Duitku modal
    setTimeout(() => {
      setSubmitting(false);
      setShowDuitkuModal(true);
    }, 400);
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText('1234 5678 9012 3456');
    setCopiedVA(true);
    addToast('Nomor VA berhasil disalin!', 'success');
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleFinishSimulation = () => {
    setShowDuitkuModal(false);
    addToast('Pembayaran berhasil diproses via Duitku!', 'success');
    router.push('/orders?success=true');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)]">
      
      {/* ─── Screen 05 Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Courier (Span 7 cols) */}
        <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Informasi Pesanan
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Nomor Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Provinsi</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 outline-none"
                >
                  <option value="Banten">Banten</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kota/Kabupaten</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 outline-none"
                >
                  <option value="Kota Serang">Kota Serang</option>
                  <option value="Kab. Serang">Kab. Serang</option>
                  <option value="Kota Cilegon">Kota Cilegon</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kecamatan</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 outline-none"
                >
                  <option value="Serang">Serang</option>
                  <option value="Cipocok Jaya">Cipocok Jaya</option>
                  <option value="Kasemen">Kasemen</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Pilih Kurir Pengiriman (Screen 05) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Pilih Kurir Pengiriman
            </h3>
            <div className="space-y-2">
              {couriers.map((c) => {
                const isSelected = selectedCourier.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourier(c)}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/70 shadow-sm' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {c.logo}
                      </div>
                      <span className="font-bold text-xs text-slate-800">{c.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {formatRupiah(c.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Ringkasan Pesanan & Metode Pembayaran (Span 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ringkasan Pesanan Card (Screen 05) */}
          <div className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-extrabold text-white">
              Ringkasan Pesanan
            </h2>

            {/* Items list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#f1f5f9] dark:bg-[#1a2333] p-1.5 border border-slate-800 shrink-0 flex items-center justify-center">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.variant} {item.quantity}x</p>
                  </div>
                  <span className="text-xs font-black text-white shrink-0">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ongkir</span>
                <span className="font-bold text-white">{formatRupiah(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-cyan-400">
                <span>Voucher</span>
                <span className="font-bold">- {formatRupiah(voucherDiscount)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-base text-white">{formatRupiah(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran Card (Screen 05) */}
          <div className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white">
              Metode Pembayaran
            </h3>

            {/* Duitku Gateway with 4 Channel Badges */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-[11px] flex items-center justify-center">
                  D
                </div>
                <span className="text-xs font-bold text-slate-900">Duitku Payment Gateway</span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: 'Virtual Account', icon: '🏦' },
                  { label: 'QRIS', icon: '📱' },
                  { label: 'E-Wallet', icon: '💳' },
                  { label: 'Gerai Retail', icon: '🏪' },
                ].map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center gap-1"
                  >
                    <span className="text-sm">{ch.icon}</span>
                    <span className="text-[9px] font-bold text-slate-700 leading-tight">
                      {ch.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button: Bayar Sekarang (Screen 05) */}
            <button
              onClick={handlePayNow}
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Bayar Sekarang</span>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* ─── Screen 06 Modal: Pembayaran via Duitku ─── */}
      {showDuitkuModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#070b14] border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white">Pembayaran via Duitku</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pilih metode pembayaran yang Anda inginkan</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-blue-400 font-mono tracking-wider">Duitku</span>
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  D
                </div>
              </div>
            </div>

            {/* Two-Column Duitku Layout (Screen 06) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              
              {/* Left Tabs (Span 5 cols) */}
              <div className="sm:col-span-5 space-y-2">
                <div className="px-3.5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2">
                  <span>Virtual Account</span>
                </div>

                <div className="space-y-1 pt-1">
                  {['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata'].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedBank === bank 
                          ? 'bg-[#0e172a] text-blue-400 border border-blue-500/40' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-md bg-slate-800 text-[10px] font-bold text-white flex items-center justify-center">
                        {bank.charAt(0)}
                      </div>
                      <span>{bank}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Content Card (Span 7 cols) */}
              <div className="sm:col-span-7 bg-[#0b1220] rounded-2xl border border-slate-800 p-5 space-y-4">
                <h4 className="text-sm font-black text-white">
                  {selectedBank} Virtual Account
                </h4>

                {/* Nomor VA with Salin Button (Screen 06) */}
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nomor VA</span>
                    <span className="text-sm font-mono font-black text-white tracking-wider">
                      1234 5678 9012 3456
                    </span>
                  </div>
                  <button
                    onClick={handleCopyVA}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedVA ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                {/* Total Pembayaran & Batas Waktu */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total Pembayaran</span>
                  <span className="text-lg font-black text-white">{formatRupiah(totalAmount)}</span>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Batas Waktu Pembayaran</span>
                  <span className="text-sm font-bold text-white">23 Jam 59 Menit</span>
                </div>

                {/* Accordion guide */}
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span>Lihat panduan pembayaran</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>

            </div>

            {/* Note & Close/Simulate Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-[11px] text-slate-400">
                Setelah pembayaran berhasil, status pesanan akan otomatis diperbarui.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDuitkuModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={handleFinishSimulation}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Simulasikan Bayar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
