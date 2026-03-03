"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Pastikan path sesuai struktur folder kamu
import { ShoppingCart, Trash2, CheckCircle } from "lucide-react";

export default function SalesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').gt('stock', 0); // Hanya ambil yang ada stok
    if (data) setProducts(data);
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const handleTransaction = async () => {
    setIsProcessing(true);
    
    try {
      for (const item of cart) {
        // 1. Kurangi stok di tabel products
        const newStock = item.stock - item.qty;
        await supabase.from('products').update({ stock: newStock }).eq('id', item.id);

        // 2. Simpan record penjualan ke tabel sales (Opsional, jika tabel sudah ada)
        await supabase.from('sales').insert([{ 
          product_id: item.id, 
          quantity: item.qty, 
          total_price: item.price * item.qty 
        }]);
      }

      alert("Transaksi Berhasil!");
      setCart([]);
      fetchProducts(); // Refresh stok di layar
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.selling_price * item.qty), 0);

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* Daftar Produk Berdasarkan Database */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Pilih Menu DChezeeCake</h1>
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-500 transition text-left group"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">{p.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-blue-600 font-bold">Rp {p.selling_price?.toLocaleString()}</p>
                  <span className="text-xs text-gray-400">Stok: {p.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Keranjang Belanja Dinamis */}
        <div className="w-96 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8 border">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <ShoppingCart className="text-blue-600" />
            <h2 className="text-xl font-bold">Checkout</h2>
          </div>

          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">{item.qty}x @ Rp {item.selling_price?.toLocaleString()}</p>
                </div>
                <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total Bayar</span>
              <span className="text-blue-600">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleTransaction}
              disabled={cart.length === 0 || isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-300 flex justify-center items-center gap-2"
            >
              {isProcessing ? "Memproses..." : <><CheckCircle size={20} /> Selesaikan Pesanan</>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}