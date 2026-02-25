export interface OrderProduct {
  product_id: number;
  quantity: number;
  unit_price: number;
  total: number;          // ✅ total por línea
  product_code?: string;  // opcional
  product_name?: string;  // opcional
}

export interface Order {
  id: number;
  date: string;
  state: string;
  due_date?: string;
  total_price: number;

  // Relaciones principales
  client_id: number;
  location_id?: number;

  // Usuarios
  user_creates_id?: number;
  user_updates_id?: number;

  // Relación con productos
  products?: OrderProduct[];

  // Campos extra planos desde el cliente/ubicación
  cliente?: string;
  estadoTraducido?: string;
}
