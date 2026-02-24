import type { DashboardResponse } from "../../types/dashboard.types";

interface Props {
  data: DashboardResponse;
}

const TutorDashboard = ({ data }: Props) => {
  return (
    <div>
      <h2>Vista Tutor</h2>
      <p>Revisión de grupo activa</p>
    </div>
  );
};

export default TutorDashboard;