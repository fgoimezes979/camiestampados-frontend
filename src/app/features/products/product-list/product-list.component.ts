import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './product-list.component.html',
  styles: ``
})
export class ProductListComponent implements OnInit {

  products: any[] = [];
editingId:number | null = null;
product: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response: { products: any[] } | any[]) => {
        this.products = Array.isArray(response) ? response : response.products;
        console.log('✅ Productos cargados:', this.products);
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
    // Aquí normalmente llamarías al servicio para guardar el producto editado
    console.log('✅ Producto guardado:', product);
    this.editingId = null;
  }

  cancelEdit() {
    this.editingId = null;
  }

  searchText: string = '';

get filteredProducts() {
  if (!this.searchText) return this.products;

  return this.products.filter(p =>
    p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
    p.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
    p.category.toLowerCase().includes(this.searchText.toLowerCase()) 
  );
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
