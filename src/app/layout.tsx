import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DChezeeCake - Pembukuan Toko",
  description: "Aplikasi pembukuan toko profesional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen bg-gray-50`}>
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r flex flex-col fixed h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-blue-600 tracking-tight">DChezeeCake</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
              <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/inventory" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
              <Package size={20} /> <span className="font-medium">Inventaris</span>
            </Link>
            <Link href="/sales" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
              <ShoppingCart size={20} /> <span className="font-medium">Kasir</span>
            </Link>
          </nav>

          <div className="p-4 border-t space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
              <LogOut size={20} /> <span className="font-medium">Keluar</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-64">
          {children}
        </main>
      </body>
    </html>
  );
}