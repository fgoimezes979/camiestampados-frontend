import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

private apiUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/categories';

  constructor(private http: HttpClient) {}

  /* =========================
     LISTAR CATEGORÍAS
  ========================= */
  getCategories(): Observable<{categories: Category[]}> {

    return this.http.get<{categories: Category[]}>(this.apiUrl);

  }

  /* =========================
     CREAR CATEGORÍA
  ========================= */
  createCategory(data: Partial<Category>): Observable<Category> {

    return this.http.post<Category>(this.apiUrl, data);

  }

  /* =========================
     ACTUALIZAR CATEGORÍA
  ========================= */
  updateCategory(id:number, data:Partial<Category>): Observable<Category>{

    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);

  }

  /* =========================
     ELIMINAR CATEGORÍA
  ========================= */
  deleteCategory(id:number): Observable<any>{

    return this.http.delete(`${this.apiUrl}/${id}`);

  }

}