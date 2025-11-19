import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// =====================
// GET: Listar clientes
// =====================
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT id_cliente, nombre, dni_ruc, direccion, telefono, correo, fecha_registro
      FROM clientes
      ORDER BY id_cliente DESC
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// =====================
// POST: Crear cliente
// =====================
export async function POST(request) {
  try {
    const { nombre, dni_ruc, direccion, telefono, correo } = await request.json();

    if (!nombre) {
      return NextResponse.json({ success: false, error: "El nombre es obligatorio" }, { status: 400 });
    }

    await db.query(
      `INSERT INTO clientes (nombre, dni_ruc, direccion, telefono, correo)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, dni_ruc || null, direccion || null, telefono || null, correo || null]
    );

    return NextResponse.json({ success: true, message: "Cliente registrado correctamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// =====================
// PUT: Editar cliente
// =====================
export async function PUT(request) {
  try {
    const { id_cliente, nombre, dni_ruc, direccion, telefono, correo } = await request.json();

    if (!id_cliente) {
      return NextResponse.json({ success: false, error: "Falta id_cliente" }, { status: 400 });
    }

    await db.query(
      `UPDATE clientes
       SET nombre=?, dni_ruc=?, direccion=?, telefono=?, correo=?
       WHERE id_cliente=?`,
      [nombre, dni_ruc, direccion, telefono, correo, id_cliente]
    );

    return NextResponse.json({ success: true, message: "Cliente actualizado correctamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// =====================
// DELETE: Eliminar cliente
// =====================
export async function DELETE(request) {
  try {
    const { id_cliente } = await request.json();

    if (!id_cliente) {
      return NextResponse.json({ success: false, error: "Falta id_cliente" }, { status: 400 });
    }

    await db.query("DELETE FROM clientes WHERE id_cliente = ?", [id_cliente]);

    return NextResponse.json({ success: true, message: "Cliente eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
