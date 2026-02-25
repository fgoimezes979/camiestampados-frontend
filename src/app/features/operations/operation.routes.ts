import { Routes } from "@angular/router";
import {OperationListComponent} from "./operation-list/operation-list.component";
import { OperationEditComponent } from "./operation-edit/operation-edit.component";
import { OperationShowComponent } from "./operation-show/operation-show.component";
import { OperationCreateComponent } from "./operation-create/operation-create.component";


export const OPERATION_ROUTES: Routes=[


    { path: 'list' , component:OperationListComponent},
    { path: 'create' , component: OperationCreateComponent },
    { path: 'edit/:id' , component: OperationEditComponent },
    { path: 'show/:id' , component: OperationShowComponent},
    { path: '', redirectTo: 'list', pathMatch: 'full' }
 


    
]
