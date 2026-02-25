import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { SupplierService } from '../../services/supplier.service';
import { OrderService } from '../../services/order.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalProducts: number = 0;
  totalUnidades: number = 0;
  totalSuppliers: number = 0;
  pendingOrders: number = 0;

  private ventasChartInstance: Chart | undefined;

  @ViewChild('ventasChart') ventasChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers();
    this.loadOrders();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        const products = res.products ?? res;
        this.totalProducts = products.length;
        this.totalUnidades = products.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0);
      },
      error: (err) => console.error('❌ Error cargando productos:', err)
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (res: any) => {
        const suppliers = res.suppliers ?? res;
        this.totalSuppliers = suppliers.length;
      },
      error: (err) => console.error('❌ Error cargando proveedores:', err)
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res: any) => {
        const orders = res.orders ?? res;
        this.pendingOrders = orders.filter((o: any) => o.state === 'PENDING').length;
        this.renderVentasChart(orders);
      },
      error: (err) => console.error('❌ Error cargando órdenes:', err)
    });
  }

  renderVentasChart(orders: any[]): void {
    const ventasPorMes: { [key: string]: number } = {};

    orders.forEach(order => {
      const date = new Date(order.date);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      ventasPorMes[key] = (ventasPorMes[key] || 0) + (order.total_price || 0);
    });

    // Ordenar cronológicamente las claves
    const sortedKeys = Object.keys(ventasPorMes).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    const labels = sortedKeys;
    const data = sortedKeys.map(key => ventasPorMes[key]);

    const canvas = this.ventasChartRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, '#93C5FD');
    gradient.addColorStop(1, '#3B82F6');

    // Si ya existe el gráfico, actualizamos los datos
    if (this.ventasChartInstance) {
      this.ventasChartInstance.data.labels = labels;
      this.ventasChartInstance.data.datasets[0].data = data;
      this.ventasChartInstance.update();
      return;
    }

    // Crear nuevo gráfico
    this.ventasChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Ventas ($)',
          data,
          backgroundColor: gradient,
          borderRadius: 10,
          barThickness: 25,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context:any) => `💰 $${Number(context.parsed.y).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#374151', font: { weight: 'bold' } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#6B7280' },
            grid: { color: '#E5E7EB' }
          }
        }
      }
    });
  }
}
