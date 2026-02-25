import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule]
})
export class SupplierCreateComponent implements OnInit {
  supplierForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      nit: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type: ['', Validators.required],
      direction: [''],
      phone: ['', [Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      isActive: [false] // default inactivo
    });
  }

onSubmit(): void {
  if (this.supplierForm.invalid) {
    this.supplierForm.markAllAsTouched();
    alert('Por favor complete los campos obligatorios: NIT y Nombre');
    return;
  }

  const formValue = this.supplierForm.value;

  // Validar que nit y name tengan valor
  if (!formValue.nit || !formValue.name) {
    alert('El código (NIT) y el nombre son obligatorios.');
    return;
  }

  // Mapear camelCase → snake_case si la DB espera is_active
  const payload = {
    nit: formValue.nit,
    name: formValue.name,
    type: formValue.type || '',
    direction: formValue.direction || '',
    phone: formValue.phone || '',
    email: formValue.email || '',
    isActive: !!formValue.isActive // boolean
  };

  console.log('Payload final a enviar:', payload);

  this.http.post('http://localhost:4040/api/parameters/suppliers', payload, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: (res) => {
      console.log('Proveedor creado:', res);
      alert('Proveedor creado con éxito');
      this.supplierForm.reset({ isActive: false });
    },
    error: (err) => {
      console.error('Error al crear proveedor:', err);
      if (err.error && err.error.msg) {
        alert(`Error del backend: ${err.error.msg}`);
      } else {
        alert('Error al crear proveedor');
      }
    }
  });
}
}