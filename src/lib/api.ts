import { env } from "@/lib/env";
import type { Product, ProductInput } from "@/types/product";

const STORAGE_KEY = "pop9_products";

const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

function readLocalProducts(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

function saveLocalProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.apiBaseUrl) {
    throw new Error("API base URL não configurada.");
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Erro na API (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const productsApi = {
  async list(): Promise<Product[]> {
    if (env.apiBaseUrl) {
      return apiFetch<Product[]>("/products");
    }

    await wait();
    return readLocalProducts();
  },

  async create(input: ProductInput): Promise<Product> {
    if (env.apiBaseUrl) {
      return apiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    await wait();
    const next: Product = {
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      ...input,
    };
    const all = [next, ...readLocalProducts()];
    saveLocalProducts(all);
    return next;
  },

  async update(id: string, input: ProductInput): Promise<Product> {
    if (env.apiBaseUrl) {
      return apiFetch<Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });
    }

    await wait();
    const all = readLocalProducts();
    const index = all.findIndex((product) => product.id === id);

    if (index < 0) {
      throw new Error("Produto não encontrado.");
    }

    const updated: Product = {
      ...all[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    saveLocalProducts(all);
    return updated;
  },

  async remove(id: string): Promise<void> {
    if (env.apiBaseUrl) {
      await apiFetch<void>(`/products/${id}`, {
        method: "DELETE",
      });
      return;
    }

    await wait();
    const all = readLocalProducts().filter((product) => product.id !== id);
    saveLocalProducts(all);
  },
};
