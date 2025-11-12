"use client";
import { Home, Users, Package, FileText, ShoppingCart, Truck, BarChart3 } from "lucide-react";
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
        "bg-white border-r border-gray-200 h-screen fixed md:relative flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <img src="/img/logo.png" alt="Logo" className="w-8 h-8" />
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition",
              pathname === href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            )}
          >
            <Icon size={20} />
            {isOpen && <span>{name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
