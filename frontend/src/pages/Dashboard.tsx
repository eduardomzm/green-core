import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import { getMe } from "../services/userService";
import type { DashboardResponse } from "../types/dashboard.types";
import type { MeResponse } from "../types/user.types";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import OperadorDashboard from "../components/dashboard/OperadorDashboard";
import AlumnoDashboard from "../components/dashboard/AlumnoDashboard";
import TutorDashboard from "../components/dashboard/TutorDashboard";

const Dashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, userData] = await Promise.all([
          getDashboard(),
          getMe(),
        ]);

        setData(dashboardData);
        setUser(userData);
      } catch (error) {
        console.error("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <p className="text-gray-500 font-bold animate-pulse text-lg">Cargando tu panel de control...</p>
      </div>
    );
  }

  if (!data || !user) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold border border-red-200">
          Error cargando información. Por favor, recarga la página.
        </div>
      </div>
    );
  }

  return (
 
    <div className="p-8 space-y-6">
      
     
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">¡Hola de nuevo, {user.username}!</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Estás en el panel de <span className="text-secondary font-bold uppercase">{user.role}</span></p>
        </div>
        <div className="text-4xl animate-bounce-slow"></div>
      </div>

      {user.role === "ADMIN" && <AdminDashboard data={data} />}
      {user.role === "OPERADOR" && <OperadorDashboard data={data} />}
      {user.role === "ALUMNO" && <AlumnoDashboard data={data} />}
      {user.role === "TUTOR" && <TutorDashboard data={data} />}

    </div>
  );
};

export default Dashboard;