import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LocationService } from "../../../services/location.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-location-edit',
  standalone: true,
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class LocationEditComponent implements OnInit {

  locationForm!: FormGroup;
  isLoading = false;
  locationId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    // ✅ FORMULARIO EN CAMELCASE
    this.locationForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      ability: [0],
      isActive: [true], // ✅ CAMELCASE
      products: this.fb.array([])
    });

    this.locationId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📌 ID de la ubicación recibido:', this.locationId);

    if (this.locationId) {
      this.locationService.getLocationById(this.locationId).subscribe({
        next: (data: any) => {
          console.log('📌 Datos recibidos del backend:', data);

          // ✅ snake_case → camelCase
          this.locationForm.patchValue({
            code: data.code ?? '',
            name: data.name ?? '',
            description: data.description ?? '',
            ability: data.ability ?? 0,
            isActive: data.is_active ?? false
          });

          // Productos
          const productsArray = this.locationForm.get('products') as FormArray;
          productsArray.clear();

          if (Array.isArray(data.products)) {
            data.products.forEach((p: any) => {
              productsArray.push(
                this.fb.group({
                  id: [p.id],
                  name: [p.name]
                })
              );
            });
          }
        },
        error: err => console.error('❌ Error obteniendo ubicación:', err)
      });
    }
  }

  // ✅ SUBMIT CORRECTO
  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // ✅ CONVERTIMOS A snake_case SOLO PARA EL BACKEND
    const payload = {
      code: this.locationForm.value.code,
      name: this.locationForm.value.name,
      description: this.locationForm.value.description,
      ability: this.locationForm.value.ability,
      is_active: this.locationForm.value.isActive
    };

    this.locationService.updateLocation(this.locationId, payload).subscribe({
      next: () => {
        this.isLoading = false;
        console.log('✅ Ubicación actualizada con éxito');
        this.router.navigate(['/locations']);
      },
      error: err => {
        this.isLoading = false;
        console.error('❌ Error actualizando ubicación', err);
      }
    });
  }
}
