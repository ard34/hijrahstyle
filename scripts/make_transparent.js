const sharp = require('sharp');
const path = require('path');

async function makeTransparent() {
  const inputPath = path.join(__dirname, '../public/hero-sneaker.png');
  const outputPath = path.join(__dirname, '../public/hero-sneaker-transparent.png');

  console.log('Processing sneaker image to true transparent PNG...');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image info: ${width}x${height}, channels: ${channels}`);

  // Loop through pixels and make dark pixels transparent
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness
    const brightness = Math.max(r, g, b);

    if (brightness < 30) {
      data[i + 3] = 0; // Completely transparent
    } else if (brightness < 60) {
      // Smooth alpha transition
      const factor = (brightness - 30) / 30;
      data[i + 3] = Math.round(data[i + 3] * factor);
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log('✅ Generated hero-sneaker-transparent.png successfully!');
}

makeTransparent().catch(console.error);

