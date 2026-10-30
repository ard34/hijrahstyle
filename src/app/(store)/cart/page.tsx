'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
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
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
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
        setItems(data.items || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
      }
    } catch {}
  };

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        addToast('Item dihapus dari keranjang', 'info');
      }
    } catch {}
  };

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'DISKON50K') {
      setAppliedVoucher({ code: 'DISKON50K', discount: 50000 });
      addToast('Voucher DISKON50K berhasil diterapkan!', 'success');
    } else {
      addToast('Kode voucher tidak valid', 'error');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = items.length > 0 ? 25000 : 0;
  const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
  const grandTotal = Math.max(0, subtotal - voucherDiscount + shippingFee);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-[#0e172a] animate-pulse rounded-2xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[calc(100vh-140px)]">
      
      {/* Page Title (Screen 04) */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {totalItems > 0 ? `${totalItems} produk dalam keranjang` : 'Keranjang belanja Anda'}
          </p>
        </div>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Lanjut Belanja
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-[#0e172a] rounded-3xl border border-slate-800 shadow-xl max-w-lg mx-auto my-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-lg sm:text-xl font-bold text-white">Keranjang Anda Kosong</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Yuk, mulai pilih produk favorit Anda di katalog Toko Sample BBN!
            </p>
          </div>
          <div className="pt-2">
            <Link 
              href="/products" 
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Lihat Katalog Produk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List (Screen 04) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#0e172a] rounded-2xl border border-slate-800 p-4 sm:p-5 flex gap-4 shadow-md items-center">
                <Link href={`/products`} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-[#070b14] flex items-center justify-center border border-slate-800 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products`} className="font-bold text-white hover:text-blue-400 text-sm line-clamp-1 transition-colors">
                    {item.productName}
                  </Link>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{item.variantLabel}</p>
                  <p className="font-black text-blue-400 text-sm mt-1.5">
                    {formatRupiah(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-700 bg-[#070b14] flex items-center justify-center hover:border-blue-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.stock || 99, item.quantity + 1))}
                        className="w-7 h-7 rounded-lg border border-slate-700 bg-[#070b14] flex items-center justify-center hover:border-blue-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Ringkasan Belanja (Screen 04) */}
          <div className="lg:col-span-1">
            <div className="bg-[#0e172a] rounded-3xl border border-slate-800 p-6 sticky top-28 space-y-4 shadow-xl">
              <h3 className="font-extrabold text-white text-base pb-3 border-b border-slate-800">
                Ringkasan Belanja
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Voucher ({appliedVoucher.code})</span>
                    <span className="font-bold">- {formatRupiah(appliedVoucher.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Ongkir</span>
                  <span className="font-bold text-white">{formatRupiah(shippingFee)}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Total</span>
                  <span className="font-black text-lg text-blue-400">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Voucher Input (Screen 04) */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <label className="text-[11px] font-bold text-slate-300 block">Voucher</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Kode Voucher..."
                    className="flex-1 h-9 px-3 rounded-xl bg-[#070b14] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 uppercase font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Pakai
                  </button>
                </div>
                {appliedVoucher && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    ✓ Voucher {appliedVoucher.code} berhasil digunakan! Hemat {formatRupiah(appliedVoucher.discount)}
                  </div>
                )}
              </div>

              <Link 
                href="/checkout" 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

