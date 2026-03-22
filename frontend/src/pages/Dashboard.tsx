import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import { getMe } from "../services/userService";
import type { DashboardResponse } from "../types/dashboard.types";
import type { MeResponse } from "../types/user.types";
import { getMetasSistema, type MetaSistema } from "../services/reciclajeService";
import { Target } from "lucide-react";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import OperadorDashboard from "../components/dashboard/OperadorDashboard";
import AlumnoDashboard from "../components/dashboard/AlumnoDashboard";
import TutorDashboard from "../components/dashboard/TutorDashboard";

const Dashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [metas, setMetas] = useState<MetaSistema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, userData, metasData] = await Promise.all([
          getDashboard(),
          getMe(),
          getMetasSistema()
        ]);

        setData(dashboardData);
        setUser(userData);
        setMetas(metasData.filter((m: MetaSistema) => m.activa));
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
    <div className="space-y-6">
      
      {/* Banner Minimalista de Bienvenida */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ¡Hola, {user.username}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Panel de control principal <span className="text-gray-300 mx-2">•</span> 
            <span className="text-black font-semibold uppercase tracking-wider text-xs">{user.role}</span>
          </p>
        </div>
      </div>

      {/* METAS GLOBALES PUBLICAS */}
      {metas.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 mb-6 shadow-sm">
          <h2 className="text-lg font-black text-emerald-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            Metas Globales Activas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metas.map((m) => (
              <div key={m.id} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-emerald-200/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-1 block">
                    {m.material_nombre}
                  </span>
                  <h3 className="font-bold text-gray-800 leading-tight">
                    {m.nombre}
                  </h3>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  {/* Todo: Cuando haya progreso global implementado, aquí iría una barra de progreso. Por ahora mostramos la cantidad */}
                  <span className="text-3xl font-black text-emerald-700 tracking-tighter">
                    {m.cantidad_meta.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                    Objetivo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Renderizado de los sub-paneles por rol */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {user.role === "ADMIN" && <AdminDashboard data={data} />}
        {user.role === "OPERADOR" && <OperadorDashboard data={data} />}
        {user.role === "ALUMNO" && <AlumnoDashboard data={data} />}
        {user.role === "TUTOR" && <TutorDashboard data={data} />}
      </div>

    </div>
  );
};

export default Dashboard;