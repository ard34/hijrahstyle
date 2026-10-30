'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, ArrowLeft, Loader2, Copy, ChevronDown, CheckCircle2, ShieldCheck, CreditCard, ShoppingBag, MapPin, Truck, Sparkles
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore, useAuthStore } from '@/lib/store';

interface OrderSummaryItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { user, setUser } = useAuthStore();

  const [items, setItems] = useState<OrderSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);

  // Form Fields (Ref Screen 05)
  const [name, setName] = useState('Siti Nurhaliza');
  const [phone, setPhone] = useState('081234567890');
  const [address, setAddress] = useState('Jl. Ahmad Yani No. 45, Cipocok Jaya');
  const [province, setProvince] = useState('Banten');
  const [city, setCity] = useState('Kota Serang');
  const [district, setDistrict] = useState('Cipocok Jaya');
  const [postalCode, setPostalCode] = useState('42121');

  // Couriers
  const couriers = [
    { id: 'sicepat', name: 'SiCepat', logo: 'SiCepat', price: 17000 },
    { id: 'jne', name: 'JNE', logo: 'JNE', price: 18000 },
    { id: 'jnt', name: 'J&T', logo: 'J&T', price: 20000 },
    { id: 'gosend', name: 'GoSend Instan (Kota Serang)', logo: 'GoSend', price: 25000 },
  ];
  const [selectedCourier, setSelectedCourier] = useState(couriers[0]);

  // Voucher
  const [voucherCode] = useState('DISKON50K');
  const voucherDiscount = 50000;

  // Duitku Modal State
  const [showDuitkuModal, setShowDuitkuModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [copiedVA, setCopiedVA] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Initial Data Fetching: Auth, Addresses & Cart
  useEffect(() => {
    async function initCheckout() {
      try {
        setLoading(true);
        // 1. Check Auth
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData?.user) {
            setUser(authData.user);
            setName(authData.user.name || 'Siti Nurhaliza');
            if (authData.user.phone) setPhone(authData.user.phone);
          }
        }

        // 2. Fetch Addresses
        const addrRes = await fetch('/api/addresses');
        if (addrRes.ok) {
          const addrData = await addrRes.json();
          if (addrData.addresses && addrData.addresses.length > 0) {
            const def = addrData.addresses[0];
            setAddressId(def.id);
            setName(def.recipientName);
            setPhone(def.phone);
            setAddress(def.addressDetail);
            setProvince(def.province);
            setCity(def.city);
            setDistrict(def.district);
            setPostalCode(def.postalCode);
          }
        }

        // 3. Fetch Cart
        const cartRes = await fetch('/api/cart');
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          if (cartData.items && cartData.items.length > 0) {
            setItems(cartData.items.map((i: any) => ({
              id: i.id,
              name: i.productName,
              variant: i.variantLabel,
              price: i.price,
              quantity: i.quantity,
              imageUrl: i.imageUrl || '/products/kaos-forge.jpg',
            })));
          }
        }
      } catch (err) {
        console.error('Checkout init error:', err);
      } finally {
        setLoading(false);
      }
    }

    initCheckout();
  }, [setUser]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedCourier.price;
  const adminFee = 4000;
  const totalAmount = Math.max(0, subtotal + shippingCost + adminFee - (subtotal > voucherDiscount ? voucherDiscount : 0));

  const handlePayNow = async () => {
    if (!name || !phone || !address || !postalCode) {
      addToast('Mohon lengkapi data alamat pengiriman', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Ensure address is saved/registered in database
      let currentAddressId = addressId;
      if (!currentAddressId) {
        const createAddrRes = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientName: name,
            phone,
            fullAddress: address,
            province,
            city,
            district,
            postalCode,
            isDefault: true,
          }),
        });
        if (createAddrRes.ok) {
          const addrJson = await createAddrRes.json();
          currentAddressId = addrJson.address?.id;
          setAddressId(currentAddressId);
        } else if (createAddrRes.status === 401) {
          addToast('Silakan login terlebih dahulu untuk checkout', 'warning');
          router.push('/login?redirect=/checkout');
          return;
        }
      }

      if (!currentAddressId) {
        addToast('Gagal memproses alamat pengiriman', 'error');
        return;
      }

      // 2. Call real POST /api/checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: currentAddressId,
          shippingCourier: selectedCourier.name,
          shippingService: 'Reguler',
          shippingCost: selectedCourier.price,
          voucherCode: subtotal > voucherDiscount ? voucherCode : undefined,
          paymentMethod: 'duitku',
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        addToast(checkoutData.error || 'Gagal membuat pesanan', 'error');
        return;
      }

      // Update badge cart count
      window.dispatchEvent(new Event('cart-updated'));

      setCreatedOrder(checkoutData.order);
      setShowDuitkuModal(true);
      addToast('Pesanan berhasil dibuat di sistem!', 'success');
    } catch (err) {
      console.error('Checkout error:', err);
      addToast('Terjadi kesalahan koneksi, coba lagi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText('88081234567890');
    setCopiedVA(true);
    addToast('Nomor VA berhasil disalin!', 'success');
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!createdOrder) return;
    try {
      // Trigger webhook sandbox to mark as PAID in database
      await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantOrderId: createdOrder.orderNumber,
          resultCode: '00',
          amount: createdOrder.totalAmount,
          is_mock: true,
        }),
      });

      setShowDuitkuModal(false);
      addToast('Pembayaran Duitku berhasil! Pesanan sedang diproses Butik 🎉', 'success');
      router.push(`/orders/${createdOrder.id}`);
    } catch {
      router.push(`/orders/${createdOrder.id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-24 min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-bold text-slate-400">Menyiapkan rincian checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0b1220] border border-slate-800 flex items-center justify-center text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Keranjang Belanja Kosong</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Silakan pilih busana muslimah favorit Anda di katalog butik sebelum melanjutkan ke pembayaran.
          </p>
        </div>
        <Link
          href="/products"
          prefetch={true}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
        >
          <span>Jelajahi Produk Butik</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 min-h-[calc(100vh-140px)] animate-fade-in-up">
      
      {/* ─── Screen 05 Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Courier (Span 7 cols, Dark Theme) */}
        <div className="lg:col-span-7 bg-[#0b1220] text-white rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Alamat Pengiriman</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Tujuan pengiriman pesanan butik Anda</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
              Kota Serang &amp; Nasional
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nama Penerima</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none"
                placeholder="Nama Lengkap Penerima"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none"
                placeholder="081234567890"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none"
                placeholder="Jl. Nama Jalan No. Rumah, RT/RW, Kelurahan"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Provinsi</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Banten">Banten</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Kota / Kabupaten</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Kota Serang">Kota Serang</option>
                  <option value="Kab. Serang">Kab. Serang</option>
                  <option value="Kota Cilegon">Kota Cilegon</option>
                  <option value="Kota Tangerang">Kota Tangerang</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none"
                  placeholder="Kecamatan"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-800 bg-[#070b14] text-white text-xs font-medium focus:border-blue-500 outline-none"
                  placeholder="Kode Pos"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Pilih Kurir Pengiriman */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Pilihan Kurir Pengiriman</span>
            </h3>
            <div className="space-y-2">
              {couriers.map((c) => {
                const isSelected = selectedCourier.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCourier(c)}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-600/15 shadow-md shadow-blue-500/10' 
                        : 'border-slate-800 bg-[#070b14] hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-xs flex items-center justify-center">
                        {c.logo.substring(0, 3)}
                      </div>
                      <span className="font-bold text-xs text-white">{c.name}</span>
                    </div>
                    <span className="text-xs font-black text-blue-400">
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
          
          {/* Ringkasan Pesanan Card */}
          <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 space-y-4 shadow-xl text-white">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span>Ringkasan Pesanan ({items.length} Item)</span>
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-slate-800/60 last:border-none">
                  <div className="w-14 h-14 rounded-xl bg-[#10192e] p-1.5 border border-slate-800 shrink-0 flex items-center justify-center">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.variant} • {item.quantity}x</p>
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
                <span>Subtotal Produk</span>
                <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ongkos Kirim ({selectedCourier.name})</span>
                <span className="font-bold text-white">{formatRupiah(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Layanan &amp; Kemas</span>
                <span className="font-bold text-white">{formatRupiah(adminFee)}</span>
              </div>
              {subtotal > voucherDiscount && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Voucher ({voucherCode})</span>
                  <span className="font-bold">- {formatRupiah(voucherDiscount)}</span>
                </div>
              )}
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm">
                <span className="font-black text-white">Total Pembayaran</span>
                <span className="font-black text-lg text-blue-400">{formatRupiah(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran Card */}
          <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Metode Pembayaran Online</span>
            </h3>

            {/* Duitku Gateway Container */}
            <div className="bg-[#070b14] border border-blue-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-[11px] flex items-center justify-center">
                    D
                  </div>
                  <span className="text-xs font-bold text-white">Duitku Payment Gateway</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Sandbox Aktif
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: 'Virtual Account', icon: '🏦' },
                  { label: 'QRIS Instant', icon: '📱' },
                  { label: 'E-Wallet', icon: '💳' },
                  { label: 'Indomaret / Alfamart', icon: '🏪' },
                ].map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-[#0b1220] border border-slate-800 flex flex-col items-center text-center gap-1"
                  >
                    <span className="text-sm">{ch.icon}</span>
                    <span className="text-[9px] font-bold text-slate-300 leading-tight">
                      {ch.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button: Bayar Sekarang */}
            <button
              onClick={handlePayNow}
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Membuat Pesanan...</span>
                </div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Bayar Sekarang ({formatRupiah(totalAmount)})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* ─── Screen 06 Modal: Pembayaran via Duitku Sandbox ─── */}
      {showDuitkuModal && createdOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="w-full max-w-2xl bg-[#070b14] border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white">Pembayaran Duitku</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pesanan #{createdOrder.orderNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-blue-400 font-mono tracking-wider">Duitku</span>
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  D
                </div>
              </div>
            </div>

            {/* Two-Column Duitku Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              
              {/* Left Bank Tabs */}
              <div className="sm:col-span-5 space-y-2">
                <div className="px-3.5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2">
                  <span>Virtual Account Bank</span>
                </div>

                <div className="space-y-1 pt-1">
                  {['BCA', 'Mandiri', 'BNI', 'BRI', 'BSI Syariah'].map((bank) => (
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

              {/* Right Content Card */}
              <div className="sm:col-span-7 bg-[#0b1220] rounded-2xl border border-slate-800 p-5 space-y-4">
                <h4 className="text-sm font-black text-white">
                  {selectedBank} Virtual Account
                </h4>

                {/* Nomor VA with Salin Button */}
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nomor Rekening VA</span>
                    <span className="text-sm font-mono font-black text-white tracking-wider">
                      8808 1234 5678 90
                    </span>
                  </div>
                  <button
                    onClick={handleCopyVA}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedVA ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                {/* Total Pembayaran */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total Nominal Transfer</span>
                  <span className="text-xl font-black text-blue-400">
                    {formatRupiah(createdOrder.totalAmount)}
                  </span>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Batas Waktu Pembayaran</span>
                  <span className="text-sm font-bold text-amber-300">23 Jam 59 Menit</span>
                </div>
              </div>

            </div>

            {/* Note & Close/Simulate Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-[11px] text-slate-400">
                Dalam mode sandbox, Anda dapat menekan tombol simulasi bayar untuk mengubah status menjadi Dibayar.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/orders/${createdOrder.id}`)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  Lihat Pesanan
                </button>
                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  ⚡ Bayar Otomatis (Lunas)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
