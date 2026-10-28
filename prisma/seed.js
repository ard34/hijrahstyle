const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hijrahstyle.id' },
    update: {},
    create: {
      name: 'Admin HijrahStyle',
      email: 'admin@hijrahstyle.id',
      phone: '081234567890',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create Customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'siti@gmail.com' },
    update: {},
    create: {
      name: 'Siti Nurhaliza',
      email: 'siti@gmail.com',
      phone: '081298765432',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Customer created:', customer.email);

  // Create address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      recipientName: 'Siti Nurhaliza',
      phone: '081298765432',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Kebayoran Baru',
      postalCode: '12160',
      addressDetail: 'Jl. Senopati No. 45, RT 05/RW 03',
      note: 'Rumah pagar hitam, dekat masjid',
      isDefault: true,
    },
  });

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'gamis' },
      update: {},
      create: { name: 'Gamis', slug: 'gamis', description: 'Koleksi gamis syar\'i elegan untuk muslimah modern', imageUrl: '/uploads/categories/gamis.jpg', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'hijab' },
      update: {},
      create: { name: 'Hijab', slug: 'hijab', description: 'Hijab premium berbagai model dan bahan', imageUrl: '/uploads/categories/hijab.jpg', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'abaya' },
      update: {},
      create: { name: 'Abaya', slug: 'abaya', description: 'Abaya mewah untuk tampilan anggun', imageUrl: '/uploads/categories/abaya.jpg', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'koko' },
      update: {},
      create: { name: 'Koko', slug: 'koko', description: 'Baju koko modern untuk pria muslim', imageUrl: '/uploads/categories/koko.jpg', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'tunik' },
      update: {},
      create: { name: 'Tunik', slug: 'tunik', description: 'Tunik casual dan formal untuk sehari-hari', imageUrl: '/uploads/categories/tunik.jpg', sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: 'mukena' },
      update: {},
      create: { name: 'Mukena', slug: 'mukena', description: 'Mukena cantik untuk ibadah yang nyaman', imageUrl: '/uploads/categories/mukena.jpg', sortOrder: 6 },
    }),
    prisma.category.upsert({
      where: { slug: 'aksesoris' },
      update: {},
      create: { name: 'Aksesoris', slug: 'aksesoris', description: 'Bros, ciput, dan aksesoris hijab', imageUrl: '/uploads/categories/aksesoris.jpg', sortOrder: 7 },
    }),
    prisma.category.upsert({
      where: { slug: 'dress-muslimah' },
      update: {},
      create: { name: 'Dress Muslimah', slug: 'dress-muslimah', description: 'Dress muslimah cantik dan modis', imageUrl: '/uploads/categories/dress.jpg', sortOrder: 8 },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create Products
  const products = [
    {
      categorySlug: 'gamis',
      name: 'Gamis Ayana Premium',
      slug: 'gamis-ayana-premium',
      sku: 'GMS-AYN-001',
      description: 'Gamis premium dengan bahan wolfis grade A yang jatuh sempurna. Desain elegan dengan detail bordir di bagian dada dan lengan. Cocok untuk acara formal maupun sehari-hari. Dilengkapi dengan tali pinggang yang bisa disesuaikan.',
      material: 'Wolfis Grade A',
      price: 285000,
      compareAtPrice: 350000,
      colors: ['Hitam', 'Navy', 'Maroon', 'Dusty Pink'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      categorySlug: 'gamis',
      name: 'Gamis Zahra Syari',
      slug: 'gamis-zahra-syari',
      sku: 'GMS-ZHR-002',
      description: 'Gamis syar\'i dengan potongan lebar yang anggun. Bahan ceruti babydoll yang ringan dan tidak menerawang. Tersedia dalam berbagai warna pastel yang cantik.',
      material: 'Ceruti Babydoll',
      price: 325000,
      compareAtPrice: 420000,
      colors: ['Sage', 'Lilac', 'Baby Blue', 'Cream'],
      sizes: ['All Size', 'Jumbo'],
    },
    {
      categorySlug: 'hijab',
      name: 'Hijab Voal Premium Printed',
      slug: 'hijab-voal-premium-printed',
      sku: 'HJB-VPP-001',
      description: 'Hijab voal premium dengan print motif eksklusif. Bahan voal yang lembut dan mudah dibentuk. Ukuran jumbo 120x120cm untuk berbagai style hijab.',
      material: 'Voal Premium',
      price: 89000,
      compareAtPrice: 125000,
      colors: ['Motif Bunga', 'Motif Abstrak', 'Motif Batik', 'Motif Geometri'],
      sizes: ['120x120cm'],
    },
    {
      categorySlug: 'hijab',
      name: 'Hijab Pashmina Crinkle',
      slug: 'hijab-pashmina-crinkle',
      sku: 'HJB-PSC-002',
      description: 'Pashmina crinkle yang elegan dengan tekstur pleats yang natural. Tidak perlu disetrika, langsung pakai. Bahan ringan dan breathable.',
      material: 'Crinkle Pleats',
      price: 65000,
      compareAtPrice: null,
      colors: ['Hitam', 'Putih', 'Abu-abu', 'Coklat Muda', 'Dusty Pink', 'Sage'],
      sizes: ['175x75cm'],
    },
    {
      categorySlug: 'koko',
      name: 'Koko Rayyan Modern',
      slug: 'koko-rayyan-modern',
      sku: 'KKO-RYN-001',
      description: 'Baju koko dengan desain modern minimalis. Bahan toyobo yang adem dan tidak mudah kusut. Cocok untuk sholat Jumat, pengajian, atau acara formal.',
      material: 'Toyobo Premium',
      price: 195000,
      compareAtPrice: 250000,
      colors: ['Putih', 'Hitam', 'Navy', 'Abu-abu'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      categorySlug: 'abaya',
      name: 'Abaya Rania Exclusive',
      slug: 'abaya-rania-exclusive',
      sku: 'ABY-RAN-001',
      description: 'Abaya mewah dengan detail bordiran tangan yang ekslusif. Bahan jetblack premium yang jatuh sempurna. Dilengkapi inner dress. Cocok untuk acara special dan pengajian.',
      material: 'Jetblack Premium',
      price: 450000,
      compareAtPrice: 580000,
      colors: ['Hitam', 'Navy', 'Dark Brown'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      categorySlug: 'tunik',
      name: 'Tunik Marsha Casual',
      slug: 'tunik-marsha-casual',
      sku: 'TNK-MRS-001',
      description: 'Tunik casual yang nyaman untuk aktivitas sehari-hari. Bahan kaos cotton combed 30s yang adem. Potongan A-line yang flattering untuk semua bentuk tubuh.',
      material: 'Cotton Combed 30s',
      price: 145000,
      compareAtPrice: 185000,
      colors: ['Hitam', 'Putih', 'Maroon', 'Mustard', 'Army'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      categorySlug: 'mukena',
      name: 'Mukena Bali Rayon Premium',
      slug: 'mukena-bali-rayon-premium',
      sku: 'MKN-BRP-001',
      description: 'Mukena bahan rayon premium yang super lembut dan nyaman. Motif printing cantik khas Bali. Dilengkapi tas mukena yang matching. Travel-friendly.',
      material: 'Rayon Premium',
      price: 175000,
      compareAtPrice: 225000,
      colors: ['Pink Flower', 'Blue Ocean', 'Green Garden', 'Purple Dream'],
      sizes: ['All Size'],
    },
    {
      categorySlug: 'aksesoris',
      name: 'Bros Mutiara Crystal',
      slug: 'bros-mutiara-crystal',
      sku: 'AKS-BMC-001',
      description: 'Bros hijab cantik dengan mutiara dan crystal premium. Aman untuk semua jenis kain hijab. Desain elegan yang bisa mempercantik tampilan hijab Anda.',
      material: 'Alloy, Mutiara, Crystal',
      price: 35000,
      compareAtPrice: 50000,
      colors: ['Gold', 'Silver', 'Rose Gold'],
      sizes: ['One Size'],
    },
    {
      categorySlug: 'dress-muslimah',
      name: 'Dress Nayla Elegant',
      slug: 'dress-nayla-elegant',
      sku: 'DRS-NYL-001',
      description: 'Dress muslimah dengan desain elegan untuk acara formal. Bahan moscrepe premium yang bertekstur lembut. Potongan A-line dengan detail ruffle di bagian rok.',
      material: 'Moscrepe Premium',
      price: 275000,
      compareAtPrice: 350000,
      colors: ['Dusty Pink', 'Sage', 'Lilac', 'Cream'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      categorySlug: 'gamis',
      name: 'Gamis Salwa Daily',
      slug: 'gamis-salwa-daily',
      sku: 'GMS-SLW-003',
      description: 'Gamis daily wear yang nyaman dan simpel. Bahan crinkle airflow yang ringan dan tidak menerawang. Cocok untuk aktivitas sehari-hari.',
      material: 'Crinkle Airflow',
      price: 199000,
      compareAtPrice: null,
      colors: ['Hitam', 'Mocca', 'Grey', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      categorySlug: 'hijab',
      name: 'Hijab Sport Instant',
      slug: 'hijab-sport-instant',
      sku: 'HJB-SPT-003',
      description: 'Hijab instant khusus olahraga. Bahan jersey premium yang elastis dan breathable. Quick-dry technology. Cocok untuk gym, jogging, dan aktivitas outdoor.',
      material: 'Jersey Sport Premium',
      price: 79000,
      compareAtPrice: 110000,
      colors: ['Hitam', 'Navy', 'Abu-abu', 'Maroon'],
      sizes: ['All Size'],
    },
  ];

  for (const product of products) {
    const category = categories.find(c => c.slug === product.categorySlug);
    if (!category) continue;

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        categoryId: category.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        material: product.material,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        status: 'ACTIVE',
        totalSold: Math.floor(Math.random() * 200),
      },
    });

    // Create product images (placeholder)
    const existingImages = await prisma.productImage.findFirst({ where: { productId: createdProduct.id } });
    if (!existingImages) {
      await prisma.productImage.createMany({
        data: [
          { productId: createdProduct.id, imageUrl: `/uploads/products/${product.slug}-1.jpg`, sortOrder: 1 },
          { productId: createdProduct.id, imageUrl: `/uploads/products/${product.slug}-2.jpg`, sortOrder: 2 },
        ],
      });
    }

    // Create variants
    for (const color of product.colors) {
      for (const size of product.sizes) {
        const variantSku = `${product.sku}-${color.substring(0, 3).toUpperCase()}-${size}`;
        await prisma.productVariant.upsert({
          where: { sku: variantSku },
          update: {},
          create: {
            productId: createdProduct.id,
            sku: variantSku,
            color,
            size,
            stock: Math.floor(Math.random() * 50) + 5,
            status: 'ACTIVE',
          },
        });
      }
    }
  }
  console.log('✅ Products created:', products.length);

  // Create Vouchers
  await prisma.voucher.upsert({
    where: { code: 'HIJRAH20' },
    update: {},
    create: {
      code: 'HIJRAH20',
      type: 'PERCENTAGE',
      value: 20,
      minimumPurchase: 150000,
      maximumDiscount: 50000,
      usageLimit: 100,
      usageCount: 0,
      startsAt: new Date('2026-09-01'),
      expiresAt: new Date('2026-09-30'),
      status: 'ACTIVE',
    },
  });

  await prisma.voucher.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      type: 'FIXED',
      value: 50000,
      minimumPurchase: 200000,
      maximumDiscount: 50000,
      usageLimit: 50,
      usageCount: 0,
      startsAt: new Date('2026-01-01'),
      expiresAt: new Date('2027-12-31'),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Vouchers created');

  // Create some reviews
  const allProducts = await prisma.product.findMany({ take: 5 });
  const reviewComments = [
    'Bahannya bagus banget, sesuai ekspektasi!',
    'Warnanya cantik, jahitannya rapi. Recommended!',
    'Ukurannya pas, modelnya elegan. Suka banget!',
    'Pengiriman cepat, packaging aman. Quality oke!',
    'Worth it banget dengan harganya. Pasti repeat order!',
  ];

  // Note: Reviews require order items, so we'll skip for seed
  console.log('✅ Sample data ready');

  console.log('\n📧 Login Admin: admin@hijrahstyle.id / admin123');
  console.log('📧 Login Customer: siti@gmail.com / customer123');
  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
