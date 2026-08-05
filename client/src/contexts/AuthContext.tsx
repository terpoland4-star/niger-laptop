import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  registerCustomer,
  loginCustomer,
  getMe,
  Customer,
  RegisterPayload,
  CustomerAuthPayload,
} from "@/lib/api";

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: CustomerAuthPayload) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "nl_customer_token";
const STORAGE_CUSTOMER_KEY = "nl_customer";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    const storedCustomer = localStorage.getItem(STORAGE_CUSTOMER_KEY);
    if (storedToken && storedCustomer) {
      setToken(storedToken);
      setCustomer(JSON.parse(storedCustomer));
      // Rafraîchit les infos en arrière-plan pour rester à jour, sans bloquer l'UI.
      getMe(storedToken)
        .then(res => {
          setCustomer(res.data);
          localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(res.data));
        })
        .catch(() => {
          // Token expiré ou invalide : on déconnecte proprement.
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_CUSTOMER_KEY);
          setToken(null);
          setCustomer(null);
        });
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((newToken: string, newCustomer: Customer) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(newCustomer));
    setToken(newToken);
    setCustomer(newCustomer);
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await registerCustomer(payload);
      persist(res.data.token, res.data.customer);
    },
    [persist]
  );

  const login = useCallback(
    async (payload: CustomerAuthPayload) => {
      const res = await loginCustomer(payload);
      persist(res.data.token, res.data.customer);
    },
    [persist]
  );

  // Utilisé quand un token est déjà émis ailleurs (ex: création de compte
  // implicite lors d'une commande via OrderModal) : on récupère juste le
  // profil client associé et on persiste la session.
  const loginWithToken = useCallback(
    async (newToken: string) => {
      const res = await getMe(newToken);
      persist(newToken, res.data);
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_CUSTOMER_KEY);
    setToken(null);
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isLoading,
        isAuthenticated: !!token,
        register,
        login,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
