import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cancelOrderById } from '@/lib/orders';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber, courier, service } = body;

    if (status === 'CANCELLED') {
      const result = await cancelOrderById(id, 'admin');
      return NextResponse.json({ message: 'Order berhasil dibatalkan di sistem & Midtrans', order: result.order });
    }

    const updateData: any = {};
    if (status) updateData.status = status;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // Update shipment if tracking info provided
    if (trackingNumber || courier) {
      await prisma.shipment.update({
        where: { orderId: id },
        data: {
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(courier ? { courier } : {}),
          ...(service ? { service } : {}),
          ...(status === 'SHIPPED' ? { shippedAt: new Date() } : {}),
          ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
        },
      });
    }

    // Update payment status
    if (status === 'PAID') {
      await prisma.payment.update({
        where: { orderId: id },
        data: { status: 'paid', paidAt: new Date() },
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
