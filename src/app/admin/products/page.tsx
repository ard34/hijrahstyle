'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, 
  CheckCircle2, XCircle, Eye, Loader2
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
  images: { url: string }[];
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
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Katalog Produk</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Kelola daftar produk, varian warna/ukuran, harga, dan ketersediaan stok toko.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk atau kode SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
            className="w-full text-xs h-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-600 outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200/60">
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Harga</th>
                <th className="py-3.5 px-6">Total Stok</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    Tidak ada produk yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                  const firstImg = product.images?.[0]?.url;
                  return (
                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 overflow-hidden">
                          {firstImg ? (
                            <img src={firstImg} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <span className="line-clamp-1">{product.name}</span>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-500 font-semibold">{product.sku}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">{product.category.name}</td>
                      <td className="py-3.5 px-6 font-extrabold text-slate-900">{formatRupiah(product.price)}</td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                          totalStock > 10 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {totalStock} unit
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold font-heading text-slate-900 mb-4">Tambah Produk Baru</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Nama Produk</label>
                <input
                  type="text"
                  placeholder="Gamis Silk Premium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">SKU Utama</label>
                  <input
                    type="text"
                    placeholder="GMS-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
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
                  <label className="text-xs font-semibold text-slate-700">Harga (Rp)</label>
                  <input
                    type="number"
                    placeholder="350000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Harga Coret (Optional)</label>
                  <input
                    type="number"
                    placeholder="450000"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Bahan / Material</label>
                <input
                  type="text"
                  placeholder="Ceruty Baby Doll Premium"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi bahan dan keunggulan produk..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-xs cursor-pointer"
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
