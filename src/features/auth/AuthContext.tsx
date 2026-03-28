import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AUTH_KEY = "pop9_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialUser() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { username: string };
    return parsed.username;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => getInitialUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(username),
      username,
      async login(nextUsername: string, password: string) {
        if (!nextUsername || !password) {
          throw new Error("Usuário e senha são obrigatórios.");
        }

        localStorage.setItem(AUTH_KEY, JSON.stringify({ username: nextUsername }));
        setUsername(nextUsername);
      },
      logout() {
        localStorage.removeItem(AUTH_KEY);
        setUsername(null);
      },
    }),
    [username],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
