const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const prod = await p.product.findUnique({ where: { slug: 'sneakers-vortex' } });
  if (prod) {
    await p.productImage.deleteMany({ where: { productId: prod.id } });
    await p.productImage.create({
      data: {
        productId: prod.id,
        imageUrl: '/hero-sneaker.png',
        sortOrder: 0
      }
    });
    console.log('✅ Sneakers Vortex image updated to /hero-sneaker.png');
  }
}

run()
  .catch(console.error)
  .finally(() => p.$disconnect());
