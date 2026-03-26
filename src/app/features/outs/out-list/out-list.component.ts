import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { OutService } from '../../../services/out.service';
import { ProductService } from '../../../services/product.service';
import { LocationService } from '../../../services/location.service';

import { Out } from '../../../models/out.model';
import { Product } from '../../../models/product.model';
import { Location } from '../../../models/location.model';

@Component({
  selector: 'app-out-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './out-list.component.html',
  styleUrls: ['./out-list.component.css']
})
export class OutListComponent implements OnInit {

  outs: Out[] = [];
  products: Product[] = [];
  locations: Location[] = [];

  constructor(
    private outService: OutService,
    private productService: ProductService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  createEntry() {
    this.router.navigate(['/outs/create']);
  }

  loadData(): void {
  forkJoin({
    products: this.productService.getAllProducts(),
    locations: this.locationService.getAllLocations(),
    outs: this.outService.getAllOuts()
  }).subscribe({
    next: (res: any) => {
      // 1. Extraer catálogos base (manejando si vienen envueltos en un objeto)
      const listProducts = Array.isArray(res.products) ? res.products : (res.products?.products || []);
      const listLocations = Array.isArray(res.locations) ? res.locations : (res.locations?.locations || []);
      
      this.products = listProducts;
      this.locations = listLocations;

      // 2. EXTRAER EL ARRAY DE SALIDAS (Aquí estaba el detalle)
      // Si el backend envía { status: true, outs: [] }, res.outs es el objeto, res.outs.outs es el array
      const rawOuts = res.outs && Array.isArray(res.outs.outs) ? res.outs.outs : (Array.isArray(res.outs) ? res.outs : []);

      this.outs = rawOuts.map((out: any) => {
        // Buscamos el producto en la lista cargada por si el include del backend falla
        const foundProduct = listProducts.find((p: any) => +p.id === +out.product_id);
        const foundLocation = listLocations.find((l: any) => +l.id === +out.location_id);

        return {
          ...out,
          // Priorizamos lo que venga del backend, si no, usamos lo que encontramos localmente
          product: out.product || (foundProduct ? { name: foundProduct.name } : { name: 'N/A' }),
          location: out.location || (foundLocation ? { name: foundLocation.name } : { name: 'N/A' }),
          // Normalizamos nombres de variables para el HTML
          salePrice: out.salePrice || out.saleprice || 0,
          totalPrice: out.totalPrice || out.totalprice || 0
        };
      });

      console.log('✅ Salidas listas para la tabla:', this.outs);
    },
    error: (err) => console.error('❌ Error en la carga:', err)
  });
}
}