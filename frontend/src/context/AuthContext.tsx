import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types/auth.types";
import api from "../services/api";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access")
  );

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Token inválido");
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem("access", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("access");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};