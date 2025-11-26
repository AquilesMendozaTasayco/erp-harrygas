"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import SaleForm from "@/components/forms/SaleForm";

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/ventas");
    const data = await res.json();
    if (data.success) setVentas(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ventas</h1>

        <button
          onClick={() => setShow(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Nueva Venta
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-xl text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">Cliente</th>
            <th>Usuario</th>
            <th>Repartidor</th>
            <th>Método</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta} className="border-t">
              <td className="p-3">{v.cliente_nombre}</td>
              <td>{v.usuario_nombre}</td>
              <td>{v.repartidor_nombre || "—"}</td>
              <td>{v.metodo_pago}</td>
              <td>S/ {v.total}</td>
              <td>{v.estado}</td>
              <td>
                <Link
                  href={`/dashboard/ventas/${v.id_venta}`}
                  className="text-blue-600"
                >
                  <Eye />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <SaleForm
          close={() => {
            setShow(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
