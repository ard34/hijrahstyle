import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyMidtransSignature, isMidtransConfigured } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
      is_mock,
    } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // If Midtrans is configured and it's not an internal mock call, verify signature
    if (isMidtransConfigured() && !is_mock) {
      const isValid = verifyMidtransSignature({
        orderId: order_id,
        statusCode: status_code,
        grossAmount: gross_amount,
        signatureKey: signature_key,
      });

      if (!isValid) {
        console.error('Invalid Midtrans signature for order:', order_id);
        return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
      }
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
      include: {
        payment: true,
        items: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!order) {
      console.warn('Order not found for Midtrans notification:', order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let newPaymentStatus = order.payment?.status || 'pending';
    let newOrderStatus = order.status;
    let shouldRestoreStock = false;
    let paidAt: Date | null = null;

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newPaymentStatus = 'pending';
        newOrderStatus = 'PENDING_PAYMENT';
      } else if (fraud_status === 'accept') {
        newPaymentStatus = 'paid';
        newOrderStatus = 'PROCESSING';
        paidAt = new Date();
      }
    } else if (transaction_status === 'settlement') {
      newPaymentStatus = 'paid';
      newOrderStatus = 'PROCESSING';
      paidAt = new Date();
    } else if (transaction_status === 'pending') {
      newPaymentStatus = 'pending';
      newOrderStatus = 'PENDING_PAYMENT';
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      newPaymentStatus = transaction_status === 'expire' ? 'expired' : 'cancelled';
      newOrderStatus = 'CANCELLED';
      // If order was not already cancelled, restore stock
      if (order.status !== 'CANCELLED') {
        shouldRestoreStock = true;
      }
    } else if (transaction_status === 'refund') {
      newPaymentStatus = 'refunded';
      newOrderStatus = 'CANCELLED';
    }

    // Process updates inside a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update Payment
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: newPaymentStatus,
            paymentMethod: payment_type || order.payment.paymentMethod || 'midtrans',
            providerPaymentId: transaction_id || order.payment.providerPaymentId,
            paidAt: paidAt || order.payment.paidAt,
          },
        });

        // 2. Log Payment Event
        await tx.paymentEvent.create({
          data: {
            paymentId: order.payment.id,
            eventType: transaction_status || 'notification',
            providerReference: transaction_id || null,
            payload: JSON.stringify(body),
          },
        });
      }

      // 3. Update Order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: newOrderStatus,
        },
      });

      // 4. Restore stock if cancelled/expired
      if (shouldRestoreStock) {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stock: { increment: item.quantity } },
          });
          await tx.product.update({
            where: { id: item.productVariant.productId },
            data: { totalSold: { decrement: item.quantity } },
          });
        }
      }
    });

    console.log(`✅ Webhook processed for order ${order_id}: ${newOrderStatus} (${newPaymentStatus})`);
    return NextResponse.json({ status: 'OK', message: 'Notification processed' }, { status: 200 });
  } catch (error) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
