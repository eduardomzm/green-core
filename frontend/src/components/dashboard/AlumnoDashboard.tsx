import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Recycle, User, Target, Users, PartyPopper, Flame } from "lucide-react";
import { triggerConfettiBurst } from "../../utils/confetti";
import { Link } from "react-router-dom";
import { buscarAlumnos } from "../../services/userService";
import UserAvatar from "../common/UserAvatar";
import type { DashboardResponse, DepositoHistorial } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
  user?: any;
}

const MOCK_DEPOSITOS: DepositoHistorial[] = [
  { id: 1, fecha: "2024-10-25", cantidad: 15, material: "PET", operador: "operador_juan", alumno: "alumno_mock" },
  { id: 2, fecha: "2024-10-24", cantidad: 5, material: "Cartón", operador: "operador_maria", alumno: "alumno_mock" },
];

const AlumnoDashboard = ({ data, user }: Props) => {
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

  const getMonthName = () => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const now = new Date();
    // Alineación ISO: El jueves de la semana actual determina el mes
    const day = now.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
    const isoDay = day === 0 ? 7 : day;
    const thursday = new Date(now);
    thursday.setDate(now.getDate() + (4 - isoDay));
    return months[thursday.getMonth()];
  };

  const formatDateRange = (inicio: string, fin: string) => {
    const d1 = new Date(inicio + 'T00:00:00'); // Ensure local date
    const d2 = new Date(fin + 'T00:00:00');
    const day1 = d1.getDate().toString().padStart(2, '0');
    const day2 = d2.getDate().toString().padStart(2, '0');
    // Abbreviated month in Spanish
    const month = d1.toLocaleString('es-ES', { month: 'short' }).replace('.', '');
    return `${day1}-${day2} ${month}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BUSCADOR DE ALUMNOS */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl relative z-20">
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
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform border border-gray-200">
                      <UserAvatar avatar={res.avatar} />
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

      {/* RACHA SEMANAL DEL MES ACTUAL */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex-shrink-0 p-5 bg-orange-50 rounded-2xl">
          <Flame className="w-10 h-10 text-orange-500 fill-orange-500" strokeWidth={2} />
        </div>
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">Racha de {getMonthName()}</h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Mantén tu racha activa reciclando cada semana.</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-3xl font-black text-orange-600 leading-none">{data.racha_actual ?? user?.racha_actual ?? 0}</span>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">Semanas Seguidas</span>
            </div>
          </div>

          {/* Grilla de Semanas (4 periodos fijos) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.semanas_racha?.map((semana) => (
              <div key={semana.n_semana} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-transparent hover:bg-white/50 transition-colors">
                <motion.div 
                  initial={false}
                  animate={semana.activa ? { 
                    scale: [1, 1.1, 1],
                    filter: ["drop-shadow(0 0 0px #f97316)", "drop-shadow(0 0 8px #f97316)", "drop-shadow(0 0 0px #f97316)"]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative ${
                    semana.activa 
                      ? "bg-orange-50 border-orange-200 text-orange-500 shadow-lg shadow-orange-500/10" 
                      : semana.es_actual 
                        ? "bg-gray-50 border-gray-200 text-gray-300 border-dashed"
                        : "bg-gray-50 border-gray-100 text-gray-200"
                  }`}
                >
                  <Flame className={`w-6 h-6 ${semana.activa ? "fill-orange-500" : "fill-transparent opacity-30"}`} />
                  {semana.es_actual && !semana.activa && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </motion.div>
                <div className="text-center flex flex-col gap-0.5">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${semana.es_actual ? 'text-blue-500' : 'text-gray-400'}`}>
                    Semana {semana.n_semana}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">
                    {formatDateRange(semana.inicio, semana.fin)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* META ASIGNADA POR TUTOR (si existe) */}
      {metaAlumno && (
        <div className="glass-panel p-8 rounded-3xl border-orange-100/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
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
            <p 
              onClick={() => metaAlumno.porcentaje >= 100 && triggerConfettiBurst()}
              className={`text-right text-xs font-bold mt-2 flex items-center justify-end gap-1 ${metaAlumno.porcentaje >= 100 ? 'text-accent cursor-pointer hover:scale-110 transition-transform' : 'text-accent'}`}
            >
              {metaAlumno.porcentaje >= 100 && <PartyPopper className="w-3 h-3" />}
              {metaAlumno.porcentaje}% Completado
            </p>
          </div>
        </div>
      )}


  
      <div className="glass-panel rounded-3xl overflow-hidden">
        
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