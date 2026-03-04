export interface NavItem {
  label: string;
  path: string;
}

export const navigationByRole: Record<
  "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR",
  NavItem[]
> = {
  ADMIN: [
    { label: "Inicio", path: "/dashboard" },
    { label: "Usuarios", path: "/usuarios" },
    { label: "Depósitos", path: "/depositos" },
    { label: "Reportes", path: "/reportes" },
    
  ],
  OPERADOR: [
    { label: "Inicio", path: "/dashboard" },
    { label: "Registrar Depósito", path: "/depositos" },
  ],
  ALUMNO: [
    { label: "Inicio", path: "/dashboard" },
    { label: "Mis Estadísticas", path: "/estadisticas" },
  ],
  TUTOR: [
    { label: "Inicio", path: "/dashboard" },
    { label: "Mi Grupo", path: "/grupo" },
  ],
};