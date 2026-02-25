export interface User {
  id: number;
  username: string;
  role: "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR";
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}