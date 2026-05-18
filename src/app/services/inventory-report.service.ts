import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryReportService {

// 🔐 Reportes
private baseUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/reports';

// 📦 Productos
private productsUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/products';

// 📍 Ubicaciones
private locationsUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/locations';
  constructor(private http: HttpClient) {}

  // ===============================
  // 🔐 HEADERS CON TOKEN
  // ===============================
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // =====================================
  // 📍 LISTAR UBICACIONES
  // =====================================
  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(
      this.locationsUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================
  // 📦 LISTAR PRODUCTOS
  // =====================================
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(
      this.productsUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================
  // 📊 REPORTE EN PANTALLA
  // =====================================
  getInventoryMovements(
    startDate?: string,
    endDate?: string,
    product_id?: number,
    location_id?: number
  ): Observable<any> {

    const params = this.buildParams(
      startDate,
      endDate,
      product_id,
      location_id
    );

    return this.http.get<any>(
      `${this.baseUrl}/inventory`,
      {
        params,
        headers: this.getAuthHeaders()
      }
    );
  }

  // =====================================
  // 📥 DESCARGA EXCEL
  // =====================================
  exportInventoryExcel(
    startDate?: string,
    endDate?: string,
    product_id?: number,
    location_id?: number
  ): Observable<Blob> {

    const params = this.buildParams(
      startDate,
      endDate,
      product_id,
      location_id
    );

    return this.http.get(
      `${this.baseUrl}/inventory-excel`,
      {
        params,
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      }
    );
  }

  // =====================================
  // 🔧 CONSTRUCTOR DE PARAMS
  // =====================================
  private buildParams(
    startDate?: string,
    endDate?: string,
    product_id?: number,
    location_id?: number
  ): HttpParams {

    let params = new HttpParams();

    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (product_id) params = params.set('product_id', product_id.toString());
    if (location_id) params = params.set('location_id', location_id.toString());

    return params;
  }

}
