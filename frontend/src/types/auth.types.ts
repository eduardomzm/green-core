export interface Medalla {
  id: number;
  nombre: string;
  descripcion: string;
  icono_lucide: string;
}

export interface MedallaAlumno {
  id: number;
  alumno: number;
  medalla: Medalla;
  mes_obtenida: string;
  fecha_otorgada: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  primer_apellido: string;
  segundo_apellido?: string;
  role: "ADMIN" | "OPERADOR" | "ALUMNO" | "TUTOR";
  matricula?: string | null;
  avatar: string;
  biografia?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  nivel?: number;
  medallas?: MedallaAlumno[];
  seguidores_count?: number;
  siguiendo_count?: number;
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