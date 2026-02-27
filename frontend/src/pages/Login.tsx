import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/common/Button";
import Background from "../components/common/Background"

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginRequest(username, password);
      console.log(data);

      login(data.access); // guardar token en contexto
      navigate("/dashboard");
    } catch (err) {
      console.error(err)
      setError("Credenciales incorrectas");
    }
  };

return (
  
  

    <div className="relative min-h-screen w-full flex items-center justify-center">
      <Background>
          
        </Background>
  

      <form
        onSubmit={handleSubmit}
       
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80 border border-white/20"
      >
        <h1 className="text-2xl font-bold mb-6 text-green-800 text-center">Green-core</h1>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        
        <input
          type="text"
          placeholder="Usuario"
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button 
          type="submit"
          variant="primary"
          className="w-full py-3"
        >
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
};

export default Login;