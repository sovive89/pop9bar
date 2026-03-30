import { FormEvent, useMemo, useState } from "react";

import { getPendingItems, validateItemByQrPayload } from "@/lib/comandas";

export function ManagerValidationPage() {
  const [qrPayload, setQrPayload] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const pending = useMemo(() => getPendingItems(), [refreshToken]);

  function refresh() {
    setRefreshToken((current) => current + 1);
  }

  function handleValidatePayload(payload: string) {
    const updated = validateItemByQrPayload(payload);
    if (!updated) {
      setFeedback("QR não encontrado para validação.");
      return;
    }

    setFeedback(`Item validado na comanda de ${updated.customerName}.`);
    refresh();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!qrPayload.trim()) {
      setFeedback("Informe o conteúdo do QR para validar.");
      return;
    }

    handleValidatePayload(qrPayload.trim());
    setQrPayload("");
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Validação de QR (Gestor)</h1>
        <p className="text-sm text-muted-foreground">Valide cada item da comanda ao escanear o QR.</p>
      </header>

      <form className="space-y-3 rounded-lg border border-border bg-card p-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span>Payload do QR</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2"
            value={qrPayload}
            onChange={(event) => setQrPayload(event.target.value)}
            placeholder='Cole aqui o conteúdo do QR (JSON com comandaId/itemId)'
          />
        </label>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" type="submit">
          Validar QR
        </button>
      </form>

      {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Itens pendentes ({pending.length})</h2>

        {pending.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item pendente no momento.</p>}

        <ul className="space-y-3">
          {pending.map((entry) => (
            <li className="rounded-md border border-border p-3" key={entry.item.id}>
              <p className="font-medium">{entry.item.name}</p>
              <p className="text-xs text-muted-foreground">Cliente: {entry.customerName} · {entry.phone}</p>
              <p className="mt-2 text-xs break-all text-muted-foreground">{entry.item.qrPayload}</p>
              <button className="mt-2 rounded-md border border-border px-3 py-1 text-xs" onClick={() => handleValidatePayload(entry.item.qrPayload)} type="button">
                Validar item
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
