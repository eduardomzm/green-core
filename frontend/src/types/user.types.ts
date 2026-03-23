export interface MeResponse {
  id: number;
  username: string;
  role: "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR";
  first_name?: string;
  primer_apellido?: string;
  matricula?: string | null;
  racha_actual?: number;
  max_racha?: number;
}