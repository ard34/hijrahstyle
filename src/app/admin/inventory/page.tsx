'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Search, Loader2 } from 'lucide-react';

interface Variant {
  id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  product: { name: string };
}

export default function AdminInventoryPage() {
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        const allVariants: Variant[] = [];
        (data.products || []).forEach((p: any) => {
          (p.variants || []).forEach((v: any) => {
            allVariants.push({
              ...v,
              product: { name: p.name },
            });
          });
        });
        setVariants(allVariants);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Manajemen Inventaris & Stok</h1>
        <p className="text-sm text-slate-500">Monitor stok per varian warna dan ukuran</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-100">
              <th className="py-3 px-6">SKU Varian</th>
              <th className="py-3 px-6">Nama Produk</th>
              <th className="py-3 px-6">Warna</th>
              <th className="py-3 px-6">Ukuran</th>
              <th className="py-3 px-6">Stok Tersedia</th>
              <th className="py-3 px-6">Status Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                </td>
              </tr>
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada varian produk</td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-6 font-mono text-slate-600">{v.sku}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{v.product.name}</td>
                  <td className="py-3.5 px-6 text-slate-700">{v.color}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{v.size}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{v.stock} unit</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      v.stock > 10 ? 'bg-emerald-100 text-emerald-800' :
                      v.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {v.stock > 10 ? 'Aman' : v.stock > 0 ? 'Hampir Habis' : 'Habis'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
