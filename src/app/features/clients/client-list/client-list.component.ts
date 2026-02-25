import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './client-list.component.html',
  styles: ``
})
export class ClientListComponent implements OnInit {
searchTerm: any;
filtrarGestiones() {
throw new Error('Method not implemented.');
}

  clients: any[] = [];
editingId:number | null = null;

  constructor(private ClientService: ClientService) {}

  ngOnInit(): void {
    this.loadclients();
  }

  loadclients(): void {
    this.ClientService.getAllClients().subscribe({
      next: (response: { clients: any[] } | any[]) => {
        this.clients = Array.isArray(response) ? response : response.clients;
        console.log('✅ clientes cargados:', this.clients);
      },
      error: (err: any) => {
        console.error('❌ Error al cargar cliente:', err);
      }
    });
    }

  startEdit(id: number) {
    this.editingId = id;
  }

  saveEdit(client: any) {
    // Aquí normalmente llamarías al servicio para guardar el producto editado
    console.log('✅ cliente guardado:', client);
    this.editingId = null;
  }

  cancelEdit() {
    this.editingId = null;
  }
  

  deleteClient(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.ClientService.deleteClient(id).subscribe({
        next: () => {
          this.clients = this.clients.filter(client => client.id !== id);
          console.log(`✅ client con ID ${id} eliminado.`);
        },
        error: (error: any) => {
          console.error('❌ Error al eliminar el cliente:', error);
        }
      });
    }
  }

}