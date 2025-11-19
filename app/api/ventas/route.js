import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT IFNULL(SUM(monto_total), 0) AS total
      FROM ventas
      WHERE DATE(fecha) = CURDATE()
    `);

    const [week] = await db.query(`
      SELECT 
        DATE_FORMAT(fecha, '%a') AS dia,
        SUM(monto_total) AS total
      FROM ventas
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(fecha)
      ORDER BY fecha
    `);

    return Response.json({
      ventas_dia: rows[0].total,
      ventas_semana: week,
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: true }, { status: 500 });
  }
}
