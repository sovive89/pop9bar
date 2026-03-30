import type { ClientSession, Comanda, ComandaItem } from "@/types/comanda";

const COMANDAS_KEY = "pop9_comandas";
const CLIENT_SESSION_KEY = "pop9_client_session";

export const menuItems = [
  { id: "beer", name: "Cerveja Pilsen", price: 12 },
  { id: "caipirinha", name: "Caipirinha", price: 18 },
  { id: "burger", name: "Burger da Casa", price: 34 },
  { id: "fries", name: "Batata Frita", price: 22 },
  { id: "water", name: "Água", price: 6 },
];

export function isValidBrazilPhone(value: string) {
  return /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(value.replace(/\s+/g, ""));
}

export function readComandas(): Comanda[] {
  const raw = localStorage.getItem(COMANDAS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Comanda[];
  } catch {
    return [];
  }
}

function saveComandas(comandas: Comanda[]) {
  localStorage.setItem(COMANDAS_KEY, JSON.stringify(comandas));
}

export function createComanda(customerName: string, phone: string): ClientSession {
  const comanda: Comanda = {
    id: crypto.randomUUID(),
    customerName,
    phone,
    createdAt: new Date().toISOString(),
    items: [],
  };

  const all = [comanda, ...readComandas()];
  saveComandas(all);

  const session: ClientSession = {
    comandaId: comanda.id,
    customerName,
    phone,
  };
  localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));

  return session;
}

export function getClientSession(): ClientSession | null {
  const raw = localStorage.getItem(CLIENT_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ClientSession;
  } catch {
    return null;
  }
}

export function clearClientSession() {
  localStorage.removeItem(CLIENT_SESSION_KEY);
}

export function getComandaById(comandaId: string): Comanda | null {
  return readComandas().find((comanda) => comanda.id === comandaId) ?? null;
}

export function addItemToComanda(comandaId: string, menuItemId: string): Comanda {
  const menuItem = menuItems.find((item) => item.id === menuItemId);
  if (!menuItem) {
    throw new Error("Item inválido.");
  }

  const all = readComandas();
  const index = all.findIndex((comanda) => comanda.id === comandaId);
  if (index < 0) {
    throw new Error("Comanda não encontrada.");
  }

  const item: ComandaItem = {
    id: crypto.randomUUID(),
    menuItemId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    status: "pendente",
    createdAt: new Date().toISOString(),
    qrPayload: JSON.stringify({
      comandaId,
      itemId: crypto.randomUUID(),
      menuItemId: menuItem.id,
      createdAt: new Date().toISOString(),
    }),
  };

  all[index] = {
    ...all[index],
    items: [item, ...all[index].items],
  };

  saveComandas(all);
  return all[index];
}

export function validateItemByQrPayload(payload: string): Comanda | null {
  const all = readComandas();

  for (let i = 0; i < all.length; i += 1) {
    const itemIndex = all[i].items.findIndex((item) => item.qrPayload === payload);
    if (itemIndex >= 0) {
      const currentItem = all[i].items[itemIndex];
      all[i].items[itemIndex] = { ...currentItem, status: "validado" };
      saveComandas(all);
      return all[i];
    }
  }

  return null;
}

export function getPendingItems() {
  return readComandas().flatMap((comanda) =>
    comanda.items
      .filter((item) => item.status === "pendente")
      .map((item) => ({
        comandaId: comanda.id,
        customerName: comanda.customerName,
        phone: comanda.phone,
        item,
      })),
  );
}
