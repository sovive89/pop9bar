export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  price: number;
  stock: number;
};
