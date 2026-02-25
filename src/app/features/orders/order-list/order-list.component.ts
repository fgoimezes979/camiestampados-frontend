import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: any[] = [];
  clients: any[] = [];
  estadoMap: any = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En camino / En proceso',
    DELIVERED: 'Despachado / Entregado',
    CANCELLED: 'Cancelada'
  };
estadoTraducido: any;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

 ngOnInit(): void {
  this.loadClients();
  }

  // --- Cargar clientes primero ---
  loadClients(): void {
    this.orderService.getClients().subscribe({
      next: (res: any) => {
        this.clients = res;
        this.loadOrders(); // luego cargamos las órdenes
      },
      error: (err: any) => console.error('❌ Error cargando clientes:', err)
    });
  }

  loadOrders(): void {
  this.orderService.getAllOrders().subscribe({
    next: (res: any) => {
      const rawOrders = Array.isArray(res) ? res : res.orders || [];

      this.orders = rawOrders.map((order: any) => {
        let total = 0;
        if (Array.isArray(order.products)) {
          total = order.products.reduce((sum: number, p: any) => {
            const qty = p.OrderProduct?.quantity ?? 0; // ← corregido
            const price = p.OrderProduct?.unit_price ?? 0; // ← corregido
            return sum + qty * price;
          }, 0);
        }

        const cliente = this.clients.find(c => c.id === order.client_id)?.name || 'N/A';
        const estadoTraducido = this.traducirEstado(order.state);

        return {
    ...order,
    total_price: total,
    cliente,
    estadoTraducido,
    due_date: order.due_date // ← aquí agregamos la fecha de entrega
  };
        
      });

      console.log('✅ Órdenes con total calculado:', this.orders);
    },
    error: (err: any) => console.error('❌ Error cargando órdenes:', err)
  });
}

  // ✏️ Editar orden
  editOrder(orderId: number): void {
    this.router.navigate(['/orders-edit', orderId]);
  }

  // 🗑️ Eliminar orden
  deleteOrder(orderId: number): void {
    if (confirm('⚠️ ¿Seguro que deseas eliminar este pedido?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => this.loadOrders(),
        error: (err: any) => console.error('❌ Error eliminando pedido:', err)
      });
    }
  }

  // --- Traducir estado ---
  traducirEstado(state: string): string {
    return this.estadoMap[state] || state;
  }

}
