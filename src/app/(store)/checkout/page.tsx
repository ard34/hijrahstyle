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
  quantity: number;
  productVariant: {
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

  // Payment method & Midtrans state
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [mockSnapModal, setMockSnapModal] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentType: string;
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

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.productVariant.priceOverride || item.productVariant.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const grandTotal = subtotal - discount + shippingCost;

  const handleSimulatePaymentSuccess = async () => {
    if (!mockSnapModal) return;
    try {
      setIsSimulatingPayment(true);
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: mockSnapModal.orderNumber,
          transaction_status: 'settlement',
          gross_amount: String(mockSnapModal.totalAmount),
          payment_type: mockSnapModal.paymentType,
          is_mock: true,
        }),
      });

      if (res.ok) {
        router.push(`/orders?success=true&orderId=${mockSnapModal.orderId}&status=paid`);
      } else {
        alert('Gagal memproses simulasi webhook.');
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

      // 2. If mock mode (sandbox dummy key without active Midtrans account)
      if (data.isMock || !window.snap) {
        setMockSnapModal({
          orderId: data.order.id,
          orderNumber: data.order.orderNumber,
          totalAmount: data.order.totalAmount,
          paymentType: paymentMethod,
        });
        return;
      }

      // 3. Real Midtrans Snap Modal
      window.snap.pay(data.snapToken, {
        onSuccess: function () {
          router.push(`/orders?success=true&orderId=${data.order.id}&status=paid`);
        },
        onPending: function () {
          router.push(`/orders?pending=true&orderId=${data.order.id}`);
        },
        onError: function () {
          alert('Pembayaran dibatalkan atau gagal.');
          router.push(`/orders?orderId=${data.order.id}`);
        },
        onClose: function () {
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
        <ShoppingBag className="w-16 h-16 text-purple-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Keranjang Anda Kosong</h2>
        <p className="text-slate-500 text-xs mb-6">Tambahkan beberapa produk sebelum melangkah ke checkout.</p>
        <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 bg-purple-700 text-white rounded-xl text-xs font-semibold hover:bg-purple-800 transition-colors shadow-xs">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
          <Link href="/cart" className="p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-slate-600 hover:text-purple-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Pesanan</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Lengkapi alamat pengiriman dan konfirmasi pembayaran Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Alamat Pengiriman */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">1</div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-700" /> Alamat Pengiriman
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Alamat
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl p-6">
                  <p className="text-xs text-slate-500 mb-4">Belum ada alamat pengiriman tersimpan</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-purple-700 text-white text-xs font-semibold rounded-xl hover:bg-purple-800 transition-colors shadow-xs"
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
                          ? 'border-purple-700 bg-purple-50/40 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                          Alamat Pengiriman
                        </span>
                        {selectedAddressId === addr.id && (
                          <Check className="w-4 h-4 text-purple-700" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-slate-900">{addr.recipientName} ({addr.phone})</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {addr.addressDetail}, {addr.district}, {addr.city}, {addr.province} {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Opsi Pengiriman */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">2</div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-700" /> Pengiriman &amp; Kurir
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'JNE', name: 'JNE Express', cost: 15000, etd: '2-3 hari' },
                  { id: 'JNT', name: 'J&T Express', cost: 14000, etd: '1-2 hari' },
                  { id: 'POS', name: 'Pos Indonesia', cost: 12000, etd: '3-4 hari' },
                ].map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setCourier(c.id);
                      setShippingCost(c.cost);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                      courier === c.id
                        ? 'border-purple-700 bg-purple-50/40 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="font-bold text-xs text-slate-900">{c.name}</p>
                    <p className="text-xs text-purple-700 font-extrabold mt-1">{formatRupiah(c.cost)}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Estimasi {c.etd}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Metode Pembayaran */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">3</div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-700" /> Metode Pembayaran
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    id: 'bank_transfer', 
                    name: 'Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata)', 
                    desc: 'Otomatis terverifikasi instan via Midtrans Snap Virtual Account',
                    badge: 'Midtrans VA' 
                  },
                  { 
                    id: 'qris', 
                    name: 'QRIS (GoPay, ShopeePay, OVO, DANA, LinkAja)', 
                    desc: 'Scan QRIS langsung dari aplikasi e-wallet apa saja melalui Midtrans',
                    badge: 'Midtrans QRIS' 
                  },
                  { 
                    id: 'cod', 
                    name: 'COD (Bayar Tunai di Tempat)', 
                    desc: 'Bayar tunai ke kurir saat busana muslim Anda tiba di rumah',
                    badge: 'Manual COD' 
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start justify-between gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-purple-700 bg-purple-50/40 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="mt-1 accent-purple-700"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900">{pm.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{pm.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      pm.badge.includes('Midtrans') 
                        ? 'text-purple-800 bg-purple-100 border border-purple-200' 
                        : 'text-slate-600 bg-slate-100'
                    }`}>
                      {pm.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 sticky top-28">
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Ringkasan Belanja
              </h2>

              {/* Product items list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs items-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0 border border-purple-100">
                      👗
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.productVariant.product.name}</p>
                      <p className="text-[11px] text-slate-400">{item.productVariant.color} / {item.productVariant.size} x {item.quantity}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {formatRupiah((item.productVariant.priceOverride || item.productVariant.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher code input */}
              <div className="mb-4 pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
                    <input
                      type="text"
                      placeholder="Kode Voucher (Coba: HIJRAH10)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      style={{ paddingLeft: '44px' }}
                      className="w-full text-xs h-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-600 uppercase font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-4 h-10 bg-purple-700 text-white text-xs font-semibold rounded-xl hover:bg-purple-800 transition-colors shrink-0"
                  >
                    Gunakan
                  </button>
                </div>
                {voucherError && <p className="text-[11px] text-rose-600 font-medium mt-1">{voucherError}</p>}
                {appliedVoucher && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    Voucher &quot;{appliedVoucher.code}&quot; terpasang! Diskon {formatRupiah(appliedVoucher.discount)}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Produk</span>
                  <span className="font-bold text-slate-900">{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Voucher</span>
                    <span>-{formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Pengiriman</span>
                  <span className="font-bold text-slate-900">{formatRupiah(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-3 mt-3">
                  <span>Total Pembayaran</span>
                  <span className="text-purple-700">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || !selectedAddressId}
                className="w-full mt-6 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses Pesanan...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Buat Pesanan Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      {/* Modal Tambah Alamat */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold font-heading text-gray-900 mb-4">Tambah Alamat Pengiriman</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Label Alamat</label>
                <input
                  type="text"
                  placeholder="Contoh: Rumah, Kantor"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Nama Penerima</label>
                  <input
                    type="text"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">No. HP / WA</label>
                  <input
                    type="text"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  placeholder="Jl. Merdeka No. 12, RT 01/02"
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Kode Pos</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Midtrans Sandbox Simulation Modal */}
      {mockSnapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-6 text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Mode Midtrans Sandbox (Testing)
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Simulasi Pembayaran Midtrans
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Pesanan <strong className="text-slate-800 font-mono">#{mockSnapModal.orderNumber}</strong> berhasil dibuat di sistem database.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Metode Pembayaran:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {mockSnapModal.paymentType === 'bank_transfer' ? 'Virtual Account Bank' : mockSnapModal.paymentType}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Tagihan:</span>
                <span className="font-extrabold text-purple-700 text-sm">
                  {formatRupiah(mockSnapModal.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Status Saat Ini:</span>
                <span className="font-bold text-amber-600">Menunggu Pembayaran</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={isSimulatingPayment}
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses Webhook...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Simulasikan Bayar Lunas (Tes Webhook)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/orders?orderId=${mockSnapModal.orderId}`)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Bayar Nanti (Ke Daftar Pesanan)
              </button>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Tips: Masukkan Client Key &amp; Server Key Midtrans Anda di file <code className="font-mono text-purple-600">.env</code> untuk mengaktifkan Popup Snap resmi Midtrans.
            </p>
          </div>
        </div>
      )}

      {/* Midtrans Snap JS Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-sample-key'}
        strategy="afterInteractive"
      />
    </main>
  );
}
