import { useState, useEffect, useCallback } from "react";
import { getUsers, getCarreras, getGrupos, type User, type Carrera, type Grupo } from "../services/userService";
import { getMateriales, createDeposito, getDepositos, type Material, type Deposito, type PaginatedDepositos } from "../services/reciclajeService";
import { 
  Search, 
  Calendar, 
  User as UserIcon, 
  GraduationCap, 
  Users, 
  Recycle, 
  ChevronLeft, 
  ChevronRight,
  History,
  Trash2
} from "lucide-react";

const Depositos = () => {
  // Estados para el formulario de registro
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [alumnos, setAlumnos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<User | null>(null);
  const [errorAlumno, setErrorAlumno] = useState("");
  const [depositoForm, setDepositoForm] = useState({ material_id: "", cantidad: "" });
  const [depositoMsg, setDepositoMsg] = useState({ text: "", type: "" }); 

  // Estados para el historial y filtros
  const [depositosData, setDepositosData] = useState<PaginatedDepositos | null>(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  
  const [filters, setFilters] = useState({
    fecha: "",
    grupo: "",
    carrera: "",
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
      
      const data = await getDepositos(params);
      setDepositosData(data);
    } catch (error) {
      console.error("Error al cargar historial", error);
    } finally {
      setLoadingTable(false);
    }
  }, [page, filters]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [materialesData, usuariosData, carrerasData, gruposData] = await Promise.all([
          getMateriales(),
          getUsers({ role: 'ALUMNO', page_size: 1000 }), // Intentar traer todos los alumnos para la búsqueda local
          getCarreras(),
          getGrupos()
        ]);
        
        setMateriales(materialesData);
        setAlumnos(usuariosData.results || usuariosData); // Manejar si viene paginado o no
        setCarreras(carrerasData);
        setGrupos(gruposData);
        
        await fetchHistory();
      } catch (error) {
        console.error("Error al cargar datos iniciales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []); // Solución: Solo se ejecuta al montar para evitar que 'setLoading(true)' ocurra en cada filtro

  // Refetch cuando cambian los filtros o la página
  useEffect(() => {
    if (!loading) {
      fetchHistory();
    }
  }, [page, filters, fetchHistory, loading]);

  const buscarAlumno = () => {
    setErrorAlumno("");
    setAlumnoEncontrado(null);
    setDepositoMsg({ text: "", type: "" });
    
    if (!matriculaBusqueda.trim()) return;

    const match = alumnos.find(a => a.matricula === matriculaBusqueda.trim());
    
    if (match) {
      setAlumnoEncontrado(match);
    } else {
      setErrorAlumno("No se encontró ningún alumno con esta matrícula.");
    }
  };

  const handleDepositoSubmit = async () => {
    if (!alumnoEncontrado || !depositoForm.material_id || !depositoForm.cantidad) return;
    setDepositoMsg({ text: "Registrando...", type: "loading" });

    try {
      await createDeposito({
        alumno: alumnoEncontrado.id,
        material: parseInt(depositoForm.material_id),
        cantidad: parseInt(depositoForm.cantidad) 
      });
      
      setDepositoMsg({ text: "¡Depósito registrado con éxito! ", type: "success" });
      setDepositoForm({ material_id: "", cantidad: "" });
      setMatriculaBusqueda("");
      setAlumnoEncontrado(null);
      
      // Recargar historial
      fetchHistory();
      
      setTimeout(() => setDepositoMsg({ text: "", type: "" }), 3000);
    } catch (error: any) {
      setDepositoMsg({ text: "Error al registrar el depósito.", type: "error" });
    }
  };

  const clearFilters = () => {
    setFilters({
      fecha: "",
      grupo: "",
      carrera: "",
      material: ""
    });
    setPage(1);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold text-lg">Cargando módulos de depósitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 pb-24">
      
      {/* SECCIÓN DE REGISTRO */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-textMain">Depósitos</h2>
          <p className="text-gray-500 mt-1">Registra nuevas aportaciones de reciclaje de los alumnos.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-primary relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none">
            <Recycle className="w-64 h-64" />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">
                <PlusIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-textMain">Nuevo Registro</h3>
            </div>
            {depositoMsg.text && (
              <span className={`text-sm font-bold px-4 py-2 rounded-xl animate-fade-in ${depositoMsg.type === 'success' ? 'bg-green-100 text-green-700' : depositoMsg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                {depositoMsg.text}
              </span>
            )}
          </div>
          
          <form className="space-y-8 relative z-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">1. Identificar Alumno</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ingresa la matrícula del alumno..."
                    value={matriculaBusqueda}
                    onChange={(e) => setMatriculaBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarAlumno())}
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white shadow-sm transition-all" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={buscarAlumno}
                  className="bg-primary hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Buscar
                </button>
              </div>
              
              {alumnoEncontrado && (
                <div className="mt-4 px-5 py-4 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <UserIcon className="w-5 h-5" />
                  <div>
                    <p>Alumno seleccionado: <span className="text-green-800">{alumnoEncontrado.first_name} {alumnoEncontrado.primer_apellido}</span></p>
                    <p className="text-[10px] opacity-70 font-medium">Matrícula: {alumnoEncontrado.matricula}</p>
                  </div>
                </div>
              )}
              {errorAlumno && (
                <div className="mt-4 px-5 py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {errorAlumno}
                </div>
              )}
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${!alumnoEncontrado ? 'opacity-30 blur-[1px] pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">2. Material</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Recycle className="h-5 w-5 text-gray-400" />
                  </div>
                  <select 
                    value={depositoForm.material_id}
                    onChange={(e) => setDepositoForm({...depositoForm, material_id: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50 hover:bg-white transition-colors appearance-none"
                  >
                    <option value="">Selecciona el material...</option>
                    {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">3. Cantidad</label>
                <input 
                  type="number" min="1" placeholder="Cantidad de piezas"
                  value={depositoForm.cantidad}
                  onChange={(e) => setDepositoForm({...depositoForm, cantidad: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50 hover:bg-white transition-colors" 
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleDepositoSubmit}
              disabled={!alumnoEncontrado || !depositoForm.material_id || !depositoForm.cantidad || depositoMsg.type === 'loading'}
              className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-6 text-lg"
            >
              {depositoMsg.type === 'loading' ? 'Procesando...' : 'Confirmar Registro'}
            </button>
          </form>
        </div>
      </div>

      <hr className="border-gray-100 max-w-6xl mx-auto" />

      {/* SECCIÓN DE HISTORIAL */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-textMain flex items-center gap-2">
              <History className="w-7 h-7 text-secondary" />
              Historial de Depósitos
            </h2>
            <p className="text-gray-500 mt-1">Consulta y filtra todos los registros realizados.</p>
          </div>
          
          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors self-start md:self-auto"
          >
            <Trash2 className="w-3 h-3" /> Limpiar filtros
          </button>
        </div>

        {/* CONTROLES DE FILTRO */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Fecha
            </label>
            <input 
              type="date"
              value={filters.fecha}
              onChange={(e) => { setFilters({...filters, fecha: e.target.value}); setPage(1); }}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>


          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> Carrera
            </label>
            <select 
              value={filters.carrera}
              onChange={(e) => { setFilters({...filters, carrera: e.target.value, grupo: ""}); setPage(1); }}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-secondary outline-none"
            >
              <option value="">Todas las carreras</option>
              {carreras.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Grupo
            </label>
            <select 
              value={filters.grupo}
              onChange={(e) => { setFilters({...filters, grupo: e.target.value}); setPage(1); }}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-secondary outline-none"
            >
              <option value="">Todos los grupos</option>
              {grupos
                .filter(g => filters.carrera === "" || g.carrera === parseInt(filters.carrera))
                .map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))
              }
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <Recycle className="w-3 h-3" /> Material
            </label>
            <select 
              value={filters.material}
              onChange={(e) => { setFilters({...filters, material: e.target.value}); setPage(1); }}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-secondary outline-none"
            >
              <option value="">Todos los materiales</option>
              {materiales.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLA DE RESULTADOS */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] relative">
          {loadingTable && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Alumno</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4 text-center">Cantidad</th>
                  <th className="px-6 py-4">Operador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {depositosData?.results && depositosData.results.length > 0 ? (
                  depositosData.results.map((d: Deposito) => (
                    <tr key={d.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-xs font-medium text-gray-600">
                          {new Date(d.fecha).toLocaleDateString()}
                        </p>
                        <p className="text-[9px] text-gray-400">
                          {new Date(d.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-textMain">{d.alumno_info?.first_name} {d.alumno_info?.primer_apellido}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Mat: {d.alumno_info?.matricula || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100 uppercase">
                          {d.material_nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-black text-secondary">{d.cantidad}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                              <UserIcon className="w-3.5 h-3.5" />
                           </div>
                           <p className="text-xs font-semibold text-gray-500">@{d.operador_info?.username}</p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                       {!loadingTable && (
                         <div className="flex flex-col items-center justify-center text-gray-300">
                           <Search className="w-12 h-12 mb-3 opacity-20" />
                           <p className="text-sm font-bold">No se encontraron depósitos con estos filtros</p>
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
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Mostrando {depositosData.results.length} de {depositosData.count} resultados
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-secondary">
                  {page}
                </div>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!depositosData.next}
                  className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for icon
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Depositos;