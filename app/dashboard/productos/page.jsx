"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import Swal from "sweetalert2";
import ProductForm from "@/components/forms/ProductForm";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProductos = async () => {
    const res = await fetch("/api/productos");
    const data = await res.json();
    if (data.success) setProductos(data.data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id_producto) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/productos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_producto }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("Eliminado", data.message, "success");
      fetchProductos();
    } else {
      Swal.fire("Error", data.error, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Productos</h1>
          <p className="text-gray-500">Gestión de inventario</p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Precio</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Proveedor</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.id_producto} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{p.nombre}</td>
                <td className="py-2 px-4">{p.categoria}</td>
                <td className="py-2 px-4">S/ {p.precio}</td>
                <td className="py-2 px-4">{p.stock}</td>
                <td className="py-2 px-4">{p.proveedor_nombre ?? "—"}</td>

                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => {
                      setSelected(p);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mx-1"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id_producto)}
                    className="text-red-600 hover:text-red-800 mx-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          selected={selected}
          close={() => {
            setShowForm(false);
            fetchProductos();
          }}
        />
      )}
    </div>
  );
}
