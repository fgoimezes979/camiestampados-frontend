import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-edit',
  standalone: true,
  templateUrl: './supplier-edit.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class SupplierEditComponent implements OnInit {

  supplierForm!: FormGroup;
  id: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
  nit: [{ value: '', disabled: true }, Validators.required], // NIT solo lectura
  name: ['', Validators.required], // Nombre empresa
  type: [''],                      // Tipo
  direction: [''],                 // Dirección
  phone: [''],                     // Teléfono
  email: ['', [Validators.email]], // Correo
  isActive: [true]                // Activo


    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.id)) {
      console.error('❌ ID inválido en la URL');
      return;
    }

    this.supplierService.getSupplierById(this.id).subscribe({
      next: (response: { supplier: any; }) => {
        console.log('✅ proveedor recibido del backend:', response.supplier);
        this.supplierForm.patchValue(response.supplier);
      },
      error: (err: any) => {
        console.error('❌ Error al cargar proveedor:', err);
      }
    });
  }

  onsubmit(): void {
    if (this.supplierForm.valid) {
      const updatedSupplier = this.supplierForm.getRawValue(); // Incluye campos deshabilitados
      this.supplierService.updateSupplier(this.id, updatedSupplier).subscribe({
        next: () => {
          alert('✅ proveedor actualizado con éxito');
          this.router.navigate(['/supplier']);
        },
        error: (err: any) => {
          console.error('❌ Error al actualizar el proveedor:', err);
        }
      });
    } else {
      alert('❌ Formulario inválido. Por favor, revisa los campos requeridos.');
    }
  }
}
