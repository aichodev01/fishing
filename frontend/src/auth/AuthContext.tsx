import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import * as authApi from "@/api/auth";
import type { Me } from "@/api/auth";

type AuthState =
  | { status: "loading"; me: null }
  | { status: "guest"; me: null }
  | { status: "authed"; me: Me };

type AuthContextValue = {
  state: AuthState;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", me: null });

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.me();
      setState({ status: "authed", me });
    } catch {
      setState({ status: "guest", me: null });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      await authApi.login(email, password);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({ status: "guest", me: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ state, refresh, login, logout }),
    [state, refresh, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider is missing");
  return ctx;
}

