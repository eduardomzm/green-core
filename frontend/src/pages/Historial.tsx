import MainLayout from "../components/layout/MainLayout";
import HistorialTabla from "../components/Historial/HistorialTabla";
import { History, Scale, Award } from "lucide-react";

const HistorialPage = () => {
  const estadisticasRapidas = [
    { label: "Envíos Totales", value: "10", icon: <History size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Peso Total", value: "18.2 kg", icon: <Scale size={20} />, color: "text-green-600", bg: "bg-green-50" },
    { label: "Puntos Ganados", value: "115", icon: <Award size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <MainLayout>
      <div className="max-w-[1400px] animate-fadeIn pb-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Historial de Depósitos</h2>
          <p className="text-gray-500 font-medium">Revisa el estado y detalle de todos tus aportes al medio ambiente.</p>
        </div>

        {/* TARJETAS DE RESUMEN RÁPIDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {estadisticasRapidas.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className={`p-4 ${item.bg} ${item.color} rounded-2xl`}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-black text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <HistorialTabla />
        </div>
      </div>
    </MainLayout>
  );
};

export default HistorialPage;