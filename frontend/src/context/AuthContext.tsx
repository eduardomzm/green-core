import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types/auth.types";
import api from "../services/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const fetchUser = useCallback(async (currentToken: string | null) => {
    if (!currentToken) {
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
  }, []);

  useEffect(() => {
    fetchUser(token);
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

  const refreshUser = async () => {
    await fetchUser(token);
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};