import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-show',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './supplier-show.component.html',
  styles: ''
})
export class SupplierShowComponent implements OnInit {
  supplier: Supplier | null = null;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const supplierId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🧪 ID capturado de la URL:', supplierId);

    if (!isNaN(supplierId)) {
      this.supplierService.getSupplierById(supplierId).subscribe({
        next: (response: { supplier: any }) => {
          console.log('🧪 Respuesta recibida del backend:', response);

          const p = response.supplier;
          if (!p) {
            console.error('⚠ Proveedor no encontrado en la respuesta');
            return;
          }

          // Mapeo backend → frontend
          this.supplier = {
            id: p.id,
            nit: p.nit,
            name: p.name,
            type: p.type,
            direction: p.direction,
            phone: p.phone,
            email: p.email,
            isActive: p.is_active // 👈 conversión snake_case → camelCase
          };

          this.cd.detectChanges();
        },
        error: (err: any) => console.error('❌ Error al obtener el proveedor:', err)
      });
    } else {
      console.error('❌ ID inválido en la URL.');
    }
  }
}