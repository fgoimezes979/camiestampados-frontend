import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getAll() {
    throw new Error('Method not implemented.');
  }

  // URL base plural correcta
  private apiUrl = 'http://localhost:4040/api/parameters/products';

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getAllProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener un producto por su ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un producto
  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  // Actualizar un producto por ID
  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  // Eliminar un producto por ID
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
