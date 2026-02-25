import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private apiUrl = 'http://localhost:4040/api/parameters/operations';

  constructor(private http: HttpClient) {}

  // 🔐 Headers con token
  private getHeaders() {
    const token = localStorage.getItem("token");

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ======================================================
  // 🔹 REGISTRAR SALDO INICIAL (usa lógica del backend)
  // ======================================================
  registerInitialBalance(amount: number, locationId: number): Observable<any> {

    const body = {
      type: "ENTRY",               // 👈 obligatorio
      location_id: locationId,     // 👈 obligatorio
      details: [
        {
          purchasePrice: amount    // 👈 backend detecta saldo inicial
        }
      ]
    };

    return this.http.post(
      this.apiUrl,
      body,
      this.getHeaders()
    );
  }

  // ======================================================
  // 🔹 CREAR OPERACIÓN NORMAL (ENTRY / SALE / TRANSFER)
  // ======================================================
  createOperation(operationData: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      operationData,
      this.getHeaders()
    );
  }

  // ======================================================
  // 🔹 OBTENER TODAS
  // ======================================================
  getAllOperations(): Observable<any[]> {
    return this.http.get<any>(
      this.apiUrl,
      this.getHeaders()
    ).pipe(
      map((response) => {

        if (response?.operations && Array.isArray(response.operations)) {
          return response.operations;
        }

        if (Array.isArray(response)) {
          return response;
        }

        console.warn('⚠️ Estructura inesperada de respuesta:', response);
        return [];
      })
    );
  }

  // ======================================================
  // 🔹 ELIMINAR
  // ======================================================
  deleteOperation(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

  // ======================================================
  // 🔹 OBTENER POR ID
  // ======================================================
  getOperationById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    ).pipe(
      map((response) => {

        if (!response?.operation) {
          throw new Error('Operación no encontrada');
        }

        const op = response.operation;

        op.purchasePrice = Number(
          op.purchasePrice ??
          op.purchaseprice ??
          op.purchase_price ??
          0
        );

        return op;
      })
    );
  }

  // ======================================================
  // 🔹 ACTUALIZAR
  // ======================================================
  updateOperation(id: number, operationData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      operationData,
      this.getHeaders()
    );
  }
}
