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

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('users/');
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