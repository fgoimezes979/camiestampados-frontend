import { Routes } from "@angular/router";
import { EntryListComponent} from "./entry-list/entry-list.component";
import { EntryEditComponent } from "./entry-edit/entry-edit.component";
import { EntryShowComponent } from "./entry-show/entry-show.component";
import { EntryCreateComponent } from "./entry-create/entry-create.component";


export const ENTRIES_ROUTES: Routes=[


    { path: 'list' , component: EntryListComponent},
    { path: 'create' , component: EntryCreateComponent },
    { path: 'edit/:id' , component: EntryEditComponent },
    { path: 'show/:id' , component: EntryShowComponent},
    { path: '', redirectTo: '/entries/list', pathMatch: 'full' }
 


    
]
