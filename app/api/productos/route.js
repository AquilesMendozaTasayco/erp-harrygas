import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT SUM(stock) AS total
      FROM productos
    `);

    return Response.json({ total: rows[0]?.total ?? 0 });
  } catch (error) {
    console.error(error);
    return Response.json({ total: 0, error: true }, { status: 500 });
  }
}
