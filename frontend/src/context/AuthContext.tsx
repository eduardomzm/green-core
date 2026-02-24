import{ createContext, useState, useEffect } from "react";
import type{ ReactNode } from "react";
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

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

  const isAuthenticated = !!token;

  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("access");
      setToken(storedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("access", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("access");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};