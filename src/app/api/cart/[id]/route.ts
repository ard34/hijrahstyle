import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true, productVariant: true },
    });

    if (!cartItem || cartItem.cart.userId !== session.userId) {
      return NextResponse.json({ error: 'Item tidak ditemukan' }, { status: 404 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Jumlah minimal 1' }, { status: 400 });
    }

    if (quantity > cartItem.productVariant.stock) {
      return NextResponse.json({ error: 'Melebihi stok yang tersedia' }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json({ message: 'Keranjang diperbarui' });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== session.userId) {
      return NextResponse.json({ error: 'Item tidak ditemukan' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id } });

    return NextResponse.json({ message: 'Item dihapus dari keranjang' });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
