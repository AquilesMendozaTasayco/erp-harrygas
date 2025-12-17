// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/register', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Para rutas protegidas, verificar si hay token en las cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const userData = request.cookies.get('user_data')?.value;
  
  // Si no hay token, redirigir al login
  if (!authToken || !userData) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const user = JSON.parse(userData);
    
    // Verificar acceso basado en roles para rutas de dashboard
    if (pathname.startsWith('/dashboard')) {
      const hasAccess = checkRouteAccess(pathname, user.id_rol);
      
      if (!hasAccess) {
        // Redirigir al dashboard correcto según el rol
        const dashboardRoute = getDashboardByRole(user.id_rol);
        return NextResponse.redirect(new URL(dashboardRoute, request.url));
      }
    }
  } catch (error) {
    // Si hay error al parsear los datos, redirigir al login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

function getDashboardByRole(roleId) {
  const dashboardRoutes = {
    1: '/dashboard/admin',      // Administrador
    2: '/dashboard/vendedor',   // Vendedor
    3: '/dashboard/repartidor'  // Repartidor
  };
  return dashboardRoutes[roleId] || '/dashboard';
}

function checkRouteAccess(pathname, roleId) {
  // Definir permisos de rutas
  const rolePermissions = {
    1: [ // Administrador - acceso a todo
      '/dashboard/admin',
      '/dashboard/clientes',
      '/dashboard/productos',
      '/dashboard/proveedores',
      '/dashboard/ventas',
      '/dashboard/pedidos',
      '/dashboard/usuarios',
      '/dashboard/reportes',
      '/dashboard/roles',
    ],
    2: [ // Vendedor
      '/dashboard/vendedor',
      '/dashboard/clientes',
      '/dashboard/productos',
      '/dashboard/ventas',
      '/dashboard/pedidos',
    ],
    3: [ // Repartidor
      '/dashboard/repartidor',
    ]
  };
  
  const allowedRoutes = rolePermissions[roleId] || [];
  
  // Verificar si el pathname comienza con alguna de las rutas permitidas
  return allowedRoutes.some(route => pathname.startsWith(route));
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};