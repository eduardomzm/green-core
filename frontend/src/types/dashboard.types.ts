export interface Usuario {
  nombre: string;
  matricula: string;
  carrera: string;
  semestre: string;
  correo: string;
  telefono: string;
}

export interface DashboardResponse {
  usuario: Usuario;
  estadisticas: {
    total_piezas: number;
    total_depositos: number;
  };
  progreso: {
    actual: number;
    meta: number;
    porcentaje: number;
  };
  por_material: {
    material: string;
    total_piezas: number;
  }[];
}