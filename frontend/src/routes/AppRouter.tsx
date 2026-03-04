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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Landing />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/depositos"
          element={
            <ProtectedRoute>
              <Depositos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rankings"
          element={
            <ProtectedRoute>
              <Rankings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute>
              <Estadisticas />
            </ProtectedRoute>
          }
        />

        

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;