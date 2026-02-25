import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  clients: any[] = [];
  products: any[] = [];
  locations: any[] = [];
  orders: any[] = [];

  selectedProducts: any[] = []; // Productos agregados temporalmente
  private readonly apiUrl = 'http://localhost:4040/api/parameters';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

    // Formulario principal
    this.orderForm= this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      client_id: [null, Validators.required],
      due_date: [null, Validators.required], // ← nuevo campo
      location_id: [null, Validators.required],
      state: ['PENDING', Validators.required],
      user_creates_id: [1],
      product_id: [null],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
    this.loadLocations();
    this.loadOrders();
  }

  // --- Agregar producto a la lista ---
  addProduct(): void {
    const { quantity, product_id } = this.orderForm.value;

    if (!product_id || quantity <= 0) {
      alert('Selecciona un producto y una cantidad válida');
      return;
    }

    const product = this.products.find(p => p.id === product_id);
    if (!product) {
      alert('Producto no encontrado');
      return;
    }

    const unit_price = parseFloat(product.sale_price ?? product.saleprice ?? 0);
    const total_price = unit_price * quantity;

    this.selectedProducts.push({
      product_id: product.id,
      product_code: product.code,
      product_name: product.name,
      unit_price,
      quantity,
      total_price
    });

    // Reiniciar los campos del producto
    this.orderForm.patchValue({
       
      product_id: null,
      quantity: 1
    });
  }

  // --- Eliminar producto de la lista ---
  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
    this.selectedProducts = [...this.selectedProducts];
  }

  // --- Calcular el total general ---
  getTotalOrder(): number {
    return this.selectedProducts.reduce((sum, p) => sum + (p.total_price || 0), 0);
  }

  // --- Confirmar y guardar orden ---
  confirmOrder(): void {
    if (!this.orderForm.valid) {
      alert('Por favor completa todos los campos requeridos ❌');
      return;
    }

    if (!this.selectedProducts.length) {
      alert('Debes agregar al menos un producto a la orden ❌');
      return;
    }

    const formData = this.orderForm.getRawValue();
    const total_price = this.getTotalOrder();

    // ✅ Ahora enviamos también el unit_price de cada producto
    const payload = {
  date: formData.date,
  client_id: formData.client_id,
  location_id: Number(formData.location_id),
  state: formData.state,
  user_creates_id: formData.user_creates_id,
  due_date: new Date(
    new Date(formData.date).setDate(new Date(formData.date).getDate() + 7)
  ).toISOString(),

  // 👇 CAMBIO CLAVE
  details: this.selectedProducts.map(p => ({
    product_id: p.product_id,
    quantity: p.quantity,
    unit_price: p.unit_price
  })),

  total_price
};
    console.log('🧾 Payload enviado:', payload);

    this.http.post(`${this.apiUrl}/orders`, payload).subscribe({
      next: (res: any) => {
        alert('Orden creada con éxito ✅');

        this.orders.push({
          ...res.order,
          products: this.selectedProducts
        });

        this.selectedProducts = [];
        this.orderForm.reset({
          date: new Date().toISOString().substring(0, 10),
          client_id: null,
          location_id: null,
          state: 'PENDING',
          user_creates_id: 1,
          product_id: null,
          quantity: 1
        });
      },
      error: (err) => {
        console.error('Error al crear orden ❌:', err);
        alert(`Error al crear orden ❌: ${err.error?.message || err.message}`);
      }
    });
  }

  // --- Cerrar y volver al listado ---
  onClose(): void {
    this.router.navigate(['/orders']);
  }

  // --- Cargar datos desde el backend ---
  loadClients(): void {
    this.http.get(`${this.apiUrl}/clients`).subscribe((res: any) => {
      this.clients = res.clients || res;
    });
  }

  loadProducts(): void {
    this.http.get(`${this.apiUrl}/products`).subscribe((res: any) => {
      const products = res.products || res;
      this.products = products.map((p: any) => ({
        ...p,
        sale_price: p.sale_price ?? p.salePrice ?? p.saleprice ?? 0
      }));
      console.log('📦 Productos cargados:', this.products);
    });
  }

  loadLocations(): void {
    this.http.get(`${this.apiUrl}/locations`).subscribe((res: any) => {
      this.locations = res.locations || res;
    });
  }

  loadOrders(): void {
    this.http.get(`${this.apiUrl}/orders`).subscribe((res: any) => {
      this.orders = Array.isArray(res) ? res : res.orders || [];
      console.log('📋 Órdenes cargadas:', this.orders);
    });
  }
}
