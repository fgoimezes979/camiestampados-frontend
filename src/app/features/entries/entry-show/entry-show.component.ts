import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryService } from '../../../services/entry.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-entry-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-show.component.html',
  styleUrls: ['./entry-show.component.css']
})
export class EntryShowComponent implements OnInit {

  entry: any;

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadEntry(id);
  }

  loadEntry(entryId: number) {
    this.entryService.getEntryById(entryId).subscribe({
      next: (entryRes: any) => {
        this.entry = {
          ...entryRes,
          code_product: entryRes.product?.code || 'N/A',
          productName: entryRes.product?.name || 'N/A',
          locationName: entryRes.product?.location?.name || 'N/A',
          locationDescription: entryRes.product?.location?.description || ''
        };
        console.log('✅ Entrada cargada:', this.entry);
      },
      error: err => console.error('❌ Error cargando entrada:', err)
    });
  }

  onCancel() {
    this.router.navigate(['/entries/list']);
  }

  onEdit() {
    if (this.entry?.id) {
      this.router.navigate([`/entries/edit/${this.entry.id}`]);
    }
  }
}
