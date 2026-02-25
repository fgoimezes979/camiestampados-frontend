import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JournalEntry } from '../../models/journal-entry.model';

@Injectable({
  providedIn: 'root',
})
export class JournalService {

  private readonly API_URL = 'http://localhost:4040/api/accounting/journals';

  constructor(private http: HttpClient) {}

  // ✅ Listar asientos contables
  getAll(): Observable<{ status: boolean; entries: JournalEntry[] }> {
    return this.http.get<{ status: boolean; entries: JournalEntry[] }>(
      this.API_URL
    );
  }
}
