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
        const dashboardData = await getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (authLoading || loading) {
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
      <h1>Dashboard</h1>
      <p>Bienvenido {user.username}</p>
      <p>Rol: {user.role}</p>

      {user.role === "ADMIN" && <AdminDashboard data={data} />}
      {user.role === "OPERADOR" && <OperadorDashboard data={data} />}
      {user.role === "ALUMNO" && <AlumnoDashboard data={data} />}
      {user.role === "TUTOR" && <TutorDashboard data={data} />}
    </MainLayout>
  );
};

export default Dashboard;
