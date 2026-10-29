import prisma from '@/lib/prisma';
import { cancelDuitkuTransaction } from '@/lib/duitku';

export async function cancelOrderById(orderId: string, cancelledBy: 'customer' | 'admin' = 'customer') {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payment: true,
      items: {
        include: {
          productVariant: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Pesanan tidak ditemukan');
  }

  if (order.status === 'CANCELLED') {
    return { success: true, message: 'Pesanan sudah berstatus dibatalkan', order };
  }

  if (['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
    throw new Error('Pesanan yang sudah dalam proses pengiriman tidak dapat dibatalkan');
  }

  // 1. Cancel transaction context in Duitku
  try {
    await cancelDuitkuTransaction(order.orderNumber);
  } catch (err) {
    console.warn(`Duitku cancel call warning for ${order.orderNumber}:`, err);
  }

  // 2. Perform atomic database updates and restore product stock
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Update payment record
    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'cancelled',
        },
      });

      // Log payment audit event
      await tx.paymentEvent.create({
        data: {
          paymentId: order.payment.id,
          eventType: 'cancel',
          payload: JSON.stringify({
            cancelledBy,
            cancelledAt: new Date().toISOString(),
            orderNumber: order.orderNumber,
          }),
        },
      });
    }

    // Restore stock for all ordered items
    for (const item of order.items) {
      if (item.productVariantId) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { stock: { increment: item.quantity } },
        });

        if (item.productVariant?.productId) {
          await tx.product.update({
            where: { id: item.productVariant.productId },
            data: { totalSold: { decrement: item.quantity } },
          });
        }
      }
    }

    // Update order status
    return await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
      },
      include: {
        payment: true,
        items: true,
      },
    });
  });

  return { success: true, message: 'Pesanan berhasil dibatalkan dan stok dikembalikan', order: updatedOrder };
}
