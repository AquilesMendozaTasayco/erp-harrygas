import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// ======================
// GET: Listar usuarios
// ======================
export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono,
              u.estado, u.id_rol, r.nombre AS rol, u.fecha_creacion
       FROM usuarios u
       LEFT JOIN roles r ON u.id_rol = r.id_rol
       ORDER BY u.id_usuario DESC`
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ======================
// POST: Crear usuario
// ======================
export async function POST(request) {
  try {
    const { nombre, apellido, correo, contrasena, telefono, id_rol } = await request.json();

    if (!nombre || !correo || !contrasena) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios (nombre, correo, contraseña)" }, { status: 400 });
    }
    if (!id_rol) {
      return NextResponse.json({ success: false, error: "Debe seleccionar un rol" }, { status: 400 });
    }

    // correo duplicado
    const [exists] = await db.query("SELECT id_usuario FROM usuarios WHERE correo = ?", [correo]);
    if (exists.length > 0) {
      return NextResponse.json({ success: false, error: "El correo ya está registrado" }, { status: 409 });
    }

    await db.query(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, id_rol, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'activo')`,
      [nombre, apellido, correo, contrasena, telefono || null, id_rol]
    );

    return NextResponse.json({ success: true, message: "Usuario registrado correctamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ======================
// PUT: Editar usuario
// ======================
export async function PUT(request) {
  try {
    const { id_usuario, nombre, apellido, correo, telefono, estado, id_rol } = await request.json();

    if (!id_usuario) {
      return NextResponse.json({ success: false, error: "Falta id_usuario" }, { status: 400 });
    }
    if (!id_rol) {
      return NextResponse.json({ success: false, error: "Debe seleccionar un rol" }, { status: 400 });
    }

    await db.query(
      `UPDATE usuarios 
       SET nombre=?, apellido=?, correo=?, telefono=?, estado=?, id_rol=? 
       WHERE id_usuario=?`,
      [nombre, apellido, correo, telefono || null, estado || "activo", id_rol, id_usuario]
    );

    return NextResponse.json({ success: true, message: "Usuario actualizado correctamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ======================
// DELETE: Eliminar usuario
// ======================
export async function DELETE(request) {
  try {
    const { id_usuario } = await request.json();
    if (!id_usuario) {
      return NextResponse.json({ success: false, error: "Falta id_usuario" }, { status: 400 });
    }
    await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);
    return NextResponse.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
