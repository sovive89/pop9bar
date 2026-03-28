import { FormEvent, useMemo, useState } from "react";

import { useProducts } from "@/features/products/useProducts";
import type { Product, ProductInput } from "@/types/product";

const initialForm: ProductInput = {
  name: "",
  price: 0,
  stock: 0,
};

export function ProductsPage() {
  const { products, loading, error, create, update, remove } = useProducts();
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const totalStock = useMemo(() => products.reduce((acc, item) => acc + item.stock, 0), [products]);

  function resetForm() {
    setForm(initialForm);
    setEditing(null);
    setFormError(null);
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (!form.name.trim()) {
        throw new Error("Informe o nome do produto.");
      }

      if (editing) {
        await update(editing.id, form);
      } else {
        await create(form);
      }

      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível salvar o produto.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRUD de produtos</h1>
          <p className="text-muted-foreground">Cadastro, edição e exclusão com integração a API (ou fallback local).</p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Itens em estoque: {totalStock}</span>
      </header>

      <form className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4" onSubmit={handleSubmit}>
        <input
          className="rounded-md border border-input bg-background px-3 py-2"
          placeholder="Nome do produto"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <input
          className="rounded-md border border-input bg-background px-3 py-2"
          min={0}
          placeholder="Preço"
          step="0.01"
          type="number"
          value={form.price}
          onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
        />
        <input
          className="rounded-md border border-input bg-background px-3 py-2"
          min={0}
          placeholder="Estoque"
          type="number"
          value={form.stock}
          onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))}
        />
        <div className="flex gap-2">
          <button
            className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving ? "Salvando..." : editing ? "Atualizar" : "Criar"}
          </button>
          {editing && (
            <button className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm" onClick={resetForm} type="button">
              Cancelar
            </button>
          )}
        </div>
        {formError && <p className="text-sm text-destructive md:col-span-4">{formError}</p>}
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3 font-medium">Atualização</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-muted-foreground" colSpan={5}>
                  Carregando produtos...
                </td>
              </tr>
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-muted-foreground" colSpan={5}>
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr className="border-t border-border" key={product.id}>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">R$ {product.price.toFixed(2)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(product.updatedAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-md border border-border px-3 py-1" onClick={() => startEdit(product)} type="button">
                      Editar
                    </button>
                    <button className="rounded-md border border-destructive px-3 py-1 text-destructive" onClick={() => void remove(product.id)} type="button">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </section>
  );
}
