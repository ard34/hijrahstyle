'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { 
  MapPin, Truck, CreditCard, ShoppingBag, ShieldCheck, 
  Check, Plus, ArrowLeft, Loader2, Tag, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

declare global {
  interface Window {
    snap?: any;
    checkout?: any;
    duitku?: any;
  }
}

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  addressDetail: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

interface CartItem {
  id: string;
  productVariantId?: string;
  productName?: string;
  variantLabel?: string;
  price?: number;
  quantity: number;
  imageUrl?: string;
  stock?: number;
  slug?: string;
  productVariant?: {
    id: string;
    size: string;
    color: string;
    priceOverride: number | null;
    product: {
      name: string;
      price: number;
      images: { url: string }[];
    };
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Address form
  const [newAddress, setNewAddress] = useState({
    label: 'Rumah',
    recipientName: '',
    phone: '',
    fullAddress: '',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    postalCode: '12110',
    isDefault: true,
  });

  // Courier selection
  const [courier, setCourier] = useState('JNE');
  const [service, setService] = useState('REG');
  const [shippingCost, setShippingCost] = useState(15000);

  // Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  // Payment method & Duitku state
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [mockDuitkuModal, setMockDuitkuModal] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentType: string;
    paymentUrl?: string;
  } | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const [cartRes, addrRes] = await Promise.all([
        fetch('/api/cart'),
        fetch('/api/addresses')
      ]);

      if (cartRes.status === 401) {
        router.push('/login?redirect=/checkout');
        return;
      }

      const cartData = await cartRes.json();
      const addrData = await addrRes.json();

      setCartItems(cartData.items || []);
      const addrList = addrData.addresses || [];
      setAddresses(addrList);

      const defaultAddr = addrList.find((a: Address) => a.isDefault) || addrList[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowAddressModal(false);
      fetchCheckoutData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setVoucherError('');
    // Mock voucher validation
    if (voucherCode.toUpperCase() === 'HIJRAH10') {
      const sub = calculateSubtotal();
      const disc = Math.round(sub * 0.1);
      setAppliedVoucher({ code: 'HIJRAH10', discount: disc });
    } else if (voucherCode.toUpperCase() === 'FREEONGKIR') {
      setAppliedVoucher({ code: 'FREEONGKIR', discount: shippingCost });
    } else {
      setVoucherError('Kode voucher tidak valid');
    }
  };

  const getItemPrice = (item: CartItem) => {
    if (typeof item.price === 'number') return item.price;
    if (item.productVariant) {
      return item.productVariant.priceOverride || item.productVariant.product?.price || 0;
    }
    return 0;
  };

  const getItemName = (item: CartItem) => {
    return item.productName || item.productVariant?.product?.name || 'Produk Busana Muslim';
  };

  const getItemVariantLabel = (item: CartItem) => {
    if (item.variantLabel) return item.variantLabel;
    if (item.productVariant) {
      return `${item.productVariant.color || ''} / ${item.productVariant.size || ''}`;
    }
    return '';
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + getItemPrice(item) * item.quantity;
    }, 0);
  };

  const adminFee = 4000;
  const subtotal = calculateSubtotal();
  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const grandTotal = subtotal - discount + shippingCost + adminFee;

  const handleSimulatePaymentSuccess = async () => {
    if (!mockDuitkuModal) return;
    try {
      setIsSimulatingPayment(true);
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantOrderId: mockDuitkuModal.orderNumber,
          resultCode: '00',
          amount: String(mockDuitkuModal.totalAmount),
          paymentCode: mockDuitkuModal.paymentType,
          reference: `TEST-REF-${mockDuitkuModal.orderNumber}`,
          is_mock: true,
        }),
      });

      if (res.ok) {
        router.push(`/orders?success=true&orderId=${mockDuitkuModal.orderId}&status=paid`);
      } else {
        alert('Gagal memproses simulasi webhook Duitku.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Silakan pilih alamat pengiriman');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          shippingCourier: courier,
          shippingService: service,
          shippingCost,
          voucherCode: appliedVoucher?.code || null,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pesanan');

      // 1. If COD, redirect directly
      if (paymentMethod === 'cod') {
        router.push(`/orders?success=true&orderId=${data.order.id}`);
        return;
      }

      const transactionRef = data.reference || data.snapToken;

      // 2. If mock mode or Duitku POP script is not loaded
      if (data.isMock || !window.checkout?.process) {
        if (!data.isMock && data.paymentUrl) {
          window.location.href = data.paymentUrl;
          return;
        }

        setMockDuitkuModal({
          orderId: data.order.id,
          orderNumber: data.order.orderNumber,
          totalAmount: data.order.totalAmount,
          paymentType: paymentMethod,
          paymentUrl: data.paymentUrl,
        });
        return;
      }

      // 3. Official Duitku Pop Checkout Process
      window.checkout.process(transactionRef, {
        defaultLanguage: 'id',
        successEvent: function () {
          router.push(`/orders?success=true&orderId=${data.order.id}&status=paid`);
        },
        pendingEvent: function () {
          router.push(`/orders?pending=true&orderId=${data.order.id}`);
        },
        errorEvent: function () {
          alert('Pembayaran dibatalkan atau gagal.');
          router.push(`/orders?orderId=${data.order.id}`);
        },
        closeEvent: function () {
          router.push(`/orders?orderId=${data.order.id}`);
        },
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <ShoppingBag className="w-16 h-16 text-blue-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Keranjang Anda Kosong</h2>
        <p className="text-slate-500 text-xs mb-6">Tambahkan beberapa produk sebelum melangkah ke checkout.</p>
        <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header (Screen 05) */}
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-800">
          <Link href="/cart" className="p-2.5 bg-[#0e172a] border border-slate-800 rounded-xl shadow-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Checkout Pesanan</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Lengkapi alamat pengiriman dan konfirmasi pembayaran Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Alamat Pengiriman (Screen 05) */}
            <div className="bg-[#0e172a] rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">1</div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" /> Informasi Pembeli &amp; Alamat
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs sm:text-sm font-bold text-blue-400 hover:text-white flex items-center gap-1.5 bg-blue-600/15 hover:bg-blue-600 px-4 py-2 rounded-xl border border-blue-500/30 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Tambah Alamat
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-4">Belum ada alamat pengiriman tersimpan</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-xs cursor-pointer"
                  >
                    + Tambah Alamat Baru
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-blue-500 bg-blue-600/15 shadow-md'
                          : 'border-slate-800 hover:border-slate-700 bg-[#070b14]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md">
                          Alamat Terpilih
                        </span>
                        {selectedAddressId === addr.id && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-white">{addr.recipientName} ({addr.phone})</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {addr.addressDetail}, {addr.district}, {addr.city}, {addr.province} {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Opsi Pengiriman (Screen 05) */}
            <div className="bg-[#0e172a] rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">2</div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" /> Pilih Kurir Pengiriman
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'JNE', name: 'JNE Express', cost: 18000, etd: '2-3 hari' },
                  { id: 'SiCepat', name: 'SiCepat Reguler', cost: 15000, etd: '1-2 hari' },
                  { id: 'JNT', name: 'J&T Express', cost: 16000, etd: '1-2 hari' },
                  { id: 'GoSend', name: 'GoSend Instant', cost: 25000, etd: 'Hari ini' },
                ].map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setCourier(c.id);
                      setShippingCost(c.cost);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                      courier === c.id
                        ? 'border-blue-500 bg-blue-600/15 shadow-md'
                        : 'border-slate-800 hover:border-slate-700 bg-[#070b14]'
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{c.name}</p>
                    <p className="text-xs text-blue-400 font-black mt-1">{formatRupiah(c.cost)}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{c.etd}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Metode Pembayaran (Screen 05 & 06) */}
            <div className="bg-[#0e172a] rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">3</div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" /> Metode Pembayaran
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    id: 'bank_transfer', 
                    name: 'Duitku Payment Gateway (Virtual Account)', 
                    desc: 'BCA, Mandiri, BNI, BRI, Permata - Otomatis terverifikasi instan',
                    badge: 'Duitku VA' 
                  },
                  { 
                    id: 'qris', 
                    name: 'Duitku QRIS & E-Wallet', 
                    desc: 'Scan QRIS via GoPay, OVO, ShopeePay, DANA, LinkAja',
                    badge: 'Duitku QRIS' 
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start justify-between gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-blue-500 bg-blue-600/15 shadow-md'
                        : 'border-slate-800 hover:border-slate-700 bg-[#070b14]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="mt-1 accent-blue-500"
                      />
                      <div>
                        <p className="font-bold text-xs text-white">{pm.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pm.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 text-blue-400 bg-blue-500/15 border border-blue-500/30">
                      {pm.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Screen 05) */}
          <div className="space-y-6">
            <div className="bg-[#0e172a] rounded-3xl p-6 shadow-xl border border-slate-800 sticky top-28">
              <h2 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                Ringkasan Pesanan
              </h2>

              {/* Product items list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#070b14] text-blue-400 flex items-center justify-center font-bold shrink-0 border border-slate-800">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{getItemName(item)}</p>
                      <p className="text-[11px] text-slate-400">{getItemVariantLabel(item)} x {item.quantity}</p>
                    </div>
                    <span className="font-extrabold text-white">
                      {formatRupiah(getItemPrice(item) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher code input */}
              <div className="mb-4 pt-3 border-t border-slate-800">
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none z-10" />
                    <input
                      type="text"
                      placeholder="Kode Voucher (Coba: DISKON50K)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      style={{ paddingLeft: '44px' }}
                      className="w-full text-xs h-10 pr-3 bg-[#070b14] border border-slate-800 rounded-xl focus:border-blue-500 uppercase font-semibold text-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-5 h-10 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md shadow-blue-600/30 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                  >
                    Pakai
                  </button>
                </div>
                {voucherError && <p className="text-[11px] text-rose-400 font-medium mt-1">{voucherError}</p>}
                {appliedVoucher && (
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">
                    ✓ Voucher &quot;{appliedVoucher.code}&quot; terpasang! Diskon {formatRupiah(appliedVoucher.discount)}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal Produk</span>
                  <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Diskon Voucher</span>
                    <span>-{formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold text-white">{formatRupiah(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-3 mt-3">
                  <span>Total Pembayaran</span>
                  <span className="text-blue-400 font-black text-lg">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Action Button (Screen 05) */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || !selectedAddressId}
                className="w-full mt-6 py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses Pesanan...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> Bayar Sekarang (Duitku)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      {/* Modal Tambah Alamat */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e172a] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Tambah Alamat Pengiriman</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Label Alamat</label>
                <input
                  type="text"
                  placeholder="Contoh: Rumah, Kantor"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full text-xs p-2.5 bg-[#070b14] border border-slate-800 text-white rounded-xl focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Nama Penerima</label>
                  <input
                    type="text"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#070b14] border border-slate-800 text-white rounded-xl focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">No. HP / WA</label>
                  <input
                    type="text"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#070b14] border border-slate-800 text-white rounded-xl focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  placeholder="Jl. Contoh No. 123, RT 01/02"
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                  className="w-full text-xs p-2.5 bg-[#070b14] border border-slate-800 text-white rounded-xl focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#070b14] border border-slate-800 text-white rounded-xl focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Kode Pos</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#070b14] border border-slate-800 text-white rounded-xl focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-400 bg-slate-800 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 cursor-pointer"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duitku Sandbox Simulation Modal (Screen 06) */}
      {mockDuitkuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-black text-white tracking-tight">
                  Pembayaran via Duitku
                </h3>
              </div>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-full">
                Sandbox Mode
              </span>
            </div>

            {/* Virtual Account Detail Box (Screen 06) */}
            <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">BCA Virtual Account</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Aktif
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nomor Virtual Account:</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-mono font-black text-blue-400 tracking-wider">
                    1234 5678 9012 3456
                  </span>
                  <button 
                    onClick={() => navigator.clipboard?.writeText('1234567890123456')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">Total Pembayaran:</span>
                <span className="text-base font-black text-white">
                  {formatRupiah(mockDuitkuModal.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-amber-400">
                <span>Batas Waktu Pembayaran:</span>
                <span className="font-bold">23 Jam 59 Menit</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {mockDuitkuModal.paymentUrl && (
                <a
                  href={mockDuitkuModal.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-500/30"
                >
                  Buka Portal Duitku Checkout Pop-up &rarr;
                </a>
              )}

              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={isSimulatingPayment}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses Callback Duitku...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Simulasikan Bayar Berhasil (Sandbox)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/orders?orderId=${mockDuitkuModal.orderId}`)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center block"
              >
                Bayar Nanti (Ke Riwayat Pesanan)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duitku Pop JS Sandbox Script */}
      <Script
        src="https://app-sandbox.duitku.com/lib/js/duitku.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
