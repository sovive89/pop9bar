import { Link, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";

export function AppShell() {
  const { logout, username } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <strong className="text-lg">PØP9 Bar</strong>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link className="transition hover:text-foreground" to="/dashboard">
              Dashboard
            </Link>
            <Link className="transition hover:text-foreground" to="/products">
              Produtos
            </Link>
            <Link className="transition hover:text-foreground" to="/qr-acesso">
              QR PWA
            </Link>
            <Link className="transition hover:text-foreground" to="/validacao">
              Validação QR
            </Link>
            <span className="hidden text-xs md:inline">{username}</span>
            <button className="rounded border border-border px-2 py-1 text-xs hover:text-foreground" onClick={logout} type="button">
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
