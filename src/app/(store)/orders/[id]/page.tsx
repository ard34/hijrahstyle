import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatRupiah, formatDate } from '@/lib/utils';
import { 
  ChevronRight, ArrowLeft, CheckCircle2, Clock, 
  Package, Truck, MapPin, ShieldCheck, CreditCard 
} from 'lucide-react';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/orders/${id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      shipment: true,
      payment: true,
    },
  });

  if (!order || (order.userId !== user.id && user.role !== 'ADMIN')) {
    notFound();
  }

  // Stepper logic
  const steps = [
    { label: 'Menunggu Pembayaran', status: 'PENDING_PAYMENT' },
    { label: 'Dibayar', status: 'PAID' },
    { label: 'Diproses', status: 'PROCESSING' },
    { label: 'Dikirim', status: 'SHIPPED' },
    { label: 'Selesai', status: 'COMPLETED' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 0;
      case 'PAID': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED':
      case 'COMPLETED': return 4;
      default: return 1;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-[calc(100vh-140px)]">
      {/* Breadcrumb (Screen 08) */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-blue-400">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/orders" className="hover:text-blue-400">Riwayat Pesanan</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold">Detail Pesanan</span>
      </nav>

      {/* Main Container Card (Screen 08) */}
      <div className="bg-[#0e172a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
                #{order.orderNumber}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                order.status === 'PAID' || order.status === 'PROCESSING' 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : order.status === 'PENDING_PAYMENT' 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              }`}>
                {order.status === 'PAID' ? 'Dibayar' : order.status === 'PROCESSING' ? 'Diproses' : order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
          </div>

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-extrabold text-slate-200 hover:text-white transition-all border border-slate-700 hover:border-slate-600 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        {/* Status Stepper (Screen 08) */}
        <div className="py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
            {steps.map((s, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={s.status} className="flex flex-col items-center gap-2 relative z-10 bg-[#0e172a] px-2 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isPast || isCurrent
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold max-w-[80px] sm:max-w-[100px] leading-tight ${
                    isCurrent ? 'text-blue-400 font-bold' : isPast ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2 Grid Columns: Pengiriman & Ekspedisi (Screen 08) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Info Pengiriman */}
          <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Informasi Pengiriman
            </h3>
            <p className="text-sm font-bold text-white pt-1">
              {order.address?.recipientName || user.name}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {order.address ? `${order.address.addressDetail}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}` : 'Alamat Pengiriman Utama'}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              {order.address?.phone || user.phone || '081234567890'}
            </p>
          </div>

          {/* Ekspedisi & Pembayaran */}
          <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> Ekspedisi &amp; Pembayaran
            </h3>
            <div className="pt-1 flex justify-between text-xs">
              <span className="text-slate-400">Kurir Pengiriman:</span>
              <span className="font-bold text-white">{order.shipment?.courier || 'SiCepat Reguler'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Nomor Resi:</span>
              <span className="font-mono font-bold text-blue-400">
                {order.shipment?.trackingNumber || 'Menunggu Resi Kurir'}
              </span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Gateway:</span>
              <span className="font-bold text-emerald-400">Duitku Sandbox Verified</span>
            </div>
          </div>
        </div>

        {/* Product Items Table (Screen 08) */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white">Daftar Produk yang Dipesan</h3>
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-[#070b14]">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-bold">
                    📦
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.productNameSnapshot}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.variantSnapshot} x {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-white">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost Breakdown */}
        <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal Produk</span>
            <span className="font-bold text-white">{formatRupiah(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Potongan Diskon</span>
              <span>-{formatRupiah(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-400">
            <span>Biaya Pengiriman</span>
            <span className="font-bold text-white">{formatRupiah(order.shippingAmount)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-slate-800">
            <span>Total Pembayaran</span>
            <span className="text-blue-400">{formatRupiah(order.totalAmount)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

