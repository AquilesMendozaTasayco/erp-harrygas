"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export function UserForm({ selected, close }) {
  const [form, setForm] = useState(
    selected || { nombre: "", apellido: "", correo: "", contrasena: "", telefono: "" }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = selected ? "PUT" : "POST";
    const res = await fetch("/api/usuarios", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    toast[data.success ? "success" : "error"](data.message || data.error);
    if (data.success) close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4 relative"
      >
        <button
          onClick={close}
          type="button"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {selected ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2 w-full"
        />

        {!selected && (
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 w-full"
          />
        )}

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {selected ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
