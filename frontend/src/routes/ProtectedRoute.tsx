import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/Sidebar"; // Ajusta la ruta si tu Sidebar está en otra carpeta
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    
    <div className="flex min-h-screen bg-background font-sans text-textMain">
      
      
      <Sidebar />

      
      <main className="flex-1 ml-64">
        {children}
      </main>

    </div>
  );
};

export default ProtectedRoute;