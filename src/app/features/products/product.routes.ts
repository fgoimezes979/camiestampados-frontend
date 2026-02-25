import { Routes } from "@angular/router";
import { ProductListComponent} from "./product-list/product-list.component";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { ProductShowComponent } from "./product-show/product-show.component";
import { ProductCreateComponent } from "./product-create/product-create.component";


export const PRODUCTS_ROUTES: Routes=[


    { path: 'list' , component: ProductListComponent},
    { path: 'create' , component: ProductCreateComponent },
    { path: 'edit/:id' , component: ProductEditComponent },
    { path: 'show/:id' , component: ProductShowComponent},
    { path: '', redirectTo: '/products/list', pathMatch: 'full' }
 


    
]
