import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const TutorDashboard = ({ data }: Props) => {
  return (
    <div>
      <h2>Vista Tutor</h2>
      <p>Revisión de grupo activa</p>
      <p>Depósitos del grupo: {data.estadisticas.total_depositos}</p>
      <p>Avance del grupo: {data.progreso.porcentaje}%</p>
    </div>
  );
};

export default TutorDashboard;
