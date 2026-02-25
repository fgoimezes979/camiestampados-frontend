import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.css'
})
export class ClientCreateComponent {
guardar() {
throw new Error('Method not implemented.');
}
gestionForm: any;

}
