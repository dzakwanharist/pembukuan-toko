"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Printer } from "lucide-react";

export default function ReportPage() {
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      // Mengambil data produk untuk laporan aset
      const { data } = await supabase.from('products').select('*');
      if (data) setReportData(data);
    };
    fetchReport();
  }, []);

  const totalAsset = reportData.reduce((sum, item) => sum + (item.cost_price * item.stock), 0);
  const totalPotentialProfit = reportData.reduce((sum, item) => sum + ((item.selling_price - item.cost_price) * item.stock), 0);

  return (
    <main className="p-10 bg-white min-h-screen text-black">
      {/* Header Laporan */}
      <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Laporan Bulanan DChezeeCake</h1>
          <p className="text-sm text-gray-600">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 print:hidden"
        >
          <Printer size={18} /> Cetak Ke PDF
        </button>
      </div>

      {/* Tabel Data */}
      <table className="w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nama Barang</th>
            <th className="border p-2">Stok</th>
            <th className="border p-2">Modal</th>
            <th className="border p-2">Total Nilai</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.stock}</td>
              <td className="border p-2">Rp {item.cost_price.toLocaleString()}</td>
              <td className="border p-2">Rp {(item.cost_price * item.stock).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ringkasan Finansial */}
      <div className="flex flex-col items-end gap-2 text-lg">
        <p>Total Nilai Aset: <strong>Rp {totalAsset.toLocaleString()}</strong></p>
        <p>Estimasi Keuntungan Bersih: <strong className="text-green-600">Rp {totalPotentialProfit.toLocaleString()}</strong></p>
      </div>
    </main>
  );
}