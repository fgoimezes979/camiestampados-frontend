import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operation-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './operation-create.component.html',
  styleUrls: ['./operation-create.component.css']
})
export class OperationCreateComponent implements OnInit {

  operationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.operationForm = this.fb.group({
      operation: this.fb.group({
        date: [new Date(), Validators.required],
        description: [''],
        user: ['admin', Validators.required],
        purchasePrice: [0, [Validators.required, Validators.min(0)]],
        salePrice: [0],
        quantity: [1, [Validators.required, Validators.min(1)]],
        type: ['INCOME', Validators.required]
      })
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (!this.operationForm.valid) return;

    const raw = this.operationForm.getRawValue().operation;

    const operationPayload = {
      date: new Date(raw.date).toISOString(),
      description: raw.description,
      user: raw.user || 'Sistema',
      purchasePrice: Number(raw.purchasePrice),
      salePrice: Number(raw.salePrice || 0),
      quantity: Number(raw.quantity),
      type: raw.type
    };

    this.http.post(
      'https://inventarios-adso-api.onrender.com/api/parameters/operations',
      operationPayload
    ).subscribe({
      next: () => {
        alert('✅ Operación creada correctamente');
        this.router.navigate(['/operations/list']);
      },
      error: (err) => {
        console.error('❌ Error creando operación:', err);
        alert(err.error?.msg || 'Error al crear la operación');
      }
    });
  }

  onClose() {
    this.router.navigate(['/operations/list']);
  }
}
