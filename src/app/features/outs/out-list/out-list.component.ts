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
      next: ({ products, locations, outs }) => {

        this.products = Array.isArray(products) ? products : [];
        this.locations = Array.isArray(locations) ? locations : [];

        const rawOuts = Array.isArray(outs) ? outs : [];

        this.outs = rawOuts.map((out: any) => {
          const prod = out.product ?? this.products.find(p => +p.id === +out.product_id);
          const loc  = out.location ?? this.locations.find(l => +l.id === +out.location_id);

          return {
            id: out.id,
            code_product: out.code_product,
            product_id: +out.product_id,

            // 👇 OBJETO product (correcto)
            product: prod ? { id: prod.id, name: prod.name } : undefined,

            // 👇 OBJETO location (correcto)
            location: loc ? { id: loc.id, name: loc.name } : undefined,

            date: out.date ?? null,
            client: out.client ?? null,
            user: out.user ?? null,
            quantity: out.quantity ?? 0,

            salePrice: prod?.salePrice ?? 0,
            totalPrice: out.totalPrice ?? ((prod?.salePrice ?? 0) * (out.quantity ?? 0)),

            balance: out.balance ?? null
          } as Out;
        });

        console.log('📌 Outs cargados:', this.outs);
      },
      error: (err: any) => console.error('❌ Error cargando datos:', err)
    });
  }
}
