import { Routes } from "@angular/router";
import { ClientListComponent } from "./client-list/client-list.component";
import { ClientEditComponent } from "./client-edit/client-edit.component";
import { ClientShowComponent } from "./client-show/client-show.component";
import { ClientCreateComponent } from "./client-create/client-create.component";

export const CLIENTS_MANAGEMENT_ROUTES: Routes = [
  { path: 'list', component: ClientListComponent},
  { path: 'create', component: ClientCreateComponent},
  { path: 'edit/:id', component: ClientEditComponent },
  { path: 'show/:id', component: ClientShowComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' } // ✅ corregido
];
