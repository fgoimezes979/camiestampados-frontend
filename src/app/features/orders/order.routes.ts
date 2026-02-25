import { Routes } from "@angular/router";
import {OrderListComponent} from "./order-list/order-list.component";
import { OrderEditComponent } from "./order-edit/order-edit.component";
import { OrderShowComponent } from "./order-show/order-show.component";
import { OrderCreateComponent } from "./order-create/order-create.component";


export const ORDER_ROUTES: Routes=[


    { path: 'list' , component:OrderListComponent},
    { path: 'create' , component: OrderCreateComponent },
    { path: 'edit/:id' , component: OrderEditComponent },
    { path: 'show/:id' , component: OrderShowComponent},
    { path: '', redirectTo: 'list', pathMatch: 'full' }
 


    
]
