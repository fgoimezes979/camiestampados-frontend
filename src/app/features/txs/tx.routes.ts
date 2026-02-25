import { Routes } from "@angular/router";
import { TxListComponent} from "./tx-list/tx-list.component";
import { TxEditComponent } from "./tx-edit/tx-edit.component";
import { TxShowComponent } from "./tx-show/tx-show.component";
import { TxCreateComponent, } from "./tx-create/tx-create.component";


export const TX_ROUTES: Routes=[


    { path: 'list' , component:TxListComponent},
    { path: 'create' , component: TxCreateComponent },
    { path: 'edit/:id' , component: TxEditComponent },
    { path: 'show/:id' , component: TxShowComponent},
    { path: '', redirectTo: 'list', pathMatch: 'full' }
 


    
]
