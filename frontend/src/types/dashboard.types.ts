export interface Estadisticas {
  total_piezas: number;
  total_depositos: number;
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

export interface DashboardResponse {
  estadisticas: Estadisticas;
  progreso: Progreso;
  por_material: MaterialItem[];
}

export interface DepositoHistorial {
  id: number;
  fecha: string; 
  cantidad: number;
  material: string;
  operador: string;
}

export interface DashboardResponse {
  estadisticas: Estadisticas;
  progreso: Progreso;
  por_material: MaterialItem[];
  // Lo hacemos opcional (?) por si el backend aún no lo manda
  ultimos_depositos?: DepositoHistorial[]; 
}