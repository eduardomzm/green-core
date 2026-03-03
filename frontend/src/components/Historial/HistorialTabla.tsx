import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Search, Scale, Calendar } from "lucide-react";
import { EstadoBadge } from "./EstadoBadge";

interface Deposito {
  fecha: string;
  material: string;
  peso: number;
  puntos: number;
  estado: string;
}

const depositos: Deposito[] = [
  { fecha: "2026-02-28", material: "Plástico", peso: 1.5, puntos: 15, estado: "Validado" },
  { fecha: "2026-02-25", material: "Aluminio", peso: 0.7, puntos: 7, estado: "Rechazado" },
  { fecha: "2026-02-24", material: "Vidrio", peso: 3.2, puntos: 16, estado: "Pendiente" },

];

const ITEMS_PER_PAGE = 5;

const HistorialTabla = () => {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const deposFiltrados = depositos.filter((d) => 
    d.material.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.max(1, Math.ceil(deposFiltrados.length / ITEMS_PER_PAGE));
  const inicio = (paginaActual - 1) * ITEMS_PER_PAGE;
  const deposPagina = deposFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <Filter size={18} className="text-green-600" />
        <h3 className="font-bold">Filtros y Búsqueda</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por material (ej. Plástico)..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 outline-none"
            value={busqueda}
            onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4 flex items-center gap-1">
                <Calendar size={12} /> Fecha
              </th>
              <th className="px-6 py-4">Material</th>
              <th className="px-6 py-4 text-center flex items-center justify-center gap-1">
                <Scale size={12} /> Peso (kg)
              </th>
              <th className="px-6 py-4 text-center">Puntos</th>
              <th className="px-6 py-4 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deposPagina.map((d, i) => (
              <tr key={i} className="hover:bg-green-50/30 transition-colors">
                <td className="px-6 py-4 text-gray-600">{d.fecha}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{d.material}</td>
                <td className="px-6 py-4 text-center text-gray-600">{d.peso.toFixed(2)}</td>
                <td className="px-6 py-4 text-center font-black text-green-700">{d.puntos}</td>
                <td className="px-6 py-4 text-right">
                  <EstadoBadge estado={d.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <p className="text-xs text-gray-400 font-medium">
          Mostrando {deposPagina.length} de {deposFiltrados.length} registros
        </p>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-gray-700">
            {paginaActual} / {totalPaginas}
          </span>
          <button 
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialTabla;