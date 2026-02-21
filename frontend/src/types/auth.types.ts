export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;

}

export interface LoginResponse {
  access: string;
  refresh: string;
}