"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/layout/DashboardCard";
import { Package, ShoppingCart, Truck, Users } from "lucide-react";
import SalesChart from "@/components/charts/SalesChart";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // 🔥 TRAER DATOS REALES DEL BACKEND
  // ================================
  useEffect(() => {
    async function loadData() {
      try {
        const [ventas, pedidos, clientes, productos] = await Promise.all([
          fetch("/api/ventas").then(r => r.json()),
          fetch("/api/pedidos").then(r => r.json()),
          fetch("/api/clientes").then(r => r.json()),
          fetch("/api/productos").then(r => r.json()),
        ]);

        setStats([
          {
            title: "Ventas del día",
            value: `S/ ${ventas.total ?? 0}`,
            icon: ShoppingCart,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Pedidos activos",
            value: pedidos.total ?? 0,
            icon: Truck,
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            title: "Clientes registrados",
            value: clientes.total ?? 0,
            icon: Users,
            color: "bg-green-100 text-green-600",
          },
          {
            title: "Productos en stock",
            value: productos.total ?? 0,
            icon: Package,
            color: "bg-purple-100 text-purple-600",
          },
        ]);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  if (!stats || loading) {
    return <p>Cargando dashboard…</p>;
  }

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Panel General</h1>
        <p className="text-gray-500 mt-1">
          Bienvenido al sistema ERP de Distribuidora Harry Gas.
        </p>
      </div>

      {/* 🔥 Tarjetas métricas (LAS MISMAS QUE TENÍAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <DashboardCard key={index} {...item} />
        ))}
      </div>

      {/* 🔥 Gráfica real */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen de Ventas Semanal
        </h2>

        <SalesChart />
      </div>
    </section>
  );
}
