export interface Product {
  id: number;
  code: string;
  name: string;

  category: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  supplierId: number;

  image?: string;
  isActive: boolean;
  userCreatesId?: number;
  userUpdatesId?: number;
  createdAt?: string;
  updatedAt?: string;

  // 👇 Agregar esto para MANY-TO-MANY
  locations?: Location[];
}
