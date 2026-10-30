'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, MapPin, Phone, User, Check, Package, Truck, 
  CreditCard, Sparkles, Clock, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

export default function OrderDetailClient({ order }: { order: any }) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const isPending = order.status === 'PENDING_PAYMENT';
  const isPaid = order.status === 'PAID';
  const isProcessingStatus = order.status === 'PROCESSING';
  const isShipped = order.status === 'SHIPPED';
  const isDelivered = order.status === 'DELIVERED' || order.status === 'COMPLETED';
  const isCancelled = order.status === 'CANCELLED';

  const steps = [
    { 
      label: 'Menunggu Pembayaran', 
      date: isPending ? 'Menunggu Anda' : 'Selesai', 
      active: true,
      current: isPending
    },
    { 
      label: 'Dibayar', 
      date: isPaid || isProcessingStatus || isShipped || isDelivered ? 'Dikonfirmasi' : '-', 
      active: !isPending && !isCancelled,
      current: isPaid
    },
    { 
      label: 'Diproses Butik', 
      date: isProcessingStatus || isShipped || isDelivered ? 'Sedang Dikemas' : '-', 
      active: isProcessingStatus || isShipped || isDelivered,
      current: isProcessingStatus
    },
    { 
      label: 'Dalam Pengiriman', 
      date: isShipped || isDelivered ? (order.shipment?.trackingNumber ? `Resi: ${order.shipment.trackingNumber}` : 'Dalam Kurir') : '-', 
      active: isShipped || isDelivered,
      current: isShipped
    },
    { 
      label: 'Pesanan Selesai', 
      date: isDelivered ? 'Diterima' : '-', 
      active: isDelivered,
      current: isDelivered
    },
  ];

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantOrderId: order.orderNumber,
          resultCode: '00',
          amount: order.totalAmount,
          is_mock: true,
        }),
      });

      if (res.ok) {
        addToast('Pembayaran Duitku berhasil dikonfirmasi! Status kini DIPROSES 🎉', 'success');
        router.refresh();
      } else {
        addToast('Gagal memproses simulasi pembayaran', 'error');
      }
    } catch {
      addToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    if (isPending) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Menunggu Pembayaran</span>
        </span>
      );
    }
    if (isPaid || isProcessingStatus) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isPaid ? 'Pembayaran Berhasil' : 'Pesanan Sedang Diproses'}</span>
        </span>
      );
    }
    if (isShipped) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" />
          <span>Sedang Dikirim</span>
        </span>
      );
    }
    if (isDelivered) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Pesanan Selesai</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
        Dibatalkan
      </span>
    );
  };

  const dateStr = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 w-full min-h-[calc(100vh-140px)] space-y-6 animate-fade-in-up">
      
      {/* ─── Breadcrumb ─── */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
        <Link href="/orders" className="hover:text-blue-400 transition-colors">Riwayat Pesanan</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold">Detail Pesanan</span>
      </nav>

      {/* ─── Top Order Progress Card ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Order Header & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
                #{order.orderNumber}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-400">{dateStr}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Total Tagihan</span>
            <span className="text-xl font-black text-blue-400">{formatRupiah(order.totalAmount)}</span>
          </div>
        </div>

        {/* 5-Step Timeline Stepper */}
        {!isCancelled && (
          <div className="relative pt-4 pb-2">
            <div className="absolute top-8 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
            <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
              {steps.map((st, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    st.active 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                      : 'bg-[#070b14] border border-slate-700 text-slate-500'
                  }`}>
                    {st.active ? <Check className="w-4 h-4 stroke-[3]" /> : i + 1}
                  </div>
                  <div className="space-y-0.5">
                    <span className={`text-[11px] font-bold block ${st.active ? 'text-white' : 'text-slate-500'}`}>
                      {st.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[80px] sm:max-w-none">
                      {st.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banner Aksi Pembayaran jika PENDING_PAYMENT */}
        {isPending && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-1.5 justify-center sm:justify-start">
                <AlertCircle className="w-4 h-4" />
                <span>Menunggu Konfirmasi Pembayaran</span>
              </h3>
              <p className="text-xs text-slate-300">
                Silakan lakukan transfer atau gunakan simulasi sandbox untuk menyelesaikan pembayaran secara instan.
              </p>
            </div>
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>⚡ Simulasi Bayar Berhasil (Sandbox)</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* ─── Middle Row: Informasi Pengiriman & Kurir ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Informasi Pengiriman */}
        <div className="md:col-span-7 bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Alamat Pengiriman Pelanggan</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-white">{order.address?.recipientName || order.user?.name || 'Pelanggan'}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                {order.address 
                  ? `${order.address.addressDetail}, ${order.address.district}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}`
                  : 'Kota Serang, Banten'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-mono text-white">{order.address?.phone || order.user?.phone || '081234567890'}</span>
            </div>
          </div>
        </div>

        {/* Right: Courier Card */}
        <div className="md:col-span-5 bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Kurir &amp; Ekspedisi</span>
          </h3>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-sm flex items-center justify-center shrink-0">
              {order.shipment?.courier?.substring(0, 3) || 'EXP'}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-white">{order.shipment?.courier || 'SiCepat'}</h4>
              <p className="text-xs text-slate-400">{order.shipment?.service || 'Layanan Reguler'}</p>
              <p className="text-xs font-black text-blue-400">{formatRupiah(order.shippingAmount || 17000)}</p>
            </div>
          </div>

          {order.shipment?.trackingNumber && (
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Nomor Resi Pengiriman:</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{order.shipment.trackingNumber}</span>
            </div>
          )}
        </div>

      </div>

      {/* ─── Bottom Card: Items Ordered & Financials ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 sm:p-8 space-y-6 shadow-xl">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-400" />
          <span>Daftar Busana &amp; Produk yang Dipesan</span>
        </h3>

        <div className="space-y-3 divide-y divide-slate-800/60">
          {order.items.map((item: any) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-[#10192e] p-1.5 border border-slate-800 shrink-0 flex items-center justify-center">
                  <img 
                    src={item.imageUrl || '/products/kaos-forge.jpg'} 
                    alt={item.productNameSnapshot} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.productNameSnapshot}</h4>
                  <p className="text-xs text-slate-400">{item.variantSnapshot} • {item.quantity} pcs</p>
                </div>
              </div>
              <span className="font-extrabold text-sm text-white shrink-0">
                {formatRupiah(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal Produk</span>
            <span className="font-bold text-white">{formatRupiah(order.subtotal || order.totalAmount - (order.shippingAmount || 0))}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Ongkos Kirim</span>
            <span className="font-bold text-white">{formatRupiah(order.shippingAmount || 0)}</span>
          </div>
          {order.adminFee > 0 && (
            <div className="flex justify-between text-slate-400">
              <span>Biaya Layanan &amp; Kemas</span>
              <span className="font-bold text-white">{formatRupiah(order.adminFee)}</span>
            </div>
          )}
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Diskon Voucher</span>
              <span className="font-bold">- {formatRupiah(order.discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm sm:text-base">
            <span className="font-black text-white">Total Tagihan</span>
            <span className="font-black text-lg text-blue-400">{formatRupiah(order.totalAmount)}</span>
          </div>
        </div>

      </div>

    </div>
  );
}

