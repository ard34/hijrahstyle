import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import OrderDetailClient from './OrderDetailClient';

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
        user: { select: { name: true, email: true, phone: true } },
      },
    });
  } catch (err) {
    console.error('Fetch order detail error:', err);
  }

  // Fallback demo data if testing with simulated id
  if (!order) {
    order = {
      id: id || 'ord-demo',
      orderNumber: 'HS-20261031-DEMO',
      createdAt: new Date().toISOString(),
      status: 'PENDING_PAYMENT',
      subtotal: 599000,
      shippingAmount: 17000,
      adminFee: 4000,
      discountAmount: 0,
      totalAmount: 620000,
      user: {
        name: 'Siti Nurhaliza',
        email: 'siti@gmail.com',
        phone: '081234567890',
      },
      address: {
        recipientName: 'Siti Nurhaliza',
        addressDetail: 'Jl. Ahmad Yani No. 45, Cipocok Jaya',
        district: 'Cipocok Jaya',
        city: 'Kota Serang',
        province: 'Banten',
        postalCode: '42121',
        phone: '081234567890',
      },
      shipment: {
        courier: 'SiCepat',
        service: 'Layanan Reguler',
        shippingCost: 17000,
        trackingNumber: null,
      },
      payment: {
        provider: 'duitku',
        paymentMethod: 'va',
        status: 'pending',
      },
      items: [
        {
          id: 'item-demo-1',
          productNameSnapshot: 'Mukena Silk Premium Serang',
          variantSnapshot: 'Emerald Green • All Size',
          price: 599000,
          quantity: 1,
          imageUrl: '/products/kaos-forge.jpg',
        },
      ],
    };
  }

  return <OrderDetailClient order={order} />;
}
