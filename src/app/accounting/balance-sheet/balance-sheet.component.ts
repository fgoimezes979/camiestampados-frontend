import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../services/accounting/journal.service';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './balance-sheet.component.html'
})
export class BalanceSheetComponent implements OnInit {

  balance: any;

  startDate: string = '2026-01-01';
  endDate: string = '2026-12-31';
loading: any;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadBalance();
  }

  loadBalance(): void {
    this.journalService
      .getBalance(this.startDate, this.endDate)
      .subscribe({
        next: (res) => {
          this.balance = res;
        },
        error: (err) => {
          console.error('Error cargando balance:', err);
        }
      });
      
  }
}
