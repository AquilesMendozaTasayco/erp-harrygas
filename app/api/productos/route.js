import { NextResponse } from "next/server";
import { db } from "@/lib/db";


// =======================
// GET — lista de productos
// =======================
export async function GET() {
  try {
    const [productos] = await db.query(`
      SELECT p.*, pr.nombre AS proveedor_nombre
      FROM productos p
      LEFT JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
      ORDER BY p.id_producto DESC
    `);

    return NextResponse.json({ success: true, data: productos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// =======================
// POST — crear producto
// =======================
export async function POST(req) {
  try {
    const body = await req.json();

    await db.query(
      `
      INSERT INTO productos (nombre, descripcion, categoria, precio, stock, id_proveedor, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        body.nombre,
        body.descripcion,
        body.categoria,
        body.precio,
        body.stock,
        body.id_proveedor || null,
        body.estado,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Producto creado correctamente",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// =======================
// PUT — actualizar producto
// =======================
export async function PUT(req) {
  try {
    const body = await req.json();

    await db.query(
      `
      UPDATE productos
      SET nombre=?, descripcion=?, categoria=?, precio=?, stock=?, id_proveedor=?, estado=?
      WHERE id_producto=?
    `,
      [
        body.nombre,
        body.descripcion,
        body.categoria,
        body.precio,
        body.stock,
        body.id_proveedor || null,
        body.estado,
        body.id_producto,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Producto actualizado",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// =======================
// DELETE — borrar producto
// =======================
export async function DELETE(req) {
  try {
    const { id_producto } = await req.json();

    await db.query(`DELETE FROM productos WHERE id_producto=?`, [
      id_producto,
    ]);

    return NextResponse.json({
      success: true,
      message: "Producto eliminado",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
