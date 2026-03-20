import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styles: ``
})
export class ProductListComponent implements OnInit {

  products: any[] = [];
  editingId: number | null = null;
  searchText: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
  this.productService.getAllProducts().subscribe({
    next: (response: { products: any[] } | any[]) => {

      const rawProducts = Array.isArray(response)
        ? response
        : response.products;

      // 🔥 Normalizamos nombres de campos
      this.products = rawProducts.map((p: any) => ({
        ...p,
        stock: p.quantity ?? p.stock ?? 0,
        taxType: p.taxType ?? p.tax_type ?? null,
        taxRate: p.taxRate ?? p.tax_rate ?? 0
      }));

      console.log('✅ Productos normalizados:', this.products);
    },
    error: (err: any) => {
      console.error('❌ Error al cargar productos:', err);
    }
  });
}

  startEdit(id: number) {
    this.editingId = id;
  }

  saveEdit(product: any) {
    console.log('✅ Producto guardado:', product);
    this.editingId = null;
  }

  cancelEdit() {
    this.editingId = null;
  }

  // 🔎 FILTRO MEJORADO
  get filteredProducts() {
    if (!this.searchText) return this.products;

    const search = this.searchText.toLowerCase();

    return this.products.filter(p =>
      p.name?.toLowerCase().includes(search) ||
      p.code?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.taxType?.toLowerCase().includes(search)
    );
  }

  // 🔥 MÉTODO PARA MOSTRAR IVA
  getTaxLabel(product: any): string {
    if (product.taxType === 'GRAVADO') {
      return `Gravado ${product.taxRate}%`;
    }

    if (product.taxType === 'EXENTO') {
      return 'Exento';
    }

    if (product.taxType === 'EXCLUIDO') {
      return 'Excluido';
    }

    return 'Sin definir';
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
          console.log(`✅ Producto con ID ${id} eliminado.`);
        },
        error: (error) => {
          console.error('❌ Error al eliminar el producto:', error);
        }
      });
    }
  }
}