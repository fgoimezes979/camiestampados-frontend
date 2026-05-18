import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

private apiUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/products';
private supplierUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/suppliers';
private locationUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/locations';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todos los productos
  getAllProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 🔹 Obtener producto por ID
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 🔹 Crear producto
  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  // 🔹 Actualizar producto
  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  // 🔹 Eliminar producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 Obtener proveedores
  getSuppliers(): Observable<any> {
    return this.http.get(this.supplierUrl);
  }

  // 🔹 Obtener ubicaciones
  getLocations(): Observable<any> {
    return this.http.get(this.locationUrl);
  }

  // 🔹 Obtener productos por ubicación
  getProductsByLocation(location_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/location/${location_id}`);
  }

}