import { useState, useEffect, useCallback } from "react";
import { getMateriales, getMisDepositos, type Material } from "../services/reciclajeService";
import { 
  Search, 
  Calendar, 
  Recycle, 
  ChevronLeft, 
  ChevronRight,
  History,
  Trash2,
  User as UserIcon
} from "lucide-react";

export default function Historial() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Estados para el historial y filtros
  const [depositosData, setDepositosData] = useState<any>(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState({
    fecha: "",
    material: ""
  });

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingTable(true);
      const params: any = {
        page,
        ...filters
      };
      // Eliminar filtros vacíos
      Object.keys(params).forEach(key => (params[key] === "" || params[key] === null) && delete params[key]);
      
      const data = await getMisDepositos(params);
      setDepositosData(data);
    } catch (error) {
      console.error("Error al cargar mis depósitos", error);
    } finally {
      setLoadingTable(false);
    }
  }, [page, filters]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingInitial(true);
        const materialesData = await getMateriales();
        setMateriales(materialesData.filter((m: Material) => m.activo));
        await fetchHistory();
      } catch (error) {
        console.error("Error al cargar datos iniciales", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchInitialData();
  }, []);

  // Refetch cuando cambian los filtros o la página
  useEffect(() => {
    if (!loadingInitial) {
      fetchHistory();
    }
  }, [page, filters, fetchHistory, loadingInitial]);

  const clearFilters = () => {
    setFilters({
      fecha: "",
      material: ""
    });
    setPage(1);
  };

  if (loadingInitial) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold text-lg">Cargando tu historial de depósitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* SECCIÓN DE HISTORIAL */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-textMain flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <History className="w-8 h-8" />
              </div>
              Mis Depósitos
            </h2>
            <p className="text-gray-500 mt-2">Consulta y filtra tu historial personal de reciclaje.</p>
          </div>
          
          <button 
            onClick={clearFilters}
            className="text-sm font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 transition-colors self-start md:self-auto bg-white py-2 px-4 rounded-xl border border-gray-100 shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Limpiar filtros
          </button>
        </div>

        {/* CONTROLES DE FILTRO */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-9xl opacity-5 pointer-events-none">
            <Recycle className="w-64 h-64 text-green-500" />
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" /> Filtrar por Fecha
            </label>
            <input 
              type="date"
              value={filters.fecha}
              onChange={(e) => { setFilters({...filters, fecha: e.target.value}); setPage(1); }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all"
            />
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <Recycle className="w-4 h-4 text-secondary" /> Filtrar por Material
            </label>
            <select 
              value={filters.material}
              onChange={(e) => { setFilters({...filters, material: e.target.value}); setPage(1); }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all appearance-none"
            >
              <option value="">Todos los materiales</option>
              {materiales.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLA DE RESULTADOS */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] relative">
          {loadingTable && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5">Material</th>
                  <th className="px-8 py-5 text-center">Cantidad</th>
                  <th className="px-8 py-5">Registrado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {depositosData?.results && depositosData.results.length > 0 ? (
                  depositosData.results.map((d: any) => (
                    <tr key={d.id} className="hover:bg-green-50/30 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(d.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-xs font-medium text-gray-400 mt-0.5">
                          {new Date(d.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 uppercase inline-block">
                          {d.material_nombre}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-2xl font-black text-secondary">{d.cantidad}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                              <UserIcon className="w-4 h-4" />
                           </div>
                           <p className="text-sm font-semibold text-gray-600">@{d.operador}</p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                       {!loadingTable && (
                         <div className="flex flex-col items-center justify-center text-gray-300">
                           <Search className="w-16 h-16 mb-4 opacity-20" />
                           <p className="text-xl font-bold text-gray-400">No se encontraron depósitos</p>
                           <p className="text-sm text-gray-400 mt-2">Prueba cambiando los filtros o fechas.</p>
                         </div>
                       )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          {depositosData && depositosData.count > 10 && (
            <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Mostrando página {page} - {depositosData.count} resultados en total
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-secondary shadow-sm">
                  {page}
                </div>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!depositosData.next}
                  className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}