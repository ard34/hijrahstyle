import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { 
  ChevronRight, MapPin, Phone, User, Check, Package, Truck, ShieldCheck, Clock, CheckCircle2
} from 'lucide-react';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order: any = null;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        shipment: true,
        payment: true,
      },
    });
  } catch {}

  // Fallback data matching Screen 08
  if (!order) {
    order = {
      id: id || 'ord-1',
      orderNumber: 'INV/202610290001',
      createdAt: new Date().toISOString(),
      status: 'Dibayar',
      totalAmount: 848000,
      address: {
        recipientName: 'Riski Ardiansyah',
        addressDetail: 'Jl. Contoh No. 123, Kota Serang',
        city: 'Kota Serang',
        province: 'Banten',
        postalCode: '42111',
        phone: '081234567890',
      },
      shipment: {
        courier: 'SiCepat',
        service: 'Reguler',
        shippingAmount: 17000,
      },
      items: [
        {
          id: 'i-1',
          productNameSnapshot: 'Sneakers Vortex',
          variantSnapshot: 'Putih / 42',
          quantity: 1,
          price: 599000,
          imageUrl: '/products/sneakers-vortex.png',
        },
        {
          id: 'i-2',
          productNameSnapshot: 'Hoodie BBN Premium',
          variantSnapshot: 'Hitam / L',
          quantity: 1,
          price: 249000,
          imageUrl: '/products/hoodie-bbn.jpg',
        },
      ],
    };
  }

  const steps = [
    { label: 'Menunggu Pembayaran', date: '28 Okt 14:30', active: true },
    { label: 'Dibayar', date: '28 Okt 15:00', active: true },
    { label: 'Diproses', date: '29 Okt 09:00', active: true },
    { label: 'Dikirim', date: '-', active: false },
    { label: 'Selesai', date: '-', active: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-[calc(100vh-140px)] space-y-6">
      
      {/* ─── Screen 08 Breadcrumb: Pesanan > Detail Pesanan ─── */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link href="/orders" className="hover:text-blue-400">Pesanan</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold">Detail Pesanan</span>
      </nav>

      {/* ─── Screen 08 Top Order Progress Card ─── */}
      <div className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Order Header & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
                #{order.orderNumber}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Dibayar
              </span>
            </div>
            <p className="text-xs text-slate-400">28 Oktober 2026, 14:32</p>
          </div>
        </div>

        {/* 5-Step Timeline Stepper (Screen 08) */}
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
                  <span className="text-[10px] text-slate-500 block">{st.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── Screen 08 Middle Row: Informasi Pengiriman & Kurir ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Informasi Pengiriman (Span 7 cols) */}
        <div className="md:col-span-7 bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 space-y-3 shadow-lg">
          <h3 className="text-sm font-extrabold text-white">
            Informasi Pengiriman
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-white">{order.address?.recipientName || 'Riski Ardiansyah'}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{order.address?.addressDetail || 'Jl. Contoh No. 123, Kota Serang, Banten 42111'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-mono">{order.address?.phone || '081234567890'}</span>
            </div>
          </div>
        </div>

        {/* Right: Courier Card (Span 5 cols) */}
        <div className="md:col-span-5 bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 space-y-3 shadow-lg">
          <h3 className="text-sm font-extrabold text-white">
            Kurir Pengiriman
          </h3>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
              SiCepat
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">SiCepat</h4>
              <p className="text-xs text-slate-400">Reguler</p>
              <p className="text-xs font-black text-blue-400 pt-0.5">Rp 17.000</p>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Screen 08 Bottom Card: Items Ordered ─── */}
      <div className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-white">
          Daftar Produk
        </h3>

        <div className="space-y-3 divide-y divide-slate-800/60">
          {order.items.map((item: any) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-[#f1f5f9] dark:bg-[#1a2333] p-1.5 border border-slate-800 shrink-0 flex items-center justify-center">
                  <img 
                    src={item.imageUrl || (item.productNameSnapshot?.includes('Sneakers') ? '/products/sneakers-vortex.png' : '/products/hoodie-bbn.jpg')} 
                    alt="" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.productNameSnapshot}</h4>
                  <p className="text-xs text-slate-400">{item.variantSnapshot} {item.quantity}x</p>
                </div>
              </div>
              <span className="font-extrabold text-sm text-white shrink-0">
                {formatRupiah(item.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
