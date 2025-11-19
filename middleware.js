  import { NextResponse } from "next/server";
  import { verifyToken } from "@/lib/auth";

  export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Rutas públicas
    const publicPaths = ["/auth/login", "/auth/register", "/favicon.ico"];

    // Permitir APIs públicas
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Si la ruta es pública → permitir acceso
    if (publicPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Verificar token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      verifyToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  export const config = {
    matcher: [
      "/dashboard/:path*",
      "/api/:path*", // protegido excepto /api/auth
    ],
  };
