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
        console.error("Error loading dashboard");
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