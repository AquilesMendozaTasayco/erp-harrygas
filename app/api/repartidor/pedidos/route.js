// app/api/repartidor/pedidos/route.js
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
    const idRepartidor = searchParams.get('id_repartidor');

    if (!idRepartidor) {
      return NextResponse.json(
        { success: false, error: 'ID de repartidor requerido' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Obtener pedidos asignados al repartidor con información completa
    const [pedidos] = await connection.execute(
      `SELECT 
        p.id_pedido,
        p.direccion_entrega,
        p.fecha_pedido,
        p.fecha_entrega,
        p.estado,
        c.nombre as nombre_cliente,
        c.telefono as telefono_cliente,
        c.correo as correo_cliente,
        v.total,
        v.metodo_pago,
        v.fecha as fecha_venta
      FROM pedidos p
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente
      INNER JOIN ventas v ON p.id_venta = v.id_venta
      WHERE p.id_repartidor = ?
      ORDER BY 
        CASE 
          WHEN p.estado = 'en_camino' THEN 1
          WHEN p.estado = 'pendiente' THEN 2
          WHEN p.estado = 'entregado' THEN 3
          ELSE 4
        END,
        p.fecha_pedido DESC`,
      [idRepartidor]
    );

    return NextResponse.json({
      success: true,
      pedidos: pedidos
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}