import api from './api';


export interface Material {
  id: number;
  nombre: string;
  unidad: string;
  activo: boolean;
}

export const getMateriales = async (): Promise<Material[]> => {
  const response = await api.get('materiales/');
  return response.data;
};

export const createMaterial = async (data: { nombre: string; unidad: string }) => {
  const response = await api.post('materiales/', data);
  return response.data;
};

export const createDeposito = async (data: { alumno: number; material: number; cantidad: number }) => {
  const response = await api.post('depositos/', data);
  return response.data;
};

export const createMeta = async (data: { nombre: string; cantidad_meta: number; activa: boolean }) => {
  const response = await api.post('metas/', data);
  return response.data;
};

export interface RankingsResponse {
  timeframe: string;
  top_alumnos: any[];
  top_grupos: any[];
  top_carreras: any[];
  top_materiales: any[];
}
export const getRankings = async (timeframe: 'general' | 'mensual' = 'general'): Promise<RankingsResponse> => {
  const response = await api.get('rankings/', { params: { timeframe } });
  return response.data;
};