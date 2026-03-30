import { useMemo } from "react";
import { Link } from "react-router-dom";

export function PwaAccessQrPage() {
  const pwaUrl = useMemo(() => `${window.location.origin}/cliente`, []);

  return (
    <section className="mx-auto w-full max-w-xl space-y-4 rounded-lg border border-border bg-card p-6 text-center">
      <h1 className="text-2xl font-bold">QR Code de acesso ao PWA</h1>
      <p className="text-sm text-muted-foreground">Use este QR para abrir a interface do cliente e iniciar a comanda.</p>

      <div className="flex justify-center">
        <img
          alt="QR Code para acesso do cliente"
          className="h-56 w-56 rounded-lg border border-border bg-white p-3"
          src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(pwaUrl)}`}
        />
      </div>

      <p className="text-xs text-muted-foreground break-all">{pwaUrl}</p>
      <div className="flex justify-center gap-3">
        <Link className="rounded-md border border-border px-4 py-2 text-sm" to="/cliente">
          Ir para abertura de comanda
        </Link>
        <Link className="rounded-md border border-border px-4 py-2 text-sm" to="/gestor/validacao">
          Ir para validação do gestor
        </Link>
      </div>
    </section>
  );
}
