import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ledger.component.html'
})
export class LedgerComponent implements OnInit {

  // PLAN DE CUENTAS
  accounts: any[] = [];

  // MOVIMIENTOS LIBRO MAYOR
  ledger: any[] = [];

  // FILTROS
  accountId = '';
  from = '';
  to = '';

  // SALDOS
  openingBalance = 0;
  totalDebit = 0;
  totalCredit = 0;
  closingBalance = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAccounts();
  }

  /* ============================================
     CARGAR PLAN DE CUENTAS
  ============================================ */

  loadAccounts() {

    this.http.get<any>('http://localhost:4040/api/accounting/journals/accounts')
      .subscribe({
        next: (res) => {
          this.accounts = res.accounts;
        },
        error: (err) => {
          console.error('Error cargando cuentas', err);
        }
      });

  }

  /* ============================================
     CONSULTAR LIBRO MAYOR
  ============================================ */

  loadLedger() {

    if (!this.accountId) {
      alert("Seleccione una cuenta");
      return;
    }

    const url =
      `http://localhost:4040/api/accounting/journals/ledger/${this.accountId}?from=${this.from}&to=${this.to}`;

    this.http.get<any>(url)
      .subscribe({
        next: (res) => {

          this.ledger = res.ledger || [];

          this.openingBalance = res.openingBalance || 0;
          this.totalDebit = res.totalDebit || 0;
          this.totalCredit = res.totalCredit || 0;
          this.closingBalance = res.closingBalance || 0;

        },
        error: (err) => {
          console.error('Error cargando libro mayor', err);
        }
      });

  }

}
