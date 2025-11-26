"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SaleForm({ close }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    id_cliente: "",
    id_repartidor: "",
    metodo_pago: "efectivo",
    direccion_entrega: "",
    lat: null,
    lng: null,
  });

  const cargar = async () => {
    const resC = await fetch("/api/clientes");
    const resP = await fetch("/api/productos");
    const resR = await fetch("/api/usuarios?rol=repartidor");

    setClientes((await resC.json()).data);
    setProductos((await resP.json()).data);
    setRepartidores((await resR.json()).data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const agregarItem = (prod) => {
    const existe = items.find((i) => i.id_producto === prod.id_producto);
    if (existe) return;

    setItems([
      ...items,
      {
        id_producto: prod.id_producto,
        nombre: prod.nombre,
        cantidad: 1,
        precio_unitario: prod.precio,
      },
    ]);
  };

  const cambiarCantidad = (id_producto, valor) => {
    setItems(
      items.map((i) =>
        i.id_producto === id_producto
          ? { ...i, cantidad: valor }
          : i
      )
    );
  };

  const total = items.reduce(
    (acc, i) => acc + i.cantidad * i.precio_unitario,
    0
  );
  const subtotal = (total / 1.18).toFixed(2);
  const igv = (total - subtotal).toFixed(2);

  const guardar = async () => {
    if (items.length === 0)
      return Swal.fire("Error", "Agregue productos.", "error");

    const res = await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id_usuario: 1, // TEMPORAL
        detalle: items,
      }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("Ok", "Venta registrada", "success");
      close();
    } else {
      Swal.fire("Error", data.error, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-xl max-w-3xl w-full space-y-6">

        {/* CABECERA */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Nueva Venta</h2>
          <button onClick={close}>❌</button>
        </div>

        {/* CLIENTE */}
        <div>
          <label>Cliente</label>
          <select
            className="w-full border p-2 rounded"
            value={form.id_cliente}
            onChange={(e) => setForm({ ...form, id_cliente: e.target.value })}
          >
            <option value="">Seleccione…</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* PRODUCTOS */}
        <div>
          <label>Agregar Productos</label>
          <div className="grid grid-cols-2 gap-2">
            {productos.map((p) => (
              <button
                key={p.id_producto}
                className="border p-2 rounded hover:bg-gray-100"
                onClick={() => agregarItem(p)}
              >
                {p.nombre} - S/ {p.precio}
              </button>
            ))}
          </div>

          {/* LISTA DE ITEMS */}
          <table className="w-full text-sm mt-4">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subt.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id_producto}>
                  <td>{i.nombre}</td>
                  <td>
                    <input
                      type="number"
                      className="border w-16 p-1"
                      value={i.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(i.id_producto, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>S/ {i.precio_unitario}</td>
                  <td>S/ {(i.cantidad * i.precio_unitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REPATIDOR */}
        <div>
          <label>Repartidor</label>
          <select
            className="w-full border p-2 rounded"
            value={form.id_repartidor}
            onChange={(e) =>
              setForm({ ...form, id_repartidor: e.target.value })
            }
          >
            <option value="">Seleccione…</option>
            {repartidores.map((r) => (
              <option key={r.id_usuario} value={r.id_usuario}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* MÉTODO DE PAGO */}
        <div>
          <label>Método de pago</label>
          <select
            className="w-full border p-2 rounded"
            value={form.metodo_pago}
            onChange={(e) =>
              setForm({ ...form, metodo_pago: e.target.value })
            }
          >
            <option value="efectivo">Efectivo</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        {/* TOTALES */}
        <div className="text-right space-y-1">
          <p>Subtotal: S/ {subtotal}</p>
          <p>IGV (18%): S/ {igv}</p>
          <p className="text-xl font-bold">Total: S/ {total.toFixed(2)}</p>
        </div>

        <button
          onClick={guardar}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Guardar Venta
        </button>
      </div>
    </div>
  );
}
