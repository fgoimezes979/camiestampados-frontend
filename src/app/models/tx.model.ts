export interface Tx {
  id: number;
  description: string;
  date: string;
  user: string;
  user_creates_id?: number;   // opcional
  user_updates_id?: number;   // opcional
  created_at?: string;        // opcional, según si lo usas en Angular
  updated_at?: string;        // opcional
}
