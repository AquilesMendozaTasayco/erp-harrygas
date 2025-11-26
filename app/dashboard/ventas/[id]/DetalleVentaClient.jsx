"use client";

import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

// Cargar librerías solo en cliente
let html2canvas = null;
let jsPDF = null;

if (typeof window !== "undefined") {
  html2canvas = require("html2canvas");
  jsPDF = require("jspdf");
}

export default function DetalleVentaClient({ id }) {
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef();

  // ============================
  // CARGAR VENTA
  // ============================
  useEffect(() => {
    if (!id) return;

    const fetchVenta = async () => {
      try {
        const res = await fetch(`/api/ventas/${id}`);
        const data = await res.json();

        if (data.success) setVenta(data.data);
      } catch (err) {
        console.log("ERROR FETCH:", err);
      }

      setLoading(false);
    };

    fetchVenta();
  }, [id]);

  // ============================
  // IMPRIMIR SOLO EL TICKET
  // ============================
  const imprimir = () => {
    window.print();
  };

  // ============================
  // PDF SOLO DEL TICKET
  // ============================
const descargarPDF = async () => {
  try {
    const element = ticketRef.current;

    if (!element) {
      Swal.fire("Error", "No se encontró el ticket", "error");
      return;
    }

    // Asegurar fondo blanco y eliminar sombras
    element.style.background = "#FFFFFF";
    element.style.boxShadow = "none";

    // Esperar un frame para que se apliquen estilos
    await new Promise((r) => setTimeout(r, 50));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = canvas.height / canvas.width;
    const pdfHeight = pageWidth * ratio;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    pdf.save(`venta-${id}.pdf`);
  } catch (error) {
    console.error("ERROR PDF:", error);
    Swal.fire("Error", "No se pudo generar el PDF", "error");
  }
};


  // ============================
  // ANULAR VENTA
  // ============================
  const anularVenta = async () => {
    const confirm = await Swal.fire({
      title: "¿Anular venta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/ventas/${id}`, { method: "PUT" });
    const data = await res.json();

    if (data.success) {
      Swal.fire("Anulada", "La venta fue anulada.", "success");
      setVenta((prev) => ({ ...prev, estado: "anulado", anulado: 1 }));
    }
  };

  if (!id) return <p>ID no recibido.</p>;
  if (loading) return <p>Cargando venta...</p>;
  if (!venta) return <p>No se encontró la venta.</p>;

  return (
    <div className="space-y-6">

      {/* CSS que oculta todo excepto el ticket al imprimir */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #ticketVenta, #ticketVenta * {
            visibility: visible !important;
          }
          #ticketVenta {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <h1 className="text-2xl font-bold">Detalle de Venta #{id}</h1>

      <div className="flex gap-4">
        <button
          onClick={imprimir}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Imprimir Ticket
        </button>

        <button
          onClick={descargarPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Descargar PDF
        </button>

        {venta.estado !== "anulado" && (
          <button
            onClick={anularVenta}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Anular Venta
          </button>
        )}
      </div>

      {/* TICKET SOLO */}
      <div
        id="ticketVenta"
        ref={ticketRef}
        className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto space-y-4"
        style={{ pageBreakInside: "avoid" }}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">HARRY GAS</h2>
          <p className="text-gray-500">Comprobante de Venta</p>
        </div>

        <div>
          <p><strong>Cliente:</strong> {venta.cliente_nombre}</p>
          <p><strong>Vendedor:</strong> {venta.usuario_nombre}</p>
          <p><strong>Método de Pago:</strong> {venta.metodo_pago}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}</p>

          {venta.anulado === 1 && (
            <p className="text-red-600 font-bold mt-2">VENTA ANULADA</p>
          )}
        </div>

        <div>
          <p><strong>Dirección:</strong> {venta.direccion || "—"}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Productos</h3>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th align="left">Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subt.</th>
              </tr>
            </thead>

            <tbody>
              {venta.detalle.map((d) => (
                <tr key={d.id_detalle}>
                  <td>{d.producto_nombre}</td>
                  <td align="center">{d.cantidad}</td>
                  <td>S/ {d.precio_unitario}</td>
                  <td>S/ {d.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t pt-2 text-sm">
          <p><strong>Subtotal:</strong> S/ {venta.subtotal}</p>
          <p><strong>IGV (18%):</strong> S/ {venta.igv}</p>
          <p className="text-lg font-bold">
            <strong>Total:</strong> S/ {venta.total}
          </p>
        </div>
      </div>
    </div>
  );
}
