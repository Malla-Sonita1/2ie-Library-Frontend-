"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe, login as apiLogin, register as apiRegister } from "../lib/api";
import { useToast } from "@/components/ui/use-toast";

// Types

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student";
  studentId?: string;
  department?: string;
  phone?: string;
  address?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string; studentId?: string; department?: string; role?: string }) => Promise<boolean>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedRefreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    if (storedToken) {
      setToken(storedToken);
      // Logging
      console.log("Restoring token from localStorage:", storedToken);
      getMe(storedToken)
        .then((u) => {
          setUser(u);
          setLoading(false);
          console.log("Fetched user from /me:", u);
        })
        .catch((err) => {
          setLoading(false);
          logout();
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter.",
            variant: "destructive",
          });
          console.error("Error fetching /me:", err);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiLogin(email, password);
      console.log("Login response:", res);
      if (res && res.token) {
        setToken(res.token);
        localStorage.setItem("token", res.token);
        if (res.refreshToken) {
          localStorage.setItem("refreshToken", res.refreshToken);
        }
        setUser(res.user);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${res.user.name} !`,
        });
        // Redirection automatique selon le rôle après login
        if (typeof window !== "undefined") {
          if (res.user.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        }
        return true;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      console.error("Login error:", error);
    }
    toast({
      title: "Erreur de connexion",
      description: "Email ou mot de passe incorrect",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    // Désactiver la redirection automatique après logout
    // if (typeof window !== "undefined") {
    //   window.location.href = "/auth/login";
    // }
  };

  const register = async (data: { name: string; email: string; password: string; studentId?: string; department?: string; role?: string }): Promise<boolean> => {
    try {
      const res = await apiRegister(data);
      if (res) {
        toast({
          title: "Inscription réussie",
          description: `Bienvenue ${data.name} ! Votre compte a été créé avec succès.`,
        });
        return true;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    }
    return false;
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
