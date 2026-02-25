import { Routes } from "@angular/router";
import { SupplierListComponent } from "./supplier-list/supplier-list.component";
import { SupplierCreateComponent } from "./supplier-create/supplier-create.component";
import { SupplierEditComponent } from "./supplier-edit/supplier-edit.component";
import { SupplierShowComponent } from "./supplier-show/supplier-show.component";


export const SUPPLIERS_ROUTES: Routes=[


    { path: 'list' , component: SupplierListComponent },
    { path: 'create' , component: SupplierCreateComponent },
    { path: 'edit/:id' , component: SupplierEditComponent },
    { path: 'show/:id' , component: SupplierShowComponent},
    { path: '', redirectTo: 'list', pathMatch: 'full' }
    

    
]