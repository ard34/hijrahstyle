import prisma from '@/lib/prisma';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true, price: true } });
  if (!product) return { title: 'Produk tidak ditemukan' };
  return {
    title: `${product.name} — Toko Sample BBN`,
    description: product.description?.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      variants: { where: { status: 'ACTIVE' }, orderBy: [{ color: 'asc' }, { size: 'asc' }] },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: 'ACTIVE' },
    include: {
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
      category: true,
      reviews: { select: { rating: true } },
      variants: { where: { status: 'ACTIVE' } },
    },
    take: 4,
  });

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const colors = [...new Set(product.variants.map(v => v.color))];
  const sizes = [...new Set(product.variants.map(v => v.size))];

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      avgRating={avgRating}
      colors={colors}
      sizes={sizes}
    />
  );
}
