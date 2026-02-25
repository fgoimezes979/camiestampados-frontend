import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../../../models/entry.model';
import { EntryService } from '../../../services/entry.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-entry-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './entry-edit.component.html',
})
export class EntryEditComponent implements OnInit {
  entryForm!: FormGroup;
  entry!: Entry;
  isLoading = false;
  locations: any[] = [];
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntryService,
    private productService:ProductService
  ) {}

ngOnInit(): void {
  const entryId = Number(this.route.snapshot.paramMap.get('id'));

  // 🔹 cargar productos antes de setear el formulario
  this.productService.getAllProducts().subscribe({
    next: (data) => {
      this.products = data;
    },
    error: (err) => {
      console.error('❌ Error al cargar productos', err);
    }
  });

  // 🔹 cargar la entrada
  this.entryService.getEntryById(entryId).subscribe({
    next: (entry: Entry) => {
      this.entry = entry;

      this.entryForm = this.fb.group({
        code: [this.entry.product?.product_code ?? '', Validators.required],
        product_id: [this.entry.product_id, Validators.required],
        quantity: [this.entry.quantity, [Validators.required, Validators.min(1)]],
        date: [this.entry.date, Validators.required],
        location_id: [this.entry.location_id, Validators.required],
        user: [this.entry.user, Validators.required],
        isActive: [this.entry.isActive],
      });
      
    },
    error: (err) => {
      console.error('❌ Error al cargar la entrada', err);
    }
  });
}


  onSubmit(): void {
    if (this.entryForm.valid) {
      const entryId = Number(this.route.snapshot.paramMap.get('id'));

      this.entryService.updateEntry(entryId, this.entryForm.value).subscribe({
        next: () => {
          console.log('✅ Entrada actualizada');
          this.router.navigate(['/entries']); // redirigir a la lista
        },
        error: (err: any) => {
          console.error('❌ Error al actualizar entrada', err);
        }
      });
    }
  }
}
