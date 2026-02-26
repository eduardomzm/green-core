import api from "./api";

import type { LoginResponse } from "../types/auth.types";

export const loginRequest = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/token/", {
    username,
    password,
  });

  return response.data;
};

export const registerAlumno = async (userData: any) => {
  const response = await api.post("/users/registro/alumno/", userData);
  return response.data;
};