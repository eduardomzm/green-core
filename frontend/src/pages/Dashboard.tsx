import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <MainLayout><div className="p-8 text-gray-500">Cargando...</div></MainLayout>;
  if (!data || !user) return <MainLayout><div className="p-8 text-red-500">Error al cargar datos</div></MainLayout>;

  return (
    <MainLayout>
      {/* Eliminamos el paréntesis extra al final de la línea de Alumno */}
      {user.role === "ADMIN" && <AdminDashboard data={data} />}
      {user.role === "OPERADOR" && <OperadorDashboard data={data} />}
      {user.role === "ALUMNO" && (
        <AlumnoDashboard data={data} nombreLogin={user.username} />
      )}
      {user.role === "TUTOR" && <TutorDashboard data={data} />}
    </MainLayout>
  );
};

export default Dashboard;