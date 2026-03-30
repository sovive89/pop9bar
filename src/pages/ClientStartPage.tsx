import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createComanda, isValidBrazilPhone } from "@/lib/comandas";

export function ClientStartPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (fullName.trim().split(" ").length < 2) {
      setError("Informe nome completo.");
      return;
    }

    if (!isValidBrazilPhone(phone)) {
      setError("Informe celular no padrão BR. Ex: (11) 98888-7777");
      return;
    }

    createComanda(fullName.trim(), phone.trim());
    navigate("/cliente/menu", { replace: true });
  }

  return (
    <section className="mx-auto w-full max-w-lg space-y-6 rounded-lg border border-border bg-card p-6">
      <header>
        <h1 className="text-2xl font-bold">Abertura de Comanda</h1>
        <p className="text-sm text-muted-foreground">Escaneie o QR do bar, informe seus dados e acesse o cardápio.</p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span>Nome completo</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Seu nome e sobrenome"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Celular</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(11) 98888-7777"
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" type="submit">
          Abrir comanda e acessar cardápio
        </button>
      </form>

      <div className="text-xs text-muted-foreground">
        Gestor? <Link className="text-primary underline" to="/gestor/validacao">Acessar validação de QR</Link>
      </div>
    </section>
  );
}
