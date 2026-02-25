import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';

import { JournalService } from '../../../services/accounting/journal.service';
import { JournalEntry } from '../../../models/journal-entry.model';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css'],

export class JournalListComponent implements OnInit {

  entries: JournalEntry[] = [];
  loading = true;
noData: TemplateRef<NgIfContext<boolean>> | null | undefined;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
  this.journalService.getAll().subscribe({
    next: (resp: any) => {
      console.log('📘 RESPUESTA API 👉', resp);
      this.entries = resp.entries;   // 👈 correcto para tu backend
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error cargando asientos', err);
      this.loading = false;
    },
  });
}
}
