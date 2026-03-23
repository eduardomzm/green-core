import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { loginRequest } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/common/Button";
import Background from "../components/common/Background";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginRequest(username, password);
      console.log(data);

      login(data.access); // guardar token en contexto
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans text-textMain px-4">
      
      <Background></Background>

      
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/40">
        
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-bounce-slow"></div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Green Core</h1>
        </div>

        {error && (
          <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
    
          <div>
            <label className="block text-sm font-bold text-textMain mb-1.5 ml-1">
              Usuario o Correo
            </label>
            <input
              type="text"
              placeholder=""
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-textMain mb-1.5 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" "
                className="w-full px-5 py-3.5 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-2">
          <Link to="/olvide-mi-contrasena" className="text-sm text-primary font-bold hover:underline">
          ¿Olvidaste tu contraseña?
          </Link>
          </div>

          <Button 
            type="submit"
            variant="primary"
            className="w-full py-4 mt-6 rounded-xl font-bold bg-primary hover:bg-secondary text-white shadow-[0_8px_30px_rgb(45,106,79,0.3)] hover:shadow-[0_8px_30px_rgb(0,180,216,0.4)] transition-all duration-300 transform hover:-translate-y-1 border-none"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-gray-200/60">
          <div className="text-sm text-gray-600 font-medium">
            ¿Aún no tienes cuenta?{" "}
            <Link to="/registro" className="text-accent font-bold hover:opacity-80 transition-opacity">
              Regístrate aquí
            </Link>
          </div>
          
          <Link to="/home" className="text-xs text-gray-500 hover:text-primary transition-colors font-medium">
            ← Volver a la página principal
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;