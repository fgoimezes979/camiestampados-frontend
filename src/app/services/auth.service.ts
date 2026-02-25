import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post('/api/security/users/login', data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = (jwtDecode as any)(token);

      return {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}