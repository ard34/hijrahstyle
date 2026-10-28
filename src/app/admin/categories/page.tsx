'use client';

import { useState, useEffect } from 'react';
import { Layers, Loader2, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Kategori Produk</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Daftar struktur kategori busana muslim untuk pengelompokan produk dan pencarian katalog.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200/60">
                <th className="py-3.5 px-6">Nama Kategori</th>
                <th className="py-3.5 px-6">Slug URL</th>
                <th className="py-3.5 px-6">Deskripsi</th>
                <th className="py-3.5 px-6">Jumlah Produk</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-700 mx-auto" />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    Belum ada data kategori terdaftar.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500 font-semibold">{cat.slug}</td>
                    <td className="py-4 px-6 text-slate-600">{cat.description || '-'}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      {cat._count?.products || 0} produk
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {cat.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

