"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export function ClienteForm({ selected, close }) {
  const [form, setForm] = useState({
    id_cliente: selected?.id_cliente || "",
    nombre: selected?.nombre || "",
    dni_ruc: selected?.dni_ruc || "",
    direccion: selected?.direccion || "",
    telefono: selected?.telefono || "",
    correo: selected?.correo || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre) {
      Swal.fire("Error", "El nombre es obligatorio", "error");
      return;
    }

    const method = selected ? "PUT" : "POST";

    const res = await fetch("/api/clientes", {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          {selected ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Nombre completo *"
            className="w-full border p-2 rounded"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            type="text"
            placeholder="DNI o RUC"
            className="w-full border p-2 rounded"
            value={form.dni_ruc}
            onChange={(e) => setForm({ ...form, dni_ruc: e.target.value })}
          />

          <input
            type="text"
            placeholder="Teléfono"
            className="w-full border p-2 rounded"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />

          <input
            type="email"
            placeholder="Correo"
            className="w-full border p-2 rounded"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
          />

          <input
            type="text"
            placeholder="Dirección"
            className="w-full border p-2 rounded"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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
