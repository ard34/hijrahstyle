import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productVariantId: item.productVariant.id,
      productName: item.productVariant.product.name,
      variantLabel: `${item.productVariant.color} - ${item.productVariant.size}`,
      price: item.productVariant.priceOverride || item.productVariant.product.price,
      quantity: item.quantity,
      imageUrl: item.productVariant.product.images[0]?.imageUrl || '',
      stock: item.productVariant.stock,
      slug: item.productVariant.product.slug,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const body = await request.json();
    const { productVariantId, quantity = 1 } = body;

    if (!productVariantId) {
      return NextResponse.json({ error: 'Varian produk wajib dipilih' }, { status: 400 });
    }

    // Check variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      include: { product: true },
    });

    if (!variant || variant.status !== 'ACTIVE' || variant.product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Produk tidak tersedia' }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ error: 'Stok tidak mencukupi' }, { status: 400 });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.userId } });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productVariantId: { cartId: cart.id, productVariantId } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stock) {
        return NextResponse.json({ error: 'Melebihi stok yang tersedia' }, { status: 400 });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productVariantId, quantity },
      });
    }

    return NextResponse.json({ message: 'Berhasil ditambahkan ke keranjang' }, { status: 201 });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
