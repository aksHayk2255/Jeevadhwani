import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearToken,
  getMe,
  getToken,
  loginUser,
  registerUser,
  setToken,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getToken();
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        if (!cancelled) setUser(data.user);
      } catch {
        clearToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(credentials) {
        const data = await loginUser(credentials);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      async register(payload) {
        const data = await registerUser(payload);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      logout() {
        clearToken();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
