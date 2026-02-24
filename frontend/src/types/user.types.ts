export interface MeResponse {
  id: number;
  username: string;
  role: "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR";
}