import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const AdminDashboard = ({ data }: Props) => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-textMain">Resumen General</h2>
        <p className="text-gray-500">Vista rápida del estado del reciclaje en la Universidad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-primary">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Piezas</p>
          <p className="text-4xl font-extrabold text-textMain mt-2">
            {data.estadisticas.total_piezas} <span className="text-lg text-primary">pz</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-secondary">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Depósitos Registrados</p>
          <p className="text-4xl font-extrabold text-textMain mt-2">
            {data.estadisticas.total_depositos} <span className="text-lg text-secondary"></span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-accent">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Meta Global</p>
          <p className="text-4xl font-extrabold text-textMain mt-2">
            {data.progreso.meta} <span className="text-lg text-accent">pz</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;