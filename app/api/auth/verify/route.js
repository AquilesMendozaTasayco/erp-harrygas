import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ valid: false });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ valid: false });

    return NextResponse.json({ valid: true, user });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
