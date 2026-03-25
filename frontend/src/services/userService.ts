import api from "./api";

export const getMe = async () => {
  const response = await api.get("users/me/");
  return response.data;
};

export const updateMe = async (data: {
  username?: string;
  email?: string;
  contrasena_actual?: string;
  nueva_contrasena?: string;
  repetir_contrasena?: string;
  avatar?: string;
  biografia?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}) => {
  const response = await api.patch("users/me/", data);
  return response.data;
};

export const getPublicProfile = async (username: string) => {
  const response = await api.get(`users/perfil/${username}/`);
  return response.data;
};

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  activo: boolean;
  first_name?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  matricula?: string;
  avatar?: string;
  biografia?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  nivel?: number;
  nivel_nombre?: string;
  nivel_color?: string;
  piezas_proximo_nivel?: number;
  porcentaje_nivel?: number;
  total_piezas_historico?: number;
  total_depositos?: number;
  total_piezas?: number;
  seguidores_count?: number;
  siguiendo_count?: number;
  medallas?: any[];
}

export interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export const getUsers = async (params: any = {}): Promise<PaginatedUsers | any> => {
  try {
    const response = await api.get('users/', { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const createUser = async (userData: any): Promise<User> => {
  try {
    
    const response = await api.post('users/', userData);
    return response.data;
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    
    const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data)
        : 'Error desconocido al crear usuario';
    throw new Error(errorMsg);
  }
};

export interface Carrera {
  id: number;
  nombre: string;
  abreviatura?: string;
}

export const getCarreras = async (): Promise<Carrera[]> => {
  const response = await api.get('carreras/');
  return response.data;
};

export const createCarrera = async (data: { nombre: string, abreviatura: string }): Promise<Carrera> => {
  const response = await api.post('carreras/', data);
  return response.data;
};

export const updateUser = async (id: number, userData: any): Promise<User> => {
  try {
    const response = await api.patch(`users/${id}/`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data)
        : 'Error desconocido al actualizar usuario';
    throw new Error(errorMsg);
  }
};

export interface Grupo {
  id: number;
  nombre: string;
  carrera: number;
}

export const getGrupos = async (): Promise<Grupo[]> => {
    const response = await api.get('grupos/');
    return response.data;
};

export const buscarAlumnos = async (query: string) => {
  const response = await api.get(`users/buscar/?q=${query}`);
  return response.data;
};

export const toggleSeguir = async (username: string) => {
  const response = await api.post(`users/perfil/${username}/seguir/`);
  return response.data;
};

export const getMisSeguidores = async () => {
  const response = await api.get('users/me/seguidores/');
  return response.data;
};

export const getMisSiguiendo = async () => {
  const response = await api.get('users/me/siguiendo/');
  return response.data;
};

export interface NivelConfig {
  id: number;
  nivel: number;
  nombre: string;
  piezas_requeridas: number;
  color: string;
}

export const getNiveles = async (): Promise<NivelConfig[]> => {
  const response = await api.get('niveles/');
  return response.data;
};

export const updateNivel = async (id: number, data: Partial<NivelConfig>): Promise<NivelConfig> => {
  const response = await api.patch(`niveles/${id}/`, data);
  return response.data;
};

export const createNivel = async (data: { nivel: number, nombre: string, piezas_requeridas: number, color: string }): Promise<NivelConfig> => {
  const response = await api.post('niveles/', data);
  return response.data;
};

export const deleteNivel = async (id: number): Promise<void> => {
  await api.delete(`niveles/${id}/`);
};
