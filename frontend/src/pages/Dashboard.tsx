import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { getDashboard } from "../services/dashboardService";
import type { DashboardResponse } from "../types/dashboard.types";
import { useAuth } from "../hooks/useAuth";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import OperadorDashboard from "../components/dashboard/OperadorDashboard";
import AlumnoDashboard from "../components/dashboard/AlumnoDashboard";
import TutorDashboard from "../components/dashboard/TutorDashboard";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardData, userData] = await Promise.all([
          getDashboard(),
          getMe(),
        ]);

        setData(dashboardData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <p>Cargando...</p>
      </MainLayout>
    );
  }

  if (!data || !user) {
    return (
      <MainLayout>
        <p>Error cargando información</p>
      </MainLayout>
    );
  }

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