import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutService {
private apiUrl = 'https://inventarios-adso-api.onrender.com/api/parameters/outs';

  constructor(private http: HttpClient) {}

 getAllOuts() {
  return this.http.get<any>(`${this.apiUrl}`).pipe(
    map(resp => {
      console.log("📌 BACKEND RESPONSE --> ", resp);
      return resp.outs ?? [];
    })
  );
}



  deleteOut(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
getOutById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
    map(response => {
      if (response && response.out) {
        console.log('📌 Datos de la entrada (backend):', response.out);
        return response.out; // 👈 devolvemos SOLO el objeto location
      } else {
        throw new Error('salida no encontrada');
      }
    })
  );
}


  updateOut(id: number, outData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, outData);
  }
}
