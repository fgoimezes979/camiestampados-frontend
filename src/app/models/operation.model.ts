export interface Operation {
  id: number;
  date: string;
  description: string;

  user: string;

  // 🔹 Precio unitario correcto para operaciones
  purchasePrice: number;

  quantity: number;

  // 🔹 Tipo de operación
  type: 'INCOME' | 'OUTCOME';

  // 🔹 Valores calculados
  income: number;  
  outcome: number;

  // 🔹 Balance acumulado
  balance: number;

  // 🔹 Si se usa referencia a producto o ubicación
  product_id?: number;
  location_id?: number;
}
