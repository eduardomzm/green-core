import api from "./api";
import type { MeResponse } from "../types/user.types";

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get("users/me/");
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
}

export const getCarreras = async (): Promise<Carrera[]> => {
  const response = await api.get('carreras/');
  return response.data;
};

export const createCarrera = async (data: { nombre: string }) => {
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
