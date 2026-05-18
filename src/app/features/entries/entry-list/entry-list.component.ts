import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {
addEntry() {
  this.router.navigate(['/entries/create']);
}

viewEntry(arg0: any) {
throw new Error('Method not implemented.');
}

  entries: any[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  // =========================
  // 📦 CARGAR ENTRADAS
  // =========================
  loadEntries() {
    this.loading = true;
    this.http.get<any>('https://inventarios-adso-api.onrender.com/api/parameters/entries')
      .subscribe({
        next: res => {
          this.entries = res.entries || res;
          this.loading = false;
        },
        error: err => {
          console.error('Error cargando entradas:', err);
          this.loading = false;
        }
      });
  }
  // ===============================
// 🔢 Calcular total de items
// ===============================
getTotal(entry: any): number {
  return Number(entry.total || 0);
}


  // =========================
  // ✏️ EDITAR ENTRADA
  // =========================
  editEntry(id: number) {
    this.router.navigate([`/entries/edit/${id}`]);
  }

  // =========================
  // ❌ ELIMINAR ENTRADA
  // =========================
  deleteEntry(id: number) {
    if (!confirm('¿Está seguro de eliminar esta entrada?')) return;

    this.http.delete(`https://inventarios-adso-api.onrender.com/api/parameters/entries/${id}`)
      .subscribe({
        next: () => {
          alert('Entrada eliminada ✅');
          this.loadEntries(); // recargar lista
        },
        error: err => {
          console.error('Error eliminando entrada:', err);
          alert('Error eliminando entrada ❌');
        }
      });
  }

}
