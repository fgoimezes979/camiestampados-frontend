import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']

})
export class ClientListComponent {
gestionesFiltradas: any;
editarGestion(_t19: any) {
throw new Error('Method not implemented.');
}
verDetalle(_t19: any) {
throw new Error('Method not implemented.');
}
abrirNuevaGestion() {
throw new Error('Method not implemented.');
}
filtrarGestiones() {
throw new Error('Method not implemented.');
}
searchTerm: any;

}
