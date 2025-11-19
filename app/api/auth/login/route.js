import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { correo, contrasena } = await request.json();

    // Conexión MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Buscar usuario
    const [rows] = await connection.execute(
      "SELECT id_usuario, nombre, apellido, correo, contrasena, id_rol FROM usuarios WHERE correo = ?",
      [correo]
    );

    await connection.end();

    // Validar existencia
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Correo no encontrado" });
    }

    const user = rows[0];

    // Comparar contraseña (sin hash)
    if (user.contrasena !== contrasena) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta" });
    }

    // ============================
    // 🔥 CREAR TOKEN JWT
    // ============================
    const token = jwt.sign(
      {
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.id_rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ============================
    // 🔥 RESPUESTA + COOKIE
    // ============================
    const response = NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.id_rol,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
