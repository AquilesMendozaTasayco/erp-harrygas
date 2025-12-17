// app/api/repartidor/pedido-detalle/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'erp_harry_gas'
};

export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const idPedido = searchParams.get('id_pedido');

    if (!idPedido) {
      return NextResponse.json(
        { success: false, error: 'ID de pedido requerido' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Obtener detalles del pedido con productos
    const [detalles] = await connection.execute(
      `SELECT 
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        p.nombre as nombre_producto,
        p.descripcion as descripcion_producto
      FROM pedidos ped
      INNER JOIN detalle_venta dv ON ped.id_venta = dv.id_venta
      INNER JOIN productos p ON dv.id_producto = p.id_producto
      WHERE ped.id_pedido = ?`,
      [idPedido]
    );

    if (detalles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se encontraron detalles del pedido' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      detalles: detalles
    });

  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener detalles del pedido' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}