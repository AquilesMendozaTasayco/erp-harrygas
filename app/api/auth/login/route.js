// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createToken, getDashboardByRole } from '@/lib/auth';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'erp_harry_gas'
};

export async function POST(request) {
  let connection;
  
  try {
    const { correo, contrasena } = await request.json();

    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Buscar usuario con su rol
    const [rows] = await connection.execute(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       LEFT JOIN roles r ON u.id_rol = r.id_rol 
       WHERE u.correo = ? AND u.estado = 'activo'`,
      [correo]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado o inactivo' },
        { status: 401 }
      );
    }

    const usuario = rows[0];

    // Verificar contraseña (en producción deberías usar bcrypt)
    if (usuario.contrasena !== contrasena) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = createToken(usuario);

    // Determinar dashboard según rol
    const dashboardRoute = getDashboardByRole(usuario.id_rol);

    // Preparar datos del usuario (sin la contraseña)
    const userData = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      id_rol: usuario.id_rol,
      rol_nombre: usuario.rol_nombre
    };

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      message: `¡Bienvenido ${usuario.nombre}!`,
      user: userData,
      redirectTo: dashboardRoute
    });

    // Establecer cookie con el token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 horas
    });

    // También guardar datos del usuario en cookie (para acceso rápido en cliente)
    response.cookies.set('user_data', JSON.stringify(userData), {
      httpOnly: false, // Accesible desde el cliente
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}