const setupChecklist = [
  "Estrutura inicial de pastas criada",
  "Roteamento base com React Router",
  "Layout compartilhado para páginas",
  "Tema base com variáveis e Tailwind",
];

export function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base do projeto configurada</h1>
        <p className="text-muted-foreground">
          O projeto está pronto para evoluir os próximos módulos (dashboard, produtos,
          autenticação e integrações).
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold">Checklist de setup</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          {setupChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
