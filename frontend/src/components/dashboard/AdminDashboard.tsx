import type { DashboardResponse } from "../../types/dashboard.types";
import { UserPlus, History, ArrowRight, BarChart3, Users, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  data: DashboardResponse;
}

const AdminDashboard = ({ data }: Props) => {
  // Cálculos para las tarjetas
  const totalAlumnos = data.estadisticas.total_alumnos || 0;
  const alumnosActivos = data.estadisticas.alumnos_participantes || 0;
  const porcentajeParticipacion = totalAlumnos > 0 
    ? Math.round((alumnosActivos / totalAlumnos) * 100) 
    : 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-textMain tracking-tight">Resumen General</h2>
          <p className="text-gray-500 font-medium">Panel de control y métricas de impacto ambiental.</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-primary border border-primary/20">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">Actualizado ahora</span>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Impacto Total */}
        <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Impacto Total</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-textMain">{data.estadisticas.total_piezas}</span>
              <span className="text-sm font-bold text-primary uppercase">piezas</span>
            </div>
            <p className="text-xs font-bold text-gray-400 mt-4 flex items-center gap-1.5">
              Material estrella: <span className="text-primary capitalize">{data.estadisticas.material_top || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Participación */}
        <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Participación</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-textMain">{alumnosActivos}</span>
              <span className="text-sm font-bold text-secondary uppercase">de {totalAlumnos} alumnos</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${porcentajeParticipacion}%` }}></div>
              </div>
              <span className="text-[10px] font-black text-secondary">{porcentajeParticipacion}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Meta Global */}
        <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Meta Global</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-textMain">{data.progreso.porcentaje}%</span>
              <span className="text-xs font-bold text-accent uppercase">completado</span>
            </div>
            <p className="text-xs font-bold text-gray-400 mt-4">
              Faltan <span className="text-accent">{Math.max(0, data.progreso.meta - data.progreso.actual)}</span> piezas para el objetivo
            </p>
          </div>
        </div>
      </div>

      {/* Vistas Previas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Últimos Registrados */}
        <div className="glass-panel rounded-3xl overflow-hidden">
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
                {data.ultimos_usuarios?.slice(0, 5).map((u: any) => (
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
        <div className="glass-panel rounded-3xl overflow-hidden">
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
                {data.ultimos_depositos?.slice(0, 5).map((d: any) => (
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