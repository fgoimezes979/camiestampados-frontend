import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InventoryReportService } from '../../../services/inventory-report.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {

  // ============================
  // 📦 DATA
  // ============================
  movements: any[] = [];
  products: any[] = [];
  locations: any[] = [];
  totalsByProduct: any[] = [];
  totalCost: number = 0;



  loading: boolean = false;
  errorMessage: string = '';

  // ============================
  // 🎯 FILTROS
  // ============================
  startDate: string = '';
  endDate: string = '';

  selectedProduct: number | undefined = undefined;
  selectedLocation: number | undefined = undefined;

  // ============================
  // 📊 TOTALES
  // ============================
  totalEntradas: number = 0;
  totalSalidas: number = 0;
  balance: number = 0;

  constructor(private reportService: InventoryReportService) {}

  // ============================
  // INIT
  // ============================
  ngOnInit(): void {
    this.loadProducts();
    this.loadLocations();
    this.loadReport();
  }

  // ============================
  // 📦 PRODUCTOS
  // ============================
  loadProducts(): void {
    this.reportService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data || res.products || res || [];
      },
      error: err => console.error('ERROR PRODUCTOS', err)
    });
  }

  // ============================
  // 📍 UBICACIONES
  // ============================
  loadLocations(): void {

    this.reportService.getLocations().subscribe({
      next: (res: any) => {

        console.log('LOCATIONS RESPONSE:', res);

        this.locations = res?.data || res?.locations || res || [];

        if (!Array.isArray(this.locations)) {
          this.locations = [];
        }
      },

      error: (err) => {
        console.error('ERROR LOCATIONS:', err);
        this.locations = [];
        this.errorMessage = 'No se pudieron cargar las ubicaciones';
      }
    });

  }

  // ============================
  // 📊 REPORTE
  // ============================
  loadReport(): void {

    this.loading = true;
    this.errorMessage = '';

    this.reportService.getInventoryMovements(
      this.startDate,
      this.endDate,
      this.selectedProduct,
      this.selectedLocation
    ).subscribe({
      next: (res: any) => {

        console.log('REPORTE:', res);

        this.movements = res.movements || res.data || [];

        // ✅ LEER TOTALES
        this.totalEntradas = res?.totals?.entradas || 0;
        this.totalSalidas = res?.totals?.salidas || 0;
        this.balance = res?.totals?.balance || 0;
        this.totalsByProduct = res?.totalsByProduct || [];
        this.totalCost = res?.totalCost || 0;


        this.loading = false;

        if (this.movements.length === 0) {
          this.errorMessage = 'No hay movimientos para los filtros seleccionados';
        }
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Error al cargar reporte';
        this.loading = false;
      }
    });
  }

  // ============================
  // 📥 EXCEL
  // ============================
  descargarExcel(): void {

    this.reportService.exportInventoryExcel(
      this.startDate,
      this.endDate,
      this.selectedProduct,
      this.selectedLocation
    ).subscribe(blob => {

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-inventario.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);

    });

  }

  // ============================
  // 🔁 TRACK BY
  // ============================
  trackById(index: number, item: any) {
    return item.id;
  }

  trackByIndex(index: number) {
    return index;
  }

}
