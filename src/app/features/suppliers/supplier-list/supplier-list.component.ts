import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './supplier-list.component.html',
  styles: ``
})
export class SupplierListComponent {
  suppliers: any[] = [];
  editingId:number | null = null;
  
    constructor(private SupplierService: SupplierService) {}
  
    ngOnInit(): void {
      this.loadsuppliers();
    }
  
    loadsuppliers(): void {
      this.SupplierService.getAllSuppliers().subscribe({
        next: (response: { suppliers: any[] } | any[]) => {
          this.suppliers = Array.isArray(response) ? response : response.suppliers;
          console.log('✅ proveedor cargados:', this.suppliers);
        },
        error: (err: any) => {
          console.error('❌ Error al cargar proveedor:', err);
        }
      });
      }
  
    startEdit(id: number) {
      this.editingId = id;
    }
  
    saveEdit(supplier: any) {
      // Aquí normalmente llamarías al servicio para guardar el producto editado
      console.log('✅ proveedor guardado:', supplier);
      this.editingId = null;
    }
  
    cancelEdit() {
      this.editingId = null;
    }
    
  
    deleteSupplier(id: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este proveedort?')) {
        this.SupplierService.deleteSupplier(id).subscribe({
          next: () => {
            this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
            console.log(`✅ proveedor con ID ${id} eliminado.`);
          },
          error: (error: any) => {
            console.error('❌ Error al eliminar el proveedor:', error);
          }
        });
      }
    }
  
  }


