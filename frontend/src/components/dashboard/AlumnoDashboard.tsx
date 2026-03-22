import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Calendar, Recycle, User, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { buscarAlumnos } from "../../services/userService";
import type { DashboardResponse, DepositoHistorial } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const MOCK_DEPOSITOS: DepositoHistorial[] = [
  { id: 1, fecha: "2024-10-25", cantidad: 15, material: "PET", operador: "operador_juan", alumno: "alumno_mock" },
  { id: 2, fecha: "2024-10-24", cantidad: 5, material: "Cartón", operador: "operador_maria", alumno: "alumno_mock" },
];

const AlumnoDashboard = ({ data }: Props) => {
  const [filtroMaterial, setFiltroMaterial] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await buscarAlumnos(searchQuery);
          setSearchResults(results);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const depositos = data.ultimos_depositos || MOCK_DEPOSITOS;

  const depositosFiltrados = useMemo(() => {
    return depositos.filter((deposito) => {
      const coincideMaterial = filtroMaterial ? deposito.material === filtroMaterial : true;
      const coincideFecha = filtroFecha ? deposito.fecha.startsWith(filtroFecha) : true;
      return coincideMaterial && coincideFecha;
    });
  }, [depositos, filtroMaterial, filtroFecha]);

  const materialesUnicos = Array.from(new Set(depositos.map(d => d.material)));
  const metaAlumno = data.meta_alumno;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BUSCADOR DE ALUMNOS */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative z-20">
        <h2 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" strokeWidth={2} />
          Buscar Estudiantes
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Escribe el nombre o usuario de otro alumno..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-2xl text-sm text-textMain focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 hover:bg-white transition-colors outline-none"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Dropdown de resultados */}
        {searchResults.length > 0 && searchQuery.trim().length > 2 && (
          <div className="absolute top-full left-6 right-6 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {searchResults.map((res: any) => (
                <li key={res.username}>
                  <Link 
                    to={`/dashboard/perfil/${res.username}`}
                    className="flex items-center gap-4 p-4 hover:bg-blue-50/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform border border-gray-200">
                      {/* Aquí idealmente renderizas dinámicamente si tienes AVATARS exportado, sino un placeholder */}
                      <User className="w-full h-full p-2 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {res.first_name} {res.primer_apellido}
                      </h4>
                      <p className="text-xs font-medium text-gray-500">@{res.username} {res.carrera ? `• ${res.carrera}` : ''}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* META GLOBAL */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 p-5 bg-green-50 rounded-2xl">
          <Target className="w-10 h-10 text-primary" strokeWidth={2} />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-textMain mb-2">Tu Progreso de Reciclaje</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
            <span>{data.progreso.actual} piezas aportadas</span>
            <span>Meta: {data.progreso.meta}</span>
          </div>
          <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-gray-100">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(data.progreso.porcentaje, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-right text-xs font-bold text-primary mt-2">{data.progreso.porcentaje}% Completado</p>
        </div>
      </div>

      {/* META ASIGNADA POR TUTOR (si existe) */}
      {metaAlumno && (
        <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-accent opacity-5">
            <Target className="w-40 h-40" />
          </div>
          <div className="flex-shrink-0 p-5 bg-orange-50 rounded-2xl relative z-10">
            <Target className="w-10 h-10 text-accent" strokeWidth={2} />
          </div>
          <div className="flex-1 w-full relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-textMain">Meta Asignada por tu Tutor</h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-orange-50 text-accent border border-orange-100">
                {metaAlumno.material}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
              <span>{metaAlumno.actual} {metaAlumno.material_unidad}s aportados</span>
              <span>Meta: {metaAlumno.cantidad_meta} {metaAlumno.material_unidad}s</span>
            </div>
            <div className="w-full bg-orange-50 rounded-full h-3 overflow-hidden border border-orange-100">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${Math.min(metaAlumno.porcentaje, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-right text-xs font-bold text-accent mt-2">{metaAlumno.porcentaje}% Completado</p>
          </div>
        </div>
      )}


  
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-50 bg-white space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
              <Recycle className="w-5 h-5 text-secondary" strokeWidth={2} />
              Mis Depósitos Recientes
            </h3>
            <p className="text-sm text-gray-500 mt-1">Historial de tus aportaciones validadas.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-textMain focus:ring-primary focus:border-primary bg-background/50 hover:bg-white transition-colors outline-none"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={filtroMaterial}
                onChange={(e) => setFiltroMaterial(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-textMain focus:ring-primary focus:border-primary bg-background/50 hover:bg-white transition-colors appearance-none outline-none"
              >
                <option value="">Todos los materiales</option>
                {materialesUnicos.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4 text-right">Cantidad</th>
                <th className="px-6 py-4 text-right">Validado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {depositosFiltrados.length > 0 ? (
                depositosFiltrados.map((deposito) => (
                  <tr key={deposito.id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(deposito.fecha).toLocaleDateString('es-MX', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-green-50 text-primary border border-green-100">
                        {deposito.material}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-textMain font-black text-right">
                      {deposito.cantidad} <span className="text-gray-400 text-xs font-semibold">pzs</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium flex items-center justify-end gap-2">
                      <User className="w-4 h-4" strokeWidth={2} />
                      {deposito.operador}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium text-gray-500">No se encontraron depósitos</p>
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