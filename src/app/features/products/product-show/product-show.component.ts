import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-show',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './product-show.component.html',
  styles: ''
})
export class ProductShowComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🧪 ID capturado de la URL:', productId);

    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe({
        next: (response) => {
          console.log('🧪 Respuesta recibida del backend:', response);

          const p = response.product;
          if (!p) {
            console.error('⚠ Producto no encontrado en la respuesta');
            return;
          }

          this.product = {
            id: p.id,
            code: p.code,
            name: p.name,
            category: p.category,
            quantity: p.quantity,
            purchasePrice: p.purchasePrice,
            salePrice: p.salePrice,
            supplierId: p.supplier_id,
            image: p.image,
            isActive: p.is_active,

            // 👇 Ahora sí: ubicaciones del producto
            locations: p.locations || []
          };

          this.cd.detectChanges();
        },
        error: (err) => console.error('❌ Error al obtener el producto:', err)
      });
    } else {
      console.error('❌ ID inválido en la URL.');
    }
  }
}

