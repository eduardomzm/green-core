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
export const getRankings = async (timeframe: 'actual' | 'mensual' | string = 'actual', month?: string): Promise<RankingsResponse> => {
  const params: any = { timeframe };
  if (timeframe === 'mensual' && month) {
    params.month = month;
  }
  const response = await api.get('rankings/', { params });
  return response.data;
};

export const unirseGrupo = async (codigo: string) => {
  const response = await api.post('unirse-grupo/', { codigo });
  return response.data;
};

export interface Grupo {
  id: number;
  nombre: string;
  codigo_invitacion?: string;
  carrera: number | any;
  tutor: number | any;
}

export const getGrupos = async () => {
  const response = await api.get('grupos/');
  return response.data;
};

export const createGrupo = async (data: { nombre: string, carrera: number, tutor: number, activo: boolean }) => {
  const response = await api.post('grupos/', data);
  return response.data;
};

export const getRankingHistorial = async (
  mes: number,
  anio: number
): Promise<RankingsResponse> => {

  const response = await api.get('rankings/historial/', {
    params: { mes, anio }
  })

  return response.data

}

export const getMiGrupoTutor = async () => {
  const response = await api.get('reciclaje/mi-grupo/');
  return response.data;
};