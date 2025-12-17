// app/api/repartidor/cambiar-estado/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'erp_harry_gas'
};

export async function POST(request) {
  let connection;
  
  try {
    const { id_pedido, nuevo_estado, id_repartidor } = await request.json();

    if (!id_pedido || !nuevo_estado || !id_repartidor) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'en_camino', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(nuevo_estado)) {
      return NextResponse.json(
        { success: false, error: 'Estado no válido' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Verificar que el pedido pertenece al repartidor
    const [pedidos] = await connection.execute(
      'SELECT * FROM pedidos WHERE id_pedido = ? AND id_repartidor = ?',
      [id_pedido, id_repartidor]
    );

    if (pedidos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pedido no encontrado o no autorizado' },
        { status: 404 }
      );
    }

    // Actualizar el estado del pedido
    const fechaEntrega = nuevo_estado === 'entregado' ? new Date() : null;
    
    await connection.execute(
      `UPDATE pedidos 
       SET estado = ?, fecha_entrega = ?
       WHERE id_pedido = ?`,
      [nuevo_estado, fechaEntrega, id_pedido]
    );

    // Si el pedido se marca como entregado, actualizar también la venta
    if (nuevo_estado === 'entregado') {
      const pedido = pedidos[0];
      await connection.execute(
        `UPDATE ventas 
         SET estado = 'pagado'
         WHERE id_venta = ?`,
        [pedido.id_venta]
      );
    }

    // Registrar la actividad en logs
    await connection.execute(
      `INSERT INTO logs_actividad (id_usuario, accion, fecha) 
       VALUES (?, ?, NOW())`,
      [id_repartidor, `Cambió estado del pedido #${id_pedido} a ${nuevo_estado}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado correctamente'
    });

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return NextResponse.json(
      { success: false, error: 'Error al cambiar estado del pedido' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}