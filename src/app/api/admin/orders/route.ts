import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { productVariant: { include: { product: { select: { name: true } } } } },
        },
        payment: true,
        shipment: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID wajib' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    if (trackingNumber) {
      await prisma.shipment.updateMany({
        where: { orderId },
        data: {
          trackingNumber,
          shippedAt: new Date(),
        },
      });
      if (!status) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'SHIPPED' },
        });
      }
    }

    return NextResponse.json({ message: 'Order berhasil diperbarui', order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

