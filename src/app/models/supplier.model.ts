export interface Supplier {
  id: number;
  nit: string;
  name: string;
  type: string;
  direction: string;
  phone: string;
  email: string;
  isActive: boolean; // Angular usa camelCase
}
