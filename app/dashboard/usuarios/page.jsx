"use client";
import { useEffect, useState } from "react";
import { UserForm } from "@/components/forms/UserForm";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar usuarios
  const fetchUsuarios = async () => {
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    if (data.success) setUsuarios(data.data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id_usuario) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const res = await fetch("/api/usuarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario }),
    });
    const data = await res.json();
    toast[data.success ? "success" : "error"](data.message || data.error);
    fetchUsuarios();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Usuarios</h1>
          <p className="text-gray-500">Gestión de cuentas del sistema</p>
        </div>
        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-left">Teléfono</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{u.nombre} {u.apellido}</td>
                <td className="py-2 px-4">{u.correo}</td>
                <td className="py-2 px-4">{u.telefono}</td>
                <td className="py-2 px-4">{u.rol}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.estado === "activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.estado}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => {
                      setSelected(u);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mx-1"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id_usuario)}
                    className="text-red-600 hover:text-red-800 mx-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario modal */}
      {showForm && (
        <UserForm
          selected={selected}
          close={() => {
            setShowForm(false);
            fetchUsuarios();
          }}
        />
      )}
    </div>
  );
}
