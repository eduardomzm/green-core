import { useState, useMemo } from "react";
import { Search, Filter, Calendar, Recycle, User, Target } from "lucide-react";
import type { DashboardResponse, DepositoHistorial } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const MOCK_DEPOSITOS: DepositoHistorial[] = [];

const AlumnoDashboard = ({ data }: Props) => {
 
  const [filtroMaterial, setFiltroMaterial] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("");

  const depositos = data.ultimos_depositos || MOCK_DEPOSITOS;

  const depositosFiltrados = useMemo(() => {
    return depositos.filter((deposito) => {
      const coincideMaterial = filtroMaterial ? deposito.material === filtroMaterial : true;
      const coincideFecha = filtroFecha ? deposito.fecha.startsWith(filtroFecha) : true;
      return coincideMaterial && coincideFecha;
    });
  }, [depositos, filtroMaterial, filtroFecha]);

  const materialesUnicos = Array.from(new Set(depositos.map(d => d.material)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 p-4 bg-background rounded-full">
          <Target className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-textMain mb-2">Progreso de Reciclaje</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
            <span>{data.progreso.actual} piezas aportadas</span>
            <span>Meta: {data.progreso.meta}</span>
          </div>
          <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-gray-100">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(data.progreso.porcentaje, 100)}%` }}
            ></div>
          </div>
          <p className="text-right text-xs font-bold text-primary mt-2">{data.progreso.porcentaje}% Completado</p>
        </div>
      </div>

      {/* SECCIÓN DE MIS DEPÓSITOS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Cabecera y Filtros */}
        <div className="p-6 border-b border-gray-50 bg-white space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
              <Recycle className="w-5 h-5 text-secondary" strokeWidth={2} />
              Mis Depósitos Recientes
            </h3>
            <p className="text-sm text-gray-500 mt-1">Historial de tus aportaciones validadas en el centro de acopio.</p>
          </div>

          {/* Controles de Filtro */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtro de Fecha */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-textMain focus:ring-primary focus:border-primary bg-background/50 hover:bg-background transition-colors"
              />
            </div>

            {/* Filtro de Material */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={filtroMaterial}
                onChange={(e) => setFiltroMaterial(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-textMain focus:ring-primary focus:border-primary bg-background/50 hover:bg-background transition-colors appearance-none"
              >
                <option value="">Todos los materiales</option>
                {materialesUnicos.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla Minimalista */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Cantidad</th>
                <th className="px-6 py-4">Validado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {depositosFiltrados.length > 0 ? (
                depositosFiltrados.map((deposito) => (
                  <tr key={deposito.id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-textMain font-medium">
                      {new Date(deposito.fecha).toLocaleDateString('es-MX', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-primary border border-green-100">
                        {deposito.material}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-textMain font-bold">
                      {deposito.cantidad} pzs
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" strokeWidth={2} />
                      @{deposito.operador}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium text-gray-500">No se encontraron depósitos</p>
                      <p className="text-xs mt-1">Intenta cambiar los filtros de búsqueda</p>
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

export default AlumnoDashboard;