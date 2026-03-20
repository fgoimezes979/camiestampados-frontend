import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  products: any[] = [];
  cart: any[] = [];

  search: string = '';
  barcode: string = '';

  

  subtotal = 0;
  tax = 0;
  total = 0;
  tax19 = 0;
tax5 = 0;
exempt = 0;

  amountPaid = 0;
  change = 0;

  locationId: number = 0;
  clientId: number = 4; // 👈 usa el ID real de tu BD
 
  
locations: any[] = [];
clients: any;

  constructor(


    private orderService: OrderService,
    private productService: ProductService
  ) {}

  // =============================
  // INIT
  // =============================
 ngOnInit(): void {
  const userData = localStorage.getItem('user');

  if (userData) {
    try {
      const user = JSON.parse(userData);
      // Intentamos sacar el ID del usuario, si no existe o es 0, usamos el 1 por defecto
      this.locationId = user.location_id || 1; 
    } catch (e) {
      console.error("Error al parsear el usuario del storage", e);
      this.locationId = 1; // Respaldo en caso de error en el JSON
    }
  } else {
    // 🔥 Si borraste el storage, forzamos el ID 1 (la ubicación 'PRINCIPAL')
    this.locationId = 1; 
    console.warn("LocalStorage vacío: Usando ubicación por defecto (ID 1)");
  }

  // 👇 Seguridad para el cliente (Aseguramos que siempre sea un número)
  if (!this.clientId) {
    this.clientId = 4; // Asegúrate de que este ID exista en tu tabla clients
  }

  console.log("📍 Tienda activa para el POS:", this.locationId);
  console.log("👤 Cliente configurado:", this.clientId);

  this.loadProducts();
}
  // =============================
  // CARGAR PRODUCTOS
  // =============================
  loadProducts() {

    this.productService.getAllProducts().subscribe({

      next: (res: any) => {

        console.log("Productos backend:", res);

        this.products = res.products ?? res;

      },

      error: (err) => {
        console.error("Error cargando productos", err);
      }

    });

  }

  // =============================
  // AGREGAR PRODUCTO AL CARRITO
  // =============================
  addProduct(product: any) {

    const price = product.sale_price || product.salePrice || product.price || 0;

    const existing = this.cart.find(p => p.product_id === product.id);

    if (existing) {

      existing.quantity++;

    } else {

     this.cart.push({
  product_id: product.id,
  name: product.name,
  quantity: 1,
  unit_price: price,
  taxType: product.taxType,
  taxRate: Number(product.taxRate) || 0
});
    }

    this.calculateTotals();

  }

  // =============================
  // ELIMINAR PRODUCTO
  // =============================
  removeProduct(item: any) {

    this.cart = this.cart.filter(p => p.product_id !== item.product_id);

    this.calculateTotals();

  }

  // =============================
  // CALCULAR TOTALES
  // =============================
  calculateTotals() {

  this.subtotal = 0;
  this.tax = 0;

  this.tax19 = 0;
  this.tax5 = 0;
  this.exempt = 0;

  this.cart.forEach(p => {

    const lineTotal = p.quantity * p.unit_price;
    const rate = Number(p.taxRate) || 0;

    this.subtotal += lineTotal;

    if (rate === 19) {

      const iva = lineTotal * 0.19;
      this.tax19 += iva;
      this.tax += iva;

    } else if (rate === 5) {

      const iva = lineTotal * 0.05;
      this.tax5 += iva;
      this.tax += iva;

    } else {

      this.exempt += lineTotal;

    }

  });

  this.total = this.subtotal + this.tax;

}
  // =============================
  // CALCULAR CAMBIO
  // =============================
  calculateChange(): void {

    this.change = this.amountPaid - this.total;

    if (this.change < 0) {
      this.change = 0;
    }

  }

  // =============================
  // REGISTRAR VENTA
  // =============================
checkout() {
  if (this.cart.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }

  // 📦 Objeto listo para Sequelize
  // pos.component.ts

const order = {
  state: "DELIVERED",
  
  // 🔥 IDs REALES SEGÚN TUS CAPTURAS:
  client_id: 5,      // 'CLIENTE GENERAL' (ID 5 en tu tabla de clientes)
  location_id: 1,    // 'PRINCIPAL' (ID 1 en tu tabla de locations)

  products: this.cart,
  subtotal: this.subtotal,
  tax: this.tax,
  total_price: this.total,
  date: new Date().toISOString(),
  stock_discounted: true 
};

  console.log("📤 Enviando orden corregida al backend:", order);

  this.orderService.createOrder(order).subscribe({
    next: () => {
      alert("Venta registrada correctamente ✅");
      this.resetPos(); // Función para limpiar todo
    },
    error: (err) => {
      console.error("❌ Error en el servidor:", err);
      const errorMsg = err?.error?.msg || err?.error?.message || "Error al registrar la venta";
      alert(errorMsg);
    }
  });
}

// Función auxiliar para limpiar el formulario
resetPos() {
  this.cart = [];
  this.subtotal = 0;
  this.tax = 0;
  this.total = 0;
  this.amountPaid = 0;
  this.change = 0;
  this.barcode = '';
}
  // =============================
  // BUSCADOR
  // =============================
  get filteredProducts() {

    if (!this.search) return this.products;

    const term = this.search.toLowerCase();

    return this.products.filter((p: any) =>
      p.name.toLowerCase().includes(term)
    );

  }

  // =============================
  // BUSCAR POR CÓDIGO
  // =============================
  searchBarcode() {

    const product = this.products.find(
      (p: any) => p.code === this.barcode
    );

    if (product) {

      this.addProduct(product);

    } else {

      alert("Producto no encontrado");

    }

    this.barcode = '';

  }

  
// 2. 🔥 LA FUNCIÓN PARA BORRAR (Logística de Corrección)
  eliminarDelCarrito(productId: number): void {
    // a. Buscamos el producto en el carrito por su ID
    const index = this.cart.findIndex(p => p.id === productId);

    if (index !== -1) {
      // b. Si lo encontramos, lo sacamos del arreglo usando splice
      const removedProduct = this.cart.splice(index, 1)[0];
      
      // c. Avisamos con un mensaje suave (toast o consola)
      console.log(`❌ ${removedProduct.name} eliminado del carrito.`);
      
      // d. Recalculamos el gran total del carrito
      this.calculateTotal();
    }
  }

  // 3. Función auxiliar para recalcular el total
  calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

}