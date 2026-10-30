const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndSync() {
  console.log('🧹 Cleaning old categories and products, syncing pure BBN catalog...');

  const officialCategorySlugs = ['pakaian', 'sepatu', 'aksesoris', 'tas', 'elektronik', 'lainnya'];

  // 1. Deactivate all non-BBN categories
  await prisma.category.updateMany({
    where: {
      slug: { notIn: officialCategorySlugs }
    },
    data: { status: 'INACTIVE' }
  });

  // Ensure official categories are ACTIVE with correct sort order
  const officialCats = [
    { name: 'Pakaian', slug: 'pakaian', sortOrder: 1 },
    { name: 'Sepatu', slug: 'sepatu', sortOrder: 2 },
    { name: 'Aksesoris', slug: 'aksesoris', sortOrder: 3 },
    { name: 'Tas', slug: 'tas', sortOrder: 4 },
    { name: 'Elektronik', slug: 'elektronik', sortOrder: 5 },
    { name: 'Lainnya', slug: 'lainnya', sortOrder: 6 },
  ];

  const catMap = {};
  for (const c of officialCats) {
    const updated = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, status: 'ACTIVE', sortOrder: c.sortOrder },
      create: { name: c.name, slug: c.slug, status: 'ACTIVE', sortOrder: c.sortOrder }
    });
    catMap[c.slug] = updated.id;
  }
  console.log('✅ 6 Official categories active:', Object.keys(catMap));

  // 2. Deactivate any old non-BBN products
  const officialProductSlugs = [
    'sneakers-vortex',
    'hoodie-bbn-premium',
    'kaos-forge',
    'jaket-windbreaker',
    'tas-sling-bbn',
    'topi-trucker',
    'smartwatch-forge-x',
    'backpack-cyber-bbn'
  ];

  await prisma.product.updateMany({
    where: {
      slug: { notIn: officialProductSlugs }
    },
    data: { status: 'INACTIVE' }
  });

  // 3. Perfect BBN Products matching the mockup
  const products = [
    {
      name: 'Sneakers Vortex BBN Edition',
      slug: 'sneakers-vortex',
      sku: 'BBN-SNK-01',
      categoryId: catMap['sepatu'],
      price: 599000,
      compareAtPrice: 699000,
      description: 'Sneakers premium dengan desain modern BBN untuk aktivitas harian. Menggunakan material breathable knit, insole empuk ergonomis, dan outsole anti-slip untuk kenyamanan maksimal sepanjang hari.',
      material: 'Breathable Knit & Boost Sole',
      status: 'ACTIVE',
      totalSold: 120,
      image: '/hero-sneaker.png'
    },
    {
      name: 'Hoodie BBN Premium',
      slug: 'hoodie-bbn-premium',
      sku: 'BBN-HD-01',
      categoryId: catMap['pakaian'],
      price: 249000,
      compareAtPrice: 299000,
      description: 'Hoodie berpotongan oversized dengan material French Terry cotton 330 GSM tebal, nyaman, dan hangat. Dilengkapi sablon timbul logo BBn Digital Forge.',
      material: '100% Cotton French Terry 330 GSM',
      status: 'ACTIVE',
      totalSold: 95,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kaos Forge',
      slug: 'kaos-forge',
      sku: 'BBN-TS-01',
      categoryId: catMap['pakaian'],
      price: 129000,
      compareAtPrice: 159000,
      description: 'Kaos katun combed 24s premium berdesain minimalis streetwear BBN. Sejuk di kulit dan tidak mudah melar setelah dicuci.',
      material: 'Cotton Combed 24s Premium',
      status: 'ACTIVE',
      totalSold: 180,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Jaket Windbreaker',
      slug: 'jaket-windbreaker',
      sku: 'BBN-JK-01',
      categoryId: catMap['pakaian'],
      price: 299000,
      compareAtPrice: 389000,
      description: 'Jaket teknikal anti-angin dan tahan percikan air ringan (water-repellent). Dilengkapi resleting YKK tahan air dan hoodie adjustable.',
      material: 'Taslan Water-Repellent & Polar Lining',
      status: 'ACTIVE',
      totalSold: 74,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Tas Sling BBN',
      slug: 'tas-sling-bbn',
      sku: 'BBN-SLG-01',
      categoryId: catMap['tas'],
      price: 139000,
      compareAtPrice: 189000,
      description: 'Tas selempang multifungsi dengan kompartemen luas untuk gadget, dompet, dan kunci. Dilengkapi strap tebal dan buckle kokoh.',
      material: 'Cordura 1000D Nylon',
      status: 'ACTIVE',
      totalSold: 110,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Topi Trucker',
      slug: 'topi-trucker',
      sku: 'BBN-TRK-01',
      categoryId: catMap['aksesoris'],
      price: 99000,
      compareAtPrice: 129000,
      description: 'Topi trucker jaring breathable dengan bordir 3D logo BBN di bagian depan. Pengatur ukuran snapback fleksibel di bagian belakang.',
      material: 'Polyester Mesh & Cotton Twill',
      status: 'ACTIVE',
      totalSold: 85,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Smartwatch Forge X',
      slug: 'smartwatch-forge-x',
      sku: 'BBN-SW-01',
      categoryId: catMap['elektronik'],
      price: 499000,
      compareAtPrice: 649000,
      description: 'Jam tangan pintar berlayar AMOLED 1.4 inci dengan sensor detak jantung, SpO2, pelacak olahraga 50+ mode, dan sertifikasi tahan air IP68.',
      material: 'Aluminum Case & Silicone Strap',
      status: 'ACTIVE',
      totalSold: 62,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Backpack Cyber BBN',
      slug: 'backpack-cyber-bbn',
      sku: 'BBN-BP-01',
      categoryId: catMap['tas'],
      price: 349000,
      compareAtPrice: 429000,
      description: 'Ransel laptop hingga 15.6 inci dengan desain tahan benturan, port USB charging eksternal, dan busa punggung empuk anti-gerah.',
      material: 'Waterproof Oxford Fabric',
      status: 'ACTIVE',
      totalSold: 78,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    }
  ];

  for (const item of products) {
    const p = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        categoryId: item.categoryId,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        description: item.description,
        material: item.material,
        status: 'ACTIVE',
        totalSold: item.totalSold
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        categoryId: item.categoryId,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        description: item.description,
        material: item.material,
        status: 'ACTIVE',
        totalSold: item.totalSold
      }
    });

    // Replace images
    await prisma.productImage.deleteMany({ where: { productId: p.id } });
    await prisma.productImage.create({
      data: {
        productId: p.id,
        imageUrl: item.image,
        sortOrder: 0
      }
    });

    // Ensure at least one default variant exists
    const variants = await prisma.productVariant.findMany({ where: { productId: p.id } });
    if (variants.length === 0) {
      await prisma.productVariant.create({
        data: {
          productId: p.id,
          sku: `${item.sku}-STD`,
          color: 'Hitam',
          size: 'All Size',
          stock: 30,
          status: 'ACTIVE'
        }
      });
    }
  }

  console.log('✅ Exactly 8 official BBN products synced and active!');
}

cleanAndSync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

