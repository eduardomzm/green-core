import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import api from "../services/api";

export default function OlvidarContrasena() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await api.post("password_reset/", { email });
      setStatus("success");
    } catch (error: any) {
      console.error("Error en recuperar contrasena:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.detail || 
        error.response?.data?.email?.[0] || 
        "Hubo un problema al enviar el correo. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Volver al Login
        </Link>

        <h2 className="text-2xl font-black text-textMain mb-2">Recuperar Acceso</h2>
        
        {status === "success" ? (
          <div className="bg-green-50 p-6 rounded-2xl text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-green-800 font-medium">
              Si el correo <strong>{email}</strong> está registrado, te hemos enviado un enlace para restablecer tu contraseña.
            </p>
            <p className="text-sm text-green-600">Revisa tu bandeja de entrada y la carpeta de Spam.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6 text-sm">
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones para crear una nueva contraseña.
            </p>

            {status === "error" && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6">
                <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={!email || status === "loading"}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {status === "loading" ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}