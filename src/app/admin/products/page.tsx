'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2, RefreshCw, Search, ExternalLink } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToastStore();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products) {
          const mapped: AdminProduct[] = data.products.map((p: any) => {
            const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
            const imageUrl = p.images?.[0]?.imageUrl || '/products/kaos-forge.jpg';

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              sku: p.sku,
              category: p.category?.name || 'Busana Muslimah',
              price: p.price,
              stock: totalStock,
              imageUrl,
              status: p.status,
            };
          });
          setProducts(mapped);
        }
      }
    } catch (err) {
      console.error('Fetch admin products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string, name: string) => {
    setProducts(products.filter(p => p.id !== id));
    addToast(`Produk "${name}" dinonaktifkan`, 'info');
  };

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      
      {/* ─── Screen 15 Top Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Koleksi Produk Butik</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola katalog busana muslimah, stok varian, dan harga jual.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-[#0b1220] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => addToast('Fitur penambahan produk baru aktif', 'info')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/35 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Cari nama busana, SKU, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '40px' }}
          className="w-full h-11 rounded-xl bg-[#0b1220] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* ─── Screen 15 Table ─── */}
      <div className="bg-[#0b1220] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Memuat katalog produk database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Tidak ada produk yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 bg-[#070b14]/50">
                  <th className="py-4 px-6">Produk Butik</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Harga Jual</th>
                  <th className="py-4 px-6">Total Stok</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#0e172a] transition-colors">
                    {/* Produk: Thumbnail + Title */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#10192e] p-1 border border-slate-800 shrink-0 flex items-center justify-center">
                        <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-semibold">● Aktif di Butik</span>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-4 px-6 text-slate-300 font-medium">
                      {p.category}
                    </td>

                    {/* SKU */}
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {p.sku}
                    </td>

                    {/* Harga */}
                    <td className="py-4 px-6 font-black text-blue-400">
                      {formatRupiah(p.price)}
                    </td>

                    {/* Stok */}
                    <td className="py-4 px-6 font-semibold">
                      <span className={p.stock < 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {p.stock} pcs
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors inline-flex items-center"
                          title="Lihat di Toko"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => addToast(`Edit produk ${p.name}`, 'info')}
                          className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
