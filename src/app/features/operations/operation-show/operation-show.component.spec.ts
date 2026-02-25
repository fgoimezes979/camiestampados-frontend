import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperationService } from '../../../services/operation.service';
import { ProductService } from '../../../services/product.service';
import { LocationService } from '../../../services/location.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-operation-show',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './operation-show.component.html',
  styleUrls: ['./operation-show.component.css']
})
export class OperationShowComponent implements OnInit {

  operartion: any;
  products: any[] = [];
  locations: any[] = [];

  constructor(
    private operationService: OperationService,
    private productService: ProductService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadProductsAndLocations(id);
  }

  loadProductsAndLocations(operationId: number) {
    // 🔹 Cargar todos los productos
    this.productService.getAllProducts().subscribe({
      next: (prodRes: any) => {
        this.products = Array.isArray(prodRes) ? prodRes : prodRes.products;

        // 🔹 Cargar todas las ubicaciones
        this.locationService.getAllLocations().subscribe({
          next: (locRes: any) => {
            this.locations = Array.isArray(locRes) ? locRes : locRes.locations;

            // 🔹 Cargar la entrada por ID
            this.operationService.getOperationById(operationId).subscribe({
              next: (operationRes: any) => {
                const prod = this.products.find(p => p.product_id === operationRes.product_id);
                const loc = this.locations.find(l => l.id === operationRes.location_id);

                this.operartion = {
                  ...operationRes,
                  code_product: prod?.code_product || 'N/A',
                  product: prod?.description || 'N/A',
                  locationName: loc?.name || 'N/A'
                };
                console.log('✅ Entrada cargada:', this.operartion);
              },
              error: err => console.error('❌ Error cargando entrada:', err)
            });
          },
          error: err => console.error('❌ Error cargando ubicaciones:', err)
        });
      },
      error: err => console.error('❌ Error cargando productos:', err)
    });
  }

  // 🔹 Volver al listado
  onCancel() {
    this.router.navigate(['/operations/list']);
  }

  // 🔹 Ir a formulario de edición
  onEdit() {
    if (this.operartion?.id) {
      this.router.navigate([`/operations/edit/${this.operartion.id}`]);
    }
  }
}
