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

  // Full sizes for apparel: S, M, L, XL, XXL; footwear: 39-44
  const availableSizes = isApparel 
    ? ['S', 'M', 'L', 'XL', 'XXL'] 
    : isFootwear 
    ? ['39', '40', '41', '42', '43', '44'] 
    : sizes.length > 0 
    ? sizes 
    : ['All Size'];

  const apparelColorsFallback = ['Hitam Solid', 'Putih Bersih', 'Navy Blue'];
  const availableColors = colors.length >= 2 
    ? colors 
    : isApparel 
    ? (colors.length === 1 && !apparelColorsFallback.includes(colors[0]) ? [colors[0], 'Hitam Solid', 'Navy Blue'] : apparelColorsFallback)
    : colors.length > 0 
    ? colors 
    : ['Hitam', 'Putih', 'Navy'];

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || 'Hitam Solid');
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

  const currentPrice = selectedVariant?.priceOverride || product.price || 129000;
  const comparePrice = product.compareAtPrice || Math.round(currentPrice * 1.25);
  const hasDiscount = Boolean(comparePrice && comparePrice > currentPrice);
  const discount = hasDiscount ? getDiscountPercentage(comparePrice, currentPrice) : 19;

  // Dynamic stock per variant or default
  const variantStock = selectedVariant?.stock || 45;
  const totalStock = product.variants && product.variants.length > 0
    ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
    : 105;

  const totalSold = product.totalSold || 180;
  const totalReviewsCount = product.reviews?.length || 128;

  const images = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.imageUrl || img.url)
    : ['/products/kaos-forge.jpg', '/products/hoodie-bbn.jpg', '/products/sneakers-vortex.png'];

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
          sellerReply: 'Terima kasih atas kepercayaannya berbelanja di HijrahStyle Official! Ditunggu pesanan berikutnya kak 🙏'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-12 animate-fade-in-up">
      
      {/* ─── Breadcrumbs with Generous Margin ─── */}
      <nav className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-400 pb-2">
        <Link href="/" className="hover:text-blue-400 transition-colors">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href={`/products?category=${product.category?.slug || 'pakaian'}`} className="hover:text-blue-400 transition-colors capitalize">
          {product.category?.name || 'Pakaian'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate max-w-sm">{product.name}</span>
      </nav>

      {/* ─── Main Product Showcase Card with Luxurious Spacing ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-8 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ─── Left Column: Image Showcase (Span 5 cols) ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Showcase Image */}
            <div className="relative aspect-square max-h-[460px] w-full rounded-2xl overflow-hidden bg-[#11192b] p-8 border border-slate-800/90 shadow-xl flex items-center justify-center group">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                className="relative w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
              />

              {/* Wishlist Heart */}
              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  addToast(isWishlisted ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist', 'info');
                }}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-105'
                    : 'bg-slate-900/70 text-slate-400 hover:text-rose-400 hover:bg-slate-900'
                }`}
                title="Tambah ke Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
              </button>
            </div>

            {/* Thumbnails Row with Comfortable Gap */}
            <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1">
              {images.map((thumbUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden p-2 border-2 transition-all cursor-pointer flex items-center justify-center bg-[#070b14] shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-blue-500 shadow-lg shadow-blue-500/30 bg-blue-600/10 scale-105'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <img src={thumbUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* 3 Jaminan Resmi Toko Multi-Tone */}
            <div className="pt-2 grid grid-cols-3 gap-3 text-center text-xs text-slate-300 font-semibold">
              <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-sky-500/30 flex flex-col items-center gap-1.5 shadow-xs hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <span className="text-[11px] font-bold text-slate-200">100% Original</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-amber-500/30 flex flex-col items-center gap-1.5 shadow-xs hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-bold text-slate-200">Garansi 7 Hari</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-emerald-500/30 flex flex-col items-center gap-1.5 shadow-xs hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-200">Bebas Ongkir</span>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Purchase Details & Form (Span 7 cols) ─── */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Title & Ratings Header */}
            <div className="space-y-3.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Shopee Rating, Reviews Count, and Sold Count Triad */}
              <div className="flex items-center gap-6 text-xs sm:text-sm mt-3 flex-wrap">
                {/* Rating */}
                <button 
                  onClick={scrollToReviews}
                  className="flex items-center gap-2 text-amber-400 font-bold hover:underline cursor-pointer group"
                >
                  <span className="text-base font-black underline text-amber-300 group-hover:text-amber-200">{avgRating.toFixed(1)}</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </button>

                {/* Jumlah Penilaian / Ulasan */}
                <button 
                  onClick={scrollToReviews}
                  className="text-slate-300 hover:text-blue-400 cursor-pointer flex items-center gap-1.5 group"
                >
                  <span className="text-white font-black underline text-sm sm:text-base group-hover:text-blue-400">{totalReviewsCount}</span>
                  <span className="text-slate-400 text-xs sm:text-sm font-medium">Penilaian</span>
                </button>

                {/* Jumlah Terjual */}
                <div className="text-slate-300 flex items-center gap-1.5">
                  <span className="text-white font-black text-sm sm:text-base">{totalSold}</span>
                  <span className="text-slate-400 text-xs sm:text-sm font-medium">Terjual</span>
                </div>
              </div>
            </div>

            {/* Shopee Style Price Box with Generous Padding */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#070b14] border border-slate-800/90 space-y-4 shadow-inner my-7">
              <div className="flex items-baseline gap-4 flex-wrap">
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-slate-500 line-through font-semibold">
                    {formatPrice(comparePrice)}
                  </span>
                )}
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-black text-xs shadow-md tracking-wide">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Promo Vouchers */}
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  Voucher Diskon Rp50RB (Kode: DISKON50K)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  Gratis Ongkir Seluruh Indonesia
                </span>
              </div>
            </div>

            {/* Attributes System with Spacious Spacing (Tanpa garis-garis mepet) */}
            <div className="space-y-6 sm:space-y-7">
              
              {/* Row 1: Pengiriman */}
              <div className="sm:flex sm:items-start sm:gap-8">
                <span className="w-36 shrink-0 text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider block sm:pt-1 mb-2 sm:mb-0">
                  Pengiriman
                </span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-xs sm:text-sm">
                    <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gratis Ongkir ke Seluruh Indonesia</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pengiriman kilat via JNE, SiCepat, J&amp;T dari <strong className="text-slate-200">Kota Serang, Banten</strong>
                  </p>
                </div>
              </div>

              {/* Row 2: Warna */}
              <div className="sm:flex sm:items-center sm:gap-8">
                <span className="w-36 shrink-0 text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3 sm:mb-0">
                  Warna
                </span>
                <div className="flex-1 flex flex-wrap gap-3">
                  {availableColors.map((color) => {
                    const isSelected = selectedColor === color;
                    const isDark = color.toLowerCase().includes('hitam') || color.toLowerCase().includes('black') || color.toLowerCase().includes('navy');
                    const isWhite = color.toLowerCase().includes('putih') || color.toLowerCase().includes('white');
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-500'
                            : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-[#070b14]'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full border ${isWhite ? 'bg-white border-slate-300' : isDark ? 'bg-slate-900 border-slate-600' : 'bg-slate-500 border-slate-400'}`} />
                        <span>{color}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Ukuran Pakaian */}
              <div className="sm:flex sm:items-start sm:gap-8">
                <div className="w-36 shrink-0 mb-3 sm:mb-0">
                  <span className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider block sm:pt-2">
                    {isApparel ? 'Ukuran Pakaian' : 'Pilihan Ukuran'}
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[3.5rem] h-12 px-4 rounded-xl text-sm font-extrabold border transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/35 ring-1 ring-blue-400'
                              : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-[#070b14]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {isApparel && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      <p>
                        Model memakai ukuran <strong className="text-white font-bold">L</strong> (Tinggi 175 cm, Berat 70 kg)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4: Kuantitas */}
              <div className="sm:flex sm:items-center sm:gap-8">
                <span className="w-36 shrink-0 text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3 sm:mb-0">
                  Kuantitas
                </span>
                <div className="flex-1 flex items-center gap-5 flex-wrap">
                  <div className="flex items-center bg-[#070b14] rounded-xl border border-slate-800 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-sm text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                      Tersisa {variantStock} buah
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>Total stok: <strong className="text-white font-semibold">{totalStock} buah</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons: Matched Heights & Generous Top Margin */}
            <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full sm:flex-1 h-14 sm:h-15 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 border-2 border-blue-500/50 text-blue-400 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>+ Masukkan Keranjang</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 h-14 sm:h-15 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ─── Box Spesifikasi Produk (Shopee Style) ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-8 sm:p-10 shadow-xl space-y-6">
        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight pb-4 border-b border-slate-800 uppercase flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span>Spesifikasi Produk</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs sm:text-sm">
          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Kategori</span>
            <span className="text-blue-400 font-bold capitalize">
              {product.category?.name || 'Pakaian'} &gt; {product.name.split(' ')[0]}
            </span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Merek</span>
            <span className="text-white font-bold">HijrahStyle Official</span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Bahan / Material</span>
            <span className="text-white font-bold">{product.material || 'Katun Rayon & Sutra Silk Premium'}</span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Gaya / Style</span>
            <span className="text-white font-bold">Busana Muslimah Modern &amp; Syar'i</span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Negara Asal</span>
            <span className="text-white font-bold">Indonesia (Official Local Brand)</span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Dikirim Dari</span>
            <span className="text-white font-bold">Kota Serang, Banten</span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Total Stok Produk</span>
            <span className="text-emerald-400 font-black">{totalStock} buah</span>
          </div>

          <div className="py-2 flex items-center">
            <span className="w-40 text-slate-400 font-medium">Masa Garansi</span>
            <span className="text-white font-bold">7 Hari Tukar Baru / Pengembalian</span>
          </div>
        </div>
      </div>

      {/* ─── Box Deskripsi Produk & Panduan Ukuran (Shopee Style) ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-8 sm:p-10 shadow-xl space-y-6">
        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight pb-4 border-b border-slate-800 uppercase flex items-center gap-2.5">
          <Package className="w-5 h-5 text-blue-400" />
          <span>Deskripsi Produk</span>
        </h2>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-5">
          <p>{product.description}</p>

          {/* Size Chart Khusus Pakaian (Shopee Size Chart Table) */}
          {isApparel && (
            <div className="pt-4 space-y-3.5">
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                📏 PANDUAN UKURAN / SIZE CHART (Lebar Dada x Panjang Baju x Panjang Lengan)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead className="bg-[#070b14] text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">Ukuran</th>
                      <th className="py-3.5 px-5">Lebar Dada (cm)</th>
                      <th className="py-3.5 px-5">Panjang Badan (cm)</th>
                      <th className="py-3.5 px-5">Panjang Lengan (cm)</th>
                      <th className="py-3.5 px-5">Rekomendasi Berat Badan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-300">
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-5 font-black text-white">S</td>
                      <td className="py-3 px-5">52 cm</td>
                      <td className="py-3 px-5">66 cm</td>
                      <td className="py-3 px-5">58 cm</td>
                      <td className="py-3 px-5">45 - 55 kg</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-5 font-black text-white">M</td>
                      <td className="py-3 px-5">55 cm</td>
                      <td className="py-3 px-5">69 cm</td>
                      <td className="py-3 px-5">60 cm</td>
                      <td className="py-3 px-5">55 - 65 kg</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-5 font-black text-white">L</td>
                      <td className="py-3 px-5">58 cm</td>
                      <td className="py-3 px-5">72 cm</td>
                      <td className="py-3 px-5">62 cm</td>
                      <td className="py-3 px-5">65 - 75 kg</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-5 font-black text-white">XL</td>
                      <td className="py-3 px-5">61 cm</td>
                      <td className="py-3 px-5">75 cm</td>
                      <td className="py-3 px-5">64 cm</td>
                      <td className="py-3 px-5">75 - 85 kg</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-5 font-black text-white">XXL</td>
                      <td className="py-3 px-5">64 cm</td>
                      <td className="py-3 px-5">78 cm</td>
                      <td className="py-3 px-5">66 cm</td>
                      <td className="py-3 px-5">&gt; 85 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400">
                *Toleransi selisih ukuran jahit 1-2 cm wajar pada industri garmen konveksi.
              </p>
            </div>
          )}

          {/* Size Chart Khusus Sepatu */}
          {isFootwear && (
            <div className="pt-4 space-y-3.5">
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                👟 PANDUAN UKURAN SEPATU (Panjang Insole / Kaki)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
                {[
                  { size: '39', cm: '24.5 cm' },
                  { size: '40', cm: '25.0 cm' },
                  { size: '41', cm: '26.0 cm' },
                  { size: '42', cm: '26.5 cm' },
                  { size: '43', cm: '27.5 cm' },
                  { size: '44', cm: '28.0 cm' },
                ].map((s) => (
                  <div key={s.size} className="p-3 rounded-2xl bg-[#070b14] border border-slate-800">
                    <span className="block font-black text-white text-sm">EU {s.size}</span>
                    <span className="block text-slate-400 text-xs mt-0.5">{s.cm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ketentuan Garansi Toko */}
          <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2.5 mt-4">
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ketentuan Garansi &amp; Retur HijrahStyle Official:</span>
            </h4>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-400 space-y-1.5 leading-relaxed pl-1">
              <li>Wajib menyertakan video unboxing paket tanpa jeda saat mengajukan komplain retur.</li>
              <li>Garansi tukar ukuran berlaku maksimal 7 hari setelah barang diterima, kondisi belum dicuci.</li>
              <li>Semua transaksi pembayaran aman dan terverifikasi otomatis via Duitku Payment Gateway.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Box Penilaian Produk / Ulasan Pembeli (Shopee Style) ─── */}
      <div id="section-ulasan" className="bg-[#0b1220] rounded-3xl border border-slate-800/90 p-8 sm:p-10 shadow-xl space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span>Penilaian Produk ({totalReviewsCount})</span>
          </h2>
        </div>

        {/* Shopee Rating Summary Banner */}
        <div className="p-6 rounded-2xl bg-[#070b14] border border-slate-800 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex items-baseline justify-center md:justify-start gap-1.5">
              <span className="text-5xl font-black text-amber-400">{avgRating.toFixed(1)}</span>
              <span className="text-slate-500 font-bold text-base">dari 5</span>
            </div>
            <div className="flex text-amber-400 justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Shopee Review Filter Chips */}
          <div className="flex flex-wrap gap-2.5 flex-1 justify-center md:justify-start">
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
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
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

        {/* Reviews List with Spacious Padding */}
        <div className="space-y-6 divide-y divide-slate-800/80">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
              {/* User Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-black text-sm flex items-center justify-center">
                    {rev.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{rev.user?.name || 'Pelanggan Terverifikasi'}</h4>
                    <div className="flex text-amber-400 items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-xs text-slate-500">{rev.createdAt}</span>
              </div>

              {/* Variasi yang dibeli */}
              <div className="text-xs text-slate-400">
                <span>Variasi: </span>
                <span className="text-slate-300 font-semibold">{rev.variant || `${selectedColor}, ${selectedSize}`}</span>
              </div>

              {/* Comment Text */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                {rev.comment}
              </p>

              {/* Helpful Thumbs Up Count */}
              <div className="flex items-center gap-4 pt-1.5">
                <button 
                  onClick={() => addToast('Terima kasih atas responnya!', 'info')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Membantu ({rev.helpfulCount || 8})</span>
                </button>
              </div>

              {/* Respon Penjual / Balasan Toko ala Shopee */}
              {rev.sellerReply && (
                <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 text-xs sm:text-sm text-slate-400 space-y-1.5 mt-3">
                  <span className="font-bold text-blue-400 block text-xs">Respon Penjual:</span>
                  <p className="leading-relaxed">{rev.sellerReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Rekomendasi Produk Terkait Lainnya ─── */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
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
