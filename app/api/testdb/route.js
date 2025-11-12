import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS usuarios FROM usuarios");
    return NextResponse.json({
      success: true,
      message: "Conexión exitosa ✅",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    return NextResponse.json(
      { success: false, message: "Error al conectar a la BD", error: error.message },
      { status: 500 }
    );
  }
}
