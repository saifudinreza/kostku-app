"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persist = (t: string, u: User) => {
    localStorage.setItem("auth_token", t);
    localStorage.setItem("auth_user", JSON.stringify(u));
    // Also set a cookie so Next.js middleware can read the role server-side
    document.cookie = `auth_token=${t}; path=/; max-age=86400`;
    document.cookie = `user_role=${u.role}; path=/; max-age=86400`;
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>(
      "/auth/login",
      { email, password }
    );
    persist(data.token, data.user);
    router.push(data.user.role === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
  }, [router]);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
      role: UserRole
    ) => {
      const { data } = await api.post<{ token: string; user: User }>(
        "/auth/register",
        { name, email, password, password_confirmation, role }
      );
      persist(data.token, data.user);
      router.push(data.user.role === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
