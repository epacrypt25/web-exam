"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { API_AUTH, API_USER } from "@/lib/api";
import { User, TokenResponse } from "@/lib/types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUserClass: (classId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await API_USER.get("/profile");
      setUser(res.data);
    } catch {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
      fetchProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = async (username: string, password: string) => {
    const res = await API_AUTH.post<TokenResponse>("/login", {
      username,
      password,
    });
    const { access_token, refresh_token } = res.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setAccessToken(access_token);
    await fetchProfile();
  };

  const register = async (username: string, password: string) => {
    await API_AUTH.post("/register", { username, password });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setUser(null);
  };

  const refreshTokenFn = async () => {
    const rt = localStorage.getItem("refresh_token");
    if (!rt) throw new Error("No refresh token");
    const res = await API_AUTH.post<TokenResponse>("/refresh", {
      refresh_token: rt,
    });
    const { access_token, refresh_token } = res.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setAccessToken(access_token);
  };

  const updateUserClass = async (classId: string) => {
    try {
      if (!accessToken) throw new Error("Not authenticated");
      await API_USER.put("/profile/class", { class_id: classId });
      if (user) {
        setUser({ ...user, class_id: classId });
      }
      toast.success("Class selected successfully! 🎉");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update class");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken: refreshTokenFn,
        updateUserClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
