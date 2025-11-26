import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ===================================
// GET — Listar ventas
// ===================================
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT v.*,
        c.nombre AS cliente_nombre,
        u.nombre AS usuario_nombre,
        r.nombre AS repartidor_nombre
      FROM ventas v
      LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
      LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
      LEFT JOIN usuarios r ON r.id_usuario = v.id_repartidor
      ORDER BY v.id_venta DESC
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ===================================
// POST — Crear venta
// ===================================
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      id_cliente,
      id_usuario,
      id_repartidor,
      metodo_pago,
      detalle,
      direccion_entrega,
      lat,
      lng,
    } = body;

    if (!detalle || detalle.length === 0) {
      return NextResponse.json({ success: false, error: "El detalle está vacío." });
    }

    // Calcular totales
    const total = detalle.reduce((acc, item) =>
      acc + item.cantidad * item.precio_unitario, 0);

    const subtotal = (total / 1.18).toFixed(2);
    const igv = (total - subtotal).toFixed(2);

    // Insertar venta
    const [result] = await db.query(`
      INSERT INTO ventas
      (id_cliente, id_usuario, id_repartidor, fecha, subtotal, igv, total,
       metodo_pago, estado, caja_usuario, direccion_entrega, lat, lng)
      VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 'pagado', ?, ?, ?, ?)
    `, [
      id_cliente, id_usuario, id_repartidor,
      subtotal, igv, total,
      metodo_pago, id_usuario,
      direccion_entrega, lat, lng
    ]);

    const id_venta = result.insertId;

    // Insertar detalle y descontar stock
    for (const item of detalle) {
      const subtotal_item = item.cantidad * item.precio_unitario;

      await db.query(`
        INSERT INTO detalle_venta
        (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `, [
        id_venta, item.id_producto, item.cantidad,
        item.precio_unitario, subtotal_item
      ]);

      await db.query(`
        UPDATE productos SET stock = stock - ? WHERE id_producto = ?
      `, [item.cantidad, item.id_producto]);
    }

    return NextResponse.json({
      success: true,
      message: "Venta registrada correctamente",
      id_venta
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
