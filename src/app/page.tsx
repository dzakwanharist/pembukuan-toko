"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Package, AlertTriangle, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalAsset: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) {
        const total = data.length;
        const low = data.filter(item => item.stock < 10).length;
        const asset = data.reduce((sum, item) => sum + (item.cost_price * item.stock), 0);
        
        setStats({ totalProducts: total, lowStock: low, totalAsset: asset });
      }
    };
    getStats();
  }, []);

  const cards = [
    { title: "Total Produk", value: stats.totalProducts, icon: <Package />, color: "bg-blue-500" },
    { title: "Stok Menipis", value: stats.lowStock, icon: <AlertTriangle />, color: "bg-red-500" },
    { title: "Total Aset Toko", value: `Rp ${stats.totalAsset.toLocaleString()}`, icon: <TrendingUp />, color: "bg-green-500" },
  ];

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-5">
              <div className={`${card.color} p-4 rounded-xl text-white`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* UX ANALYTICS PLACEHOLDER */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center py-20">
          <LayoutDashboard size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Grafik Penjualan Mendatang</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">
            Setelah kamu memiliki lebih banyak data di tabel <code className="bg-gray-100 px-1 rounded">sales</code>, kita bisa menampilkan grafik tren mingguan di sini.
          </p>
        </div>
      </div>
    </main>
  );
}