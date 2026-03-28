import { useCallback, useEffect, useState } from "react";

import { productsApi } from "@/lib/api";
import type { Product, ProductInput } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao buscar produtos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (input: ProductInput) => {
    const created = await productsApi.create(input);
    setProducts((current) => [created, ...current]);
  }, []);

  const update = useCallback(async (id: string, input: ProductInput) => {
    const updated = await productsApi.update(id, input);
    setProducts((current) => current.map((item) => (item.id === id ? updated : item)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await productsApi.remove(id);
    setProducts((current) => current.filter((item) => item.id !== id));
  }, []);

  return { products, loading, error, load, create, update, remove };
}
