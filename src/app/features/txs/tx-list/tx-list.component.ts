import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TxService } from '../../../services/tx.service';

@Component({
  selector: 'app-tx-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './tx-list.component.html',
  styleUrls: ['./tx-list.component.css']
})
export class TxListComponent implements OnInit {
  txs: any[] = [];

  constructor(private txService: TxService) {}

  ngOnInit(): void {
    this.loadTxs();
  }

  loadTxs(): void {
    this.txService.getAllTx().subscribe({
      next: (res: any) => {
        console.log("👉 Respuesta backend:", res);

        const rawTxs = Array.isArray(res) ? res : res.txs || [];

        this.txs = rawTxs.map((op: any) => ({
          ...op,
          
      
       description: op.description || 'N/A',
       date: op.date || 'N/A',
       user: op.user || 'N/A'
        }));

        console.log("✅ Movi procesadas para informe:", this.txs);
      },
      error: (err: any) => console.error('❌ Error cargando movi:', err)
    });
  }
}
