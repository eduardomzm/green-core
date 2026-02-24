import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const OperadorDashboard = ({ data }: Props) => {
  return (
    <div>
      <h2>Vista Operador</h2>
      <p>Depósitos registrados: {data.estadisticas.total_depositos}</p>
    </div>
  );
};

export default OperadorDashboard;