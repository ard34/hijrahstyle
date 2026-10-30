const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
  console.log('🔄 Updating database images to local high-res studio assets...');

  const imageMap = {
    'sneakers-vortex': '/products/sneakers-vortex.png',
    'hoodie-bbn-premium': '/products/hoodie-bbn.jpg',
    'kaos-forge': '/products/kaos-forge.jpg',
    'jaket-windbreaker': '/products/jaket-windbreaker.jpg',
    'tas-sling-bbn': '/products/tas-sling.jpg',
    'topi-trucker': '/products/topi-trucker.jpg',
    'smartwatch-forge-x': '/products/smartwatch-forge-x.jpg',
    'backpack-cyber-bbn': '/products/tas-sling.jpg',
  };

  for (const [slug, imgUrl] of Object.entries(imageMap)) {
    const prod = await prisma.product.findUnique({ where: { slug } });
    if (prod) {
      await prisma.productImage.deleteMany({ where: { productId: prod.id } });
      await prisma.productImage.create({
        data: {
          productId: prod.id,
          imageUrl: imgUrl,
          sortOrder: 0
        }
      });
      console.log(`✅ Updated ${slug} -> ${imgUrl}`);
    }
  }

  console.log('🎉 All 8 BBN studio images synced into database!');
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
