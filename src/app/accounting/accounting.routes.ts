import { Routes } from '@angular/router';

export const ACCOUNTING_ROUTES: Routes = [

  {
    path: 'journal',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./journal/journal-list/journal-list.component')
            .then(c => c.JournalListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./journal/journal-form/journal-form.component')
            .then(c => c.JournalFormComponent)
      }
    ]
  },

  {
    path: 'trial-balance',
    loadComponent: () =>
      import('./trial-balance/trial-balance.component')
        .then(c => c.TrialBalanceComponent)
  },

  {
    path: 'income-statement',
    loadComponent: () =>
      import('./income-statement/income-statement.component')
        .then(c => c.IncomeStatementComponent)
  },

  {
    path: 'balance-sheet',
    loadComponent: () =>
      import('./balance-sheet/balance-sheet.component')
        .then(c => c.BalanceSheetComponent)
  },

  {
    path: 'reportes',
    loadChildren: () =>
      import('./../features/reports/report.routes')
        .then(c => c.REPORTS_ROUTES)
  },

  {
    path: 'ledger',   // 👈 NUEVA RUTA
    loadComponent: () =>
      import('./ledger/ledger.component')
        .then(c => c.LedgerComponent)
  }


];