"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ProveedorForm({ selected, close }) {
  const [form, setForm] = useState({
    id_proveedor: null,
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = selected ? "PUT" : "POST";

    const res = await fetch("/api/proveedores", {
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
      <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {selected ? "Editar Proveedor" : "Nuevo Proveedor"}
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
            <label className="text-sm font-medium">RUC</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.ruc}
              onChange={(e) => setForm({ ...form, ruc: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Correo</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Dirección</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
