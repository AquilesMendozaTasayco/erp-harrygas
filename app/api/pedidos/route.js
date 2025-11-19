import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM pedidos
      WHERE estado IN ('pendiente','en_camino')
    `);

    return Response.json({ total: rows[0].total });
  } catch (error) {
    console.error(error);
    return Response.json({ total: 0, error: true }, { status: 500 });
  }
}
