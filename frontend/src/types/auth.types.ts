export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  primer_apellido: string;
  segundo_apellido?: string;
  role: "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR";
  matricula?: string | null;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}