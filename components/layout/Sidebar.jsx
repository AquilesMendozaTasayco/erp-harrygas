"use client";

import { 
  Home, Users, Package, FileText, 
  ShoppingCart, Truck, BarChart3, X 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Usuarios", icon: Users, href: "/dashboard/usuarios" },
  { name: "Clientes", icon: Users, href: "/dashboard/clientes" },
  { name: "Productos", icon: Package, href: "/dashboard/productos" },
  { name: "Ventas", icon: ShoppingCart, href: "/dashboard/ventas" },
  { name: "Pedidos", icon: Truck, href: "/dashboard/pedidos" },
  { name: "Reportes", icon: BarChart3, href: "/dashboard/reportes" },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "bg-white border-r border-gray-200 h-screen flex flex-col fixed md:relative z-50 transition-all duration-300",

        // Width animate
        isOpen ? "w-64" : "w-20",

        // Mobile slide in/out
        !isOpen && "md:w-20",
        isOpen ? "left-0" : "left-[-250px] md:left-0"
      )}
    >

      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {isOpen && (
          <h3 className="font-semibold text-lg text-gray-700">
            ERP • Harry Gas
          </h3>
        )}

        {/* Cerrar solo en móvil */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          <X size={22} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map(({ name, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all",

                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800",

                // centrar iconos cuando está colapsado
                !isOpen && "justify-center"
              )}
            >
              <Icon size={20} />
              {isOpen && <span>{name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
