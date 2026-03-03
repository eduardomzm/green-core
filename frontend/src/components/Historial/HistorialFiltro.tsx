import { Search, RotateCcw, Filter } from "lucide-react";

const HistoryFilters = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-6 text-gray-700">
        <Filter size={18} className="text-green-600" />
        <h3 className="font-bold">Filtros de Búsqueda</h3>
      </div>

      {/* GRID DE FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Búsqueda por Texto */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar material..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
        </div>

        {/* Selector de Material */}
        <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none">
          <option value="">Todos los materiales</option>
          <option value="pet">PET</option>
          <option value="aluminio">Aluminio</option>
          <option value="carton">Cartón</option>
        </select>

        {/* Selector de Estado */}
        <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none">
          <option value="">Cualquier estado</option>
          <option value="validado">Validado</option>
          <option value="pendiente">Pendiente</option>
          <option value="rechazado">Rechazado</option>
        </select>

        {/* Fecha Inicio */}
        <div className="flex flex-col">
          <input 
            type="date" 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" 
          />
        </div>

        {/* Fecha Fin */}
        <div className="flex flex-col">
          <input 
            type="date" 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" 
          />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-end gap-3 border-t border-gray-50 pt-4">
        <button className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
          <RotateCcw size={16} />
          Restablecer
        </button>
        <button className="px-6 py-2 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 shadow-lg shadow-green-700/20 transition-all">
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default HistoryFilters;