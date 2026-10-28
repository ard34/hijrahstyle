'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { 
  Package, Clock, CheckCircle2, Truck, AlertCircle, 
  ChevronRight, Loader2, Copy, Check, CreditCard, Sparkles
} from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';

declare global {
  interface Window {
    snap?: any;
  }
}

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  variantSnapshot: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  subtotal: number;
  shippingAmount: number;
  adminFee?: number;
  discountAmount: number;
  items: OrderItem[];
  payment?: {
    status: string;
    provider: string;
  };
  shipment?: {
    courier: string;
    trackingNumber?: string;
    shippedAt?: string;
  };
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const isNewOrder = searchParams.get('success') === 'true';

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Midtrans Payment state
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [mockSnapModal, setMockSnapModal] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
  } | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePayNow = async (orderId: string) => {
    try {
      setPayingOrderId(orderId);
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses pembayaran');

      if (data.isMock || !window.snap) {
        setMockSnapModal({
          orderId: data.order.id,
          orderNumber: data.order.orderNumber,
          totalAmount: data.order.totalAmount,
        });
        return;
      }

      window.snap.pay(data.snapToken, {
        onSuccess: function () {
          fetchOrders();
        },
        onPending: function () {
          fetchOrders();
        },
        onError: function () {
          alert('Pembayaran dibatalkan atau gagal.');
        },
        onClose: function () {
          fetchOrders();
        },
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPayingOrderId(null);
    }
  };

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
          payment_type: 'bank_transfer',
          is_mock: true,
        }),
      });

      if (res.ok) {
        setMockSnapModal(null);
        fetchOrders();
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pembayaran Berhasil
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Package className="w-3.5 h-3.5" /> Sedang Diproses
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3.5 h-3.5" /> Dalam Pengiriman
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-[calc(100vh-140px)]">
      {/* Toast for newly placed order */}
      {isNewOrder && (
        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ✓
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-sm">Pesanan Berhasil Dibuat!</h3>
              <p className="text-xs text-emerald-800 mt-0.5">Terima kasih telah berbelanja di HijrahStyle. Silakan selesaikan pembayaran Anda.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pesanan Saya</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Riwayat transaksi &amp; status pengiriman belanja Anda</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-700 mx-auto" />
          <p className="text-xs text-slate-400 font-medium mt-2">Memuat pesanan Anda...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-slate-200/80 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-4 font-bold">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Pesanan</h3>
          <p className="text-xs text-slate-500 mb-6">Anda belum pernah melakukan transaksi di HijrahStyle.</p>
          <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs">
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
              {/* Header card */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Body items */}
              <div className="p-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-3.5 last:pb-0 last:border-none">
                    <div>
                      <p className="font-bold text-slate-900">{item.productNameSnapshot}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Varian: {item.variantSnapshot} x {item.quantity}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}

                {/* Payment instruction box for pending payment */}
                {order.status === 'PENDING_PAYMENT' && (
                  <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950">
                      <Clock className="w-4 h-4 text-amber-700" /> Instruksi Pembayaran Bank Transfer / QRIS:
                    </p>
                    <p>Silakan transfer ke <strong>BCA 123-456-7890</strong> a.n. <strong>PT HijrahStyle Indonesia</strong> sebesar <span className="font-extrabold text-purple-700 text-sm">{formatRupiah(order.totalAmount)}</span></p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => copyToClipboard('1234567890', order.id)}
                        className="px-3.5 py-1.5 bg-white border border-amber-300 rounded-xl font-mono font-bold text-amber-950 hover:bg-amber-100 transition-colors flex items-center gap-1.5 text-xs shadow-2xs"
                      >
                        {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy No. Rekening
                      </button>
                    </div>
                  </div>
                )}

                {/* Tracking info if shipped */}
                {order.shipment?.trackingNumber && (
                  <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="text-indigo-950 font-bold">Resi {order.shipment.courier}: <span className="font-mono">{order.shipment.trackingNumber}</span></p>
                      <p className="text-indigo-700 text-[11px] mt-0.5">Dikirim pada {formatDate(order.shipment.shippedAt || order.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer card */}
              <div className="p-4 sm:p-5 bg-slate-50/50 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-500 font-medium">Total Pembayaran: </span>
                  <span className="font-extrabold text-base text-purple-700 ml-1">{formatRupiah(order.totalAmount)}</span>
                </div>

                {order.status === 'PENDING_PAYMENT' && (
                  <button
                    onClick={() => handlePayNow(order.id)}
                    disabled={payingOrderId === order.id}
                    className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {payingOrderId === order.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menghubungkan...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" /> Bayar Sekarang (Midtrans)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
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
                Bayar Pesanan via Midtrans
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Nomor Pesanan: <strong className="text-slate-800 font-mono">#{mockSnapModal.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Tagihan:</span>
                <span className="font-extrabold text-purple-700 text-sm">
                  {formatRupiah(mockSnapModal.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Status:</span>
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
                onClick={() => setMockSnapModal(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
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

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700 mx-auto" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
