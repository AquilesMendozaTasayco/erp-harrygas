"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Alerta de éxito con SweetAlert2
        MySwal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          html: `<p>Bienvenido <strong>${data.user.nombre} ${data.user.apellido}</strong></p>
                 <p class="text-sm text-gray-600">Rol: ${data.user.rol_nombre}</p>`,
          background: '#F9FAFB',
          color: '#1F2937',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          didClose: () => {
            // Redirigir según el rol
            router.push(data.redirectTo);
          }
        });
      } else {
        // Alerta de error con SweetAlert2
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || "Error al iniciar sesión",
          background: '#F9FAFB',
          color: '#1F2937',
          confirmButtonText: 'Intentar nuevamente',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      // Alerta de error de conexión
      MySwal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.",
        background: '#F9FAFB',
        color: '#1F2937',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Alerta de recuperación de contraseña
  const handleForgotPassword = (e) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Recuperar contraseña',
      html: `
        <div class="text-left">
          <p class="mb-4">Ingresa tu correo electrónico para restablecer tu contraseña.</p>
          <input 
            type="email" 
            id="swal-input1" 
            class="swal2-input" 
            placeholder="tu@correo.com"
            style="width: 100%;"
          >
        </div>
      `,
      background: '#F9FAFB',
      color: '#1F2937',
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#3B82F6',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#6B7280',
      preConfirm: () => {
        const email = document.getElementById('swal-input1').value;
        if (!email) {
          Swal.showValidationMessage('Por favor ingresa tu correo electrónico');
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          Swal.showValidationMessage('Por favor ingresa un correo válido');
          return false;
        }
        return email;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Simular envío
        MySwal.fire({
          icon: 'success',
          title: '¡Correo enviado!',
          text: 'Hemos enviado un enlace de recuperación a tu correo electrónico.',
          background: '#F9FAFB',
          color: '#1F2937',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3B82F6',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo azul animado simple */}
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

      {/* Líneas decorativas */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-300 to-indigo-400" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-blue-400 via-blue-300 to-indigo-400" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-t from-blue-400 via-blue-300 to-indigo-400" />

      <div className="relative w-full max-w-md z-10">
        {/* Tarjeta de login con efecto de cristal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 relative">
          {/* Acabado de esquina decorativo */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-xl" />
          
          {/* Header minimalista */}
          <div className="p-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-center text-gray-600 text-sm">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
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

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:-translate-y-1">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.contrasena}
                  onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 outline-none hover:border-gray-400"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center group/eye"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 group-hover/eye:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 group-hover/eye:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Recordarme checkbox */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  id="remember"
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center transition-colors">
                  <svg 
                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <label 
                htmlFor="remember" 
                className="ml-2 text-sm text-gray-600 cursor-pointer select-none hover:text-gray-800 transition-colors"
              >
                Recordar mi sesión
              </label>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="relative">Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span className="relative">Continuar</span>
                  <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>

            {/* Enlace a registro */}
            <p className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a
                href="/auth/register"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline inline-flex items-center gap-1 group"
                onClick={(e) => {
                  e.preventDefault();
                  MySwal.fire({
                    icon: 'info',
                    title: 'Redirigiendo...',
                    text: 'Serás llevado a la página de registro',
                    background: '#F9FAFB',
                    color: '#1F2937',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                      router.push('/auth/register');
                    }
                  });
                }}
              >
                Regístrate aquí
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </p>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/80">
            © {new Date().getFullYear()} Harry Gas. Todos los derechos reservados.
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