import { Routes } from '@angular/router';

export const ACCOUNTING_ROUTES: Routes = [
  {
    path: 'journal',
    loadComponent: () =>
      import('./journal/journal-list/journal-list.component')
        .then(c => c.JournalListComponent)
  },
  {
    path: 'journal/new',
    loadComponent: () =>
      import('./journal/journal-form/journal-form.component')
        .then(c => c.JournalFormComponent)
  }
];

