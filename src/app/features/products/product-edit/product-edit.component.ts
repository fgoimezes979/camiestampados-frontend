import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrls: []
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
suppliers: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtener ID desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

   this.productForm = this.fb.group({
  id: [{ value: 0, disabled: true }], // ID solo lectura

  code: ['', Validators.required],
  name: ['', Validators.required],
  category: ['', Validators.required],

  quantity: [null, [Validators.required, Validators.min(1)]],

  purchasePrice: [null, [Validators.required, Validators.min(0)]],
  salePrice: [null, [Validators.required, Validators.min(0)]],

  // 🔥 CLAVE: null en lugar de 0
  supplierId: [null, Validators.required],
  locationId: [null, Validators.required],

  image: [''], // opcional
  isActive: [true]
});


    // Traer datos del backend y llenar el formulario
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        const p = res.product;
        this.productForm.patchValue({
          id: p.id,
          code: p.code,
          name: p.name,
          category: p.category,
          quantity: p.quantity,
          purchasePrice: p.purchase_price,  // 👈 snake → camel
          salePrice: p.sale_price,          // 👈 snake → camel
          supplierId: p.supplier_id,        // 👈 snake → camel
          locationId: p.location_id,        // 👈 snake → camel
          image: p.image,
          isActive: p.is_active === 1       // 👈 snake → camel
        });
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        alert('No se pudo cargar el producto');
      }
    });
  }

  onSubmit(): void {
  if (this.productForm.valid) {
    const payload = this.productForm.getRawValue();

    this.productService.updateProduct(this.productId, payload).subscribe({
      next: () => {
        alert('Producto actualizado correctamente ✅');
        this.router.navigate(['/products/list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Hubo un error al actualizar ❌');
      }
    });
  }
}
}