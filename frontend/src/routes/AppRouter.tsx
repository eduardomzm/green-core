import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Usuarios from "../pages/Usuarios";
import Estadisticas from "../pages/Estadisticas";
import ProtectedRoute from "./ProtectedRoute";
import { Landing } from "../pages/Home";
import { Registro } from "../pages/Registro";
import Depositos from "../pages/Depositos";
import Historial from "../pages/Historial";
import Rankings from "../pages/Rankings";
import MiGrupo from "../pages/MiGrupo";
import UnirseMiGrupo from "../pages/UnirseMiGrupo";
import GruposCarreras from "../pages/GruposCarreras";
import Administracion from "../pages/Administracion";
import MainLayout from "../components/layout/MainLayout"; 
import Terminos from "../pages/Terminos";
import Privacidad from "../pages/Privacidad";
import OlvidarContrasena from "../pages/OlvidarContrasena";
import RestablecerContrasena from "../pages/RestablecerContrasena";
import Perfil from "../pages/Perfil";
import MiPerfil from "../pages/MiPerfil.tsx";
import PerfilPublico from "../pages/PerfilPublico";
import Metas from "../pages/Metas";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/olvide-mi-contrasena" element={<OlvidarContrasena />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
      
          <Route index element={<Dashboard />} />
          
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="depositos" element={<Depositos />} />
          <Route path="historial" element={<Historial />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="grupos-carreras" element={<GruposCarreras />} />
          <Route path="administracion" element={<Administracion />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="mi-grupo" element={<MiGrupo />} />
          <Route path="mi-grupo/unirse" element={<UnirseMiGrupo />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="mi-perfil" element={<MiPerfil />} />
          <Route path="perfil/:username" element={<PerfilPublico />} />
          <Route path="metas" element={<Metas />} />
        </Route>


        <Route path="*" element={<Navigate to="/home" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;