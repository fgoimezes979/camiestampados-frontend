import { Component, OnInit } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { JournalService } from '../../services/accounting/journal.service';

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {

  rows: any[] = [];
  loading = true;

  totalDebit = 0;
  totalCredit = 0;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadBalance();
  }

  loadBalance(): void {
    this.journalService.getTrialBalance().subscribe({
      next: (resp: any) => {
        this.rows = resp.rows;

        this.totalDebit = this.rows
          .reduce((sum, r) => sum + Number(r.total_debit), 0);

        this.totalCredit = this.rows
          .reduce((sum, r) => sum + Number(r.total_credit), 0);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get difference(): number {
    return this.totalDebit - this.totalCredit;
  }
}