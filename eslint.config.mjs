import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const user = req.cookies.get("user")?.value;

  // Si no hay sesión y se intenta entrar al dashboard
  if (!user && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Si hay sesión y trata de entrar al login o register, lo redirige al dashboard
  if (user && (url.pathname.startsWith("/auth/login") || url.pathname.startsWith("/auth/register"))) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Aplica a estas rutas
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
