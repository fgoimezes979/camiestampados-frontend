import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../../services/location.service';
import { take } from 'rxjs';

interface Location {
  id: number;
  code: string;
  name: string;
  description: string;
  ability: number;
  isActive: boolean;
}

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {

  locations: Location[] = [];
  editingId: number | null = null;
  loading: boolean = false;
 
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  /** =====================================
   *  🔹 Cargar ubicaciones
   *  ===================================== */
  loadLocations(): void {
    this.loading = true;

    this.locationService.getAllLocations()
      .pipe(take(1))
      .subscribe({
        next: (locations) => {
          this.locations = locations || [];
          console.log("📌 Ubicaciones cargadas:", this.locations);
        },
        error: (err) => {
          console.error('Error al cargar ubicaciones:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  /** =====================================
   *  🔹 Activar edición
   *  ===================================== */
  startEdit(id: number) {
    this.editingId = id;
  }

  saveEdit(location: Location) {
    // Aquí implementarías update real
    this.editingId = null;
  }

  cancelEdit() {
    this.editingId = null;
  }

  /** =====================================
   *  🔴 Eliminar ubicación
   *  ===================================== */
  deleteLocation(id: number): void {

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta ubicación?');

    if (!confirmDelete) return;

    this.locationService.deleteLocation(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.locations = this.locations.filter(loc => loc.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar ubicación:', err);
        }
      });
  }
}
