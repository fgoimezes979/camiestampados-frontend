import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../../services/operation.service';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.css']
})
export class OperationListComponent implements OnInit {

  saldo: number = 0;
  operations: any[] = [];
  saldoTotal: number = 0;

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.loadOperations();
  }

  // ==================================================
  // 🔹 CARGAR OPERACIONES
  // ==================================================
  loadOperations(): void {

    this.operationService.getAllOperations().subscribe({
      next: (res: any) => {

        const rawOperations =
          res.operations ||
          res.data ||
          res.rows ||
          (Array.isArray(res) ? res : []);

        this.operations = rawOperations.map((op: any) => ({
          ...op,
          showDetails: false,
          details: op.details || []
        }));

        if (this.operations.length > 0) {
          this.saldoTotal =
            Number(this.operations[this.operations.length - 1].balance || 0);
        } else {
          this.saldoTotal = 0;
        }
      },
      error: err => console.error('❌ Error cargando operaciones:', err)
    });

  }

  // ==================================================
  // 🔹 REGISTRAR SALDO INICIAL
  // ==================================================
  registrarSaldo(): void {

    if (!this.saldo || this.saldo <= 0) {
      alert('Por favor ingresa un saldo válido');
      return;
    }

    const nuevaOperacion = {
      type: 'ENTRY',
      description: 'Saldo inicial',
      date: new Date(),
      location_id: 1, // ✅ ID REAL DE LA UBICACIÓN
      details: [
        {
          product_id: 1,
          quantity: this.saldo,
          purchasePrice: 0
        }
      ]
    };

    this.operationService.createOperation(nuevaOperacion).subscribe({
      next: () => {
        console.log('✅ Saldo registrado');
        this.loadOperations();
        this.saldo = 0;
      },
      error: err => {
  console.error("❌ Error registrando saldo COMPLETO:", err);
  console.error("📩 Backend dice:", err.error);
}
    });

  }

  // ==================================================
  // 🔹 ELIMINAR OPERACIÓN
  // ==================================================
  deleteOperation(id: number): void {

    if (confirm('¿Seguro que deseas eliminar esta operación?')) {

      this.operationService.deleteOperation(id).subscribe({
        next: () => {
          console.log(`✅ Operación ${id} eliminada`);
          this.loadOperations();
        },
        error: err => console.error('❌ Error eliminando operación:', err)
      });

    }

  }

}