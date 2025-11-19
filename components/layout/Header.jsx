"use client";
import { Menu, LogOut } from "lucide-react";

export function Header({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-lg text-gray-800">ERP - Distribuidora Harry Gas</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition">Ayuda</button>
          <button className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100">
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
