import api from "./api";
import type { MeResponse } from "../types/user.types";

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get("/users/me/");
  return response.data;
};

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  activo: boolean;
  primer_apellido?: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};