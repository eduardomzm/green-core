import type { DashboardResponse } from "../../types/dashboard.types";
import { UserPlus, History, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  data: DashboardResponse;
}

const AdminDashboard = ({ data }: Props) => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-textMain">Resumen General</h2>
        <p className="text-gray-500">Vista rápida del estado del reciclaje en la Universidad.</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-primary">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Piezas</p>
          <p className="text-4xl font-extrabold text-textMain mt-2">
            {data.estadisticas.total_piezas} <span className="text-lg text-primary">pz</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-secondary">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Depósitos Realizados</p>
          <p className="text-4xl font-extrabold text-textMain mt-2">
            {data.estadisticas.total_depositos}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-accent">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Meta Global</p>
          <p className="text-4xl font-extrabold text-textMain mt-2">
            {data.progreso.meta} <span className="text-lg text-accent">pz</span>
          </p>
        </div>
      </div>

      {/* Vistas Previas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Últimos Registrados */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-textMain flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Últimos Registrados
            </h3>
            <Link to="/dashboard/usuarios" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-50">
                  <th className="px-6 py-3 font-bold">Usuario</th>
                  <th className="px-6 py-3 font-bold">Rol</th>
                  <th className="px-6 py-3 font-bold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.ultimos_usuarios?.slice(0, 5).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-textMain">{u.username}</p>
                      <p className="text-[10px] text-gray-400 lowercase">{u.first_name} {u.primer_apellido}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'OPERADOR' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-gray-500">
                      {new Date(u.date_joined).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!data.ultimos_usuarios || data.ultimos_usuarios.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">No hay registros recientes.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Últimos Depósitos */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-textMain flex items-center gap-2">
              <History className="w-5 h-5 text-secondary" />
              Últimos Depósitos
            </h3>
            <Link to="/dashboard/depositos" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              Ir a depósitos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-50">
                  <th className="px-6 py-3 font-bold">Alumno</th>
                  <th className="px-6 py-3 font-bold">Material</th>
                  <th className="px-6 py-3 font-bold text-center">Cant.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.ultimos_depositos?.slice(0, 5).map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-textMain">{d.alumno}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-gray-600 capitalize">{d.material}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-secondary">{d.cantidad}</span>
                    </td>
                  </tr>
                ))}
                {(!data.ultimos_depositos || data.ultimos_depositos.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">No hay depósitos recientes.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;