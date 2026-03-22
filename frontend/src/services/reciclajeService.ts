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

export const getMiGrupoTutor = async () => {
    const response = await api.get('mi-grupo/');
    return response.data;
};

export const getMiGrupoAlumno = async () => {
    const response = await api.get('mi-grupo-alumno/');
    return response.data;
};

export const solicitarSalidaGrupo = async () => {
    const response = await api.post('solicitar-salida-grupo/');
    return response.data;
};

export const autorizarIngresoGrupo = async (alumno_id: number) => {
    const response = await api.post('autorizar-ingreso-grupo/', { alumno_id });
    return response.data;
};

export const autorizarSalidaGrupo = async (alumno_id: number) => {
    const response = await api.post('autorizar-salida-grupo/', { alumno_id });
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
  const monthStr = `${anio}-${String(mes).padStart(2, '0')}`;
  return getRankings('mensual', monthStr);
};

export interface Deposito {
  id: number;
  alumno: number;
  alumno_info: any;
  operador: number;
  operador_info: any;
  material: number;
  material_nombre: string;
  cantidad: number;
  fecha: string;
}

export interface PaginatedDepositos {
  count: number;
  next: string | null;
  previous: string | null;
  results: Deposito[];
}

export const getDepositos = async (params: any = {}): Promise<PaginatedDepositos> => {
  const response = await api.get('depositos/', { params });
  return response.data;
};

export const asignarMetaAlumno = async (data: { alumno_id: number; material_id: number; cantidad_meta: number }) => {
  const response = await api.post('asignar-meta-alumno/', data);
  return response.data;
};

export const cancelarMetaAlumno = async (meta_id: number) => {
  const response = await api.delete(`cancelar-meta-alumno/${meta_id}/`);
  return response.data;
};

export const getMedallasDisponibles = async () => {
  const response = await api.get('medallas-disponibles/');
  return response.data;
};

export const hacerCorteMensual = async (medalla_id: number, mes: string) => {
  const response = await api.post('corte-mensual/', { medalla_id, mes });
  return response.data;
};