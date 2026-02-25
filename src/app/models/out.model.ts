export interface Out {
  id: number;
  code_product: string;
  product_id: number;

  // 👇 AGREGAR ESTO
  product_name?: string;

  date: string | null;
  client: string | null;
  user: string | null;
  quantity: number;
  salePrice: number;
  totalPrice: number;

  product?: {
    id: number;
    name: string;
  };

  location?: {
    id: number;
    name: string;
  };

  order?: {
    id: number;
    state: string;
  };
}
