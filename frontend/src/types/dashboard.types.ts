export interface Estadisticas {
  total_piezas: number;
  total_depositos: number;
  total_alumnos?: number;
  alumnos_participantes?: number;
  material_top?: string;
}

export interface Progreso {
  actual: number;
  meta: number;
  porcentaje: number;
}

export interface MaterialItem {
  material: string;
  total_piezas: number;
}

export interface DepositoHistorial {
  id: number;
  fecha: string;
  cantidad: number;
  material: string;
  operador: string;
  alumno: string;
}

export interface MetaAlumnoData {
  id: number;
  material: string;
  material_unidad: string;
  cantidad_meta: number;
  actual: number;
  porcentaje: number;
}

export interface UsuarioHistorial {
  id: number;
  username: string;
  first_name: string;
  primer_apellido: string;
  role: string;
  date_joined: string;
}

export interface DashboardResponse {
  estadisticas: Estadisticas;
  progreso: Progreso;
  por_material: MaterialItem[];
  ultimos_depositos?: DepositoHistorial[];
  ultimos_usuarios?: UsuarioHistorial[];
  meta_alumno?: MetaAlumnoData | null;
}