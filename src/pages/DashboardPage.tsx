import { Link } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";

const cards = [
  { title: "Comandas abertas", value: "12" },
  { title: "Pedidos pendentes", value: "7" },
  { title: "Faturamento do dia", value: "R$ 1.420,00" },
];

export function DashboardPage() {
  const { username } = useAuth();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard inicial</h1>
        <p className="text-muted-foreground">Bem-vindo, {username}. Aqui está um resumo operacional do bar.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article className="rounded-lg border border-border bg-card p-4" key={card.title}>
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className="mt-1 text-2xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Próximo módulo</h2>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie o catálogo e estoque direto na área de produtos, e acompanhe a jornada de QR da comanda.</p>
        <div className="mt-4 flex gap-2">
          <Link className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" to="/products">
            Ir para produtos
          </Link>
          <Link className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium" to="/qr-acesso">
            QR do PWA
          </Link>
        </div>
      </div>
    </section>
  );
}
