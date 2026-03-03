import { Routes } from "@angular/router";

export const REPORTS_ROUTES: Routes = [

  {
    path: 'list',
    loadComponent: () =>
      import('./report-list/report-list.component')
        .then(c => c.ReportListComponent)
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./report-create/report-create.component')
        .then(c => c.ReportCreateComponent)
  },

  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./report-edit/report-edit.component')
        .then(c => c.ReportEditComponent)
  },

  {
    path: 'show/:id',
    loadComponent: () =>
      import('./report-show/report-show.component')
        .then(c => c.ReportShowComponent)
  },

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }

];