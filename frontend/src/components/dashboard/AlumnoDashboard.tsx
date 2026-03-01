import { User, Package } from "lucide-react";
import type { DashboardResponse } from "../../types/dashboard.types";

interface AlumnoProps {
  data: DashboardResponse;
  nombreLogin: string;
}

const AlumnoDashboard = ({ data, nombreLogin }: AlumnoProps) => {
  const { usuario, estadisticas, por_material, progreso } = data || {};

  return (
    <div className="max-w-[1400px] animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Perfil del Alumno</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    
        <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
            <div className="bg-green-50 p-2 rounded-lg">
              <User size={24} className="text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Datos Personales y Académicos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 text-base">
            <div>
              <p className="text-gray-400 font-medium mb-1">Nombre Completo</p>
              <p className="font-bold text-gray-800 text-lg">
                {usuario?.nombre || nombreLogin}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Matrícula</p>
              <p className="font-bold text-gray-800 text-lg">{usuario?.matricula || "---"}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Carrera Universitaria</p>
              <p className="font-bold text-gray-800 text-lg">{usuario?.carrera || "---"}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Semestre Actual</p>
              <p className="font-bold text-gray-800 text-lg">{usuario?.semestre || "---"}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Correo Institucional</p>
              <p className="font-bold text-gray-800 text-lg">{usuario?.correo || "---"}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Teléfono de Contacto</p>
              <p className="font-bold text-gray-800 text-lg">{usuario?.telefono || "---"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 text-green-700">
              <div className="bg-green-50 p-2 rounded-lg">
                <Package size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Resumen</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total de Depósitos</p>
                <p className="text-5xl font-black text-gray-800 mt-1">
                  {estadisticas?.total_depositos ?? 0}
                </p>
              </div>

              <div className="space-y-3">
                {por_material?.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg text-gray-700">
                    <span className="font-medium text-gray-500">Total {m.material}</span>
                    <span className="font-bold text-green-700 bg-white px-2 py-1 rounded shadow-sm">
                      {m.total_piezas} pzas
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tu Progreso</p>
              <p className="text-sm font-black text-green-700">{progreso?.porcentaje ?? 0}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(22,163,74,0.2)]" 
                style={{ width: `${progreso?.porcentaje ?? 0}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 italic leading-tight">
              Llevas {progreso?.actual || 0} de {progreso?.meta || 0} piezas para tu siguiente meta.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlumnoDashboard;