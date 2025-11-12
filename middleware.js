import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Middleware principal
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Rutas públicas (que no requieren sesión)
  const publicPaths = ["/auth/login", "/auth/register", "/favicon.ico"];

  // Si la ruta es pública → permitir acceso
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Obtener token JWT desde las cookies
  const token = req.cookies.get("token")?.value;

  // Si no hay token → redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const user = verifyToken(token);
    if (!user) throw new Error("Token inválido");

    // Token válido → permitir acceso
    return NextResponse.next();
  } catch {
    // Si el token es inválido o expiró → redirigir al login
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("token");
    return response;
  }
}

// Solo proteger rutas específicas
export const config = {
  matcher: [
    "/dashboard/:path*", // todas las rutas dentro del dashboard
    "/api/:path*",       // todas las APIs
  ],
};
