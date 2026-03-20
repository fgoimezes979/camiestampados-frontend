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

  selectedProducts: any[] = [];

  private readonly apiUrl = 'http://localhost:4040/api/parameters';

  // 👇 cliente por defecto (AJUSTA ESTE ID)
  private defaultClientId = 4;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

    this.orderForm = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      client_id: [this.defaultClientId, Validators.required], // ✅ nunca null
      due_date: [null, Validators.required],
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

  // =============================
  // AGREGAR PRODUCTO
  // =============================
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

    const unit_price = Number(product.sale_price ?? product.saleprice ?? 0);
    const total_price = unit_price * quantity;

    this.selectedProducts.push({
      product_id: product.id,
      product_code: product.code,
      product_name: product.name,
      unit_price,
      quantity,
      total_price
    });

    this.orderForm.patchValue({
      product_id: null,
      quantity: 1
    });
  }

  // =============================
  // ELIMINAR PRODUCTO
  // =============================
  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
    this.selectedProducts = [...this.selectedProducts];
  }

  // =============================
  // TOTAL
  // =============================
  getTotalOrder(): number {
    return this.selectedProducts.reduce((sum, p) => sum + (p.total_price || 0), 0);
  }

  // =============================
  // CREAR ORDEN
  // =============================
  confirmOrder(): void {

    if (!this.orderForm.valid) {
      alert('Por favor completa todos los campos requeridos ❌');
      return;
    }

    if (!this.selectedProducts.length) {
      alert('Debes agregar al menos un producto ❌');
      return;
    }

    const formData = this.orderForm.getRawValue();

    const payload = {
      date: formData.date,

      // 🔥 BLINDADO
      client_id: formData.client_id || this.defaultClientId,

      location_id: Number(formData.location_id),
      state: formData.state,
      user_creates_id: formData.user_creates_id,

      due_date: new Date(
        new Date(formData.date).setDate(new Date(formData.date).getDate() + 7)
      ).toISOString(),

      products: this.selectedProducts.map(p => ({
        product_id: p.product_id,
        quantity: p.quantity,
        unit_price: p.unit_price
      })),

      total_price: this.getTotalOrder()
    };

    console.log('🧾 Payload enviado:', payload);

    this.http.post(`${this.apiUrl}/orders`, payload).subscribe({

      next: (res: any) => {

        alert('Orden creada con éxito ✅');

        this.orders.push({
          ...res.order,
          products: this.selectedProducts
        });

        this.resetForm();
      },

      error: (err) => {

        console.error('❌ Error al crear orden:', err);

        alert(err?.error?.msg || 'Error al crear orden');
      }

    });
  }

  // =============================
  // RESET LIMPIO
  // =============================
  resetForm() {
    this.selectedProducts = [];

    this.orderForm.reset({
      date: new Date().toISOString().substring(0, 10),
      client_id: this.defaultClientId, // 🔥 nunca null
      location_id: null,
      state: 'PENDING',
      user_creates_id: 1,
      product_id: null,
      quantity: 1
    });
  }

  // =============================
  // LOADERS
  // =============================
  loadClients(): void {
    this.http.get(`${this.apiUrl}/clients`).subscribe((res: any) => {
      this.clients = res.clients || res;

      // 🔥 autoasignar cliente si no hay
      if (!this.orderForm.value.client_id && this.clients.length > 0) {
        this.orderForm.patchValue({
          client_id: this.clients[0].id
        });
      }
    });
  }

  loadProducts(): void {
    this.http.get(`${this.apiUrl}/products`).subscribe((res: any) => {
      const products = res.products || res;

      this.products = products.map((p: any) => ({
        ...p,
        sale_price: p.sale_price ?? p.salePrice ?? p.saleprice ?? 0
      }));
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
    });
  }

  // =============================
  // NAV
  // =============================
  onClose(): void {
    this.router.navigate(['/orders']);
  }
}