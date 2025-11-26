import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ===================
// GET — lista
// ===================
export async function GET() {
  try {
    const [proveedores] = await db.query(`
      SELECT * FROM proveedores ORDER BY id_proveedor DESC
    `);

    return NextResponse.json({ success: true, data: proveedores });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ===================
// POST — crear
// ===================
export async function POST(req) {
  try {
    const body = await req.json();

    await db.query(
      `
      INSERT INTO proveedores (nombre, ruc, direccion, telefono, correo)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        body.nombre,
        body.ruc || null,
        body.direccion || null,
        body.telefono || null,
        body.correo || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Proveedor creado correctamente",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ===================
// PUT — actualizar
// ===================
export async function PUT(req) {
  try {
    const body = await req.json();

    await db.query(
      `
      UPDATE proveedores
      SET nombre=?, ruc=?, direccion=?, telefono=?, correo=?
      WHERE id_proveedor=?
    `,
      [
        body.nombre,
        body.ruc,
        body.direccion,
        body.telefono,
        body.correo,
        body.id_proveedor,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Proveedor actualizado correctamente",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ===================
// DELETE — borrar
// ===================
export async function DELETE(req) {
  try {
    const { id_proveedor } = await req.json();

    await db.query(`DELETE FROM proveedores WHERE id_proveedor=?`, [
      id_proveedor,
    ]);

    return NextResponse.json({
      success: true,
      message: "Proveedor eliminado",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
