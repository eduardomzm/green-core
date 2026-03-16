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

import MainLayout from "../components/layout/MainLayout"; 

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

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
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="mi-grupo" element={<MiGrupo />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;