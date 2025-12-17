"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  Phone,
  Navigation,
  AlertCircle,
  Filter,
  Search,
  LogOut,
  RefreshCw
} from 'lucide-react';

const MySwal = withReactContent(Swal);

export default function RepartidorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos'); // todos, pendiente, en_camino, entregado
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    pendientes: 0,
    en_camino: 0,
    entregados_hoy: 0,
    total: 0
  });

  useEffect(() => {
    // Verificar autenticación y rol
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.id_rol !== 3) { // 3 = Repartidor
      MySwal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos para acceder a esta sección',
        confirmButtonColor: '#3B82F6',
      }).then(() => {
        router.push('/auth/login');
      });
      return;
    }

    setUser(parsedUser);
    cargarPedidos(parsedUser.id_usuario);
  }, []);

  const cargarPedidos = async (idRepartidor) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/repartidor/pedidos?id_repartidor=${idRepartidor}`);
      const data = await res.json();

      if (data.success) {
        setPedidos(data.pedidos);
        calcularEstadisticas(data.pedidos);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los pedidos',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (pedidosList) => {
    const hoy = new Date().toDateString();
    const stats = {
      pendientes: pedidosList.filter(p => p.estado === 'pendiente').length,
      en_camino: pedidosList.filter(p => p.estado === 'en_camino').length,
      entregados_hoy: pedidosList.filter(p => {
        const fechaPedido = new Date(p.fecha_pedido).toDateString();
        return p.estado === 'entregado' && fechaPedido === hoy;
      }).length,
      total: pedidosList.length
    };
    setStats(stats);
  };

  const cambiarEstadoPedido = async (idPedido, nuevoEstado) => {
    const estadoTexto = {
      'en_camino': 'En Camino',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };

    const result = await MySwal.fire({
      title: `¿Cambiar estado a "${estadoTexto[nuevoEstado]}"?`,
      text: 'Esta acción actualizará el estado del pedido',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch('/api/repartidor/cambiar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pedido: idPedido,
          nuevo_estado: nuevoEstado,
          id_repartidor: user.id_usuario
        })
      });

      const data = await res.json();

      if (data.success) {
        MySwal.fire({
          icon: 'success',
          title: '¡Estado actualizado!',
          text: `El pedido ahora está ${estadoTexto[nuevoEstado].toLowerCase()}`,
          timer: 2000,
          showConfirmButton: false
        });

        // Recargar pedidos
        cargarPedidos(user.id_usuario);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado del pedido',
        confirmButtonColor: '#3B82F6',
      });
    }
  };

  const verDetallesPedido = async (pedido) => {
    try {
      const res = await fetch(`/api/repartidor/pedido-detalle?id_pedido=${pedido.id_pedido}`);
      const data = await res.json();

      if (data.success) {
        const productos = data.detalles.map(d => 
          `<div class="flex justify-between py-2 border-b">
            <span>${d.nombre_producto} x${d.cantidad}</span>
            <span class="font-semibold">S/ ${d.subtotal}</span>
          </div>`
        ).join('');

        MySwal.fire({
          title: `Pedido #${pedido.id_pedido}`,
          html: `
            <div class="text-left space-y-4">
              <div class="bg-blue-50 p-3 rounded-lg">
                <p class="font-semibold text-blue-900">Cliente: ${pedido.nombre_cliente}</p>
                <p class="text-sm text-gray-600"><strong>Teléfono:</strong> ${pedido.telefono_cliente || 'No disponible'}</p>
                <p class="text-sm text-gray-600"><strong>Dirección:</strong> ${pedido.direccion_entrega}</p>
              </div>
              
              <div>
                <p class="font-semibold mb-2 text-gray-800">Productos:</p>
                ${productos}
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span class="text-blue-600">S/ ${pedido.total}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">Método: ${pedido.metodo_pago || 'No especificado'}</p>
              </div>
            </div>
          `,
          width: '600px',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los detalles del pedido',
        confirmButtonColor: '#3B82F6',
      });
    }
  };

  const abrirMapa = (direccion) => {
    const query = encodeURIComponent(direccion);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleLogout = () => {
    MySwal.fire({
      title: '¿Cerrar sesión?',
      text: 'Serás redirigido al inicio de sesión',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    });
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchFilter = filter === 'todos' || pedido.estado === filter;
    const matchSearch = searchTerm === '' || 
      pedido.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.direccion_entrega.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id_pedido.toString().includes(searchTerm);
    
    return matchFilter && matchSearch;
  });

  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'en_camino': 'bg-blue-100 text-blue-800 border-blue-300',
      'entregado': 'bg-green-100 text-green-800 border-green-300',
      'cancelado': 'bg-red-100 text-red-800 border-red-300'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'pendiente': <Clock className="w-4 h-4" />,
      'en_camino': <Truck className="w-4 h-4" />,
      'entregado': <CheckCircle className="w-4 h-4" />,
      'cancelado': <XCircle className="w-4 h-4" />
    };
    return iconos[estado] || <AlertCircle className="w-4 h-4" />;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel Repartidor</h1>
                <p className="text-sm text-gray-600">
                  Bienvenido, {user.nombre} {user.apellido}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => cargarPedidos(user.id_usuario)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendientes}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Camino</p>
                <p className="text-3xl font-bold text-gray-900">{stats.en_camino}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Entregados Hoy</p>
                <p className="text-3xl font-bold text-gray-900">{stats.entregados_hoy}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, dirección o N° pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filtro por estado */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('todos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'todos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('pendiente')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pendiente'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilter('en_camino')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'en_camino'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En Camino
              </button>
              <button
                onClick={() => setFilter('entregado')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'entregado'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Entregados
              </button>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'todos'
                ? 'No se encontraron pedidos con los filtros seleccionados'
                : 'No tienes pedidos asignados en este momento'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id_pedido}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Pedido #{pedido.id_pedido}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getEstadoColor(pedido.estado)}`}>
                            {getEstadoIcon(pedido.estado)}
                            {pedido.estado.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(pedido.fecha_pedido).toLocaleString('es-PE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          S/ {pedido.total}
                        </p>
                        <p className="text-xs text-gray-500">{pedido.metodo_pago || 'Efectivo'}</p>
                      </div>
                    </div>

                    {/* Cliente */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{pedido.nombre_cliente}</p>
                          {pedido.telefono_cliente && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Phone className="w-4 h-4" />
                              {pedido.telefono_cliente}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Dirección de entrega:</p>
                        <p className="text-gray-600">{pedido.direccion_entrega}</p>
                      </div>
                      <button
                        onClick={() => abrirMapa(pedido.direccion_entrega)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        Ver mapa
                      </button>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="lg:w-64 flex flex-col gap-2">
                    <button
                      onClick={() => verDetallesPedido(pedido)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Ver Detalles
                    </button>

                    {pedido.estado === 'pendiente' && (
                      <button
                        onClick={() => cambiarEstadoPedido(pedido.id_pedido, 'en_camino')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        Iniciar Entrega
                      </button>
                    )}

                    {pedido.estado === 'en_camino' && (
                      <>
                        <button
                          onClick={() => cambiarEstadoPedido(pedido.id_pedido, 'entregado')}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Marcar Entregado
                        </button>
                        <button
                          onClick={() => cambiarEstadoPedido(pedido.id_pedido, 'cancelado')}
                          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}

                    {pedido.estado === 'entregado' && (
                      <div className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg text-center font-medium">
                        ✓ Pedido completado
                      </div>
                    )}

                    {pedido.estado === 'cancelado' && (
                      <div className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg text-center font-medium">
                        ✗ Pedido cancelado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}