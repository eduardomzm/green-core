import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const AdminDashboard = ({ data }: Props) => {
  return (
    <div>
      <h2>Vista Administrador</h2>
      <p>Total piezas: {data.estadisticas.total_piezas}</p>
      <p>Total depósitos: {data.estadisticas.total_depositos}</p>
      <p>Meta actual: {data.progreso.meta}</p>
    </div>
  );
};

export default AdminDashboard;