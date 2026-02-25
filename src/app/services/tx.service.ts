import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TxService {
  private apiUrl = 'http://localhost:4040/api/parameters/txs';

  constructor(private http: HttpClient) {}

  getAllTx(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteTx(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
getTxById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
    map(response => {
      if (response && response.tx) {
        console.log('📌 Datos de la entrada (backend):', response.tx);
        return response.tx; // 👈 devolvemos SOLO el objeto location
      } else {
        throw new Error('movimiento no encontrada');
      }
    })
  );
}


  updateTx(id: number, txData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, txData);
  }
}
