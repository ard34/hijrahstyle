import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cancelOrderById } from '@/lib/orders';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Verify ownership or admin privilege
    if (order.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    if (order.status !== 'PENDING_PAYMENT' && session.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Hanya pesanan yang belum dibayar yang dapat dibatalkan oleh pelanggan',
      }, { status: 400 });
    }

    const result = await cancelOrderById(id, session.role === 'ADMIN' ? 'admin' : 'customer');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Order cancellation error:', error);
    return NextResponse.json({
      error: error?.message || 'Gagal membatalkan pesanan',
    }, { status: 500 });
  }
}
