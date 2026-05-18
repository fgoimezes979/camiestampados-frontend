import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
private apiUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/clients';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response) {
          console.log('respuesta del backend:', response);
          return response;
        } else {
          throw new Error('cliente no encontrado');
        }
      })
    );
  }

  updateClient(id: number, clientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, clientData);
  }
}
