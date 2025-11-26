import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ===============================
// GET — DETALLE DE VENTA
// ===============================
export async function GET(req, context) {
  try {
    const resolved = await context.params;
    const { id } = resolved;

    // Venta
    const [[venta]] = await db.query(`
      SELECT v.*, 
        c.nombre AS cliente_nombre,
        u.nombre AS usuario_nombre,
        r.nombre AS repartidor_nombre
      FROM ventas v
      LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
      LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
      LEFT JOIN usuarios r ON r.id_usuario = v.id_repartidor
      WHERE v.id_venta = ?
    `, [id]);

    if (!venta)
      return NextResponse.json({ success: false, error: "Venta no encontrada." });

    // Detalle
    const [detalle] = await db.query(`
      SELECT d.*, p.nombre AS producto_nombre
      FROM detalle_venta d
      LEFT JOIN productos p ON p.id_producto = d.id_producto
      WHERE d.id_venta = ?
    `, [id]);

    venta.detalle = detalle;

    return NextResponse.json({ success: true, data: venta });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ===============================
// PUT — ANULAR VENTA
// ===============================
export async function PUT(req, context) {
  try {
    const resolved = await context.params;
    const { id } = resolved;

    await db.query(`
      UPDATE ventas SET estado='anulado', anulado=1 WHERE id_venta = ?
    `, [id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
