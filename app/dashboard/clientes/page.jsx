"use client";

import { useEffect, useState } from "react";
import { ClienteForm } from "@/components/forms/ClientForm";
import { Plus, Trash2, Edit } from "lucide-react";
import Swal from "sweetalert2";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchClientes = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    if (data.success) setClientes(data.data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id_cliente) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/clientes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("Eliminado", data.message, "success");
      fetchClientes();
    } else {
      Swal.fire("Error", data.error, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Clientes</h1>
          <p className="text-gray-500">Gestión de clientes</p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">DNI/RUC</th>
              <th className="py-3 px-4 text-left">Teléfono</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-left">Dirección</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{c.nombre}</td>
                <td className="py-2 px-4">{c.dni_ruc}</td>
                <td className="py-2 px-4">{c.telefono}</td>
                <td className="py-2 px-4">{c.correo}</td>
                <td className="py-2 px-4">{c.direccion}</td>

                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => {
                      setSelected(c);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mx-1"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(c.id_cliente)}
                    className="text-red-600 hover:text-red-800 mx-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Si no hay clientes */}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <ClienteForm
          selected={selected}
          close={() => {
            setShowForm(false);
            fetchClientes();
          }}
        />
      )}
    </div>
  );
}
