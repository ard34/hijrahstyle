import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      todayOrders,
      pendingOrders,
      processingOrders,
      recentOrders,
      lowStockVariants,
      totalRevenue,
    ] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, payment: true },
      }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 }, status: 'ACTIVE' },
        include: { product: { select: { name: true } } },
        take: 10,
      }),
      prisma.order.aggregate({
        where: { status: { in: ['PAID', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'COMPLETED'] } },
        _sum: { totalAmount: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        todayOrders,
        pendingOrders,
        processingOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
      recentOrders,
      lowStockVariants,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
