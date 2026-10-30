'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, 
  CheckCircle2, XCircle, Eye, Loader2, X
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  status: string;
  category: { name: string };
  images: { imageUrl?: string; url?: string }[];
  variants: ProductVariant[];
}

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    description: '',
    material: '',
    variants: [
      { color: 'Hitam', size: 'M', stock: 20 },
      { color: 'Hitam', size: 'L', stock: 20 },
    ],
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/categories')
      ]);

      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData.products || []);
      }
      if (catRes.ok) {
        const cData = await catRes.json();
        setCategories(cData.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat produk');

      setShowAddModal(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Screen 15 Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e172a] p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Manajemen Produk</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Kelola semua produk di toko Anda.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#0e172a] p-4 rounded-2xl border border-slate-800/80 shadow-md flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Cari nama produk atau kode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
            className="w-full text-xs h-10 pr-4 bg-[#070b14] border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-white placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Screen 15 Table */}
      <div className="bg-[#0e172a] rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1120] text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800/80">
                <th className="py-4 px-6">Produk</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Harga</th>
                <th className="py-4 px-6">Stok</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-normal text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 25;
                  const firstImg = product.images?.[0]?.imageUrl || product.images?.[0]?.url;
                  return (
                    <tr key={product.id} className="hover:bg-[#131f37] transition-colors">
                      <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#070b14] text-slate-400 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-800 overflow-hidden">
                          {firstImg ? (
                            <img src={firstImg} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <span className="line-clamp-1">{product.name}</span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-300">{product.category?.name || 'General'}</td>
                      <td className="py-4 px-6 font-black text-white">{formatRupiah(product.price)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                          totalStock > 10 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => alert(`Edit produk ${product.name}`)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => alert(`Hapus produk ${product.name}`)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Dark Cyber Theme) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-black text-white">Tambah Produk Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Nama Produk</label>
                <input
                  type="text"
                  placeholder="Contoh: Sneakers Cyber BBN"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">SKU Utama</label>
                  <input
                    type="text"
                    placeholder="BBN-SNK-01"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Harga (Rp)</label>
                  <input
                    type="number"
                    placeholder="599000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Harga Coret (Optional)</label>
                  <input
                    type="number"
                    placeholder="699000"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Bahan / Material</label>
                <input
                  type="text"
                  placeholder="Engineered Mesh + Boost Sole"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi keunggulan produk..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-3 mt-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-slate-800 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
