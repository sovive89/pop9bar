import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha no login.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6">
      <h1 className="text-2xl font-bold">Entrar no sistema</h1>
      <p className="mt-1 text-sm text-muted-foreground">Use qualquer usuário e senha para ambiente local.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span>Usuário</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Senha</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
