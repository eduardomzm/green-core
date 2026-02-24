import api from "./api";
import type { MeResponse } from "../types/user.types";

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get("/users/me/");
  return response.data;
};