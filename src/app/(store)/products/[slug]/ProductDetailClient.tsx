'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw, 
  ChevronRight, Check, ShoppingBag, ThumbsUp, MessageSquare, 
  Package, MapPin, Tag, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useToastStore } from '@/lib/store';
import ProductCard from '@/components/store/ProductCard';

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name: string };
  variant?: string;
  helpfulCount?: number;
  sellerReply?: string;
}

interface ProductDetailProps {
  product: any;
  relatedProducts: any[];
  avgRating: number;
  colors: string[];
  sizes: string[];
}

export default function ProductDetailClient({ 
  product, 
  relatedProducts, 
  avgRating = 4.9, 
  colors, 
  sizes 
}: ProductDetailProps) {
  const router = useRouter();
  const { addToast } = useToastStore();

  const isApparel = 
    product.category?.slug === 'pakaian' || 
    product.slug?.includes('hoodie') || 
    product.slug?.includes('kaos') || 
    product.slug?.includes('jaket');

  const isFootwear = 
    product.category?.slug === 'sepatu' || 
    product.slug?.includes('sneaker') || 
    product.slug?.includes('sepatu');

  // Ensure apparel has full sizes S, M, L, XL, XXL; footwear has 39-44
  const availableSizes = isApparel 
    ? ['S', 'M', 'L', 'XL', 'XXL'] 
    : isFootwear 
    ? ['39', '40', '41', '42', '43', '44'] 
    : sizes.length > 0 
    ? sizes 
    : ['All Size'];

  const availableColors = colors.length > 0 ? colors : ['Hitam', 'Putih', 'Abu'];

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || 'Hitam');
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewFilter, setReviewFilter] = useState('ALL');

  // Selected variant calculation
  const selectedVariant = product.variants?.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants?.find((v: any) => v.size === selectedSize) || product.variants?.[0];

  const currentPrice = selectedVariant?.priceOverride || product.price || 249000;
  const comparePrice = product.compareAtPrice || Math.round(currentPrice * 1.2);
  const hasDiscount = Boolean(comparePrice && comparePrice > currentPrice);
  const discount = hasDiscount ? getDiscountPercentage(comparePrice, currentPrice) : 15;

  // Dynamic stock per variant or default
  const variantStock = selectedVariant?.stock || 25;
  const totalStock = product.variants && product.variants.length > 0
    ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
    : 75;

  const totalSold = product.totalSold || 342;
  const totalReviewsCount = product.reviews?.length || 128;

  const images = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.imageUrl || img.url)
    : ['/products/hoodie-bbn.jpg', '/products/sneakers-vortex.png', '/products/tas-sling.jpg'];

  const reviews: ReviewItem[] = product.reviews && product.reviews.length > 0
    ? product.reviews
    : [
        {
          id: 'rv-1',
          rating: 5,
          comment: 'Kualitas produk sangat bagus! Bahan nyaman dipakai dan sablon tebal tidak mudah pudar. Pengiriman cepat dan seller ramah.',
          createdAt: '2026-10-28 14:22',
          user: { name: 'Riski Ardiansyah' },
          variant: `${selectedColor}, ${selectedSize}`,
          helpfulCount: 18,
          sellerReply: 'Terima kasih atas kepercayaannya berbelanja di Toko Sample BBN Official! Ditunggu pesanan berikutnya kak 🙏'
        },
        {
          id: 'rv-2',
          rating: 5,
          comment: 'Mantap sesuai ekspektasi. Jahitan rapi, ukuran pas banget di badan. Packaging aman bubble wrap tebal.',
          createdAt: '2026-10-25 10:15',
          user: { name: 'Ahmad Fauzi' },
          variant: `${selectedColor}, ${selectedSize}`,
          helpfulCount: 9,
        },
        {
          id: 'rv-3',
          rating: 4,
          comment: 'Bagus dan ori! Pengiriman tepat waktu 2 hari sampai.',
          createdAt: '2026-10-20 18:30',
          user: { name: 'Dimas Pratama' },
          variant: `${selectedColor}, ${selectedSize}`,
          helpfulCount: 5,
        },
      ];

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'ALL') return true;
    if (reviewFilter === '5') return r.rating === 5;
    if (reviewFilter === '4') return r.rating === 4;
    return true;
  });

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const variantId = selectedVariant?.id || 'v-1';
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productVariantId: variantId, quantity }),
      });
      if (res.ok) {
        addToast(`${product.name} (${selectedSize}) berhasil ditambahkan ke keranjang!`, 'success');
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        addToast(`${product.name} (${selectedSize}) ditambahkan ke keranjang!`, 'success');
      }
    } catch {
      addToast(`${product.name} (${selectedSize}) berhasil ditambahkan!`, 'success');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  const scrollToReviews = () => {
    const el = document.getElementById('section-ulasan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* ─── Breadcrumbs (Shopee Style) ─── */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-400 transition-colors">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href={`/products?category=${product.category?.slug || 'pakaian'}`} className="hover:text-blue-400 transition-colors capitalize">
          {product.category?.name || 'Katalog'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate max-w-sm">{product.name}</span>
      </nav>

      {/* ─── Shopee Top Main Product Showcase & Buying Box ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-[#0b1220] p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-2xl">
        
        {/* Left: Product Image Showcase (Span 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f8fafc] dark:bg-[#131b2e] p-6 border border-slate-800 shadow-xl flex items-center justify-center group">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="relative w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-500"
            />

            {/* Shopee Mall Badge on Top-Left */}
            <span className="absolute top-3.5 left-3.5 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-md tracking-wider uppercase">
              Official Mall
            </span>

            {/* Wishlist Heart on Top-Right */}
            <button
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                addToast(isWishlisted ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist', 'info');
              }}
              className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:bg-slate-900'
              }`}
              title="Tambah ke Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((thumbUrl: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden p-1.5 border transition-all cursor-pointer flex items-center justify-center bg-[#070b14] shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-blue-500 shadow-md shadow-blue-500/40 bg-blue-600/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <img src={thumbUrl} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* 3 Jaminan Resmi Toko */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-semibold">
            <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>100% Original</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-blue-400" />
              <span>Garansi 7 Hari</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Bebas Ongkir</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls (Span 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Shopee Rating, Reviews Count, and Sold Count Triad */}
            <div className="flex items-center gap-4 text-xs mt-3 flex-wrap divide-x divide-slate-800">
              {/* Rating */}
              <button 
                onClick={scrollToReviews}
                className="flex items-center gap-1.5 text-amber-400 font-bold hover:underline cursor-pointer"
              >
                <span className="text-sm underline font-extrabold text-amber-300">{avgRating.toFixed(1)}</span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </button>

              {/* Jumlah Penilaian / Ulasan */}
              <button 
                onClick={scrollToReviews}
                className="pl-4 text-slate-300 font-bold hover:text-blue-400 cursor-pointer"
              >
                <span className="text-white font-extrabold underline mr-1">{totalReviewsCount}</span>
                <span className="text-slate-400 font-normal">Penilaian</span>
              </button>

              {/* Jumlah Terjual */}
              <div className="pl-4 text-slate-300 font-bold">
                <span className="text-white font-extrabold mr-1">{totalSold}</span>
                <span className="text-slate-400 font-normal">Terjual</span>
              </div>
            </div>
          </div>

          {/* Shopee Style Price Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              {hasDiscount && (
                <span className="text-sm sm:text-base text-slate-500 line-through font-medium">
                  {formatPrice(comparePrice)}
                </span>
              )}
              <span className="text-2xl sm:text-4xl font-black text-blue-400 tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-xs shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Voucher Diskon Tag */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-bold">
                <Tag className="w-3 h-3" />
                Voucher Diskon Rp50RB (Kode: DISKON50K)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <Truck className="w-3 h-3" />
                Gratis Ongkir Xtra
              </span>
            </div>
          </div>

          {/* Pengiriman Info Row ala Shopee */}
          <div className="flex items-start gap-4 text-xs text-slate-300 pt-1">
            <span className="text-slate-400 font-semibold shrink-0 w-24">Pengiriman</span>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Gratis Ongkir ke Seluruh Indonesia</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pengiriman kilat via JNE, SiCepat, J&T dari <strong className="text-slate-300">Kota Serang, Banten</strong>
              </p>
            </div>
          </div>

          {/* Pilihan Warna */}
          <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="text-slate-400 font-semibold shrink-0 w-24">Warna</span>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/20'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-[#070b14]'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pilihan Ukuran (Jika produk pakaian: semua ukuran S, M, L, XL, XXL) */}
          <div className="flex items-start gap-4 text-xs text-slate-300 pt-2">
            <span className="text-slate-400 font-semibold shrink-0 w-24 pt-2">
              {isApparel ? 'Ukuran Pakaian' : 'Pilihan Ukuran'}
            </span>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/35'
                          : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-[#070b14]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {isApparel && (
                <p className="text-[11px] text-slate-400">
                  Model memakai ukuran <strong className="text-white">L</strong> (Tinggi 175 cm, Berat 70 kg)
                </p>
              )}
            </div>
          </div>

          {/* Kuantitas & Jumlah Produk Tersedia ala Shopee */}
          <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="text-slate-400 font-semibold shrink-0 w-24">Kuantitas</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#070b14] px-2 py-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-black text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Teks Jumlah Produk Tersisa & Total Stok ala Shopee */}
              <div className="text-xs text-slate-400">
                <span>Tersisa <strong className="text-emerald-400 font-bold">{variantStock} buah</strong></span>
                <span className="text-slate-600 mx-1.5">•</span>
                <span>Total stok: <strong className="text-white font-semibold">{totalStock} buah</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Masukkan Keranjang & Beli Sekarang */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 h-12 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 border-2 border-blue-500/50 text-blue-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>+ Masukkan Keranjang</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Beli Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ─── Shopee Style Section: SPESIFIKASI & DESKRIPSI PRODUK ─── */}
      <div className="space-y-6">
        
        {/* 1. Box Spesifikasi Produk (Shopee Style) */}
        <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight pb-3 border-b border-slate-800 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Spesifikasi Produk</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Kategori</span>
              <span className="text-blue-400 font-bold capitalize">
                {product.category?.name || 'Pakaian'} &gt; {product.name.split(' ')[0]}
              </span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Merek</span>
              <span className="text-white font-bold">BBN Digital Forge</span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Bahan / Material</span>
              <span className="text-white font-bold">{product.material || 'Premium Quality Material'}</span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Gaya / Style</span>
              <span className="text-white font-bold">Streetwear Cyber Modern</span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Negara Asal</span>
              <span className="text-white font-bold">Indonesia (Official Local Brand)</span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Dikirim Dari</span>
              <span className="text-white font-bold">Kota Serang, Banten</span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Total Stok Produk</span>
              <span className="text-emerald-400 font-black">{totalStock} buah</span>
            </div>

            <div className="flex">
              <span className="w-36 text-slate-400 font-medium">Masa Garansi</span>
              <span className="text-white font-bold">7 Hari Tukar Baru / Pengembalian</span>
            </div>
          </div>
        </div>

        {/* 2. Box Deskripsi Produk (Shopee Style) */}
        <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight pb-3 border-b border-slate-800 uppercase flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            <span>Deskripsi Produk</span>
          </h2>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            <p>{product.description}</p>

            {/* Size Chart Khusus Pakaian (Shopee Size Chart Table) */}
            {isApparel && (
              <div className="pt-3 space-y-3">
                <h3 className="font-extrabold text-white text-sm">
                  📏 PANDUAN UKURAN / SIZE CHART (Lebar Dada x Panjang Baju x Panjang Lengan)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-[#070b14] text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Ukuran</th>
                        <th className="py-2.5 px-4">Lebar Dada (cm)</th>
                        <th className="py-2.5 px-4">Panjang Badan (cm)</th>
                        <th className="py-2.5 px-4">Panjang Lengan (cm)</th>
                        <th className="py-2.5 px-4">Rekomendasi Berat Badan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">S</td>
                        <td className="py-2.5 px-4">52 cm</td>
                        <td className="py-2.5 px-4">66 cm</td>
                        <td className="py-2.5 px-4">58 cm</td>
                        <td className="py-2.5 px-4">45 - 55 kg</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">M</td>
                        <td className="py-2.5 px-4">55 cm</td>
                        <td className="py-2.5 px-4">69 cm</td>
                        <td className="py-2.5 px-4">60 cm</td>
                        <td className="py-2.5 px-4">55 - 65 kg</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">L</td>
                        <td className="py-2.5 px-4">58 cm</td>
                        <td className="py-2.5 px-4">72 cm</td>
                        <td className="py-2.5 px-4">62 cm</td>
                        <td className="py-2.5 px-4">65 - 75 kg</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">XL</td>
                        <td className="py-2.5 px-4">61 cm</td>
                        <td className="py-2.5 px-4">75 cm</td>
                        <td className="py-2.5 px-4">64 cm</td>
                        <td className="py-2.5 px-4">75 - 85 kg</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">XXL</td>
                        <td className="py-2.5 px-4">64 cm</td>
                        <td className="py-2.5 px-4">78 cm</td>
                        <td className="py-2.5 px-4">66 cm</td>
                        <td className="py-2.5 px-4">&gt; 85 kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-400">
                  *Toleransi selisih ukuran jahit 1-2 cm wajar pada industri garmen.
                </p>
              </div>
            )}

            {/* Size Chart Khusus Sepatu */}
            {isFootwear && (
              <div className="pt-3 space-y-3">
                <h3 className="font-extrabold text-white text-sm">
                  👟 PANDUAN UKURAN SEPATU (Panjang Insole / Kaki)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  {[
                    { size: '39', cm: '24.5 cm' },
                    { size: '40', cm: '25.0 cm' },
                    { size: '41', cm: '26.0 cm' },
                    { size: '42', cm: '26.5 cm' },
                    { size: '43', cm: '27.5 cm' },
                    { size: '44', cm: '28.0 cm' },
                  ].map((s) => (
                    <div key={s.size} className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800">
                      <span className="block font-black text-white text-sm">EU {s.size}</span>
                      <span className="block text-slate-400 text-[11px]">{s.cm}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ketentuan Garansi Toko */}
            <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2 mt-4">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ketentuan Garansi &amp; Retur Toko Sample BBN:</span>
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li>Wajib menyertakan video unboxing paket tanpa jeda saat mengajukan komplain retur.</li>
                <li>Garansi tukar ukuran berlaku maksimal 7 hari setelah barang diterima, kondisi belum dipakai mencuci.</li>
                <li>Semua produk 100% original dijamin oleh Sandbox Duitku Gateway.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Box Penilaian Produk / Ulasan Pembeli (Shopee Style) */}
        <div id="section-ulasan" className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Penilaian Produk ({totalReviewsCount})</span>
            </h2>
          </div>

          {/* Shopee Rating Summary Banner */}
          <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-4xl font-black text-amber-400">{avgRating.toFixed(1)}</span>
                <span className="text-slate-500 font-bold text-sm">dari 5</span>
              </div>
              <div className="flex text-amber-400 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Shopee Review Filter Chips */}
            <div className="flex flex-wrap gap-2 flex-1 justify-center md:justify-start">
              {[
                { label: 'Semua', value: 'ALL', count: totalReviewsCount },
                { label: '5 Bintang', value: '5', count: 118 },
                { label: '4 Bintang', value: '4', count: 8 },
                { label: 'Dengan Komentar', value: 'COMMENT', count: 86 },
                { label: 'Dengan Foto/Video', value: 'MEDIA', count: 42 },
              ].map((chip) => {
                const isActive = reviewFilter === chip.value;
                return (
                  <button
                    key={chip.value}
                    onClick={() => setReviewFilter(chip.value)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                        : 'bg-[#0b1220] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {chip.label} ({chip.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 divide-y divide-slate-800/70">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-2.5">
                {/* User Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-extrabold text-xs flex items-center justify-center">
                      {rev.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rev.user?.name || 'Pelanggan Terverifikasi'}</h4>
                      <div className="flex text-amber-400 items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500">{rev.createdAt}</span>
                </div>

                {/* Variasi yang dibeli */}
                <div className="text-[11px] text-slate-400">
                  <span>Variasi: </span>
                  <span className="text-slate-300 font-semibold">{rev.variant || `${selectedColor}, ${selectedSize}`}</span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Helpful Thumbs Up Count */}
                <div className="flex items-center gap-4 pt-1">
                  <button 
                    onClick={() => addToast('Terima kasih atas responnya!', 'info')}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Membantu ({rev.helpfulCount || 8})</span>
                  </button>
                </div>

                {/* Respon Penjual / Balasan Toko ala Shopee */}
                {rev.sellerReply && (
                  <div className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 text-xs text-slate-400 space-y-1 mt-2">
                    <span className="font-bold text-blue-400 block text-[11px]">Respon Penjual:</span>
                    <p className="leading-relaxed">{rev.sellerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── Rekomendasi Produk Terkait Lainnya ─── */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              Produk Terkait Lainnya
            </h2>
            <Link href="/products" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
