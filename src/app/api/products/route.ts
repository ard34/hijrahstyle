import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');
    const color = searchParams.get('color') || '';
    const size = searchParams.get('size') || '';

    const where: any = {
      status: 'ACTIVE',
      price: { gte: minPrice, lte: maxPrice },
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (color || size) {
      where.variants = {
        some: {
          status: 'ACTIVE',
          ...(color ? { color: { contains: color } } : {}),
          ...(size ? { size } : {}),
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'price-low': orderBy = { price: 'asc' }; break;
      case 'price-high': orderBy = { price: 'desc' }; break;
      case 'best-selling': orderBy = { totalSold: 'desc' }; break;
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      default: orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          category: true,
          variants: { where: { status: 'ACTIVE' } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithMeta = products.map((p) => ({
      ...p,
      avgRating: p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
      totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
      colors: [...new Set(p.variants.map(v => v.color))],
      sizes: [...new Set(p.variants.map(v => v.size))],
    }));

    return NextResponse.json({
      products: productsWithMeta,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
