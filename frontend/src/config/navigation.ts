export interface NavItem {
  label: string;
  path: string;
}

export const navigationByRole: Record<
  "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR",
  NavItem[]
> = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Usuarios", path: "/usuarios" },
    { label: "Reportes", path: "/reportes" },
  ],
  OPERADOR: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Registrar Depósito", path: "/depositos" },
  ],
  ALUMNO: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Mis Estadísticas", path: "/estadisticas" },
  ],
  TUTOR: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Mi Grupo", path: "/grupo" },
  ],
};