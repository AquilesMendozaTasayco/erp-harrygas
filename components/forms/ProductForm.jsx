"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ProductForm({ selected, close }) {
  const [form, setForm] = useState({
    id_producto: null,
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    id_proveedor: "",
    estado: "activo",
  });

  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const loadProveedores = async () => {
      const res = await fetch("/api/proveedores");
      const data = await res.json();
      if (data.success) setProveedores(data.data);
    };

    loadProveedores();

    if (selected) {
      setForm(selected);
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = selected ? "PUT" : "POST";

    const res = await fetch("/api/productos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("Éxito", data.message, "success");
      close();
    } else {
      Swal.fire("Error", data.error, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-lg rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          {selected ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              className="w-full border px-3 py-2 rounded mt-1"
              rows="3"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Categoría</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Proveedor</label>
            <select
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.id_proveedor}
              onChange={(e) =>
                setForm({ ...form, id_proveedor: e.target.value })
              }
            >
              <option value="">Seleccione proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id_proveedor} value={p.id_proveedor}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Estado</label>
            <select
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200"
              onClick={close}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
