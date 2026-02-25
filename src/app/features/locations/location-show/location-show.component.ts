import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import { Location } from '../../../models/location.model';

@Component({
  selector: 'app-location-show',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './location-show.component.html',
  styleUrls: ['./location-show.component.css']
})
export class LocationShowComponent implements OnInit {

  location: Location | null = null;

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const locationId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🧪 ID capturado de la URL:', locationId);

    if (isNaN(locationId)) {
      console.error('❌ ID inválido en la URL.');
      return;
    }

    this.locationService.getLocationById(locationId).subscribe({
      next: (location: Location) => {
        console.log('📦 ubicación recibida:', location);

        this.location = {
          ...location,
          ability: Number(location.ability) // solo aseguramos number
        };

        this.cd.detectChanges();
      },
      error: err => console.error('❌ Error al obtener la ubicación:', err)
    });
  }
}
