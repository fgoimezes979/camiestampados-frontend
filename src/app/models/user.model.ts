export interface User {
  id: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  role: 'ADMIN' | 'USER';
  photo?: string;
  email: string;
  is_active: boolean; // igual a lo que usas en la vista
}
