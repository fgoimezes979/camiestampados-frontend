import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {

  orderForm: FormGroup;
  orderId!: number;

  clients: any[] = [];
  locations: any[] = [];
  products: any[] = [];
  selectedProducts: any[] = [];

  private readonly apiUrl = 'http://localhost:4040/api/parameters';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.orderForm = this.fb.group({
      date: ['', Validators.required],
      client_id: [null, Validators.required],
      location_id: [null, Validators.required],
      state: ['PENDING', Validators.required],
      product_id: [null],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0],
      user_updates_id: [1]
    });
  }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClients();
    this.loadLocations();
    this.loadProducts();

    if (this.orderId) this.loadOrder();
  }

  // 🔹 Cargar listas
  loadClients(): void {
    this.http.get(`${this.apiUrl}/clients`).subscribe((res: any) => {
      this.clients = res.clients || res;
    });
  }

  loadLocations(): void {
    this.http.get(`${this.apiUrl}/locations`).subscribe((res: any) => {
      this.locations = res.locations || res;
    });
  }

  loadProducts(): void {
    this.http.get(`${this.apiUrl}/products`).subscribe((res: any) => {
      this.products = (res.products || res).map((p: any) => ({
        ...p,
        sale_price: p.sale_price ?? p.salePrice ?? 0
      }));
    });
  }

  // 🔹 Cargar orden para editar
  loadOrder(): void {
    this.http.get(`${this.apiUrl}/orders/${this.orderId}`).subscribe((order: any) => {
      if (!order) return;

      this.orderForm.patchValue({
        date: order.date?.substring(0, 10),
        client_id: order.client_id,
        location_id: order.location_id,
        state: order.state,
        total: order.total_price
      });

      this.selectedProducts = (order.products || []).map((p: any) => ({
        product_id: p.product_id || p.id,
        product_code: p.product_code || p.code,
        product_name: p.product_name || p.name,
        unit_price: Number(p.unit_price || p.OrderProduct?.unit_price),
        quantity: Number(p.quantity || p.OrderProduct?.quantity),
        total: Number(p.total || p.OrderProduct?.total)
      }));

      this.recalculateTotal();
    });
  }

  // ✅ Agregar producto
  addProduct(): void {
    const { product_id, quantity } = this.orderForm.value;

    if (!product_id || quantity <= 0) {
      alert('Selecciona un producto y una cantidad válida');
      return;
    }

    const product = this.products.find(p => p.id === product_id);
    if (!product) {
      alert('Producto no encontrado');
      return;
    }

    const unit_price = parseFloat(product.sale_price) || 0;
    const total = unit_price * quantity;

    this.selectedProducts.push({
      product_id: product.id,
      product_code: product.code,
      product_name: product.name,
      unit_price,
      quantity,
      total
    });

    this.orderForm.patchValue({ product_id: null, quantity: 1 });
    this.recalculateTotal();
  }

  // 🔹 Totales
  getTotalOrder(): number {
    return this.selectedProducts.reduce((sum, p) => sum + (p.total || 0), 0);
  }

  recalculateTotal(): void {
    const total = this.getTotalOrder();
    this.orderForm.patchValue({ total });
  }

  updateQuantity(product: any, quantity: number): void {
    product.quantity = quantity;
    product.total = (product.unit_price || 0) * quantity;
    this.recalculateTotal();
  }

  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
    this.recalculateTotal();
  }

  // ✅ Guardar cambios
  confirmOrder(): void {
    if (!this.orderForm.valid) {
      alert('Por favor completa todos los campos requeridos ❌');
      return;
    }

    if (this.selectedProducts.length === 0) {
      alert('Debe haber al menos un producto en la orden ❌');
      return;
    }

    const payload = {
      ...this.orderForm.getRawValue(),
      products: this.selectedProducts.map(p => ({
        product_id: p.product_id,
        quantity: p.quantity,
        unit_price: p.unit_price,
        total: p.total   // ⬅️ NOMBRE CORRECTO
      }))
    };

    this.http.put(`${this.apiUrl}/orders/${this.orderId}`, payload).subscribe({
      next: () => {
        alert('Orden actualizada ✅');
        this.router.navigate(['/orders/list']);
      },
      error: (err) => {
        console.error('Error al actualizar orden ❌', err);
        alert(`Error: ${err.error?.message || err.message}`);
      }
    });
  }

  // 🔹 Cancelar
  onClose(): void {
    this.router.navigate(['/orders/list']);
  }
}
