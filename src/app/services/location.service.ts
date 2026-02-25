import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Location } from '../models/location.model'; // ✅ USAR EL MODEL

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'http://localhost:4040/api/parameters/locations';

  constructor(private http: HttpClient) {}

  // 🔹 GET ALL
  getAllLocations(): Observable<Location[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res =>
        (res.locations || []).map((raw: any) => this.mapLocation(raw))
      )
    );
  }

  // 🔹 GET BY ID
  getLocationById(id: number): Observable<Location> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (!res?.location) {
          throw new Error('Ubicación no encontrada');
        }
        return this.mapLocation(res.location);
      })
    );
  }

  // 🔹 UPDATE
  updateLocation(id: number, data: any): Observable<Location> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map(raw => this.mapLocation(raw))
    );
  }

  // 🔹 DELETE
  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 MAPEO snake_case → camelCase
  private mapLocation(raw: any): Location {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      ability: Number(raw.ability),
      isActive: raw.is_active, // ✅ CLAVE
    };
  }
}
