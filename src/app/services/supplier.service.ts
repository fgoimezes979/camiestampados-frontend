import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:4040/api/parameters/suppliers'; // ✅ corregido a plural

  constructor(private http: HttpClient) {}

getAllSuppliers(): Observable<any[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(res => res.suppliers)  // 👈 aquí sacamos solo el array de suppliers
  );
}


  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getSupplierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response) {
          console.log('respuesta del backend:', response);
          return response;
        } else {
          throw new Error('proveedor no encontrado');
        }
      })
    );
  }

  updateSupplier(id: number, supplierData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, supplierData);
  }
}
