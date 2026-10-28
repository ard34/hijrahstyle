import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createMidtransTransaction } from '@/lib/midtrans';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Silakan login' }, { status: 401 });

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        items: true,
        address: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    if (order.status !== 'PENDING_PAYMENT') {
      return NextResponse.json({ error: 'Pesanan ini sudah dibayar atau dibatalkan' }, { status: 400 });
    }

    // Generate or re-generate Midtrans transaction
    const snapResult = await createMidtransTransaction({
      orderNumber: order.orderNumber,
      grossAmount: order.totalAmount,
      customer: {
        name: order.address?.recipientName || order.user.name,
        email: order.user.email,
        phone: order.address?.phone || order.user.phone || '081234567890',
        address: order.address
          ? {
              recipientName: order.address.recipientName,
              phone: order.address.phone,
              addressDetail: order.address.addressDetail,
              city: order.address.city,
              postalCode: order.address.postalCode,
            }
          : undefined,
      },
      items: [
        ...order.items.map((item) => ({
          id: item.productVariantId,
          name: item.productNameSnapshot,
          price: item.price,
          quantity: item.quantity,
        })),
        ...(order.shippingAmount > 0
          ? [
              {
                id: 'SHIPPING',
                name: 'Ongkos Kirim',
                price: order.shippingAmount,
                quantity: 1,
              },
            ]
          : []),
        ...(order.discountAmount > 0
          ? [
              {
                id: 'DISCOUNT',
                name: 'Diskon Voucher',
                price: -order.discountAmount,
                quantity: 1,
              },
            ]
          : []),
      ],
    });

    // Update payment record with snapToken if available
    if (order.payment && snapResult.token) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          providerPaymentId: snapResult.token,
          provider: 'midtrans',
        },
      });
    }

    return NextResponse.json({
      snapToken: snapResult.token,
      redirectUrl: snapResult.redirectUrl,
      isMock: snapResult.isMock,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error('Order pay error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
