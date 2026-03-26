import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// 📊 Imports de Gráficos (Ahora sí deben reconocerse)
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, registerables, Chart } from 'chart.js';

// Esto registra las barras, líneas y leyendas en el sistema
Chart.register(...registerables);

import { InventoryReportService } from '../../../services/inventory-report.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    BaseChartDirective // ✅ Ya no debería salir rojo
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Datos y Totales
  movements: any[] = [];
  products: any[] = [];
  locations: any[] = [];
  totalsByProduct: any[] = [];
  totalCost: number = 0;
  loading: boolean = false;
  errorMessage: string = '';
  totalEntradas: number = 0;
  totalSalidas: number = 0;
  balance: number = 0;

  // Filtros
  startDate: string = '';
  endDate: string = '';
  selectedProduct: number | undefined = undefined;
  selectedLocation: number | undefined = undefined;

  // 📊 Configuración del Gráfico
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Entradas', backgroundColor: '#28a745', borderRadius: 5 },
      { data: [], label: 'Salidas', backgroundColor: '#dc3545', borderRadius: 5 }
    ]
  };

  constructor(private reportService: InventoryReportService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadLocations();
    this.loadReport();
  }

  loadProducts(): void {
    this.reportService.getProducts().subscribe({
      next: (res: any) => this.products = res.data || res.products || res || []
    });
  }

  loadLocations(): void {
    this.reportService.getLocations().subscribe({
      next: (res: any) => this.locations = res?.data || res?.locations || res || []
    });
  }

  loadReport(): void {
    this.loading = true;
    this.reportService.getInventoryMovements(
      this.startDate, this.endDate, this.selectedProduct, this.selectedLocation
    ).subscribe({
      next: (res: any) => {
        this.movements = res.movements || [];
        this.totalEntradas = res?.totals?.entradas || 0;
        this.totalSalidas = res?.totals?.salidas || 0;
        this.balance = res?.totals?.balance || 0;
        this.totalsByProduct = res?.totalsByProduct || [];
        this.totalCost = res?.totalCost || 0;

        this.updateChartData(); 
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateChartData(): void {
  if (this.totalsByProduct && this.totalsByProduct.length > 0) {
    this.barChartData.labels = this.totalsByProduct.map(p => p.product_name);
    
    // 1. Datos de Entradas (Verde normal)
    this.barChartData.datasets[0].data = this.totalsByProduct.map(p => p.entradas);

    // 2. Datos de Salidas (Lógica de Alerta)
    this.barChartData.datasets[1].data = this.totalsByProduct.map(p => p.salidas);
    
    // 🚀 MAGIA: Si el balance es menor a 5, pintamos la barra de AMARILLO/NARANJA
    this.barChartData.datasets[1].backgroundColor = this.totalsByProduct.map(p => {
      return p.balance <= 5 ? '#ffc107' : '#dc3545'; // Amarillo si hay poco, Rojo si hay suficiente
    });

    this.chart?.update();
  }

}

  descargarExcel(): void {
    this.reportService.exportInventoryExcel(
      this.startDate, this.endDate, this.selectedProduct, this.selectedLocation
    ).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-camiestampados-${new Date().getTime()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  trackById(index: number, item: any) { return item.id || index; }
}
