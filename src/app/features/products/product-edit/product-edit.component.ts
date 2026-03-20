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

  suppliers: any[] = [];
  locations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    // 🔹 Obtener ID desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("ID producto:", this.productId);

    // 🔹 Crear formulario
    this.productForm = this.fb.group({

      id: [{ value: 0, disabled: true }],

      code: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],

      quantity: [0, [Validators.required, Validators.min(0)]],
      minimum_stock: [0],

      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],

      taxType: ['GRAVADO'],
      taxRate: [19],

      supplierId: [null, Validators.required],
      locationId: [null, Validators.required],

      image: [''],
      isActive: [true]

    });

    // 🔹 Cargar proveedores
    this.productService.getSuppliers().subscribe({
      next: (res:any) => {
        this.suppliers = res.suppliers ?? res;
      },
      error: (err: any) => console.error("Error proveedores", err)
    });

    // 🔹 Cargar ubicaciones
    this.productService.getLocations().subscribe({
      next: (res:any) => {
        this.locations = res.locations ?? res;
      },
      error: (err: any) => console.error("Error ubicaciones", err)
    });

    // 🔹 Cargar producto
    this.productService.getProductById(this.productId).subscribe({
      next: (res:any) => {

        console.log("Producto recibido:", res);

        const p = res.product ?? res;

      this.productForm.patchValue({

  id: p.id,
  code: p.code,
  name: p.name,
  category: p.category,

  quantity: Number(p.quantity ?? 0),
  minimum_stock: p.minimum_stock ?? 0,

  purchasePrice: p.purchase_price ?? p.purchasePrice,
  salePrice: p.sale_price ?? p.salePrice,

  taxType: p.tax_type ?? p.taxType,
  taxRate: p.tax_rate ?? p.taxRate,

  supplierId: Number(p.supplier_id ?? p.supplierId),
  locationId: Number(p.location_id ?? p.locationId),

  image: p.image,
  isActive: p.is_active === 1 || p.isActive === true

});
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        alert('No se pudo cargar el producto');
      }
    });

  }

  onSubmit(): void {

    if (this.productForm.invalid) return;

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