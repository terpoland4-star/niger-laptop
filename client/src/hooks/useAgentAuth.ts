import { useState, useCallback, useEffect } from "react";
import { agentLogin } from "@/lib/api";

interface AgentUser {
  id: string;
  email: string;
  name: string;
}

const STORAGE_KEY = "nl_agent_token";
const STORAGE_USER_KEY = "nl_agent_user";

export function useAgentAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [agent, setAgent] = useState<AgentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setAgent(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await agentLogin({ email, password });
    localStorage.setItem(STORAGE_KEY, res.data.token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data.agent));
    setToken(res.data.token);
    setAgent(res.data.agent);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setAgent(null);
  }, []);

  return { token, agent, isLoading, isAuthenticated: !!token, login, logout };
}
