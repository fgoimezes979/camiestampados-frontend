import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Entry } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

private apiUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/entries';

  constructor(private http: HttpClient) {}

  // 🔹 MAPEO CENTRALIZADO (backend → frontend)
  private mapEntry(raw: any): Entry {
    return {
      id: raw.id,
      product_id: raw.product_id,
      location_id: raw.location_id,
      quantity: raw.quantity,
      date: raw.date,
      user: raw.user ?? '',
      isActive: Boolean(raw.is_active),

      // 🔹 relaciones
      product: raw.product
        ? {
            id: raw.product.id,
            name: raw.product.name,
            product_code: raw.product.code
          }
        : undefined,

      location: raw.location
        ? {
            id: raw.location.id,
            name: raw.location.name
          }
        : undefined
    };
  }

  // 🔹 GET all
  getAllEntries(): Observable<Entry[]> {
    return this.http.get<{ entries: any[] }>(this.apiUrl).pipe(
      map(res => (res.entries || []).map(e => this.mapEntry(e)))
    );
  }

  // 🔹 GET by ID
  getEntryById(id: number): Observable<Entry> {
    return this.http.get<{ entry: any }>(`${this.apiUrl}/${id}`).pipe(
      map(res => this.mapEntry(res.entry))
    );
  }

  // 🔹 CREATE MULTI-PRODUCT
  createEntryMulti(entry: { location_id: number; items: any[]; date: string }): Observable<Entry[]> {
    /**
     * Payload esperado:
     * {
     *   location_id: number,
     *   items: [
     *     { product_id, quantity, code_product, product_name },
     *     ...
     *   ],
     *   date: string
     * }
     */
    return this.http.post<{ entries: any[] }>(this.apiUrl, entry).pipe(
      map(res => (res.entries || []).map(e => this.mapEntry(e)))
    );
  }

  // 🔹 UPDATE
  updateEntry(id: number, entry: Entry): Observable<Entry> {
    const payload = {
      product_id: entry.product_id,
      quantity: entry.quantity,
      date: entry.date,
      location_id: entry.location_id,
      user: entry.user,
      is_active: entry.isActive
    };

    return this.http.put<{ entry: any }>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => this.mapEntry(res.entry))
    );
  }

  // 🔹 DELETE
  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
