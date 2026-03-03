import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../services/accounting/journal.service';

@Component({
  selector: 'app-income-statement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income-statement.component.html'
})
export class IncomeStatementComponent implements OnInit {

  data: any = {};
  loading = true;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.journalService.getIncomeStatement().subscribe({
      next: (resp) => {
        this.data = resp;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}