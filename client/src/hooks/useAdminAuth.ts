import { useState, useCallback, useEffect } from "react";
import { adminLogin } from "@/lib/api";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

const STORAGE_KEY = "nl_admin_token";
const STORAGE_USER_KEY = "nl_admin_user";

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminLogin({ email, password });
    localStorage.setItem(STORAGE_KEY, res.data.token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data.admin));
    setToken(res.data.token);
    setAdmin(res.data.admin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  return { token, admin, isLoading, isAuthenticated: !!token, login, logout };
}
