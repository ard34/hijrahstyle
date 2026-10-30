const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Upserting BBN categories and products to match design mockup...');

  // 1. Categories
  const categoriesData = [
    { name: 'Pakaian', slug: 'pakaian', description: 'Koleksi pakaian streetwear & techwear modern', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', sortOrder: 1 },
    { name: 'Sepatu', slug: 'sepatu', description: 'Sneakers performa tinggi dan gaya modern', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', sortOrder: 2 },
    { name: 'Aksesoris', slug: 'aksesoris', description: 'Aksesoris pelengkap gaya harian', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', sortOrder: 3 },
    { name: 'Tas', slug: 'tas', description: 'Tas selempang dan ransel technical', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', sortOrder: 4 },
    { name: 'Elektronik', slug: 'elektronik', description: 'Gadget dan aksesori digital pintar', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', sortOrder: 5 },
    { name: 'Lainnya', slug: 'lainnya', description: 'Koleksi edisi terbatas & eksklusif', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', sortOrder: 6 },
  ];

  const catMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, imageUrl: c.imageUrl, sortOrder: c.sortOrder },
      create: c,
    });
    catMap[c.slug] = cat.id;
  }
  console.log('✅ Categories upserted:', Object.keys(catMap));

  // 2. Products matching the user mockup
  const productsData = [
    {
      name: 'Sneakers Vortex BBN Edition',
      slug: 'sneakers-vortex',
      sku: 'BBN-SNK-01',
      categoryId: catMap['sepatu'],
      price: 599000,
      compareAtPrice: 699000,
      description: 'Sneakers premium dengan desain modern BBN untuk aktivitas harian. Menggunakan material breathable knit, insole empuk ergonomis, dan outsole anti-slip untuk kenyamanan maksimal sepanjang hari.',
      material: 'Breathable Knit & Rubber Sole',
      status: 'ACTIVE',
      totalSold: 120,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-SNK-01-39', color: 'Putih/Biru', size: '39', price: 599000, stock: 15 },
        { sku: 'BBN-SNK-01-40', color: 'Putih/Biru', size: '40', price: 599000, stock: 20 },
        { sku: 'BBN-SNK-01-41', color: 'Putih/Biru', size: '41', price: 599000, stock: 25 },
        { sku: 'BBN-SNK-01-42', color: 'Putih/Biru', size: '42', price: 599000, stock: 18 },
        { sku: 'BBN-SNK-01-43', color: 'Putih/Biru', size: '43', price: 599000, stock: 12 },
        { sku: 'BBN-SNK-01-44', color: 'Putih/Biru', size: '44', price: 599000, stock: 10 },
      ]
    },
    {
      name: 'Hoodie BBN Premium',
      slug: 'hoodie-bbn-premium',
      sku: 'BBN-HD-01',
      categoryId: catMap['pakaian'],
      price: 249000,
      compareAtPrice: 310000,
      description: 'Hoodie streetwear premium dengan bahan katun fleece gramasi tebal yang hangat dan halus. Dilengkapi sablon timbul BBN Digital Forge tahan lama.',
      material: 'Cotton Fleece 330 gsm',
      status: 'ACTIVE',
      totalSold: 95,
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-HD-01-M', color: 'Hitam', size: 'M', price: 249000, stock: 20 },
        { sku: 'BBN-HD-01-L', color: 'Hitam', size: 'L', price: 249000, stock: 35 },
        { sku: 'BBN-HD-01-XL', color: 'Hitam', size: 'XL', price: 249000, stock: 25 },
      ]
    },
    {
      name: 'Kaos Forge',
      slug: 'kaos-forge',
      sku: 'BBN-TS-01',
      categoryId: catMap['pakaian'],
      price: 129000,
      compareAtPrice: 159000,
      description: 'T-Shirt oversized modern dengan katun combed 24s ultra-soft. Potongan relaxed fit yang cocok untuk layering atau casual daily wear.',
      material: '100% Cotton Combed 24s',
      status: 'ACTIVE',
      totalSold: 180,
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-TS-01-M', color: 'Putih', size: 'M', price: 129000, stock: 30 },
        { sku: 'BBN-TS-01-L', color: 'Putih', size: 'L', price: 129000, stock: 45 },
        { sku: 'BBN-TS-01-XL', color: 'Putih', size: 'XL', price: 129000, stock: 30 },
      ]
    },
    {
      name: 'Jaket Windbreaker',
      slug: 'jaket-windbreaker',
      sku: 'BBN-JK-01',
      categoryId: catMap['pakaian'],
      price: 299000,
      compareAtPrice: 389000,
      description: 'Jaket outdoor technical anti-angin dan water repellent. Ringan, praktis, dan dilengkapi hoodie adjustable serta kantong multifungsi.',
      material: 'Taslan Waterproof & Mesh Lining',
      status: 'ACTIVE',
      totalSold: 74,
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-JK-01-L', color: 'Navy', size: 'L', price: 299000, stock: 20 },
        { sku: 'BBN-JK-01-XL', color: 'Navy', size: 'XL', price: 299000, stock: 15 },
      ]
    },
    {
      name: 'Tas Sling BBN',
      slug: 'tas-sling-bbn',
      sku: 'BBN-BG-01',
      categoryId: catMap['tas'],
      price: 159000,
      compareAtPrice: 199000,
      description: 'Tas selempang crossbody berdesain ringkas namun muat banyak barang esensial (gadget, dompet, kunci). Dilengkapi ritsleting tahan air.',
      material: 'Cordura 1000D Waterproof',
      status: 'ACTIVE',
      totalSold: 110,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-BG-01-BLK', color: 'Hitam', size: 'All Size', price: 159000, stock: 40 },
      ]
    },
    {
      name: 'Topi Trucker',
      slug: 'topi-trucker',
      sku: 'BBN-CP-01',
      categoryId: catMap['aksesoris'],
      price: 89000,
      compareAtPrice: 119000,
      description: 'Topi trucker bergaya streetwear dengan jaring breathable dan bordir presisi tinggi BBN Forge di bagian depan.',
      material: 'Polyester & Mesh Breathable',
      status: 'ACTIVE',
      totalSold: 88,
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-CP-01-BLK', color: 'Hitam', size: 'All Size', price: 89000, stock: 50 },
      ]
    },
    {
      name: 'Smartwatch Forge X',
      slug: 'smartwatch-forge-x',
      sku: 'BBN-SW-01',
      categoryId: catMap['elektronik'],
      price: 450000,
      compareAtPrice: 599000,
      description: 'Jam tangan pintar berlayar AMOLED dengan fitur pelacak detak jantung, 50+ mode olahraga, dan ketahanan air IP68.',
      material: 'Aluminium Alloy & Silicone Strap',
      status: 'ACTIVE',
      totalSold: 65,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-SW-01-BLK', color: 'Cyber Black', size: 'All Size', price: 450000, stock: 25 },
      ]
    },
    {
      name: 'Backpack Cyber BBN',
      slug: 'backpack-cyber-bbn',
      sku: 'BBN-BP-01',
      categoryId: catMap['tas'],
      price: 320000,
      compareAtPrice: 399000,
      description: 'Ransel laptop hingga 15.6 inch dengan kompartemen empuk, port USB charging terintegrasi, dan bahan tahan cuaca.',
      material: 'Water-repellent Nylon',
      status: 'ACTIVE',
      totalSold: 42,
      images: [
        'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?q=80&w=1000&auto=format&fit=crop'
      ],
      variants: [
        { sku: 'BBN-BP-01-BLK', color: 'Stealth Black', size: 'All Size', price: 320000, stock: 30 },
      ]
    }
  ];

  for (const p of productsData) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    let productRecord;
    if (existing) {
      productRecord = await prisma.product.update({
        where: { slug: p.slug },
        data: {
          name: p.name,
          sku: p.sku,
          categoryId: p.categoryId,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          description: p.description,
          material: p.material,
          status: p.status,
          totalSold: p.totalSold,
        }
      });
      // Delete old images and variants to sync
      await prisma.productImage.deleteMany({ where: { productId: productRecord.id } });
      await prisma.productVariant.deleteMany({ where: { productId: productRecord.id } });
    } else {
      productRecord = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          categoryId: p.categoryId,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          description: p.description,
          material: p.material,
          status: p.status,
          totalSold: p.totalSold,
        }
      });
    }

    // Add images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: productRecord.id,
          imageUrl: p.images[i],
          sortOrder: i,
        }
      });
    }

    // Add variants
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: productRecord.id,
          sku: v.sku,
          color: v.color,
          size: v.size,
          stock: v.stock,
          status: 'ACTIVE',
        }
      });
    }
  }

  // 3. Ensure DISKON50K voucher exists
  await prisma.voucher.upsert({
    where: { code: 'DISKON50K' },
    update: { value: 50000, minimumPurchase: 200000, status: 'ACTIVE' },
    create: {
      code: 'DISKON50K',
      type: 'FIXED',
      value: 50000,
      minimumPurchase: 200000,
      usageLimit: 1000,
      usageCount: 24,
      startsAt: new Date('2026-01-01'),
      expiresAt: new Date('2027-12-31'),
      status: 'ACTIVE',
    }
  });

  console.log('🎉 Successfully synced BBN categories, products, and voucher with design mockup!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
