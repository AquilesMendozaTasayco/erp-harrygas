"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

const ROLES = {
  ADMIN: 1,
  VENDEDOR: 2,
  REPARTIDOR: 3
};

const ROUTE_PERMISSIONS = {
  '/dashboard/admin': [ROLES.ADMIN],
  '/dashboard/clientes': [ROLES.ADMIN, ROLES.VENDEDOR],
  '/dashboard/productos': [ROLES.ADMIN, ROLES.VENDEDOR],
  '/dashboard/proveedores': [ROLES.ADMIN],
  '/dashboard/ventas': [ROLES.ADMIN, ROLES.VENDEDOR],
  '/dashboard/pedidos': [ROLES.ADMIN, ROLES.VENDEDOR],
  '/dashboard/usuarios': [ROLES.ADMIN],
  '/dashboard/reportes': [ROLES.ADMIN],
  '/dashboard/roles': [ROLES.ADMIN],
  '/dashboard/repartidor': [ROLES.REPARTIDOR],
  '/dashboard/vendedor': [ROLES.VENDEDOR],
};

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    // Verificar si hay usuario en localStorage
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      // No hay usuario, redirigir al login
      router.push('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Verificar si el usuario tiene el rol requerido
      const hasAccess = checkRouteAccess(pathname, user.id_rol, requiredRoles);
      
      if (!hasAccess) {
        // No tiene acceso, redirigir al dashboard correspondiente
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No tienes permisos para acceder a esta sección',
          confirmButtonColor: '#3B82F6',
        }).then(() => {
          const dashboardRoute = getDashboardByRole(user.id_rol);
          router.push(dashboardRoute);
        });
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      router.push('/auth/login');
    }
  };

  const checkRouteAccess = (pathname, userRole, requiredRoles) => {
    // Si se especificaron roles requeridos, usar esos
    if (requiredRoles.length > 0) {
      return requiredRoles.includes(userRole);
    }

    // Buscar permisos de la ruta
    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(route)) {
        return allowedRoles.includes(userRole);
      }
    }

    return false;
  };

  const getDashboardByRole = (roleId) => {
    const dashboards = {
      [ROLES.ADMIN]: '/dashboard/admin',
      [ROLES.VENDEDOR]: '/dashboard/vendedor',
      [ROLES.REPARTIDOR]: '/dashboard/repartidor'
    };
    return dashboards[roleId] || '/dashboard';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}