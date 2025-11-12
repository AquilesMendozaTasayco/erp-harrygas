"use client";
import { DashboardCard } from "@/components/layout/DashboardCard";
import { Package, ShoppingCart, Truck, Users } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Ventas del día",
      value: "S/ 2,450",
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pedidos activos",
      value: "12",
      icon: Truck,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Clientes registrados",
      value: "480",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Productos en stock",
      value: "1,120",
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Panel General</h1>
        <p className="text-gray-500 mt-1">
          Bienvenido al sistema ERP de Distribuidora Harry Gas.
        </p>
      </div>

      {/* Tarjetas métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <DashboardCard key={index} {...item} />
        ))}
      </div>

      {/* Gráfico o resumen adicional (placeholder) */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Resumen de Ventas Semanal
        </h2>
        <p className="text-gray-500 text-sm">
          Aquí podrás visualizar las estadísticas generales de ventas y pedidos.
        </p>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          (Gráfico próximamente)
        </div>
      </div>
    </section>
  );
}
