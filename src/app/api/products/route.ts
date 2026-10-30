import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const fallbackProducts = [
  {
    id: 'prod-1',
    name: 'Sneakers Vortex BBN Edition',
    title: 'Sneakers Vortex BBN Edition',
    slug: 'sneakers-vortex',
    sku: 'BBN-SNK-01',
    price: 599000,
    compareAtPrice: 699000,
    totalSold: 120,
    images: [{ id: 'img-1', imageUrl: '/products/sneakers-vortex.png', url: '/products/sneakers-vortex.png', sortOrder: 1 }],
    category: { id: 'cat-2', name: 'Sepatu', slug: 'sepatu' },
    variants: [{ id: 'v-1', color: 'Hitam/Biru Neon', size: '42', stock: 45 }],
    reviews: [{ rating: 5 }, { rating: 5 }],
    avgRating: 5.0,
    reviewCount: 2,
    totalStock: 45,
    colors: ['Hitam/Biru Neon'],
    sizes: ['40', '41', '42', '43', '44'],
  },
  {
    id: 'prod-2',
    name: 'Hoodie BBN Premium',
    title: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    sku: 'BBN-HD-02',
    price: 249000,
    compareAtPrice: 299000,
    totalSold: 95,
    images: [{ id: 'img-2', imageUrl: '/products/hoodie-bbn.jpg', url: '/products/hoodie-bbn.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-2', color: 'Midnight Black', size: 'L', stock: 60 }],
    reviews: [{ rating: 4.9 }],
    avgRating: 4.9,
    reviewCount: 1,
    totalStock: 60,
    colors: ['Midnight Black'],
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'prod-3',
    name: 'Kaos Forge Cyber Edition',
    title: 'Kaos Forge Cyber Edition',
    slug: 'kaos-forge',
    sku: 'BBN-TSH-03',
    price: 129000,
    compareAtPrice: 159000,
    totalSold: 180,
    images: [{ id: 'img-3', imageUrl: '/products/kaos-forge.jpg', url: '/products/kaos-forge.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-3', color: 'Black', size: 'L', stock: 80 }],
    reviews: [{ rating: 4.9 }],
    avgRating: 4.9,
    reviewCount: 1,
    totalStock: 80,
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-4',
    name: 'Jaket Windbreaker Tactical',
    title: 'Jaket Windbreaker Tactical',
    slug: 'jaket-windbreaker',
    sku: 'BBN-JKT-04',
    price: 299000,
    compareAtPrice: 389000,
    totalSold: 74,
    images: [{ id: 'img-4', imageUrl: '/products/jaket-windbreaker.jpg', url: '/products/jaket-windbreaker.jpg', sortOrder: 1 }],
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    variants: [{ id: 'v-4', color: 'Cyber Dark', size: 'L', stock: 35 }],
    reviews: [{ rating: 4.9 }],
    avgRating: 4.9,
    reviewCount: 1,
    totalStock: 35,
    colors: ['Cyber Dark'],
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'prod-5',
    name: 'Tas Sling BBN Utility',
    title: 'Tas Sling BBN Utility',
    slug: 'tas-sling-bbn',
    sku: 'BBN-BAG-05',
    price: 189000,
    compareAtPrice: 239000,
    totalSold: 110,
    images: [{ id: 'img-5', imageUrl: '/products/tas-sling.jpg', url: '/products/tas-sling.jpg', sortOrder: 1 }],
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    variants: [{ id: 'v-5', color: 'Black', size: 'All Size', stock: 50 }],
    reviews: [{ rating: 4.8 }],
    avgRating: 4.8,
    reviewCount: 1,
    totalStock: 50,
    colors: ['Black'],
    sizes: ['All Size'],
  },
  {
    id: 'prod-6',
    name: 'Topi Trucker Forge Cyber',
    title: 'Topi Trucker Forge Cyber',
    slug: 'topi-trucker',
    sku: 'BBN-CAP-06',
    price: 99000,
    compareAtPrice: 129000,
    totalSold: 88,
    images: [{ id: 'img-6', imageUrl: '/products/topi-trucker.jpg', url: '/products/topi-trucker.jpg', sortOrder: 1 }],
    category: { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris' },
    variants: [{ id: 'v-6', color: 'Black/Grey', size: 'Adjustable', stock: 40 }],
    reviews: [{ rating: 4.7 }],
    avgRating: 4.7,
    reviewCount: 1,
    totalStock: 40,
    colors: ['Black/Grey'],
    sizes: ['Adjustable'],
  },
  {
    id: 'prod-7',
    name: 'Smartwatch Forge X Futuristic',
    title: 'Smartwatch Forge X Futuristic',
    slug: 'smartwatch-forge-x',
    sku: 'BBN-WAT-07',
    price: 899000,
    compareAtPrice: 1199000,
    totalSold: 64,
    images: [{ id: 'img-7', imageUrl: '/products/smartwatch-forge-x.jpg', url: '/products/smartwatch-forge-x.jpg', sortOrder: 1 }],
    category: { id: 'cat-5', name: 'Elektronik', slug: 'elektronik' },
    variants: [{ id: 'v-7', color: 'Space Grey', size: 'Standard', stock: 25 }],
    reviews: [{ rating: 5.0 }],
    avgRating: 5.0,
    reviewCount: 1,
    totalStock: 25,
    colors: ['Space Grey'],
    sizes: ['Standard'],
  },
  {
    id: 'prod-8',
    name: 'Backpack Cyber BBN Waterproof',
    title: 'Backpack Cyber BBN Waterproof',
    slug: 'backpack-cyber-bbn',
    sku: 'BBN-BP-08',
    price: 349000,
    compareAtPrice: 429000,
    totalSold: 52,
    images: [{ id: 'img-8', imageUrl: '/products/tas-sling.jpg', url: '/products/tas-sling.jpg', sortOrder: 1 }],
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    variants: [{ id: 'v-8', color: 'Tactical Black', size: '25L', stock: 30 }],
    reviews: [{ rating: 4.9 }],
    avgRating: 4.9,
    reviewCount: 1,
    totalStock: 30,
    colors: ['Tactical Black'],
    sizes: ['25L'],
  },
];

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

    const finalProducts = productsWithMeta.length > 0 ? productsWithMeta : fallbackProducts;
    const finalTotal = total > 0 ? total : fallbackProducts.length;

    return NextResponse.json({
      products: finalProducts,
      pagination: {
        page,
        limit,
        total: finalTotal,
        totalPages: Math.ceil(finalTotal / limit),
      },
    });
  } catch (error) {
    console.warn('Products API DB error, serving fallback BBN products:', error);
    return NextResponse.json({
      products: fallbackProducts,
      pagination: {
        page: 1,
        limit: 12,
        total: fallbackProducts.length,
        totalPages: 1,
      },
    });
  }
}
