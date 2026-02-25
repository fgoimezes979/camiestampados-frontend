import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryService } from '../../../services/entry.service';

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css']
})
export class EntryDetailComponent implements OnInit {

  entryId!: number;
  entry: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.entryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEntry();
  }

  loadEntry() {
    this.entryService.getEntryById(this.entryId).subscribe({
      next: (res: any) => {
        this.entry = res.entry;
        this.loading = false;
      },
      error: err => {
        console.error("❌ Error cargando factura:", err);
        this.loading = false;
      }
    });
  }

  // ✅ Total factura
  getTotal(): number {
    if (!this.entry?.details) return 0;

    return this.entry.details.reduce(
      (sum: number, item: any) => sum + Number(item.subtotal),
      0
    );
  }
}
