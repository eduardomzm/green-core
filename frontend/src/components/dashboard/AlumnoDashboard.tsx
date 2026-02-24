import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const AlumnoDashboard = ({ data }: Props) => {
  return (
    <div>
      <h2>Vista Alumno</h2>
      <p>Tu progreso: {data.progreso.porcentaje}%</p>
      <p>
        {data.progreso.actual} / {data.progreso.meta}
      </p>
    </div>
  );
};

export default AlumnoDashboard;