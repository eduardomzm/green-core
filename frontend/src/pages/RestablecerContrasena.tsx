import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function RestablecerContrasena() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setStatus("loading");
    try {
      
      await api.post("password_reset/confirm/", { token, password });
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Enlace inválido</h2>
          <p className="text-gray-500 mt-2 text-sm">Este enlace de recuperación no es válido o ya ha expirado.</p>
          <Link to="/login" className="mt-6 inline-block text-primary font-bold hover:underline">Ir al Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-black text-textMain mb-2">Crear nueva contraseña</h2>
        
        {status === "success" ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-gray-800 font-bold text-lg">¡Contraseña actualizada!</p>
            <p className="text-gray-500 text-sm">Tu contraseña ha sido cambiada exitosamente.</p>
            <Link to="/login" className="block w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-6">
              Iniciar Sesión ahora
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
              </div>
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm font-medium text-center">
                Hubo un error. Es posible que el enlace haya expirado.
              </p>
            )}

            <button 
              type="submit" 
              disabled={password.length < 8 || status === "loading"}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {status === "loading" ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}