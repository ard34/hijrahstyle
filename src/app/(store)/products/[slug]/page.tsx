import prisma from '@/lib/prisma';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

const fallbackProductsMap: Record<string, any> = {
  'sneakers-vortex': {
    id: 'prod-1',
    name: 'Sneakers Vortex BBN Edition',
    slug: 'sneakers-vortex',
    sku: 'BBN-SNK-01',
    description: 'Sneakers premium dengan desain modern cyber, bantalan Air Bubble responsif, dan material breathable untuk aktivitas harian.',
    material: 'Breathable Mesh & High Quality Rubber',
    price: 599000,
    compareAtPrice: 699000,
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Sepatu', slug: 'sepatu' },
    images: [{ id: 'img-1', imageUrl: '/products/sneakers-vortex.png', sortOrder: 1 }],
    variants: [
      { id: 'v-1', color: 'Hitam Neon', size: '40', stock: 10, status: 'ACTIVE' },
      { id: 'v-2', color: 'Hitam Neon', size: '41', stock: 12, status: 'ACTIVE' },
      { id: 'v-3', color: 'Hitam Neon', size: '42', stock: 15, status: 'ACTIVE' },
      { id: 'v-4', color: 'Hitam Neon', size: '43', stock: 8, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-1', rating: 5, comment: 'Sepatu sangat empuk dan keren banget tampilan neonnya!', createdAt: new Date().toISOString(), user: { name: 'Riski Ardiansyah' } },
      { id: 'r-2', rating: 5, comment: 'Pengiriman kilat, original Toko Sample BBN!', createdAt: new Date().toISOString(), user: { name: 'Dimas Pratama' } },
    ],
  },
  'hoodie-bbn-premium': {
    id: 'prod-2',
    name: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    sku: 'BBN-HD-02',
    description: 'Hoodie heavyweight cotton fleece 330gsm dengan cuttingan relaxed boxy fit dan sablon discharge awet.',
    material: 'Cotton Fleece 330 GSM',
    price: 249000,
    compareAtPrice: 299000,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    images: [{ id: 'img-2', imageUrl: '/products/hoodie-bbn.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-5', color: 'Midnight Black', size: 'M', stock: 20, status: 'ACTIVE' },
      { id: 'v-6', color: 'Midnight Black', size: 'L', stock: 25, status: 'ACTIVE' },
      { id: 'v-7', color: 'Midnight Black', size: 'XL', stock: 15, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-3', rating: 5, comment: 'Bahan tebal dan hangat, fitting sangat pas!', createdAt: new Date().toISOString(), user: { name: 'Ahmad Fauzi' } },
    ],
  },
  'kaos-forge': {
    id: 'prod-3',
    name: 'Kaos Forge Cyber Edition',
    slug: 'kaos-forge',
    sku: 'BBN-TSH-03',
    description: 'T-Shirt oversized 24s cotton combed dengan grafis cyber forge minimalis.',
    material: '100% Cotton Combed 24s',
    price: 129000,
    compareAtPrice: 159000,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    images: [{ id: 'img-3', imageUrl: '/products/kaos-forge.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-8', color: 'Black', size: 'M', stock: 30, status: 'ACTIVE' },
      { id: 'v-9', color: 'Black', size: 'L', stock: 30, status: 'ACTIVE' },
      { id: 'v-10', color: 'Black', size: 'XL', stock: 20, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-4', rating: 5, comment: 'Bahan adem, nyaman dipakai harian.', createdAt: new Date().toISOString(), user: { name: 'Budi' } },
    ],
  },
  'jaket-windbreaker': {
    id: 'prod-4',
    name: 'Jaket Windbreaker Tactical',
    slug: 'jaket-windbreaker',
    sku: 'BBN-JKT-04',
    description: 'Jaket windbreaker tahan air dan angin ringan dengan aksen saku taktis modern.',
    material: 'Taslan Water Repellent',
    price: 299000,
    compareAtPrice: 389000,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    images: [{ id: 'img-4', imageUrl: '/products/jaket-windbreaker.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-11', color: 'Cyber Dark', size: 'L', stock: 20, status: 'ACTIVE' },
      { id: 'v-12', color: 'Cyber Dark', size: 'XL', stock: 15, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-5', rating: 5, comment: 'Cocok buat riding malam, angin ketahan mantap.', createdAt: new Date().toISOString(), user: { name: 'Eko' } },
    ],
  },
  'tas-sling-bbn': {
    id: 'prod-5',
    name: 'Tas Sling BBN Utility',
    slug: 'tas-sling-bbn',
    sku: 'BBN-BAG-05',
    description: 'Sling bag taktis multifungsi dengan kompartemen empuk untuk gadget dan perlengkapan harian.',
    material: 'Cordura 1000D Waterproof',
    price: 189000,
    compareAtPrice: 239000,
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    images: [{ id: 'img-5', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-13', color: 'Black', size: 'All Size', stock: 50, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-6', rating: 5, comment: 'Muat tablet 11 inch dan barang kecil lainnya!', createdAt: new Date().toISOString(), user: { name: 'Reza' } },
    ],
  },
  'topi-trucker': {
    id: 'prod-6',
    name: 'Topi Trucker Forge Cyber',
    slug: 'topi-trucker',
    sku: 'BBN-CAP-06',
    description: 'Topi trucker dengan jaring breathable dan bordir timbul logo BBN.',
    material: 'Canvas & Breathable Mesh',
    price: 99000,
    compareAtPrice: 129000,
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris' },
    images: [{ id: 'img-6', imageUrl: '/products/topi-trucker.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-14', color: 'Black/Grey', size: 'Adjustable', stock: 40, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-7', rating: 5, comment: 'Bordiran rapi, bahan premium.', createdAt: new Date().toISOString(), user: { name: 'Rian' } },
    ],
  },
  'smartwatch-forge-x': {
    id: 'prod-7',
    name: 'Smartwatch Forge X Futuristic',
    slug: 'smartwatch-forge-x',
    sku: 'BBN-WAT-07',
    description: 'Smartwatch futuristik layar AMOLED HD dengan baterai tahan 14 hari dan sensor kesehatan lengkap.',
    material: 'Titanium Bezel & Silicone Strap',
    price: 899000,
    compareAtPrice: 1199000,
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Elektronik', slug: 'elektronik' },
    images: [{ id: 'img-7', imageUrl: '/products/smartwatch-forge-x.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-15', color: 'Space Grey', size: 'Standard', stock: 25, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-8', rating: 5, comment: 'Layar jernih banget, notifikasi lancar!', createdAt: new Date().toISOString(), user: { name: 'Denny' } },
    ],
  },
  'backpack-cyber-bbn': {
    id: 'prod-8',
    name: 'Backpack Cyber BBN Waterproof',
    slug: 'backpack-cyber-bbn',
    sku: 'BBN-BP-08',
    description: 'Backpack 25L tahan air dengan kompartemen laptop 16 inch dan roll-top closure bergaya cyberpunk.',
    material: 'Waterproof Tarpaulin & Cordura',
    price: 349000,
    compareAtPrice: 429000,
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    images: [{ id: 'img-8', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-16', color: 'Tactical Black', size: '25L', stock: 30, status: 'ACTIVE' },
    ],
    reviews: [
      { id: 'r-9', rating: 5, comment: 'Kapasitas lega, anti hujan beneran.', createdAt: new Date().toISOString(), user: { name: 'Bayu' } },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true, price: true } });
    if (product) {
      return {
        title: `${product.name} — Toko Sample BBN`,
        description: product.description?.substring(0, 160),
      };
    }
  } catch {}

  const fallback = fallbackProductsMap[slug];
  if (fallback) {
    return {
      title: `${fallback.name} — Toko Sample BBN`,
      description: fallback.description,
    };
  }

  return { title: 'Produk — Toko Sample BBN' };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
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

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: { categoryId: product.categoryId, id: { not: product.id }, status: 'ACTIVE' },
        include: {
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
          category: true,
          reviews: { select: { rating: true } },
          variants: { where: { status: 'ACTIVE' } },
        },
        take: 4,
      });
    }
  } catch (err) {
    console.warn('Database error in ProductDetailPage, using fallback data:', err);
  }

  if (!product) {
    product = fallbackProductsMap[slug];
    if (!product) notFound();
    relatedProducts = Object.values(fallbackProductsMap)
      .filter((p: any) => p.slug !== slug)
      .slice(0, 4);
  }

  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
    : 4.9;

  const colors: string[] = Array.from(new Set<string>(product.variants.map((v: any) => String(v.color || ''))));
  const sizes: string[] = Array.from(new Set<string>(product.variants.map((v: any) => String(v.size || ''))));

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
