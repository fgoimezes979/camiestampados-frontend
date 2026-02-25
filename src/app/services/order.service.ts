import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 
  
  getById(orderId: number) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:4040/api/parameters/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
getOrderById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
    map(response => {
      if (response && response.order) {
        console.log('📌 Datos de la entrada (backend):', response.order);
        return response.order; // 👈 devolvemos SOLO el objeto location
      } else {
        throw new Error('salida no encontrada');
      }
    })
  );
}


  updateOrder(id: number, orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, orderData);
  }
  getClients(): Observable<any> {
  const apiClientsUrl = 'http://localhost:4040/api/parameters/clients'; // ajusta según tu backend
  return this.http.get(apiClientsUrl).pipe(
    map((res: any) => res.clients || res)
  );
}

}
