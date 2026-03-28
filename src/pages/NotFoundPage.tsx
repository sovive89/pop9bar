import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-muted-foreground">A rota solicitada não existe no momento.</p>
      <Link className="mt-4 inline-flex text-sm font-medium text-primary underline" to="/dashboard">
        Voltar para dashboard
      </Link>
    </section>
  );
}
