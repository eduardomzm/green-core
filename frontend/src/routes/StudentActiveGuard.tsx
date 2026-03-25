import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const StudentActiveGuard = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-gray-400 animate-pulse font-medium">Verificando estado...</div>;
  }

  // Solo aplica para alumnos
  if (user?.role === 'ALUMNO') {
    // Si no está activo en un grupo, redirigir a unirse (a menos que ya esté ahí)
    if (user.grupo_estado !== 'ACTIVO' && location.pathname !== '/dashboard/mi-grupo/unirse') {
      return <Navigate to="/dashboard/mi-grupo/unirse" replace />;
    }
  }

  return <>{children}</>;
};

export default StudentActiveGuard;
