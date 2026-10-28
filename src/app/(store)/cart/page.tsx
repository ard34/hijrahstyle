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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-200/60 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 min-h-[calc(100vh-140px)]">
      
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {totalItems > 0 ? `${totalItems} item dalam keranjang Anda` : 'Keranjang belanja Anda'}
          </p>
        </div>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#522880] hover:text-[#421D6B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Lanjut Belanja
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto my-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F2EDFA] text-[#522880] flex items-center justify-center font-bold shadow-2xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Keranjang Anda Kosong</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Yuk, mulai pilih busana muslim favorit Anda di katalog HijrahStyle!
            </p>
          </div>
          <div className="pt-2">
            <Link 
              href="/products" 
              className="btn-primary !bg-[#522880] hover:!bg-[#421D6B] !text-white !h-11 !px-8 !text-xs !font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span>Lihat Katalog Produk</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex gap-4 shadow-xs items-center">
                <Link href={`/products/${item.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 overflow-hidden">
                  <span className="text-3xl">👗</span>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="font-bold text-slate-900 hover:text-purple-700 text-sm line-clamp-1">
                    {item.productName}
                  </Link>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{item.variantLabel}</p>
                  <p className="font-extrabold text-purple-700 text-sm mt-1.5">
                    {formatRupiah(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-300 bg-white flex items-center justify-center hover:border-purple-600 text-slate-700 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="w-7 h-7 rounded-lg border border-slate-300 bg-white flex items-center justify-center hover:border-purple-600 text-slate-700 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sticky top-28 space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                Ringkasan Belanja
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="font-bold text-slate-900">{formatRupiah(subtotal)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Total Harga</span>
                  <span className="font-extrabold text-base text-purple-700">{formatRupiah(subtotal)}</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Lanjut Ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

