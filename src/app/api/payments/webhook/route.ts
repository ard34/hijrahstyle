import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyDuitkuCallbackSignature, isDuitkuConfigured } from '@/lib/duitku';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value.toString();
      });
    } else {
      try {
        body = await request.json();
      } catch {
        const text = await request.text();
        const params = new URLSearchParams(text);
        params.forEach((value, key) => {
          body[key] = value;
        });
      }
    }

    // Extract parameters (support Duitku naming and fallback aliases)
    const merchantOrderId = body.merchantOrderId || body.order_id || body.orderNumber;
    const resultCode = body.resultCode || (body.transaction_status === 'settlement' || body.transaction_status === 'capture' ? '00' : '01');
    const amount = body.amount || body.gross_amount;
    const reference = body.reference || body.transaction_id || '';
    const signature = body.signature || body.signature_key || '';
    const merchantCode = body.merchantCode || process.env.DUITKU_MERCHANT_CODE || '';
    const paymentCode = body.paymentCode || body.payment_type || 'duitku';
    const isMock = Boolean(body.is_mock);

    if (!merchantOrderId) {
      return NextResponse.json({ error: 'Missing merchantOrderId' }, { status: 400 });
    }

    // If Duitku is configured and not internal mock test, verify callback signature
    if (isDuitkuConfigured() && !isMock && signature) {
      const isValid = verifyDuitkuCallbackSignature({
        merchantCode,
        amount,
        merchantOrderId,
        signature,
      });

      if (!isValid) {
        console.error('Invalid Duitku signature for order:', merchantOrderId);
        return new Response('Bad Signature', { status: 400 });
      }
    }

    // Find the order (support exact orderNumber or base orderNumber if retry suffix was appended)
    let order = await prisma.order.findUnique({
      where: { orderNumber: merchantOrderId },
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

    if (!order && typeof merchantOrderId === 'string' && merchantOrderId.startsWith('HS-')) {
      const parts = merchantOrderId.split('-');
      if (parts.length >= 3) {
        const baseOrderNumber = `${parts[0]}-${parts[1]}-${parts[2]}`;
        order = await prisma.order.findUnique({
          where: { orderNumber: baseOrderNumber },
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
      }
    }

    if (!order) {
      console.warn('Order not found for Duitku notification:', merchantOrderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let newPaymentStatus = order.payment?.status || 'pending';
    let newOrderStatus = order.status;
    let shouldRestoreStock = false;
    let paidAt: Date | null = null;

    if (resultCode === '00') {
      // 00: Payment Success in Duitku
      newPaymentStatus = 'paid';
      newOrderStatus = 'PROCESSING';
      paidAt = new Date();
    } else {
      // 01: Failed / Cancelled / Expired
      newPaymentStatus = 'cancelled';
      newOrderStatus = 'CANCELLED';
      if (order.status !== 'CANCELLED') {
        shouldRestoreStock = true;
      }
    }

    // Process database updates inside transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update Payment
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: newPaymentStatus,
            paymentMethod: paymentCode || order.payment.paymentMethod || 'duitku',
            providerPaymentId: reference || order.payment.providerPaymentId,
            paidAt: paidAt || order.payment.paidAt,
          },
        });

        // 2. Log Payment Event
        await tx.paymentEvent.create({
          data: {
            paymentId: order.payment.id,
            eventType: resultCode === '00' ? 'SUCCESS' : 'FAILED',
            providerReference: reference || null,
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

      // 4. Restore stock if cancelled
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

    console.log(`✅ Duitku Webhook processed for order ${merchantOrderId}: ${newOrderStatus} (${newPaymentStatus})`);
    
    // Duitku expects HTTP 200 with 'OK' response text
    return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    console.error('Duitku Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
