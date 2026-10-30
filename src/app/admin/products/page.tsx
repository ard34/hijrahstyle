'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToastStore } from '@/lib/store';

const initialProducts = [
  {
    id: '1',
    name: 'Sneakers Vortex',
    desc: 'Footwear series',
    category: 'Sepatu',
    price: 590000,
    stock: 25,
    imageUrl: '/products/sneakers-vortex.png',
  },
  {
    id: '2',
    name: 'Hoodie BBN',
    desc: 'Apparel series',
    category: 'Pakaian',
    price: 249000,
    stock: 40,
    imageUrl: '/products/hoodie-bbn.jpg',
  },
  {
    id: '3',
    name: 'Tas Sling BBN',
    desc: 'Bags & packs',
    category: 'Tas',
    price: 199000,
    stock: 35,
    imageUrl: '/products/tas-sling.jpg',
  },
  {
    id: '4',
    name: 'Kaos Forge',
    desc: 'Streetwear edition',
    category: 'Pakaian',
    price: 129000,
    stock: 50,
    imageUrl: '/products/kaos-forge.jpg',
  },
  {
    id: '5',
    name: 'Topi Trucker',
    desc: 'Headwear cyber',
    category: 'Aksesoris',
    price: 99000,
    stock: 60,
    imageUrl: '/products/topi-trucker.jpg',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const { addToast } = useToastStore();

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    addToast('Produk berhasil dihapus', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── Screen 15 Top Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Manajemen Produk</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola semua produk di toko Anda.</p>
        </div>

        <button
          onClick={() => addToast('Modal tambah produk aktif', 'info')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/35 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* ─── Screen 15 Table ─── */}
      <div className="bg-[#0b1220] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                <th className="py-4 px-6">Produk</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Harga</th>
                <th className="py-4 px-6">Stok</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#0e172a] transition-colors">
                  {/* Produk: Thumbnail + Title + Subtitle */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] dark:bg-[#1a2333] p-1 border border-slate-800 shrink-0 flex items-center justify-center">
                      <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">{p.desc}</p>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="py-4 px-6 text-slate-300 font-medium">
                    {p.category}
                  </td>

                  {/* Harga */}
                  <td className="py-4 px-6 font-extrabold text-white">
                    {formatRupiah(p.price)}
                  </td>

                  {/* Stok */}
                  <td className="py-4 px-6 text-slate-300 font-medium">
                    {p.stock}
                  </td>

                  {/* Aksi: Edit & Delete */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => addToast(`Edit ${p.name}`, 'info')}
                        className="p-2 rounded-lg bg-[#070b14] border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
      </div>

    </div>
  );
}
