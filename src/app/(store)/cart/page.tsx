'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

interface CartItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
  slug: string;
  checked?: boolean;
}

const fallbackCartItems: CartItem[] = [
  {
    id: 'cart-1',
    productVariantId: 'v-1',
    productName: 'Sneakers Vortex',
    variantLabel: 'Putih / 42',
    price: 599000,
    quantity: 1,
    imageUrl: '/products/sneakers-vortex.png',
    stock: 25,
    slug: 'sneakers-vortex',
    checked: true,
  },
  {
    id: 'cart-2',
    productVariantId: 'v-2',
    productName: 'Hoodie BBN Premium',
    variantLabel: 'Hitam / L',
    price: 249000,
    quantity: 1,
    imageUrl: '/products/hoodie-bbn.jpg',
    stock: 40,
    slug: 'hoodie-bbn-premium',
    checked: true,
  },
  {
    id: 'cart-3',
    productVariantId: 'v-5',
    productName: 'Tas Sling BBN',
    variantLabel: 'Hitam',
    price: 199000,
    quantity: 1,
    imageUrl: '/products/tas-sling.jpg',
    stock: 50,
    slug: 'tas-sling-bbn',
    checked: true,
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(fallbackCartItems);
  const [loading, setLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState('DISKON50K');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>({
    code: 'DISKON50K',
    discount: 50000,
  });
  const { addToast } = useToastStore();

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setItems(data.items.map((i: any) => ({ ...i, checked: true })));
        } else {
          setItems(fallbackCartItems);
        }
      } else {
        setItems(fallbackCartItems);
      }
    } catch {
      setItems(fallbackCartItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCart(); 
  }, []);

  const toggleCheck = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
    try {
      await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
    } catch {}
  };

  const removeItem = async (id: string) => {
    setItems(items.filter(item => item.id !== id));
    addToast('Item dihapus dari keranjang', 'info');
    try {
      await fetch(`/api/cart/${id}`, { method: 'DELETE' });
    } catch {}
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === 'DISKON50K') {
      setAppliedVoucher({ code: 'DISKON50K', discount: 50000 });
      addToast('Voucher DISKON50K berhasil diterapkan!', 'success');
    } else {
      addToast('Kode voucher tidak valid', 'error');
    }
  };

  const activeItems = items.filter(i => i.checked !== false);
  const subtotal = activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.length;
  const shippingFee = activeItems.length > 0 ? 25000 : 0;
  const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
  const grandTotal = Math.max(0, subtotal - voucherDiscount + shippingFee);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)]">
      
      {/* ─── Screen 04 Title: Keranjang Belanja & Product Count ─── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Keranjang Belanja
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {totalCount} produk dalam keranjang
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── Screen 04 Left Column: Cart Items (Span 7 cols) ─── */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-4 sm:p-5 flex items-center gap-4 shadow-lg"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleCheck(item.id)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                  item.checked !== false 
                    ? 'border-blue-500 bg-blue-600' 
                    : 'border-slate-600 bg-transparent'
                }`}
              >
                {item.checked !== false && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>

              {/* Product Thumbnail inside soft white/light box (Ref: Screen 04) */}
              <div className="w-20 h-20 shrink-0 rounded-xl bg-[#f1f5f9] dark:bg-[#1a2333]/80 p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.productName} 
                  className="w-full h-full object-contain filter drop-shadow-sm" 
                />
              </div>

              {/* Details & Price */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-bold text-white text-sm truncate">
                  {item.productName}
                </h3>
                <p className="text-xs text-slate-400">
                  {item.variantLabel}
                </p>
                <p className="font-extrabold text-white text-sm pt-1">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Actions Right: Trash & Quantity Counter */}
              <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Counter [-] 1 [+] */}
                <div className="flex items-center gap-2 bg-[#070b14] px-2 py-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ─── Screen 04 Right Column: Ringkasan Belanja (Span 5 cols) ─── */}
        <div className="lg:col-span-5">
          <div className="bg-[#0b1220] rounded-2xl border border-slate-800/90 p-6 space-y-5 shadow-xl">
            <h2 className="text-base font-extrabold text-white">
              Ringkasan Belanja
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-extrabold text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-cyan-400">
                <span>Voucher</span>
                <span className="font-extrabold">- {formatRupiah(voucherDiscount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ongkir</span>
                <span className="font-extrabold text-white">{formatRupiah(shippingFee)}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-base text-white">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Voucher Box (Screen 04) */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Voucher</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  className="flex-1 h-10 px-3 rounded-xl bg-white text-slate-900 text-xs font-bold font-mono outline-none"
                  placeholder="DISKON50K"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="px-5 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Pakai
                </button>
              </div>
              {appliedVoucher && (
                <p className="text-xs font-semibold text-emerald-400">
                  Anda hemat {formatRupiah(appliedVoucher.discount)}
                </p>
              )}
            </div>

            {/* CTA Button: Lanjut ke Checkout -> */}
            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
