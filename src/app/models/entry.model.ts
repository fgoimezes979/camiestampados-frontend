export interface EntryItem {
  product_id: number;
  quantity: number;
  code_product?: string;
  product_name?: string;
}

export interface Entry {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  date: string;
  user?: string;
  isActive: boolean;

  // relaciones
  product?: {
    id: number;
    name: string;
    product_code: string;
  };

  location?: {
    id: number;
    name: string;
  };
}

// 🔹 Para crear entradas múltiples
export interface EntryPayload {
  location_id: number;
  items: EntryItem[];
  date: string;
}
