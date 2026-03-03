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

  // ✅ Modelo viejo
  getAll(): Observable<{ status: boolean; entries: JournalEntry[] }> {
    return this.http.get<{ status: boolean; entries: JournalEntry[] }>(
      this.API_URL
    );
  }

  // ✅ Nuevo modelo contable
  getJournalReport(): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/report`
    );
  }

  // ✅ Trial Balance
  getTrialBalance(): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/trial-balance`
    );
  }

  getIncomeStatement(): Observable<any> {
  return this.http.get<any>(
    `${this.API_URL}/income-statement`
  );
}

getBalance(startDate: string, endDate: string) {
  return this.http.get<any>(
    `${this.API_URL}/balance-sheet`,
    {
      params: { startDate, endDate }
    }
  );
}
}
