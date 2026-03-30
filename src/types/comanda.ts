export type ComandaItemStatus = "pendente" | "validado";

export type ComandaItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  qrPayload: string;
  status: ComandaItemStatus;
  createdAt: string;
};

export type Comanda = {
  id: string;
  customerName: string;
  phone: string;
  createdAt: string;
  items: ComandaItem[];
};

export type ClientSession = {
  comandaId: string;
  customerName: string;
  phone: string;
};
