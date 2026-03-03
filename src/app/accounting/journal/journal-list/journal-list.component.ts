import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../../services/accounting/journal.service';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css'],
})
export class JournalListComponent implements OnInit {

  entries: any[] = [];
  groupedEntries: any[] = [];
  loading = true;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
  this.journalService.getJournalReport().subscribe({
    next: (resp: any) => {
      const rows = resp.rows;

      const grouped: any = {};

      rows.forEach((row: any) => {
        if (!grouped[row.journal_id]) {
          grouped[row.journal_id] = {
            journal_id: row.journal_id,
            date: row.date,
            description: row.description,
            lines: []
          };
        }

        grouped[row.journal_id].lines.push(row);
      });

      this.groupedEntries = Object.values(grouped);
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}
}