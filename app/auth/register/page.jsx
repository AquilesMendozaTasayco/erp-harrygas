"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { User, Mail, Lock, Phone, ArrowRight, UserPlus } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        // Alerta de éxito con SweetAlert2
        MySwal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada correctamente',
          background: '#F9FAFB',
          color: '#1F2937',
          confirmButtonText: 'Continuar al login',
          confirmButtonColor: '#3B82F6',
          timer: 3000,
          timerProgressBar: true,
          didClose: () => {
            router.push("/auth/login");
          }
        });
      } else {
        // Alerta de error con SweetAlert2
        MySwal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: data.error || "Hubo un problema al crear tu cuenta",
          background: '#F9FAFB',
          color: '#1F2937',
          confirmButtonText: 'Intentar nuevamente',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: "No se pudo conectar con el servidor",
        background: '#F9FAFB',
        color: '#1F2937',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo azul animado (igual al login) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20"
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 10}s linear infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Olas animadas */}
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-30">
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-500/50 to-transparent"
            style={{
              animation: 'wave 15s linear infinite',
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-indigo-400/30 to-transparent"
            style={{
              animation: 'wave 20s linear infinite reverse',
              animationDelay: '5s',
            }}
          />
        </div>
        
        {/* Brillo sutil */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      {/* Líneas decorativas - Mismos colores que el login */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-300 to-indigo-400" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-blue-400 via-blue-300 to-indigo-400" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-t from-blue-400 via-blue-300 to-indigo-400" />

      <div className="relative w-full max-w-md z-10">
        {/* Tarjeta de registro con efecto de cristal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 relative">
          {/* Acabado de esquina decorativo - Colores azules */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-xl" />
          
          {/* Header minimalista */}
          <div className="p-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Crear Cuenta
            </h1>
            <p className="text-center text-gray-600 text-sm">
              Únete a nuestra comunidad
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
            {/* Nombre y Apellido en grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  Nombre
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:-translate-y-1">
                    <User className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="pl-9 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 outline-none hover:border-gray-400"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Tu apellido"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 outline-none hover:border-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Correo electrónico */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:-translate-y-1">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 outline-none hover:border-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:-translate-y-1">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.contrasena}
                  onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 outline-none hover:border-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres, incluyendo mayúsculas y números
              </p>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-3 h-3" />
                Teléfono (opcional)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:-translate-y-1">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="tel"
                  placeholder="+52 123 456 7890"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 outline-none hover:border-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start space-x-2 p-3 bg-blue-50/50 rounded-lg">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="peer sr-only"
                  required
                />
                <div className="w-4 h-4 border border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center transition-colors">
                  <svg 
                    className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer select-none">
                Acepto los <button type="button" onClick={() => {
                  MySwal.fire({
                    title: 'Términos y Condiciones',
                    html: `
                      <div class="text-left max-h-60 overflow-y-auto">
                        <h3 class="font-bold mb-2">1. Aceptación de términos</h3>
                        <p class="mb-3 text-sm">Al registrarte, aceptas nuestros términos y condiciones...</p>
                        <h3 class="font-bold mb-2">2. Uso de datos</h3>
                        <p class="mb-3 text-sm">Tus datos serán protegidos según nuestra política de privacidad...</p>
                      </div>
                    `,
                    background: '#F9FAFB',
                    color: '#1F2937',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3B82F6',
                    width: '500px',
                  });
                }} className="text-blue-600 hover:underline font-medium">términos y condiciones</button> y la <button type="button" onClick={() => {
                  MySwal.fire({
                    title: 'Política de Privacidad',
                    html: `
                      <div class="text-left max-h-60 overflow-y-auto">
                        <p class="mb-3 text-sm">Respetamos tu privacidad y protegemos tus datos personales...</p>
                        <p class="mb-3 text-sm">No compartiremos tu información con terceros sin tu consentimiento...</p>
                      </div>
                    `,
                    background: '#F9FAFB',
                    color: '#1F2937',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3B82F6',
                    width: '500px',
                  });
                }} className="text-blue-600 hover:underline font-medium">política de privacidad</button>
              </label>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              {/* Efecto de brillo al pasar el mouse */}
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="relative">Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span className="relative">Crear Cuenta</span>
                  <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Separador sutil */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">¿Ya eres miembro?</span>
              </div>
            </div>

            {/* Enlace a login */}
            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  MySwal.fire({
                    icon: 'info',
                    title: 'Redirigiendo...',
                    text: 'Serás llevado a la página de inicio de sesión',
                    background: '#F9FAFB',
                    color: '#1F2937',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                      router.push('/auth/login');
                    }
                  });
                }}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline inline-flex items-center gap-1 group"
              >
                Inicia sesión aquí
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </p>
          </form>
        </div>

        {/* Información adicional minimalista */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/80">
            © {new Date().getFullYear()} Tu aplicación. Tu privacidad es importante.
          </p>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.2;
          }
          33% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.4;
          }
          66% { 
            transform: translateY(10px) translateX(-10px); 
            opacity: 0.3;
          }
        }
        
        @keyframes wave {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(5px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}