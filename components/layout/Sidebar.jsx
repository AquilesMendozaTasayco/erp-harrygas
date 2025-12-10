"use client";

import { 
  Home, Users, Package, FileText, 
  ShoppingCart, Truck, BarChart3, 
  Settings, Bell, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, Building,
  DollarSign, Activity, Shield, Database
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useEffect } from "react";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard", badge: null },
  { name: "Usuarios", icon: Users, href: "/dashboard/usuarios", badge: "3" },
  { name: "Clientes", icon: Users, href: "/dashboard/clientes", badge: "12" },
  { name: "Productos", icon: Package, href: "/dashboard/productos", badge: "45" },
  { name: "Proveedores", icon: Building, href: "/dashboard/proveedores", badge: "8" },
  { name: "Ventas", icon: ShoppingCart, href: "/dashboard/ventas", badge: "New" },
  { name: "Pedidos", icon: Truck, href: "/dashboard/pedidos", badge: "5" },
  { name: "Reportes", icon: BarChart3, href: "/dashboard/reportes", badge: null },
  { name: "Finanzas", icon: DollarSign, href: "/dashboard/finanzas", badge: null },
  { name: "Analítica", icon: Activity, href: "/dashboard/analitica", badge: "Pro" },
  { name: "Inventario", icon: Database, href: "/dashboard/inventario", badge: null },
];

const bottomMenuItems = [
  { name: "Notificaciones", icon: Bell, href: "/dashboard/notificaciones", badge: "5" },
  { name: "Ayuda", icon: HelpCircle, href: "/dashboard/ayuda", badge: null },
  { name: "Configuración", icon: Settings, href: "/dashboard/configuracion", badge: null },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("");
  const [userName] = useState("Harry Gas"); // En una app real, esto vendría del contexto

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-screen flex flex-col fixed md:relative z-50 transition-all duration-500 ease-in-out shadow-2xl border-r border-gray-700",
          
          // Width animate con efecto de acordeón
          isOpen ? "w-72" : "w-20",
          
          // Mobile slide in/out con efecto suave
          !isOpen ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%),
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Header con logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 relative">
          {isOpen && (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  ERP Pro
                </h3>
                <p className="text-xs text-gray-400">Gestión Integral</p>
              </div>
            </div>
          )}
          
          {!isOpen && (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {/* Botón de toggle con efecto */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-gray-800"
          >
            {isOpen ? (
              <ChevronLeft size={16} className="transition-transform duration-300" />
            ) : (
              <ChevronRight size={16} className="transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Indicador de tiempo y usuario */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-gray-700/50 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">HG</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{userName}</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-300">{currentTime}</div>
                <div className="text-xs text-gray-500">Online</div>
              </div>
            </div>
          </div>
        )}

        {/* Menú principal con scroll personalizado */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            {isOpen && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Navegación Principal
              </p>
            )}
            {menuItems.map(({ name, icon: Icon, href, badge }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={clsx(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                    
                    active
                      ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white",
                    
                    !isOpen && "justify-center"
                  )}
                >
                  {/* Efecto de brillo en hover */}
                  <div className={clsx(
                    "absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )} />
                  
                  <div className={clsx(
                    "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                    active 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg" 
                      : "bg-gray-800 group-hover:bg-gray-700"
                  )}>
                    <Icon size={18} className={clsx(
                      active ? "text-white" : "text-gray-400 group-hover:text-white"
                    )} />
                  </div>
                  
                  {isOpen && (
                    <div className="relative flex-1 flex items-center justify-between">
                      <span className={clsx(
                        "font-medium transition-all duration-300",
                        active ? "text-white font-semibold" : "group-hover:text-white"
                      )}>
                        {name}
                      </span>
                      {badge && (
                        <span className={clsx(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          badge === "Pro" 
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : badge === "New"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : "bg-gray-700 text-gray-300"
                        )}>
                          {badge}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Indicador activo */}
                  {active && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Separador */}
          {isOpen && (
            <div className="relative py-4 px-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs font-semibold text-gray-500 bg-gray-900/80">
                  Sistema
                </span>
              </div>
            </div>
          )}

          {/* Menú inferior */}
          <div className="mt-4">
            {bottomMenuItems.map(({ name, icon: Icon, href, badge }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={clsx(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                    
                    active
                      ? "bg-gray-800/50 text-white"
                      : "text-gray-400 hover:bg-gray-800/30 hover:text-white",
                    
                    !isOpen && "justify-center"
                  )}
                >
                  <div className="relative">
                    <Icon size={18} className="transition-colors duration-300" />
                    {badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </div>
                  
                  {isOpen && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-700/50">
          {isOpen ? (
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-600/30">
                <LogOut size={16} className="text-red-400" />
              </div>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          ) : (
            <div className="flex justify-center">
              <button className="p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Indicador de versión */}
        {isOpen && (
          <div className="px-4 py-2 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">v2.5.1</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Sistema Activo</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Estilos CSS personalizados */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .glass-effect {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}