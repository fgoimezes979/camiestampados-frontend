import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:4040/api/parameters/orders';

  constructor(private http: HttpClient) {}

  // =============================
  // CREAR ORDEN (POS)
  // =============================
  createOrder(order: {
    state: string;
    client_id: number;
    location_id: number;
    products: any[];
  }): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  // =============================
  // LISTAR ÓRDENES
  // =============================
  getAllOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // =============================
  // OBTENER ORDEN POR ID
  // =============================
  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response && response.order) {
          console.log('📌 Datos de la orden (backend):', response.order);
          return response.order;
        } else {
          throw new Error('Orden no encontrada');
        }
      })
    );
  }

  // =============================
  // ACTUALIZAR ORDEN
  // =============================
  updateOrder(id: number, orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, orderData);
  }

  // =============================
  // ELIMINAR ORDEN
  // =============================
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // =============================
  // CLIENTES PARA FACTURACIÓN
  // =============================
  getClients(): Observable<any> {
    const apiClientsUrl = 'http://localhost:4040/api/parameters/clients';

    return this.http.get(apiClientsUrl).pipe(
      map((res: any) => res.clients || res)
    );
  }

}