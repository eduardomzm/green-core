import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, Calendar, Filter, User } from "lucide-react";
import api from "../services/api";

interface Meta {
  id: number;
  nombre?: string;
  material_nombre?: string;
  cantidad_meta: number;
  cumplida: boolean;
  fecha_inicio: string;
  fecha_cumplimiento?: string;
  alumno_username?: string;
  material?: { nombre: string };
}

export default function Metas() {
  const [metasSistema, setMetasSistema] = useState<Meta[]>([]);
  const [metasAlumnos, setMetasAlumnos] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"SISTEMA" | "ALUMNOS">("SISTEMA");
  const [filter, setFilter] = useState<"TODAS" | "CUMPLIDAS" | "PROGRESO">("TODAS");

  const fetchMetas = async () => {
    try {
      setLoading(true);
      const [resSist, resAlum] = await Promise.all([
        api.get("metas-sistema/"),
        api.get("metas-alumnos/"),
      ]);
      setMetasSistema(resSist.data);
      setMetasAlumnos(resAlum.data);
    } catch (error) {
      console.error("Error al cargar metas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const filteredMetas = (tab === "SISTEMA" ? metasSistema : metasAlumnos).filter(m => {
    if (filter === "CUMPLIDAS") return m.cumplida;
    if (filter === "PROGRESO") return !m.cumplida;
    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-textMain flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Control de Metas
          </h2>
          <p className="text-gray-500 mt-1">Monitorea el cumplimiento de objetivos del sistema y de alumnos.</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex p-1 bg-gray-50 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setTab("SISTEMA")}
            className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === "SISTEMA" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            Metas del Sistema
          </button>
          <button
            onClick={() => setTab("ALUMNOS")}
            className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === "ALUMNOS" ? "bg-white text-secondary shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            Metas de Alumnos
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full md:w-auto bg-transparent border-none text-sm font-bold text-gray-600 outline-none cursor-pointer"
          >
            <option value="TODAS">Todas las metas</option>
            <option value="CUMPLIDAS">Solo cumplidas</option>
            <option value="PROGRESO">En progreso</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 h-48 animate-pulse shadow-sm" />
          ))
        ) : filteredMetas.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Target className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400">No hay metas que coincidan</h3>
          </div>
        ) : (
          filteredMetas.map((meta) => (
            <motion.div
              layout
              key={meta.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white p-6 rounded-3xl border transition-all relative overflow-hidden group shadow-sm ${meta.cumplida ? 'border-green-100 hover:border-green-300' : 'border-gray-100 hover:border-primary/30'}`}
            >
              {meta.cumplida && (
                <div className="absolute top-0 right-0 p-2 bg-green-500 text-white rounded-bl-2xl">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}

              <div className="mb-4">
                 <div className="flex items-center gap-2 mb-1">
                   {tab === "ALUMNOS" && <User className="w-4 h-4 text-gray-400" />}
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     {tab === "SISTEMA" ? (meta.nombre || "Meta General") : `@${meta.alumno_username}`}
                   </p>
                 </div>
                 <h4 className="text-xl font-bold text-textMain capitalize">
                    {meta.cantidad_meta} {meta.material?.nombre || meta.material_nombre || "Piezas"}
                 </h4>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Inicio: {new Date(meta.fecha_inicio).toLocaleDateString()}</span>
                  </div>
                </div>

                {meta.cumplida && meta.fecha_cumplimiento ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-green-600 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Cumplida: {new Date(meta.fecha_cumplimiento).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-orange-500 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>En progreso...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress visual representation */}
              <div className="mt-6 w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ${meta.cumplida ? 'bg-green-500' : 'bg-primary'}`}
                   style={{ width: meta.cumplida ? '100%' : '45%' }} // Placeholder for progress if we had current amount
                 />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
