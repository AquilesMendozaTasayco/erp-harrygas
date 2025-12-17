// lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

export const ROLES = {
  ADMIN: 1,
  VENDEDOR: 2,
  REPARTIDOR: 3
};

export const ROLE_NAMES = {
  1: 'Administrador',
  2: 'Vendedor',
  3: 'Repartidor'
};

export function createToken(user) {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      correo: user.correo,
      nombre: user.nombre,
      apellido: user.apellido,
      id_rol: user.id_rol
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getDashboardByRole(roleId) {
  const dashboards = {
    [ROLES.ADMIN]: '/dashboard/admin',
    [ROLES.VENDEDOR]: '/dashboard/vendedor',
    [ROLES.REPARTIDOR]: '/dashboard/repartidor'
  };
  return dashboards[roleId] || '/dashboard';
}

export function hasPermission(userRole, requiredRoles) {
  return requiredRoles.includes(userRole);
}

export function canAccessRoute(pathname, userRole) {
  const routePermissions = {
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

  // Buscar la ruta que coincida
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }

  return false;
}