import { Routes } from "@angular/router";
import { LocationListComponent} from "./location-list/location-list.component";
import { LocationEditComponent } from "./location-edit/location-edit.component";
import { LocationShowComponent } from "./location-show/location-show.component";
import { LocationCreateComponent } from "./location-create/location-create.component";


export const LOCATIONS_ROUTES: Routes=[


    { path: 'list' , component: LocationListComponent},
    { path: 'create' , component: LocationCreateComponent },
    { path: 'edit/:id' , component: LocationEditComponent },
    { path: 'show/:id' , component: LocationShowComponent},
    { path: '', redirectTo: '/locations/list', pathMatch: 'full' }
 


    
]
