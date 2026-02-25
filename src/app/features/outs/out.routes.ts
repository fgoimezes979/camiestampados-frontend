import { Routes } from "@angular/router";
import { OutListComponent} from "./out-list/out-list.component";
import { OutEditComponent } from "./out-edit/out-edit.component";
import { OutShowComponent } from "./out-show/out-show.component";
import { OutCreateComponent } from "./out-create/out-create.component";


export const OUT_ROUTES: Routes=[


    { path: 'list' , component: OutListComponent},
    { path: 'create' , component: OutCreateComponent },
    { path: 'edit/:id' , component: OutEditComponent },
    { path: 'show/:id' , component: OutShowComponent},
    { path: '', redirectTo: 'list', pathMatch: 'full' }
 


    
]
