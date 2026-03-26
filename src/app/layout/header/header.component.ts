import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html', // Apunta al archivo HTML
  styleUrls: ['./header.component.css']    // Apunta al archivo CSS
})
export class HeaderComponent {
  
  toggleSidebar() {
    console.log('Toggle sidebar');
    // Aquí irá tu lógica para abrir el menú en móviles
  }
}