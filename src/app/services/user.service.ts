import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private apiUrl = 'https://inventarios-adso-api.onrender.com/api/security/users';

  constructor(private http: HttpClient) {}

  // Crear usuario
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // Obtener todos los usuarios
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response) {
          console.log('respuesta del backend:', response);
          return response;
        } else {
          throw new Error('usuario no encontrado');
        }
      })
    );
  }

  // Actualizar usuario
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }
}
