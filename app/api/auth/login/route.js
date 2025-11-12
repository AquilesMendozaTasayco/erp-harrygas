import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    const { nombre, apellido, correo, contrasena, telefono } = await request.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [exists] = await connection.execute(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo]
    );
    if (exists.length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, error: "El correo ya está registrado" });
    }

    await connection.execute(
      "INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, id_rol, estado) VALUES (?, ?, ?, ?, ?, 2, 'activo')",
      [nombre, apellido, correo, contrasena, telefono]
    );

    await connection.end();

    return NextResponse.json({ success: true, message: "Usuario registrado con éxito" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
