import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createDuitkuTransaction } from '@/lib/duitku';

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

    // Generate or re-generate Duitku transaction
    const transactionResult = await createDuitkuTransaction({
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
          name: item.productNameSnapshot,
          price: item.price,
          quantity: item.quantity,
        })),
        ...(order.shippingAmount > 0
          ? [
              {
                name: 'Ongkos Kirim',
                price: order.shippingAmount,
                quantity: 1,
              },
            ]
          : []),
        ...(order.adminFee && order.adminFee > 0
          ? [
              {
                name: 'Biaya Layanan & Pengemasan',
                price: order.adminFee,
                quantity: 1,
              },
            ]
          : []),
        ...(order.discountAmount > 0
          ? [
              {
                name: 'Diskon Voucher',
                price: -order.discountAmount,
                quantity: 1,
              },
            ]
          : []),
      ],
      paymentMethod: order.payment?.paymentMethod || undefined,
    });

    // Update payment record with reference if available
    if (order.payment && transactionResult.reference) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          providerPaymentId: transactionResult.reference,
          provider: 'duitku',
        },
      });
    }

    return NextResponse.json({
      reference: transactionResult.reference,
      snapToken: transactionResult.reference, // alias for backwards compatibility
      paymentUrl: transactionResult.paymentUrl,
      redirectUrl: transactionResult.paymentUrl,
      isMock: transactionResult.isMock,
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
