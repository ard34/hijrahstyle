import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json();
    const { name, categoryId, sku, description, material, price, compareAtPrice, slug, variants } = body;

    if (!name || !categoryId || !sku || !price) {
      return NextResponse.json({ error: 'Field wajib belum lengkap' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        categoryId,
        sku,
        description,
        material,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        status: 'ACTIVE',
        variants: variants ? {
          create: variants.map((v: any) => ({
            sku: `${sku}-${v.color?.substring(0, 3).toUpperCase()}-${v.size}`,
            color: v.color,
            size: v.size,
            stock: parseInt(v.stock) || 0,
            status: 'ACTIVE',
          })),
        } : undefined,
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
