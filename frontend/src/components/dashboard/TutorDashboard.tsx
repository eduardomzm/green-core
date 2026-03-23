import { Target, Users, ArrowRight, Recycle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const TutorDashboard = ({ data }: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Progreso de la Meta Global */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-primary opacity-5">
            <Target className="w-40 h-40" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-green-50 rounded-xl text-primary">
                <Target className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-textMain text-sm uppercase tracking-wider">Meta Global</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-black text-textMain">{data.progreso.actual}</span>
              <span className="text-gray-500 text-sm font-medium mb-1">/ {data.progreso.meta} pzs</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-primary mb-1.5">
              <span>Progreso</span>
              <span>{data.progreso.porcentaje}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(data.progreso.porcentaje, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Aportación del Grupo */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-blue-50 rounded-xl text-secondary">
                <TrendingUp className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-textMain text-sm uppercase tracking-wider">Aportación del Grupo</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Tu grupo ha reciclado un total de:</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-textMain">{data.estadisticas.total_piezas}</span>
              <span className="text-gray-500 text-sm font-bold mb-1.5">piezas</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Acceso Directo a "Mi Grupo" */}
        <div className="bg-primary p-6 rounded-3xl shadow-md text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl text-white backdrop-blur-sm">
                <Users className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Gestión de Alumnos</h3>
            </div>
            <p className="text-primary-100 text-sm mt-3 opacity-90">
              Visualiza el progreso individual de tus alumnos tutorados y asígnales metas personales.
            </p>
          </div>
          
          {/* Este Link nos llevará a la nueva vista que vamos a crear */}
          <Link 
            to="/dashboard/mi-grupo" 
            className="mt-6 flex items-center justify-between w-full bg-white text-primary font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Ver Mi Grupo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* SECCIÓN: ÚLTIMOS DEPÓSITOS DEL GRUPO */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <Recycle className="w-5 h-5 text-accent" strokeWidth={2} />
          <div>
            <h3 className="text-lg font-bold text-textMain">Actividad Reciente del Grupo</h3>
            <p className="text-sm text-gray-500">Últimos depósitos realizados por tus alumnos tutorados.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Alumno</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4 text-right">Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.ultimos_depositos && data.ultimos_depositos.length > 0 ? (
                data.ultimos_depositos.slice(0, 8).map((deposito) => (
                  <tr key={deposito.id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium whitespace-nowrap">
                      {new Date(deposito.fecha).toLocaleDateString('es-MX', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-textMain">
                      {/* Nota: si el backend no manda 'alumno', mostrará un guión temporalmente */}
                      {(deposito as any).alumno || "Alumno"} 
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-orange-50 text-accent border border-orange-100">
                        {deposito.material}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-textMain text-right">
                      {deposito.cantidad} <span className="text-gray-400 text-xs font-semibold">pzs</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Recycle className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium text-gray-500">Sin actividad reciente</p>
                      <p className="text-xs mt-1">Los alumnos de tu grupo aún no han registrado depósitos.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default TutorDashboard;