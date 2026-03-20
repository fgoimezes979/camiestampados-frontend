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
  categories: any[] = []; // ✅ debe ser array

  // IMÁGENES
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
      category_id: ['', Validators.required], // ✔ igual que la BD
      quantity: [0, [Validators.required, Validators.min(0)]],
      minimum_stock: [0, [Validators.required, Validators.min(0)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      supplierId: ['', Validators.required],
      locationId: ['', Validators.required],
      image: [''],
      isActive: [true],

      // IVA
      taxType: ['GRAVADO', Validators.required],
      taxRate: [19]
    });
  }

  ngOnInit(): void {

    // ✅ CARGAR PROVEEDORES
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => this.suppliers = data,
      error: (err) => console.error('Error cargando proveedores:', err)
    });

    // ✅ CARGAR UBICACIONES
    this.http.get<any>('http://localhost:4040/api/parameters/locations')
      .subscribe({
        next: (data) => this.locations = data.locations ?? data,
        error: (err) => console.error('Error cargando ubicaciones:', err)
      });

    // ✅ CARGAR CATEGORÍAS
    this.http.get<any>('http://localhost:4040/api/parameters/categories')
      .subscribe({
        next: (resp) => {
          this.categories = resp.categories;
        },
        error: (err) => console.error('Error cargando categorías:', err)
      });

  }

  selectImage(img: string): void {
    this.productForm.patchValue({ image: img });
  }

  onTaxTypeChange(): void {

    const taxType = this.productForm.get('taxType')?.value;
    const currentRate = this.productForm.get('taxRate')?.value;

    if (taxType !== 'GRAVADO') {
      this.productForm.patchValue({ taxRate: 0 });
    } else if (!currentRate) {
      this.productForm.patchValue({ taxRate: 19 });
    }

  }

  onSubmit(): void {

    if (this.productForm.valid) {

      const formValue = this.productForm.value;

      const payload = {
  name: formValue.name,
  category_id: formValue.category_id, // ✅ CORREGIDO
  quantity: formValue.quantity,
  minimum_stock: formValue.minimum_stock,
  purchasePrice: formValue.purchasePrice,
  salePrice: formValue.salePrice,
  supplierId: Number(formValue.supplierId) || null,
  locationId: Number(formValue.locationId) || null,
  image: formValue.image,
  isActive: formValue.isActive,
  taxType: formValue.taxType,
  taxRate: formValue.taxRate,
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
              isActive: true,
              taxType: 'GRAVADO',
              taxRate: 19
            });

          },
          error: () => alert('Error al crear producto')
        });
    }
  }
}