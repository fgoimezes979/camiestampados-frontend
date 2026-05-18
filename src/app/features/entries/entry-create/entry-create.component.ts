import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './entry-create.component.html',
  styleUrls: ['./entry-create.component.css']
})
export class EntryCreateComponent implements OnInit {

  entryForm!: FormGroup;

  products: any[] = [];
  locations: any[] = [];
  suppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  // =========================
  // 🚀 INIT
  // =========================
  ngOnInit(): void {
    this.buildForm();
    this.loadProducts();
    this.loadLocations();
    this.loadSuppliers();
  }

  // =========================
  // 🧱 FORMULARIO
  // =========================
  buildForm() {
    this.entryForm = this.fb.group({
      supplier_id: [null, Validators.required],
      invoice_number: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      location_id: [null, Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

  // =========================
  // 📌 ITEM DETALLE
  // =========================
  createItem(): FormGroup {
    return this.fb.group({
      product_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      code_product: [''],
      product_name: [''],
      unit_cost: [0, Validators.required]
    });
  }

  // =========================
  // 🔑 GET ITEMS
  // =========================
  get items(): FormArray {
    return this.entryForm.get('items') as FormArray;
  }

  // =========================
  // ➕➖ ITEMS
  // =========================
  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // =========================
  // 📦 CARGAR DATOS
  // =========================
  loadProducts() {
    this.http.get<any>('https://inventarios-adso-api.onrender.com/api/parameters/products')
      .subscribe(res => {
        this.products = res.products || res;
      });
  }

  loadLocations() {
    this.http.get<any>('https://inventarios-adso-api.onrender.com/api/parameters/locations')
      .subscribe(res => {
        this.locations = res.locations || res;
      });
  }

  loadSuppliers() {
    this.http.get<any>('https://inventarios-adso-api.onrender.com/api/parameters/suppliers')
      .subscribe(res => {
        this.suppliers = res.suppliers || res;
      });
  }

  // =========================
  // 🔄 SELECCIONAR PRODUCTO
  // =========================
  onProductSelect(index: number) {

    const item = this.items.at(index);
    const productId = item.get('product_id')?.value;

    const selected = this.products.find(p => +p.id === +productId);

    if (selected) {

      const price = Number(selected.purchasePrice) || 0;

      item.patchValue({
        code_product: selected.code || '',
        product_name: selected.name || '',
        unit_cost: price
      });

    } else {

      // limpiar si no hay producto
      item.patchValue({
        code_product: '',
        product_name: '',
        unit_cost: 0
      });
    }
  }

  // ===============================
  // ✅ SUBTOTAL POR FILA
  // ===============================
  getSubtotal(index: number): number {
    const item = this.items.at(index);

    const qty = Number(item.get('quantity')?.value) || 0;
    const cost = Number(item.get('unit_cost')?.value) || 0;

    return qty * cost;
  }

  // ===============================
  // 🔢 TOTAL GENERAL
  // ===============================
  getTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = Number(item.get('quantity')?.value) || 0;
      const cost = Number(item.get('unit_cost')?.value) || 0;
      return sum + qty * cost;
    }, 0);
  }

  // =========================
  // 📤 SUBMIT
  // =========================
  onSubmit() {

    if (this.entryForm.invalid) {
      alert("Formulario incompleto ❌");
      return;
    }

    const payload = {
      supplier_id: Number(this.entryForm.value.supplier_id),
      invoice_number: this.entryForm.value.invoice_number,
      date: this.entryForm.value.date,
      location_id: Number(this.entryForm.value.location_id),

      items: this.items.value.map((i: any) => ({
        product_id: Number(i.product_id),
        quantity: Number(i.quantity),
        unit_cost: Number(i.unit_cost)
      }))
    };

    console.log("📌 Payload enviado:", payload);

    this.http.post('https://inventarios-adso-api.onrender.com/api/parameters/entries', payload)
      .subscribe({
        next: () => {
          alert("Entrada creada correctamente ✅");
          this.router.navigate(['/entries/list']);
        },
        error: err => {
          console.error("Error creando entrada:", err);
          alert(err.error?.msg || "Error creando entrada ❌");
        }
      });
  }

  // =========================
  // 🔚 CANCELAR

  
  // =========================
  onClose() {
    this.router.navigate(['/entries/list']);
  }
}
