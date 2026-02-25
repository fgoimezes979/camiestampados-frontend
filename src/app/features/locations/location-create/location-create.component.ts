import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
})
export class LocationCreateComponent {
  locationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.locationForm = this.fb.group({
      code: [this.generateDefaultCode(), [Validators.required, Validators.maxLength(2)]],
      name: ['', Validators.required],
      description: ['No hay productos'],
      ability: [null, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  // Genera un código por defecto de 2 dígitos
  generateDefaultCode(): string {
    return Math.floor(10 + Math.random() * 90).toString();
  }

  onSubmit() {
    if (!this.locationForm.valid) return;

    const formValue = this.locationForm.value;

    const payload = {
      code: formValue.code || this.generateDefaultCode(),
      name: formValue.name.trim(),
      description: formValue.description?.trim() || 'No hay productos',
      ability: formValue.ability != null ? +formValue.ability : 0,
      isActive: formValue.isActive ? 1 : 0
    };

    console.log('📤 Payload enviado:', payload);

    this.http.post('http://localhost:4040/api/parameters/locations', payload)
      .subscribe({
        next: (res: any) => {
          console.log('Ubicación creada:', res);
          alert(res.msg || 'Ubicación creada con éxito');
          // Redirigir al listado
          this.router.navigate(['/locations/list']);
        },
        error: (err) => {
          console.error('Error al crear ubicación:', err);
          alert(err.error?.msg || 'Error al crear ubicación');
        }
      });
  }
}
