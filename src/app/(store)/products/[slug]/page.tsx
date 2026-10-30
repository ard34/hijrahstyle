import prisma from '@/lib/prisma';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

export async function generateStaticParams() {
  return [
    { slug: 'kaos-forge' },
    { slug: 'hoodie-bbn-premium' },
    { slug: 'sneakers-vortex' },
    { slug: 'jaket-windbreaker' },
    { slug: 'tas-sling-bbn' },
    { slug: 'topi-trucker' },
    { slug: 'smartwatch-forge-x' },
    { slug: 'backpack-cyber-bbn' },
  ];
}

const fallbackProductsMap: Record<string, any> = {
  'sneakers-vortex': {
    id: 'prod-1',
    name: 'Sneakers Vortex BBN Edition',
    slug: 'sneakers-vortex',
    sku: 'BBN-SNK-01',
    description: `Sneakers Vortex BBN Edition dirancang khusus untuk kenyamanan maksimal dan performa aktivitas harian bergaya streetwear futuristik. Menggunakan teknologi sol Air Cushion responsif dan material breathable mesh yang menjaga kaki tetap sejuk sepanjang hari.

Keunggulan Produk:
• Outsole anti-slip dengan cengkraman kuat di berbagai permukaan.
• Bantalan insole Memory Foam ergonomis yang meredam benturan langkah.
• Desain aerodinamis modern dengan aksen neon cyber signature BBN.
• Ringan dan fleksibel, cocok untuk jalan santai, kuliah, hingga olahraga ringan.`,
    material: 'Breathable Mesh & High Quality Rubber Soles',
    price: 599000,
    compareAtPrice: 699000,
    totalSold: 342,
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Sepatu', slug: 'sepatu' },
    images: [
      { id: 'img-1', imageUrl: '/products/sneakers-vortex.png', sortOrder: 1 },
      { id: 'img-1b', imageUrl: '/hero-sneaker.png', sortOrder: 2 },
      { id: 'img-1c', imageUrl: '/products/sneakers-vortex.png', sortOrder: 3 },
    ],
    variants: [
      { id: 'v-1', color: 'Hitam Neon', size: '39', stock: 12, status: 'ACTIVE' },
      { id: 'v-2', color: 'Hitam Neon', size: '40', stock: 15, status: 'ACTIVE' },
      { id: 'v-3', color: 'Hitam Neon', size: '41', stock: 20, status: 'ACTIVE' },
      { id: 'v-4', color: 'Hitam Neon', size: '42', stock: 18, status: 'ACTIVE' },
      { id: 'v-5', color: 'Hitam Neon', size: '43', stock: 10, status: 'ACTIVE' },
      { id: 'v-6', color: 'Hitam Neon', size: '44', stock: 8, status: 'ACTIVE' },
      { id: 'v-7', color: 'Putih Cyber', size: '40', stock: 14, status: 'ACTIVE' },
      { id: 'v-8', color: 'Putih Cyber', size: '41', stock: 16, status: 'ACTIVE' },
      { id: 'v-9', color: 'Putih Cyber', size: '42', stock: 12, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-1', 
        rating: 5, 
        comment: 'Sepatu sangat empuk dan keren banget tampilan neonnya! Bahan sol elastis tidak kaku, packing kardus tebal dan pengiriman super cepat.', 
        createdAt: '2026-10-28 14:32', 
        user: { name: 'Riski Ardiansyah' },
        variant: 'Hitam Neon, 42',
        helpfulCount: 14,
        sellerReply: 'Terima kasih atas ulasan positif dan bintang 5 nya Kak Riski! Semoga awet dan nyaman selalu menemani aktivitas Kakak 🙌'
      },
      { 
        id: 'r-2', 
        rating: 5, 
        comment: '100% Original Toko Sample BBN! Pas banget di kaki ukuran 41, tidak sakit buat dipakai seharian. Recommended seller!', 
        createdAt: '2026-10-25 09:15', 
        user: { name: 'Dimas Pratama' },
        variant: 'Hitam Neon, 41',
        helpfulCount: 9,
        sellerReply: 'Terima kasih banyak Kak Dimas! Kepuasan pelanggan adalah prioritas utama BBN Official.'
      },
      { 
        id: 'r-3', 
        rating: 5, 
        comment: 'Warna putihnya cakep parah, sol tebal tapi enteng. Dapat voucher diskon 50rb juga jadi hemat banget!', 
        createdAt: '2026-10-22 17:40', 
        user: { name: 'Ahmad Fauzi' },
        variant: 'Putih Cyber, 42',
        helpfulCount: 7,
      },
      { 
        id: 'r-4', 
        rating: 4, 
        comment: 'Bagus kualitasnya, cuma kurir agak telat 1 hari karena hujan lebat. Overall sepatunya top markotop!', 
        createdAt: '2026-10-18 11:20', 
        user: { name: 'Budi Santoso' },
        variant: 'Hitam Neon, 43',
        helpfulCount: 3,
      },
    ],
  },
  'hoodie-bbn-premium': {
    id: 'prod-2',
    name: 'Hoodie BBN Premium',
    slug: 'hoodie-bbn-premium',
    sku: 'BBN-HD-02',
    description: `Hoodie BBN Premium dibuat menggunakan bahan Heavyweight Cotton Fleece 330 GSM berdensitas tinggi dengan tekstur dalam yang luar biasa lembut dan hangat. Memiliki potongan Boxy Oversized Fit khas streetwear modern yang memberikan siluet tegas dan stylish.

Spesifikasi & Keunggulan:
• 100% Cotton Fleece 330 GSM premium (tidak tipis & tidak berbulu saat dicuci).
• Sablon Discharge High Density yang menyerap ke serat kain, tahan setrika & tidak retak.
• Tali hoodie katun kepang bulat tebal dengan eyelet besi kokoh anti karat.
• Kantong kanguru lapang depan dengan bar-tack reinforcement pada jahitan sudut.
• Rib elastis tebal di pinggang dan pergelangan tangan yang tidak mudah melar.`,
    material: 'Heavyweight Cotton Fleece 330 GSM',
    price: 249000,
    compareAtPrice: 299000,
    totalSold: 580,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    images: [
      { id: 'img-2', imageUrl: '/products/hoodie-bbn.jpg', sortOrder: 1 },
      { id: 'img-2b', imageUrl: '/products/jaket-windbreaker.jpg', sortOrder: 2 },
    ],
    variants: [
      { id: 'v-h1', color: 'Midnight Black', size: 'S', stock: 15, status: 'ACTIVE' },
      { id: 'v-h2', color: 'Midnight Black', size: 'M', stock: 25, status: 'ACTIVE' },
      { id: 'v-h3', color: 'Midnight Black', size: 'L', stock: 35, status: 'ACTIVE' },
      { id: 'v-h4', color: 'Midnight Black', size: 'XL', stock: 20, status: 'ACTIVE' },
      { id: 'v-h5', color: 'Midnight Black', size: 'XXL', stock: 10, status: 'ACTIVE' },
      { id: 'v-h6', color: 'Dark Charcoal', size: 'M', stock: 18, status: 'ACTIVE' },
      { id: 'v-h7', color: 'Dark Charcoal', size: 'L', stock: 22, status: 'ACTIVE' },
      { id: 'v-h8', color: 'Dark Charcoal', size: 'XL', stock: 14, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-5', 
        rating: 5, 
        comment: 'Bahan tebal 330 gsm beneran kerasa berat dan mewahnya! Fittingan boxy pas banget di badan tinggi 175 bb 70 ambil size L. Sablonan rapi pol.', 
        createdAt: '2026-10-27 16:10', 
        user: { name: 'Reza Fahlevi' },
        variant: 'Midnight Black, L',
        helpfulCount: 21,
        sellerReply: 'Mantap Kak Reza! Senang sekali fittingnya cocok. Terima kasih telah mempercayakan apparel Kakak ke BBN Digital Forge.'
      },
      { 
        id: 'r-6', 
        rating: 5, 
        comment: 'Sangat puas! Hangat dipakai motoran malam hari, bahan dalamnya halus tidak gatal. Sudah order kedua kalinya.', 
        createdAt: '2026-10-21 20:45', 
        user: { name: 'Satria Wijaya' },
        variant: 'Midnight Black, XL',
        helpfulCount: 11,
      },
      { 
        id: 'r-7', 
        rating: 5, 
        comment: 'Ukuran S pas banget buat saya yang mungil (tb 160). Jarang nemu hoodie boxy fit yang proporsional begini.', 
        createdAt: '2026-10-15 13:02', 
        user: { name: 'Nadia Putri' },
        variant: 'Midnight Black, S',
        helpfulCount: 6,
      },
    ],
  },
  'kaos-forge': {
    id: 'prod-3',
    name: 'Kaos Forge Cyber Edition',
    slug: 'kaos-forge',
    sku: 'BBN-TSH-03',
    description: `T-Shirt Oversized Forge Cyber Edition menggunakan material 100% Combed 24s Heavyweight Cotton yang sejuk, berpori rapat, dan menyerap keringat dengan baik. Didesain dengan grafis cyberpunk minimalis berteknologi cetak plastisol discharge.

Spesifikasi & Keunggulan:
• 100% Cotton Combed 24s gramasi 190-200 GSM standar distro premium.
• Jahitan pundak rantai ganda dan rib leher anti-melar dengan spandeks elastis.
• Pola potongan Relaxed Drop-Shoulder Oversized Fit.
• Nyaman dipakai cuaca tropis tanpa gerah.`,
    material: '100% Pure Cotton Combed 24s',
    price: 129000,
    compareAtPrice: 159000,
    totalSold: 890,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    images: [{ id: 'img-3', imageUrl: '/products/kaos-forge.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-k1', color: 'Black Solid', size: 'S', stock: 20, status: 'ACTIVE' },
      { id: 'v-k2', color: 'Black Solid', size: 'M', stock: 40, status: 'ACTIVE' },
      { id: 'v-k3', color: 'Black Solid', size: 'L', stock: 50, status: 'ACTIVE' },
      { id: 'v-k4', color: 'Black Solid', size: 'XL', stock: 30, status: 'ACTIVE' },
      { id: 'v-k5', color: 'Black Solid', size: 'XXL', stock: 15, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-8', 
        rating: 5, 
        comment: 'Bahan adem, tebal pas 24s, kerah kencang tidak loyo setelah dicuci berkali-kali. Harga seratus ribuan kualitas bintang lima.', 
        createdAt: '2026-10-26 10:14', 
        user: { name: 'Fajar Nugraha' },
        variant: 'Black Solid, L',
        helpfulCount: 15,
      },
      { 
        id: 'r-9', 
        rating: 5, 
        comment: 'Oversized-nya dapet banget! Cocok dipaduin sama cargo pants. Pengiriman cuma 2 hari sampe Serang.', 
        createdAt: '2026-10-20 18:22', 
        user: { name: 'Kevin Sanjaya' },
        variant: 'Black Solid, XL',
        helpfulCount: 8,
      },
    ],
  },
  'jaket-windbreaker': {
    id: 'prod-4',
    name: 'Jaket Windbreaker Tactical',
    slug: 'jaket-windbreaker',
    sku: 'BBN-JKT-04',
    description: `Jaket Windbreaker Tactical BBN mengusung material Taslan Micro Ripstop bersertifikasi Water-Repellent & Windproof yang melindungi Anda dari terpaan angin kencang serta hujan gerimis ringan.

Spesifikasi & Keunggulan:
• Outer layer: Taslan Ripstop anti gores & tahan air permukaan.
• Inner layer: Puring jaring poliester breathable yang menyerap uap keringat.
• Dilengkapi 4 saku taktis resleting waterproof YKK.
• Hoodie lipat tersembunyi di kerah leher dengan stopper elastis.`,
    material: 'Taslan Micro Ripstop Water Repellent',
    price: 299000,
    compareAtPrice: 389000,
    totalSold: 215,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Pakaian', slug: 'pakaian' },
    images: [{ id: 'img-4', imageUrl: '/products/jaket-windbreaker.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-j1', color: 'Cyber Dark', size: 'S', stock: 10, status: 'ACTIVE' },
      { id: 'v-j2', color: 'Cyber Dark', size: 'M', stock: 18, status: 'ACTIVE' },
      { id: 'v-j3', color: 'Cyber Dark', size: 'L', stock: 25, status: 'ACTIVE' },
      { id: 'v-j4', color: 'Cyber Dark', size: 'XL', stock: 20, status: 'ACTIVE' },
      { id: 'v-j5', color: 'Cyber Dark', size: 'XXL', stock: 12, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-10', 
        rating: 5, 
        comment: 'Jaket mantap buat riding malam! Angin ketahan total, pas kena hujan gerimis airnya langsung meluncur kayak daun talas.', 
        createdAt: '2026-10-24 21:05', 
        user: { name: 'Eko Prasetyo' },
        variant: 'Cyber Dark, XL',
        helpfulCount: 19,
      },
    ],
  },
  'tas-sling-bbn': {
    id: 'prod-5',
    name: 'Tas Sling BBN Utility',
    slug: 'tas-sling-bbn',
    sku: 'BBN-BAG-05',
    description: `Tas Sling Bag Utility taktis multifungsi dengan material Cordura 1000D Waterproof dan aksen webbing molle. Dilengkapi kompartemen terisolasi empuk untuk gadget hingga tablet 11 inch.`,
    material: 'Cordura 1000D Waterproof & YKK Zipper',
    price: 189000,
    compareAtPrice: 239000,
    totalSold: 460,
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    images: [{ id: 'img-5', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-13', color: 'Black', size: 'All Size', stock: 50, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-11', 
        rating: 5, 
        comment: 'Muat tablet 11 inch, powerbank, dompet, kunci dll. Resleting lancar dan jahitan rapi kuat.', 
        createdAt: '2026-10-23 15:30', 
        user: { name: 'Reza Kurnia' },
        variant: 'Black, All Size',
        helpfulCount: 12,
      },
    ],
  },
  'topi-trucker': {
    id: 'prod-6',
    name: 'Topi Trucker Forge Cyber',
    slug: 'topi-trucker',
    sku: 'BBN-CAP-06',
    description: `Topi trucker bergaya cyber streetwear dengan jaring breathable premium dan bordir timbul 3D logo BBN. Dilengkapi pengatur snapback adjustable di bagian belakang.`,
    material: 'Cotton Twill & Breathable Mesh',
    price: 99000,
    compareAtPrice: 129000,
    totalSold: 310,
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris' },
    images: [{ id: 'img-6', imageUrl: '/products/topi-trucker.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-14', color: 'Black/Grey', size: 'Adjustable', stock: 40, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-12', 
        rating: 5, 
        comment: 'Bordir rapi timbul, jaring adem di kepala tidak bikin panas.', 
        createdAt: '2026-10-19 12:45', 
        user: { name: 'Rian Hidayat' },
        variant: 'Black/Grey, Adjustable',
        helpfulCount: 5,
      },
    ],
  },
  'smartwatch-forge-x': {
    id: 'prod-7',
    name: 'Smartwatch Forge X Futuristic',
    slug: 'smartwatch-forge-x',
    sku: 'BBN-WAT-07',
    description: `Smartwatch futuristik layar AMOLED HD 1.43 inch dengan titanium bezel, baterai tahan hingga 14 hari, serta sensor pemantau kesehatan SpO2 dan detak jantung 24 jam.`,
    material: 'Titanium Bezel & Hypoallergenic Silicone Strap',
    price: 899000,
    compareAtPrice: 1199000,
    totalSold: 180,
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Elektronik', slug: 'elektronik' },
    images: [{ id: 'img-7', imageUrl: '/products/smartwatch-forge-x.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-15', color: 'Space Grey', size: 'Standard', stock: 25, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-13', 
        rating: 5, 
        comment: 'Layar AMOLED jernih banget di bawah terik matahari. Baterai awet 10 hari pemakaian aktif.', 
        createdAt: '2026-10-25 18:20', 
        user: { name: 'Denny Sumargo' },
        variant: 'Space Grey, Standard',
        helpfulCount: 14,
      },
    ],
  },
  'backpack-cyber-bbn': {
    id: 'prod-8',
    name: 'Backpack Cyber BBN Waterproof',
    slug: 'backpack-cyber-bbn',
    sku: 'BBN-BP-08',
    description: `Backpack kapasitas 25L tahan air dengan kompartemen laptop 16 inch empuk dan roll-top closure bergaya cyberpunk taktis modern.`,
    material: 'Waterproof Tarpaulin & Cordura 1000D',
    price: 349000,
    compareAtPrice: 429000,
    totalSold: 290,
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Tas', slug: 'tas' },
    images: [{ id: 'img-8', imageUrl: '/products/tas-sling.jpg', sortOrder: 1 }],
    variants: [
      { id: 'v-16', color: 'Tactical Black', size: '25L', stock: 30, status: 'ACTIVE' },
    ],
    reviews: [
      { 
        id: 'r-14', 
        rating: 5, 
        comment: 'Kapasitas lega, laptop 16 inch aman banget di busa dalamnya. Hujan deras aman anti tembus!', 
        createdAt: '2026-10-21 14:15', 
        user: { name: 'Bayu Wicaksono' },
        variant: 'Tactical Black, 25L',
        helpfulCount: 8,
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true, price: true } });
    if (product) {
      return {
        title: `${product.name} — Toko Sample BBN Official`,
        description: product.description?.substring(0, 160),
      };
    }
  } catch {}

  const fallback = fallbackProductsMap[slug];
  if (fallback) {
    return {
      title: `${fallback.name} — Toko Sample BBN Official`,
      description: fallback.description?.substring(0, 160),
    };
  }

  return { title: 'Detail Produk — Toko Sample BBN' };
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
    ? Number((product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length).toFixed(1))
    : 4.9;

  const colors: string[] = Array.from(new Set<string>(product.variants.map((v: any) => String(v.color || '')))).filter(Boolean);
  const sizes: string[] = Array.from(new Set<string>(product.variants.map((v: any) => String(v.size || '')))).filter(Boolean);

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
