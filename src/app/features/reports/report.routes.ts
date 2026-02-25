import { Routes } from "@angular/router";
import { ReportListComponent } from "./report-list/report-list.component";
import { ReportCreateComponent } from "./report-create/report-create.component";
import { ReportEditComponent } from "./report-edit/report-edit.component";
import { ReportShowComponent } from "./report-show/report-show.component";

export const REPORTS_ROUTES: Routes = [
  // Lista de reportes
  { path: 'list', component: ReportListComponent },

  // Crear reporte
  { path: 'create', component: ReportCreateComponent },

  // Editar reporte (requiere ID)
  { path: 'edit/:id', component: ReportEditComponent },

  // Mostrar reporte (requiere ID)
  { path: 'show/:id', component: ReportShowComponent },

  // Ruta por defecto al entrar a /report
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
