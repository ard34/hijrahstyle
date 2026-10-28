import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { createMidtransTransaction } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Silakan login' }, { status: 401 });

    const body = await request.json();
    const { 
      addressId, 
      shippingCourier, 
      shippingService, 
      shippingCost = 0, 
      voucherCode, 
      paymentMethod = 'midtrans' 
    } = body;

    if (!addressId) {
      return NextResponse.json({ error: 'Alamat pengiriman wajib dipilih' }, { status: 400 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true, phone: true },
    });

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.userId },
    });
    if (!address) return NextResponse.json({ error: 'Alamat tidak ditemukan' }, { status: 404 });

    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.productVariant.stock < item.quantity) {
        return NextResponse.json({
          error: `Stok ${item.productVariant.product.name} (${item.productVariant.color}/${item.productVariant.size}) tidak mencukupi`,
        }, { status: 400 });
      }
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.productVariant.priceOverride || item.productVariant.product.price;
      return sum + (price * item.quantity);
    }, 0);

    // Apply voucher
    let discountAmount = 0;
    let voucher = null;
    if (voucherCode) {
      voucher = await prisma.voucher.findUnique({ where: { code: voucherCode } });
      if (voucher && voucher.status === 'ACTIVE' && new Date() >= voucher.startsAt && new Date() <= voucher.expiresAt) {
        if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
          return NextResponse.json({ error: 'Kuota voucher sudah habis' }, { status: 400 });
        }
        if (subtotal < voucher.minimumPurchase) {
          return NextResponse.json({ error: `Minimum belanja ${voucher.minimumPurchase} untuk voucher ini` }, { status: 400 });
        }
        if (voucher.type === 'PERCENTAGE') {
          discountAmount = (subtotal * voucher.value) / 100;
          if (voucher.maximumDiscount && discountAmount > voucher.maximumDiscount) {
            discountAmount = voucher.maximumDiscount;
          }
        } else {
          discountAmount = voucher.value;
        }
      }
    }

    const finalShippingCost = Number(shippingCost) || 0;
    const adminFee = 4000; // Biaya layanan & pengemasan
    const totalAmount = subtotal - discountAmount + finalShippingCost + adminFee;
    const orderNumber = generateOrderNumber();

    // Prepare Midtrans transaction if online payment
    let snapResult: { token: string; redirectUrl?: string; isMock?: boolean } | null = null;
    const isOnlinePayment = paymentMethod !== 'cod';

    if (isOnlinePayment) {
      const midtransItems = cart.items.map((item) => ({
        id: item.productVariant.id,
        name: item.productVariant.product.name,
        price: item.productVariant.priceOverride || item.productVariant.product.price,
        quantity: item.quantity,
      }));

      if (finalShippingCost > 0) {
        midtransItems.push({
          id: 'SHIPPING',
          name: `Ongkir (${shippingCourier || 'Kurir'})`,
          price: finalShippingCost,
          quantity: 1,
        });
      }

      if (adminFee > 0) {
        midtransItems.push({
          id: 'PACKAGING_FEE',
          name: 'Biaya Layanan & Pengemasan',
          price: adminFee,
          quantity: 1,
        });
      }

      if (discountAmount > 0) {
        midtransItems.push({
          id: 'DISCOUNT',
          name: 'Diskon Voucher',
          price: -discountAmount,
          quantity: 1,
        });
      }

      try {
        snapResult = await createMidtransTransaction({
          orderNumber,
          grossAmount: totalAmount,
          customer: {
            name: address.recipientName || user?.name || 'Customer',
            email: user?.email || 'customer@example.com',
            phone: address.phone || user?.phone || '081234567890',
            address: {
              recipientName: address.recipientName,
              phone: address.phone,
              addressDetail: address.addressDetail,
              city: address.city,
              postalCode: address.postalCode,
            },
          },
          items: midtransItems,
        });
      } catch (err) {
        console.error('Midtrans token generation error:', err);
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.userId,
        addressId,
        subtotal,
        discountAmount,
        shippingAmount: finalShippingCost,
        adminFee,
        totalAmount,
        voucherId: voucher?.id || null,
        status: 'PENDING_PAYMENT',
        items: {
          create: cart.items.map((item) => ({
            productVariantId: item.productVariant.id,
            productNameSnapshot: item.productVariant.product.name,
            variantSnapshot: `${item.productVariant.color} - ${item.productVariant.size}`,
            price: item.productVariant.priceOverride || item.productVariant.product.price,
            quantity: item.quantity,
            subtotal: (item.productVariant.priceOverride || item.productVariant.product.price) * item.quantity,
          })),
        },
        payment: {
          create: {
            provider: isOnlinePayment ? 'midtrans' : 'manual',
            paymentMethod: paymentMethod,
            providerPaymentId: snapResult?.token || null,
            amount: totalAmount,
            status: 'pending',
          },
        },
        shipment: {
          create: {
            courier: shippingCourier || 'JNE',
            service: shippingService || 'REG',
            shippingCost,
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    // Reduce stock
    for (const item of cart.items) {
      await prisma.productVariant.update({
        where: { id: item.productVariant.id },
        data: { stock: { decrement: item.quantity } },
      });
      await prisma.product.update({
        where: { id: item.productVariant.product.id },
        data: { totalSold: { increment: item.quantity } },
      });
    }

    // Update voucher usage
    if (voucher) {
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({
      message: 'Pesanan berhasil dibuat',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
      snapToken: snapResult?.token || null,
      redirectUrl: snapResult?.redirectUrl || null,
      isMock: snapResult?.isMock || false,
    }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
