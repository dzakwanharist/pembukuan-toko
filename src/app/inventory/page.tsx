"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Search, X } from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk form input
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost_price: 0,
    selling_price: 0,
    stock: 0
  });

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null); // Menyimpan ID yang akan dihapus

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([formData]);
    
    if (!error) {
      setIsModalOpen(false); // Tutup modal
      setFormData({ name: "", category: "", cost_price: 0, selling_price: 0, stock: 0 }); // Reset form
      fetchProducts(); // Refresh data
    } else {
      alert("Gagal menambah barang: " + error.message);
    }
  };
  // Fungsi Update
const handleUpdateProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  const { error } = await supabase
    .from('products')
    .update({
      name: editingProduct.name,
      category: editingProduct.category,
      stock: editingProduct.stock,
      cost_price: editingProduct.cost_price,
      selling_price: editingProduct.selling_price
    })
    .eq('id', editingProduct.id);

  if (!error) {
    setEditingProduct(null);
    fetchProducts();
  } else {
    alert("Gagal update: " + error.message);
  }
};

// Fungsi Delete
const handleDeleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (!error) {
    setIsDeleteModalOpen(null);
    fetchProducts();
  } else {
    alert("Gagal menghapus: " + error.message);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventaris Toko</h1>
            <p className="text-gray-500 text-sm">Kelola stok barang DChezeeCake kamu di sini.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Tambah Barang
          </button>
        </div>
        

        {/* Modal Form Tambah Barang */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-6">Tambah Barang Baru</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                  <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      onChange={(e) => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                    <input required type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Modal</label>
                    <input required type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      onChange={(e) => setFormData({...formData, cost_price: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
                    <input required type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      onChange={(e) => setFormData({...formData, selling_price: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-blue-700 transition">
                  Simpan Barang
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDIT */}
{editingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
      <h2 className="text-xl font-bold mb-6">Edit Barang</h2>
      <form onSubmit={handleUpdateProduct} className="space-y-4">
        <input 
          className="w-full p-2 border rounded-lg" 
          value={editingProduct.name} 
          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} 
          placeholder="Nama Barang"
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" 
            className="p-2 border rounded-lg" 
            value={editingProduct.stock} 
            onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} 
            placeholder="Stok"
          />
          <input 
            className="p-2 border rounded-lg" 
            value={editingProduct.category} 
            onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} 
            placeholder="Kategori"
          />
        </div>
        <input 
          type="number" 
          className="w-full p-2 border rounded-lg" 
          value={editingProduct.selling_price} 
          onChange={(e) => setEditingProduct({...editingProduct, selling_price: parseInt(e.target.value)})} 
          placeholder="Harga Jual"
        />
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-2 border rounded-xl">Batal</button>
          <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
)}

{/* MODAL KONFIRMASI DELETE (UX Practice: Mencegah kesalahan user) */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <X size={32} />
      </div>
      <h2 className="text-lg font-bold">Hapus Barang?</h2>
      <p className="text-gray-500 text-sm mt-2">Data yang dihapus tidak dapat dikembalikan.</p>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setIsDeleteModalOpen(null)} className="flex-1 py-2 bg-gray-100 rounded-xl font-medium">Batal</button>
        <button onClick={() => handleDeleteProduct(isDeleteModalOpen)} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold">Ya, Hapus</button>
      </div>
    </div>
  </div>
)}

        {/* Tabel Data (Gunakan UI yang sebelumnya sudah kita buat) */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
           {/* ... bagian <table> sama seperti sebelumnya, pastikan map dari variable 'products' ... */}
           <table className="w-full text-left border-collapse">
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-6 py-4">Nama Barang</th>
        <th className="px-6 py-4">Kategori</th>
        <th className="px-6 py-4">stok</th>
        <th className="px-6 py-4">Harga</th>
        <th className="px-6 py-4">Aksi</th>
        {/* ... th lainnya ... */}
      </tr>
    </thead>
           <tbody className="divide-y">
  {products.length > 0 ? (
    products.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
        <td className="px-6 py-4 text-gray-600">{item.category}</td>
        <td className="px-6 py-4 text-center">
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
            {item.stock} unit
          </span>
        </td>
        <td className="px-6 py-4">Rp {item.selling_price?.toLocaleString()}</td>
        <td className="px-6 py-4 text-right flex justify-end gap-3">
  <button 
    onClick={() => setEditingProduct(item)} 
    className="text-blue-600 hover:text-blue-800 font-medium"
  >
    Edit
  </button>
  <button 
    onClick={() => setIsDeleteModalOpen(item.id)} 
    className="text-red-500 hover:text-red-700 font-medium"
  >
    Hapus
  </button>
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="text-center py-10 text-gray-400">
        Data sedang dimuat atau kosong...
      </td>
    </tr>
  )}
</tbody>
</table>
        </div>
        
      </div>
      
    </main>
    
  );
}