import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { authApi } from "../services/authApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("govconnect_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("govconnect_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const me = await authApi.getMe();
          setUser(me);
          localStorage.setItem("govconnect_user", JSON.stringify(me));
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      setToken(data.access_token);
      localStorage.setItem("govconnect_token", data.access_token);
      const userObj: User = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role as UserRole,
        department_code: data.department_code,
        is_active: true,
      };
      setUser(userObj);
      localStorage.setItem("govconnect_user", JSON.stringify(userObj));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(userData);
      setToken(data.access_token);
      localStorage.setItem("govconnect_token", data.access_token);
      const userObj: User = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role as UserRole,
        department_code: data.department_code,
        is_active: true,
      };
      setUser(userObj);
      localStorage.setItem("govconnect_user", JSON.stringify(userObj));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("govconnect_token");
    localStorage.removeItem("govconnect_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
