import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { addItemToComanda, clearClientSession, getClientSession, getComandaById, menuItems } from "@/lib/comandas";

export function ClientMenuPage() {
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const session = getClientSession();

  const comanda = useMemo(() => {
    if (!session) return null;
    return getComandaById(session.comandaId);
  }, [session, refreshToken]);

  if (!session || !comanda) {
    return <Navigate to="/cliente" replace />;
  }

  const total = comanda.items.reduce((acc, item) => acc + item.price, 0);

  function handleAdd(menuItemId: string) {
    setError(null);
    try {
      addItemToComanda(comanda.id, menuItemId);
      setRefreshToken((current) => current + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível adicionar o item.";
      setError(message);
    }
  }

  function handleCloseSession() {
    clearClientSession();
    setRefreshToken((current) => current + 1);
  }

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-border bg-card p-4">
        <h1 className="text-2xl font-bold">Cardápio digital</h1>
        <p className="text-sm text-muted-foreground">Comanda: {comanda.customerName} · {comanda.phone}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <article className="rounded-lg border border-border bg-card p-4" key={item.id}>
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
            <button className="mt-3 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground" onClick={() => handleAdd(item.id)} type="button">
              Adicionar à comanda
            </button>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Itens da comanda</h2>
          <span className="text-sm text-muted-foreground">Total: R$ {total.toFixed(2)}</span>
        </div>

        {comanda.items.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item selecionado.</p>}

        <ul className="space-y-4">
          {comanda.items.map((item) => (
            <li className="rounded-md border border-border p-3" key={item.id}>
              <div className="flex items-center justify-between">
                <strong>{item.name}</strong>
                <span className={item.status === "validado" ? "text-xs text-emerald-500" : "text-xs text-amber-500"}>{item.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
              <img
                alt={`QR do item ${item.name}`}
                className="mt-2 h-24 w-24 rounded border border-border bg-white p-1"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(item.qrPayload)}`}
              />
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button className="rounded-md border border-border px-4 py-2 text-sm" onClick={handleCloseSession} type="button">
          Encerrar sessão local
        </button>
        <Link className="rounded-md border border-border px-4 py-2 text-sm" to="/cliente">
          Nova comanda
        </Link>
      </div>
    </section>
  );
}
