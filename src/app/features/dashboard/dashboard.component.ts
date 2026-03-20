import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../services/product.service';
import { SupplierService } from '../../services/supplier.service';
import { OrderService } from '../../services/order.service';
import { LocationService } from '../../services/location.service';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {

  // KPIs
  totalProducts: number = 0;
  totalUnidades: number = 0;
  totalSuppliers: number = 0;
  pendingOrders: number = 0;
  totalInventoryValue: number = 0;
  lowStockProducts: number = 0;
  normalStockProducts: number = 0;
  criticalStockProducts: number = 0;
  salesToday: number = 0;

  lastOrders: any[] = [];

  // Charts
  private productosChartInstance?: Chart<'pie', number[], string>;
private ventasChartInstance?: Chart<'bar', number[], string>;
private inventarioChartInstance?: Chart<'bar', number[], string>;

  // Canvas
  @ViewChild('ventasChart') ventasChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productosChart') productosChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inventarioChart') inventarioChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private orderService: OrderService,
    private locationService: LocationService
  ) {}

  // =============================
  // INIT
  // =============================
  ngOnInit(): void {

    this.loadProducts();
    this.loadSuppliers();
    this.loadOrders();

  }

  ngAfterViewInit(): void {

    this.loadLocations();

  }

  // =============================
  // PRODUCTOS
  // =============================
 loadProducts(): void {

  this.productService.getAllProducts().subscribe({

    next: (res: any) => {

      const products = res.products ?? res;

      this.totalProducts = products.length;

      this.totalUnidades = products.reduce(
        (sum: number, p: any) => sum + (p.quantity || 0),
        0
      );

      // 💰 valor total inventario
      this.totalInventoryValue = products.reduce(
        (sum: number, p: any) =>
          sum + ((p.quantity || 0) * (p.purchasePrice || 0)),
        0
      );

      this.lowStockProducts = products.filter(
  (p: any) => (p.quantity || 0) <= (p.minimum_stock || 0)
).length;

this.normalStockProducts = products.filter(
  (p: any) => (p.quantity || 0) > (p.minimum_stock || 0)
).length;

this.criticalStockProducts = products.filter(
  (p: any) =>
    (p.quantity || 0) <= ((p.minimum_stock || 0) / 2)
).length;

this.renderStockAlertChart();
    },

    error: (err) => console.error('Error cargando productos', err)

  });

}

  // =============================
  // PROVEEDORES
  // =============================
  loadSuppliers(): void {

    this.supplierService.getAllSuppliers().subscribe({

      next: (res: any) => {

        const suppliers = res.suppliers ?? res;
        this.totalSuppliers = suppliers.length;

      },

      error: (err) => console.error('Error cargando proveedores', err)

    });

  }

  // =============================
  // ÓRDENES
  // =============================
 loadOrders(): void {

  this.orderService.getAllOrders().subscribe({

    next: (res: any) => {

      const orders = res.orders ?? res;

      // Órdenes pendientes
      this.pendingOrders =
        orders.filter((o: any) => o.state === 'PENDING').length;

      // Últimas órdenes
      this.lastOrders = orders.slice(-5).reverse();

      const today = new Date();

      const ordersToday = orders.filter((o: any) => {

        const orderDate = new Date(o.created_at);

        return (
          orderDate.getFullYear() === today.getFullYear() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getDate() === today.getDate()
        );

      });

      // 💰 Ventas del día
      this.salesToday = ordersToday.reduce(
        (sum: number, o: any) => sum + Number(o.total_price || 0),
        0
      );

      // gráficos
      this.renderVentasChart(orders);
      this.renderProductosChart(orders);

    },

    error: (err) => console.error('Error cargando órdenes', err)

  });

}
  // =============================
  // UBICACIONES
  // =============================
  loadLocations(): void {

    this.locationService.getAllLocations().subscribe({

      next: (locations: any[]) => {

        setTimeout(() => {
          this.renderInventarioChart(locations);
        }, 100);

      },

      error: (err) => console.error('Error cargando ubicaciones', err)

    });

  }

  // =============================
  // VENTAS
  // =============================
  renderVentasChart(orders: any[]): void {

    const ventasPorMes: any = {};

    orders.forEach(order => {

      const date = new Date(order.date);

      const key = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric'
      });

      ventasPorMes[key] =
        (ventasPorMes[key] || 0) + (order.total_price || 0);

    });

    const labels = Object.keys(ventasPorMes);
    const data = Object.values(ventasPorMes) as number[];
    const ctx = this.ventasChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.ventasChartInstance) {
      this.ventasChartInstance.destroy();
    }

    this.ventasChartInstance = new Chart(ctx, {

      type: 'bar',

      data: {
        labels,
        datasets: [{
          label: 'Ventas ($)',
          data,
          backgroundColor: '#3B82F6',
          borderRadius: 8
        }]
      },

      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }

    });

  }

  // =============================
  // PRODUCTOS MÁS VENDIDOS
  // =============================
  renderProductosChart(orders: any[]): void {

  console.log("ORDERS COMPLETAS:", orders);

  const productos: any = {};

  orders.forEach(order => {

    if (!order.order_items) return;

    order.order_items.forEach((p: any) => {

      const name = p.product?.name || 'Producto';

      productos[name] =
        (productos[name] || 0) + (p.quantity || 0);

    });

  });

  const labels = Object.keys(productos);
  const data = Object.values(productos) as number[];

  const canvas = this.productosChartRef?.nativeElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (this.productosChartInstance) {
    this.productosChartInstance.destroy();
  }

  this.productosChartInstance = new Chart(ctx, {

    type: 'pie',

    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#6366F1',
          '#EF4444'
        ]
      }]
    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

  });

}
  // =============================
  // INVENTARIO POR UBICACIÓN
  // =============================
  renderInventarioChart(locations: any[]): void {

    const ctx = this.inventarioChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = locations.map((l: any) => l.name);

    const data = locations.map((l: any) => {

      const text = l.description || '';
      const matches = text.match(/\((\d+)\)/g);

      if (!matches) return 0;

      return matches.reduce((sum: number, m: string) => {
        return sum + parseInt(m.replace(/[()]/g, ''));
      }, 0);

    });

    if (this.inventarioChartInstance) {
      this.inventarioChartInstance.destroy();
    }

    this.inventarioChartInstance = new Chart(ctx, {

      type: 'bar',

      data: {
        labels,
        datasets: [{
          label: 'Inventario por ubicación',
          data,
          backgroundColor: '#10B981'
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false
      }

    });

  }

  getInventoryColor() {

  if (this.totalInventoryValue > 5000000) {
    return 'inventario-alto';
  }

  if (this.totalInventoryValue > 1000000) {
    return 'inventario-medio';
  }

  return 'inventario-bajo';

  

}
renderStockAlertChart(): void {

  const canvas = document.getElementById('stockChart') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',

    data: {
      labels: ['Normal', 'Stock bajo', 'Stock crítico'],
      datasets: [{
        data: [
          this.normalStockProducts,
          this.lowStockProducts,
          this.criticalStockProducts
        ],
        backgroundColor: [
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ]
      }]
    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

}

}