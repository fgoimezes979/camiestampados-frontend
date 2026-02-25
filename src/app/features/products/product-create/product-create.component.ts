import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  styles: []
})
export class ProductCreateComponent implements OnInit {

  productForm: FormGroup;
  suppliers: any[] = [];
  locations: any[] = [];

  // ✅ IMÁGENES VAN AQUÍ (NO en el FormGroup)
  images: string[] = [
    'assets/img/prod-1.jpg',
    'assets/img/prod-2.jpg',
    'assets/img/prod-3.jpg',
    'assets/img/prod-4.jpg',
    'assets/img/img_camilarga.jpg'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private supplierService: SupplierService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      supplierId: ['', Validators.required],
      locationId: ['', Validators.required],

      // ✅ CONTROL PARA LA IMAGEN
      image: [''],

      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => this.suppliers = data,
      error: (err) => console.error('❌ Error cargando proveedores:', err)
    });

    this.http.get<any>('http://localhost:4040/api/parameters/locations')
      .subscribe({
        next: (data) => this.locations = data.locations ?? data,
        error: (err) => console.error('❌ Error cargando ubicaciones:', err)
      });
  }

  // ✅ MÉTODO CORRECTO
  selectImage(img: string): void {
    this.productForm.patchValue({ image: img });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const payload = {
        name: formValue.name,
        category: formValue.category,
        quantity: formValue.quantity,
        purchasePrice: formValue.purchasePrice,
        salePrice: formValue.salePrice,
        supplierId: Number(formValue.supplierId) || null,
        image: formValue.image,
        isActive: formValue.isActive,
        user_creates_id: 1
      };

      console.log('Payload a enviar:', payload);

      this.http.post('http://localhost:4040/api/parameters/products', payload)
        .subscribe({
          next: () => {
            alert('Producto creado con éxito');
            this.productForm.reset({
              quantity: 0,
              purchasePrice: 0,
              salePrice: 0,
              isActive: true
            });
          },
          error: () => alert('Error al crear producto')
        });
    }
  }
}
